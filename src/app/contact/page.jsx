"use client";

import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "../../lib/db";
import { Check, Clock, Mail, MapPin, Phone } from "lucide-react";
import { db } from "../../lib/firebase";
import PageIntro from "../../components/ui/PageIntro";
import { useSettings } from "../../context/SettingsContext";
import { useToast } from "../../context/ToastContext";
import { whatsappLink } from "../../data/pakistan";

const EMPTY = { name: "", email: "", phone: "", message: "" };

export default function ContactPage() {
  const settings = useSettings();
  const { addToast } = useToast();
  const [form, setForm] = useState(EMPTY);
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    try {
      // Shape matches the validation in firestore.rules (name, email, message).
      await addDoc(collection(db, "messages"), {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        message: form.message.trim(),
        status: "New",
        createdAt: serverTimestamp(),
      });
      setSent(true);
      setForm(EMPTY);
    } catch (err) {
      console.error(err);
      addToast("We could not send your message. Please try again.", "error");
    } finally {
      setBusy(false);
    }
  }

  const details = [
    settings.address && { Icon: MapPin, label: "Visit us", value: settings.address },
    settings.contactPhone && { Icon: Phone, label: "Call us", value: settings.contactPhone, href: `tel:${settings.contactPhone}` },
    settings.contactEmail && { Icon: Mail, label: "Email us", value: settings.contactEmail, href: `mailto:${settings.contactEmail}` },
    settings.openingHours && { Icon: Clock, label: "Opening hours", value: settings.openingHours },
  ].filter(Boolean);
  const wa = whatsappLink(settings.whatsappNumber, "Hi! I have a question about an order.");

  return (
    <div className="container grid gap-10 py-10 md:grid-cols-[1fr_1.1fr] md:py-16">
      <div>
        <PageIntro eyebrow="Say Hello" title="Get in" accent="Touch">
          <p>Custom cakes, bulk orders for events, or just want to tell us about your favourite cookie? We read every message.</p>
        </PageIntro>
        <ul className="mt-8 space-y-4">
          {details.map(({ Icon, label, value, href }) => (
            <li key={label} className="flex items-start gap-4 rounded-3xl bg-white p-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-mint text-forest">
                <Icon size={19} />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted">{label}</p>
                {href ? <a href={href} className="font-semibold hover:text-forest">{value}</a> : <p className="font-semibold">{value}</p>}
              </div>
            </li>
          ))}
        </ul>
        {wa && (
          <a href={wa} target="_blank" rel="noreferrer" className="btn-dark mt-6 bg-emerald-600 hover:bg-emerald-700">
            Chat on WhatsApp
          </a>
        )}
      </div>

      <div className="rounded-[32px] bg-white p-6 shadow-[0_20px_40px_-30px_rgba(11,63,41,.5)] md:p-10">
        {sent ? (
          <div className="flex h-full flex-col items-center justify-center py-12 text-center">
            <span className="grid h-14 w-14 place-items-center rounded-full bg-forest text-white">
              <Check size={26} />
            </span>
            <h2 className="mt-5 font-display text-3xl font-extrabold">Thank you!</h2>
            <p className="mt-2 text-muted">Your message is on its way. We usually reply within a few hours.</p>
            <button onClick={() => setSent(false)} className="btn-outline mt-6">
              Send another
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <h2 className="font-display text-2xl font-extrabold">Send us a message</h2>
            <input required minLength={2} placeholder="Your name" className="field" value={form.name} onChange={set("name")} />
            <div className="grid gap-4 sm:grid-cols-2">
              <input required type="email" placeholder="Email" className="field" value={form.email} onChange={set("email")} />
              <input type="tel" placeholder="Phone (optional)" className="field" value={form.phone} onChange={set("phone")} />
            </div>
            <textarea required minLength={5} rows={6} placeholder="How can we help?" className="field" value={form.message} onChange={set("message")} />
            <button disabled={busy} className="btn-honey w-full">
              {busy ? "Sending…" : "Send message"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
