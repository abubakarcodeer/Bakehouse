import { firebaseConfigured } from "./firebase";

const LOCAL_HOSTS = ["localhost", "127.0.0.1", "[::1]"];

// Local demo mode: on a local dev host with no Firebase keys, data and sign-in live in this browser.
// Never active on a deployed site or once .env.local has the Firebase config.
export function isDemoMode() {
  if (firebaseConfigured || typeof window === "undefined") return false;
  const host = window.location.hostname;
  return LOCAL_HOSTS.includes(host) || host.endsWith(".localhost");
}
