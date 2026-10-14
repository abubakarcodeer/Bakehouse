"use client";

import { useMemo, useState } from "react";
import { deleteDoc, doc, serverTimestamp, updateDoc } from "../../../lib/db";
import { CalendarCheck, Download, Trash2 } from "lucide-react";
import { db } from "../../../lib/firebase";
import { useCollection } from "../../../lib/useCollection";
import { can, downloadCsv, formatDate, RESERVATION_STATUSES } from "../../../lib/admin";
import { STORE_FULL_NAME } from "../../../lib/config";
import { formatPkPhone, whatsappLink } from "../../../data/pakistan";
import { useAuth } from "../../../context/AuthContext";
import { useToast } from "../../../context/ToastContext";
import { EmptyState, Loading, PageHeader, SearchInput, TableShell, Td, Th } from "../../../components/admin/ui";

const todayKey = () => new Date().toISOString().slice(0, 10);

const prettyDate = (date) =>
  date ? new Date(`${date}T00:00:00`).toLocaleDateString("en-PK", { weekday: "short", day: "numeric", month: "short" }) : "—";

export default function ReservationsPage() {
  const { userProfile } = useAuth();
  const { addToast } = useToast();
  const { data: reservations, loading } = useCollection("reservations");
  const [term, setTerm] = useState("");
  const [status, setStatus] = useState("All");
  const [when, setWhen] = useState("upcoming");
  const canDelete = can(userProfile?.role, "manageMessages");

  const filtered = useMemo(() => {
    const q = term.trim().toLowerCase();
    const today = todayKey();
    return reservations
      .filter(
        (r) =>
          (status === "All" || r.status === status) &&
          (when === "all" || (when === "upcoming" ? r.date >= today : r.date < today)) &&
          (!q || [r.name, r.phone, r.email, r.notes].some((v) => String(v || "").toLowerCase().includes(q)))
      )
      .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`) * (when === "past" ? -1 : 1));
  }, [reservations, term, status, when]);

  async function changeStatus(r, next) {
    try {
      await updateDoc(doc(db, "reservations", r.id), { status: next, updatedAt: serverTimestamp() });
      addToast(`${r.name}'s booking marked ${next}`);
    } catch {
      addToast("Could not update the booking", "error");
    }
  }

  async function remove(r) {
    if (!window.confirm(`Delete the booking for ${r.name} on ${r.date}?`)) return;
    try {
      await deleteDoc(doc(db, "reservations", r.id));
      addToast("Booking deleted");
    } catch {
      addToast("Could not delete the booking", "error");
    }
  }

  if (loading) return <Loading />;

  const todayCount = reservations.filter((r) => r.date === todayKey() && r.status !== "Cancelled").length;

  return (
    <>
      <PageHeader
        title="Reservations"
        subtitle={`${todayCount} table${todayCount === 1 ? "" : "s"} booked for today · ${reservations.filter((r) => r.status === "New").length} awaiting confirmation`}
        actions={
          <>
            <SearchInput value={term} onChange={setTerm} placeholder="Search name or phone" />
            <button
              onClick={() =>
                downloadCsv(
                  `hearthly-reservations-${todayKey()}.csv`,
                  filtered.map((r) => ({ date: r.date, time: r.time, guests: r.guests, name: r.name, phone: r.phone, email: r.email, status: r.status, notes: r.notes }))
                )
              }
              disabled={!filtered.length}
              className="btn-outline gap-2 bg-white py-2.5 disabled:opacity-40"
            >
              <Download size={16} /> Export CSV
            </button>
          </>
        }
      />

      <div className="mb-5 flex flex-wrap items-center gap-2">
        {[
          ["upcoming", "Upcoming"],
          ["past", "Past"],
          ["all", "All dates"],
        ].map(([id, label]) => (
          <button
            key={id}
            onClick={() => setWhen(id)}
            className={`rounded-full border px-4 py-1.5 text-sm transition ${when === id ? "border-forest bg-forest text-white" : "border-line bg-white hover:border-forest"}`}
          >
            {label}
          </button>
        ))}
        <span className="mx-1 h-6 w-px bg-line" />
        {["All", ...RESERVATION_STATUSES.map((s) => s.id)].map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`rounded-full border px-4 py-1.5 text-sm transition ${status === s ? "border-honey bg-honey text-ink" : "border-line bg-white hover:border-honey"}`}
          >
            {s}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-line bg-white">
          <EmptyState icon={CalendarCheck} title="No bookings here" text="Requests from the Book a Table page appear here in real time." />
        </div>
      ) : (
        <TableShell>
          <thead>
            <tr>
              <Th>When</Th>
              <Th>Guest</Th>
              <Th>Party</Th>
              <Th>Notes</Th>
              <Th>Status</Th>
              <Th className="text-right">Actions</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => {
              const wa = whatsappLink(r.phone, `Assalam o Alaikum ${r.name}, this is ${STORE_FULL_NAME} confirming your table for ${r.guests} on ${prettyDate(r.date)} at ${r.time}.`);
              return (
                <tr key={r.id} className="hover:bg-cream">
                  <Td>
                    <p className="font-semibold">{prettyDate(r.date)}</p>
                    <p className="text-xs text-muted">{r.time}</p>
                  </Td>
                  <Td>
                    <p className="font-medium">{r.name}</p>
                    <a href={`tel:${r.phone}`} className="text-xs text-muted hover:text-forest">
                      {formatPkPhone(r.phone)}
                    </a>
                    {wa && (
                      <a href={wa} target="_blank" rel="noreferrer" className="ml-2 text-xs font-semibold text-emerald-700 hover:underline">
                        WhatsApp
                      </a>
                    )}
                  </Td>
                  <Td>{r.guests} guests</Td>
                  <Td className="max-w-[220px] truncate text-muted" title={r.notes}>
                    {r.notes || "—"}
                    <p className="text-[11px]">Requested {formatDate(r.createdAt, true)}</p>
                  </Td>
                  <Td>
                    <select
                      value={r.status || "New"}
                      onChange={(e) => changeStatus(r, e.target.value)}
                      className="rounded-full border border-line bg-white px-3 py-1.5 text-xs font-semibold outline-none focus:border-forest"
                      aria-label="Booking status"
                    >
                      {RESERVATION_STATUSES.map((s) => (
                        <option key={s.id}>{s.id}</option>
                      ))}
                    </select>
                  </Td>
                  <Td className="text-right">
                    {canDelete && (
                      <button onClick={() => remove(r)} className="ml-auto grid h-9 w-9 place-items-center rounded-full hover:bg-red-50 hover:text-red-700" aria-label="Delete">
                        <Trash2 size={16} />
                      </button>
                    )}
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </TableShell>
      )}
    </>
  );
}
