"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "../lib/db";
import { auth, db } from "../lib/firebase";
import { isDemoMode } from "../lib/demo";
import { demoSignIn, demoSignOut, demoSignUp, onDemoAuthStateChanged } from "../lib/demoAuth";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Only create the profile when missing so an existing `role` (e.g. admin) is never overwritten.
  async function ensureUserDoc(user, extra = {}) {
    const ref = doc(db, "users", user.uid);
    const snap = await getDoc(ref);

    // Create an email index for secure password reset checks
    if (user.email) {
      await setDoc(doc(db, "email_indices", user.email.toLowerCase().trim()), { uid: user.uid }, { merge: true });
    }

    if (snap.exists()) return snap.data();
    const [firstName = "", ...rest] = (user.displayName || "").split(" ");
    const data = {
      uid: user.uid,
      email: user.email,
      firstName,
      lastName: rest.join(" "),
      createdAt: new Date().toISOString(),
      role: "customer",
      ...extra,
    };
    await setDoc(ref, data);
    return data;
  }

  async function signup(email, password, firstName, lastName) {
    if (isDemoMode()) {
      const cred = await demoSignUp(email, password, firstName, lastName);
      return { user: cred.user, profile: await ensureUserDoc(cred.user, { firstName, lastName }), demo: true };
    }
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: `${firstName} ${lastName}`.trim() });
    await sendEmailVerification(cred.user);
    const profile = await ensureUserDoc(cred.user, { firstName, lastName });
    await signOut(auth); // Sign out so they have to verify first
    setUserProfile(null);
    return { user: cred.user, profile };
  }

  async function login(email, password) {
    if (isDemoMode()) return demoSignIn(email, password);
    const cred = await signInWithEmailAndPassword(auth, email, password);
    if (!cred.user.emailVerified) {
      const user = cred.user;
      await signOut(auth);
      // Attach the user object so the UI can offer to resend the email
      const error = new Error("EMAIL_NOT_VERIFIED");
      error.user = user;
      throw error;
    }
    return cred;
  }

  const sendVerification = (user) => !isDemoMode() && (user || currentUser) && sendEmailVerification(user || currentUser);

  async function loginWithGoogle() {
    if (isDemoMode()) throw Object.assign(new Error("Google sign-in is not available in local demo mode."), { code: "auth/demo-mode" });
    const cred = await signInWithPopup(auth, new GoogleAuthProvider());
    if (!cred.user.emailVerified) {
      const user = cred.user;
      await signOut(auth);
      const error = new Error("EMAIL_NOT_VERIFIED");
      error.user = user;
      throw error;
    }
    setUserProfile(await ensureUserDoc(cred.user));
    return cred;
  }

  const logout = () => (isDemoMode() ? demoSignOut() : signOut(auth));
  const resetPassword = (email) =>
    isDemoMode()
      ? Promise.reject(Object.assign(new Error("Password reset is not available in local demo mode."), { code: "auth/demo-mode" }))
      : sendPasswordResetEmail(auth, email);

  useEffect(() => {
    const subscribe = isDemoMode() ? onDemoAuthStateChanged : (cb) => onAuthStateChanged(auth, cb);
    return subscribe(async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const snap = await getDoc(doc(db, "users", user.uid));
          setUserProfile(snap.exists() ? snap.data() : null);
        } catch (err) {
          console.error("Error fetching user profile:", err);
          setUserProfile(null);
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, userProfile, loading, signup, login, loginWithGoogle, logout, resetPassword, sendVerification }}>
      {children}
    </AuthContext.Provider>
  );
}
