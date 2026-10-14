"use client";

import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "../../lib/db";
import { CalendarCheck, Check } from "lucide-react";
import { db } from "../../lib/firebase";
import PageIntro from "../../components/ui/PageIntro";
import { HeartDoodle } from "../../components/ui/Decor";
import { IMAGES } from "../../data/images";
import { normalizePkPhone } from "../../data/pakistan";
import { useAuth } from "../../context/AuthContext";
import { useSettings } from "../../context/SettingsContext";
import { useToast } from "../../context/ToastContext";

const TIMES = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00"];
const today = () => new Date().toISOString().slice(0, 10);
const EMPTY = { name: "", phone: "", email: "", date: "", time: "19:00", guests: "2", notes: "" };

export default function BookTablePage() {
  const { currentUser } = useAuth();
  const { openingHours } = useSettings();
  const { addToast } = useToast();
  const [form, setForm] = useState(EMPTY);
  const [busy, setBusy] = useState(false);
  const [booked, setBooked] = useState(null);
  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    const phone = normalizePkPhone(form.phone);
    if (!phone) return addToast("Enter a valid mobile number, e.g. 0300 1234567", "error");
    setBusy(true);
    try {
      // Shape matches the validation in firestore.rules.
      await addDoc(collection(db, "reservations"), {
        name: form.name.trim(),
        phone,
        email: form.email.trim().toLowerCase(),
        date: form.date,
        time: form.time,
        guests: Number(form.guests),
        notes: form.notes.trim(),
        status: "New",
        userId: currentUser?.uid || null,
        createdAt: serverTimestamp(),
      });
      setBooked({ ...form });
      setForm(EMPTY);
    } catch (err) {
      console.error(err);
      addToast("We could not save your booking. Please try again.", "error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="container grid items-start gap-10 py-10 md:grid-cols-2 md:py-16">
      <div>
        <PageIntro eyebrow="Join Us" title="Book a" accent="Table">
          <p>Birthdays, coffee dates or a slow Sunday brunch: reserve your spot and we will have something warm waiting.</p>
          {openingHours && <p className="mt-2 text-sm font-semibold text-forest">{openingHours}</p>}
        </PageIntro>
        <div className="relative mt-10 hidden md:block">
          <div className="absolute -left-6 -top-6 h-2/3 w-2/3 rounded-full bg-honey" />
          <img src={IMAGES.bakery} alt="Our bakery counter" className="relative aspect-[4/3] w-full rounded-[32px] object-cover shadow-xl" />
          <HeartDoodle className="absolute -right-4 -top-6 h-10 w-10 text-forest" />
        </div>
      </div>

      <div className="rounded-[32px] bg-white p-6 shadow-[0_20px_40px_-30px_rgba(11,63,41,.5)] md:p-10">
        {booked ? (
          <div className="py-10 text-center">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-forest text-white">
              <Check size={26} />
            </span>
            <h2 className="mt-5 font-display text-3xl font-extrabold">Request received!</h2>
            <p className="mt-2 text-muted">
              Table for <b className="text-ink">{booked.guests}</b> on <b className="text-ink">{booked.date}</b> at <b className="text-ink">{booked.time}</b>. We will call or WhatsApp you to
              confirm.
            </p>
            <button onClick={() => setBooked(null)} className="btn-outline mt-6">
              Make another booking
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <h2 className="flex items-center gap-2 font-display text-2xl font-extrabold">
              <CalendarCheck className="text-honey-deep" /> Reservation details
            </h2>
            <input required minLength={2} placeholder="Full name" className="field" value={form.name} onChange={set("name")} />
            <div className="grid gap-4 sm:grid-cols-2">
              <input required type="tel" inputMode="tel" placeholder="Mobile (03XX XXXXXXX)" className="field" value={form.phone} onChange={set("phone")} />
              <input type="email" placeholder="Email (optional)" className="field" value={form.email} onChange={set("email")} />
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <label className="col-span-2 sm:col-span-1">
                <span className="mb-1.5 block text-xs font-bold uppercase tracking-[0.1em] text-muted">Date</span>
                <input required type="date" min={today()} className="field" value={form.date} onChange={set("date")} />
              </label>
              <label>
                <span className="mb-1.5 block text-xs font-bold uppercase tracking-[0.1em] text-muted">Time</span>
                <select className="field" value={form.time} onChange={set("time")}>
                  {TIMES.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </label>
              <label>
                <span className="mb-1.5 block text-xs font-bold uppercase tracking-[0.1em] text-muted">Guests</span>
                <select className="field" value={form.guests} onChange={set("guests")}>
                  {Array.from({ length: 12 }, (_, i) => String(i + 1)).map((n) => (
                    <option key={n}>{n}</option>
                  ))}
                </select>
              </label>
            </div>
            <textarea rows={3} placeholder="Occasion or special requests (optional)" className="field" value={form.notes} onChange={set("notes")} />
            <button disabled={busy} className="btn-dark w-full">
              {busy ? "Booking…" : "Request booking"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
