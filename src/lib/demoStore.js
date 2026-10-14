"use client";

// A tiny Firestore look-alike backed by localStorage, used by local demo mode (see lib/demo.js).
// It implements only the calls this app makes: refs, get, live listeners, writes, batches,
// serverTimestamp() and increment().

import { buildDemoData } from "../data/demo";

const STORAGE_KEY = "hearthly-demo-db-v1";

class DemoTimestamp {
  constructor(ms) {
    this.seconds = Math.floor(ms / 1000);
    this.nanoseconds = (ms % 1000) * 1e6;
  }
  toDate() {
    return new Date(this.seconds * 1000 + this.nanoseconds / 1e6);
  }
  toMillis() {
    return this.toDate().getTime();
  }
}

// Dates and timestamps are stored as { __ts: ms } and revived when read.
const pack = (value) => {
  if (value instanceof Date) return { __ts: value.getTime() };
  if (value instanceof DemoTimestamp) return { __ts: value.toMillis() };
  if (Array.isArray(value)) return value.map(pack);
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, pack(v)]));
  return value;
};
const revive = (value) => {
  if (Array.isArray(value)) return value.map(revive);
  if (value && typeof value === "object") {
    if (typeof value.__ts === "number") return new DemoTimestamp(value.__ts);
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, revive(v)]));
  }
  return value;
};

let state = null;
const listeners = new Set();

function load() {
  if (state) return state;
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    state = saved && typeof saved === "object" ? saved : null;
  } catch {
    state = null;
  }
  if (!state) {
    state = pack(buildDemoData());
    persist();
  }
  return state;
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.warn("Demo data could not be saved (browser storage full?)", err);
  }
}

if (typeof window !== "undefined") {
  // Keep several open tabs in sync.
  window.addEventListener("storage", (e) => {
    if (e.key !== STORAGE_KEY) return;
    state = null;
    load();
    notify();
  });
}

export function resetDemoData() {
  state = pack(buildDemoData());
  persist();
  notify();
}

const coll = (name) => (load()[name] ||= {});
const newId = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);

// ---- refs -------------------------------------------------------------------------------

export const collection = (_db, path) => ({ __demo: true, type: "collection", path });

export function doc(base, path, id) {
  if (base?.__demo && base.type === "collection") return { __demo: true, type: "doc", path: base.path, id: path ?? newId() };
  return { __demo: true, type: "doc", path, id };
}

export const where = (field, op, value) => ({ field, op, value });
export const query = (ref, ...filters) => ({ ...ref, filters: [...(ref.filters || []), ...filters] });

// ---- sentinels --------------------------------------------------------------------------

export const serverTimestamp = () => ({ __sentinel: "ts" });
export const increment = (n) => ({ __sentinel: "inc", n });

function resolve(next, prev = {}) {
  const out = { ...prev };
  for (const [k, v] of Object.entries(next)) {
    if (v === undefined) continue;
    if (v && v.__sentinel === "ts") out[k] = { __ts: Date.now() };
    else if (v && v.__sentinel === "inc") out[k] = (Number(prev[k]) || 0) + v.n;
    else out[k] = pack(v);
  }
  return out;
}

// ---- snapshots --------------------------------------------------------------------------

const docSnap = (path, id) => {
  const raw = coll(path)[id];
  return { id, exists: () => raw !== undefined, data: () => (raw === undefined ? undefined : revive(raw)), ref: { __demo: true, type: "doc", path, id } };
};

const matches = (data, filters = []) =>
  filters.every(({ field, op, value }) => {
    const v = data?.[field];
    if (op === "==") return v === value;
    if (op === "!=") return v !== value;
    if (op === "in") return value.includes(v);
    return true;
  });

const querySnap = (ref) => {
  const docs = Object.keys(coll(ref.path))
    .filter((id) => matches(coll(ref.path)[id], ref.filters))
    .map((id) => docSnap(ref.path, id));
  return { docs, size: docs.length, empty: docs.length === 0, forEach: (fn) => docs.forEach(fn) };
};

const snapFor = (ref) => (ref.type === "doc" ? docSnap(ref.path, ref.id) : querySnap(ref));

function notify() {
  for (const l of listeners) queueMicrotask(() => l.next(snapFor(l.ref)));
}

// ---- reads ------------------------------------------------------------------------------

export const getDoc = async (ref) => docSnap(ref.path, ref.id);
export const getDocs = async (ref) => querySnap(ref);

export function onSnapshot(ref, next, error) {
  const entry = { ref, next, error };
  listeners.add(entry);
  queueMicrotask(() => {
    try {
      next(snapFor(ref));
    } catch (err) {
      error?.(err);
    }
  });
  return () => listeners.delete(entry);
}

// ---- writes -----------------------------------------------------------------------------

function applySet(ref, data, opts) {
  const c = coll(ref.path);
  c[ref.id] = resolve(data, opts?.merge ? c[ref.id] || {} : {});
}

function applyUpdate(ref, data) {
  const c = coll(ref.path);
  if (!c[ref.id]) throw new Error(`No document to update: ${ref.path}/${ref.id}`);
  c[ref.id] = resolve(data, c[ref.id]);
}

function commit(fn) {
  load();
  fn();
  persist();
  notify();
}

export const setDoc = async (ref, data, opts) => commit(() => applySet(ref, data, opts));
export const updateDoc = async (ref, data) => commit(() => applyUpdate(ref, data));
export const deleteDoc = async (ref) => commit(() => delete coll(ref.path)[ref.id]);

export async function addDoc(colRef, data) {
  const ref = doc(colRef);
  commit(() => applySet(ref, data));
  return ref;
}

export function writeBatch() {
  const ops = [];
  return {
    set: (ref, data, opts) => ops.push(() => applySet(ref, data, opts)),
    update: (ref, data) => ops.push(() => applyUpdate(ref, data)),
    delete: (ref) => ops.push(() => delete coll(ref.path)[ref.id]),
    commit: async () => commit(() => ops.forEach((op) => op())),
  };
}
