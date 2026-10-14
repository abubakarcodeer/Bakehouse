"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "../../lib/db";
import { db } from "../../lib/firebase";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import AuthShell, { authErrorMessage, GoogleButton } from "../../components/auth/AuthShell";
import { isDemoMode } from "../../lib/demo";
import { DEMO_ACCOUNTS } from "../../data/demo";

// One-click sign-in with the local demo accounts (only rendered in local demo mode).
function DemoLogins({ disabled, onPick }) {
  return (
    <div className="mb-6 rounded-2xl border border-honey/40 bg-honey-soft/60 p-4">
      <p className="text-sm font-bold text-ink">Local demo mode</p>
      <p className="mt-0.5 text-xs text-ink/70">Firebase is not set up yet, so sign in with a demo account. Everything stays in this browser.</p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {DEMO_ACCOUNTS.map((a) => (
          <button
            key={a.uid}
            type="button"
            disabled={disabled}
            onClick={() => onPick(a)}
            className="rounded-xl bg-white px-3 py-2 text-left text-xs ring-1 ring-line transition hover:ring-forest disabled:opacity-50"
          >
            <span className="block font-bold capitalize text-forest-deep">{a.role}</span>
            <span className="text-ink/60">{a.email}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function LoginPage() {
  const { login, loginWithGoogle, resetPassword, sendVerification } = useAuth();
  const { addToast } = useToast();
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [unverifiedUser, setUnverifiedUser] = useState(null);
  const [resending, setResending] = useState(false);
  const [demo, setDemo] = useState(false);
  useEffect(() => setDemo(isDemoMode()), []);

  async function run(action, fallback = "/account") {
    setError("");
    setUnverifiedUser(null);
    setBusy(true);
    try {
      await action();
      addToast("Welcome back!");
      const next = new URLSearchParams(window.location.search).get("next");
      router.push(next?.startsWith("/") && !next.startsWith("//") ? next : fallback);
    } catch (err) {
      if (err.message === "EMAIL_NOT_VERIFIED") {
        setUnverifiedUser(err.user);
        setError("Your email address is not verified.");
      } else {
        setError(authErrorMessage(err));
      }
    } finally {
      setBusy(false);
    }
  }

  async function handleResend() {
    if (!unverifiedUser) return;

    // Simple client-side rate limit: 3 attempts per session/window
    const attempts = Number(sessionStorage.getItem(`resend_${unverifiedUser.email}`) || 0);
    if (attempts >= 3) {
      return addToast("You have reached the limit for resending verification emails. Please try again later.", "error");
    }

    setResending(true);
    try {
      await sendVerification(unverifiedUser);
      sessionStorage.setItem(`resend_${unverifiedUser.email}`, attempts + 1);
      addToast("Verification email resent!");
    } catch (err) {
      addToast("Failed to resend email. Please try again later.", "error");
    } finally {
      setResending(false);
    }
  }

  async function handleReset() {
    setError("");
    if (!form.email) return setError("Enter your email above to reset your password.");

    // Simple client-side rate limit: 3 attempts per session/window
    const attempts = Number(sessionStorage.getItem(`reset_${form.email}`) || 0);
    if (attempts >= 3) {
      return setError("You have reached the limit for password reset attempts. Please try again later.");
    }

    setBusy(true);
    try {
      // Secure check using the dedicated index collection
      const email = form.email.toLowerCase().trim();
      const snap = await getDoc(doc(db, "email_indices", email));

      if (!snap.exists()) {
        setError("No account found with this email address.");
        return;
      }

      await resetPassword(form.email);
      sessionStorage.setItem(`reset_${form.email}`, attempts + 1);
      addToast("Password reset email sent");
    } catch (err) {
      setError(authErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthShell title="Sign In" subtitle="Track your orders and check out faster.">
      {demo && <DemoLogins disabled={busy} onPick={(a) => run(() => login(a.email, a.password), a.role === "customer" ? "/account" : "/admin")} />}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          run(() => login(form.email, form.password));
        }}
        className="space-y-4"
      >
        <input type="email" required placeholder="Email" className="field" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input type="password" required placeholder="Password" className="field" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <div className="flex justify-end">
          <button type="button" onClick={handleReset} className="text-xs link-underline">
            Forgot password?
          </button>
        </div>
        {error && (
          <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700 border border-red-100">
            <p>{error}</p>
            {unverifiedUser && (
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="mt-2 block font-semibold underline decoration-red-300 underline-offset-2 hover:text-red-800"
              >
                {resending ? "Resending..." : "Resend verification email"}
              </button>
            )}
          </div>
        )}
        <button disabled={busy} className="btn-dark w-full">
          {busy ? "Signing in…" : "Sign In"}
        </button>
      </form>
      <div className="my-6 flex items-center gap-3 text-xs text-muted">
        <span className="h-px flex-1 bg-line" /> or <span className="h-px flex-1 bg-line" />
      </div>
      <GoogleButton disabled={busy} onClick={() => run(loginWithGoogle)} />
      <p className="mt-8 text-center text-sm text-muted">
        New to Hearthly Bakehouse?{" "}
        <Link href="/register" className="font-semibold text-ink link-underline">
          Create an account
        </Link>
      </p>
    </AuthShell>
  );
}
