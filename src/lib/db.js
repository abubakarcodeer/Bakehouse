// Firestore calls for client code. In local demo mode (lib/demo.js) they go to a browser-local
// store instead, so the storefront and dashboard work without a Firebase project.
import * as firestore from "firebase/firestore";
import * as demoStore from "./demoStore";
import { isDemoMode } from "./demo";

const route = (name) => (...args) => (isDemoMode() ? demoStore : firestore)[name](...args);

export const collection = route("collection");
export const doc = route("doc");
export const query = route("query");
export const where = route("where");
export const getDoc = route("getDoc");
export const getDocs = route("getDocs");
export const onSnapshot = route("onSnapshot");
export const setDoc = route("setDoc");
export const updateDoc = route("updateDoc");
export const deleteDoc = route("deleteDoc");
export const addDoc = route("addDoc");
export const writeBatch = route("writeBatch");
export const serverTimestamp = route("serverTimestamp");
export const increment = route("increment");
