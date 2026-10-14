"use client";

// Sign-in for local demo mode: the test accounts in data/demo.js plus any created on /register,
// kept in this browser's localStorage. Mirrors the small slice of firebase/auth the app uses.

import { DEMO_ACCOUNTS } from "../data/demo";

const ACCOUNTS_KEY = "hearthly-demo-accounts";
const SESSION_KEY = "hearthly-demo-session";
const listeners = new Set();

const read = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key) || "null") ?? fallback;
  } catch {
    return fallback;
  }
};
const write = (key, value) => {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable: session lasts for this page only */
  }
};

const accounts = () => [...DEMO_ACCOUNTS, ...read(ACCOUNTS_KEY, [])];

const toUser = (a) =>
  a && {
    uid: a.uid,
    email: a.email,
    emailVerified: true,
    displayName: [a.firstName, a.lastName].filter(Boolean).join(" "),
    getIdToken: async () => "demo",
  };

const currentAccount = () => {
  const uid = read(SESSION_KEY, null);
  return accounts().find((a) => a.uid === uid) || null;
};

const emit = () => {
  const user = toUser(currentAccount());
  listeners.forEach((cb) => cb(user));
};

const authError = (code) => Object.assign(new Error(code), { code: `auth/${code}` });

export function onDemoAuthStateChanged(cb) {
  listeners.add(cb);
  queueMicrotask(() => cb(toUser(currentAccount())));
  return () => listeners.delete(cb);
}

export async function demoSignIn(email, password) {
  const account = accounts().find((a) => a.email.toLowerCase() === String(email).trim().toLowerCase());
  if (!account || account.password !== password) throw authError("invalid-credential");
  write(SESSION_KEY, account.uid);
  emit();
  return { user: toUser(account) };
}

export async function demoSignUp(email, password, firstName, lastName) {
  const clean = String(email).trim().toLowerCase();
  if (accounts().some((a) => a.email.toLowerCase() === clean)) throw authError("email-already-in-use");
  if (String(password).length < 6) throw authError("weak-password");
  const account = { uid: `demo-user-${Date.now().toString(36)}`, role: "customer", email: clean, password, firstName, lastName };
  write(ACCOUNTS_KEY, [...read(ACCOUNTS_KEY, []), account]);
  return { user: toUser(account) };
}

export async function demoSignOut() {
  write(SESSION_KEY, null);
  emit();
}
