"use client";

import { useMemo, useState } from "react";
import { deleteDoc, doc, updateDoc } from "../../../lib/db";
import { Download, Mail, MailOpen, Reply, Trash2 } from "lucide-react";
import { db } from "../../../lib/firebase";
import { useCollection } from "../../../lib/useCollection";
import { can, downloadCsv, formatDate } from "../../../lib/admin";
import { STORE_FULL_NAME } from "../../../lib/config";
import { useAuth } from "../../../context/AuthContext";
import { useToast } from "../../../context/ToastContext";
import { Card, EmptyState, Loading, PageHeader, SearchInput } from "../../../components/admin/ui";

export default function MessagesPage() {
  const { userProfile } = useAuth();
  const { addToast } = useToast();
  const { data: messages, loading } = useCollection("messages");
  const [term, setTerm] = useState("");
  const [view, setView] = useState("all");
  const canManage = can(userProfile?.role, "manageMessages");

  const filtered = useMemo(() => {
    const q = term.trim().toLowerCase();
    return messages.filter(
      (m) =>
        (view === "all" || (view === "unread" ? m.status !== "Read" : m.status === "Read")) &&
        (!q || [m.name, m.email, m.phone, m.message].some((v) => String(v || "").toLowerCase().includes(q)))
    );
  }, [messages, term, view]);

  async function markRead(m, read = true) {
    try {
      await updateDoc(doc(db, "messages", m.id), { status: read ? "Read" : "New" });
    } catch {
      addToast("Could not update the message", "error");
    }
  }

  async function remove(m) {
    if (!window.confirm(`Delete the message from ${m.name}?`)) return;
    try {
      await deleteDoc(doc(db, "messages", m.id));
      addToast("Message deleted");
    } catch {
      addToast("Could not delete the message", "error");
    }
  }

  if (loading) return <Loading />;

  const unread = messages.filter((m) => m.status !== "Read").length;

  return (
    <>
      <PageHeader
        title="Messages"
        subtitle={`${unread} unread · ${messages.length} total from the contact form`}
        actions={
          <>
            <SearchInput value={term} onChange={setTerm} placeholder="Search messages" />
            <button
              onClick={() =>
                downloadCsv(
                  `hearthly-messages-${new Date().toISOString().slice(0, 10)}.csv`,
                  filtered.map((m) => ({ date: formatDate(m.createdAt, true), name: m.name, email: m.email, phone: m.phone, message: m.message, status: m.status }))
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

      <div className="mb-5 flex flex-wrap gap-2">
        {[
          ["all", "All"],
          ["unread", `Unread (${unread})`],
          ["read", "Read"],
        ].map(([id, label]) => (
          <button
            key={id}
            onClick={() => setView(id)}
            className={`rounded-full border px-4 py-1.5 text-sm transition ${view === id ? "border-forest bg-forest text-white" : "border-line bg-white hover:border-forest"}`}
          >
            {label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <Card>
          <EmptyState icon={Mail} title="No messages" text="Messages sent from the Contact page appear here." />
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((m) => {
            const isNew = m.status !== "Read";
            return (
              <Card key={m.id} className={`p-5 ${isNew ? "border-l-4 border-l-honey" : ""}`}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">
                      {m.name} {isNew && <span className="ml-1 rounded-full bg-honey-soft px-2 py-0.5 text-[10px] font-bold uppercase text-honey-deep">New</span>}
                    </p>
                    <p className="text-xs text-muted">
                      <a href={`mailto:${m.email}`} className="hover:text-forest">{m.email}</a>
                      {m.phone && <> · <a href={`tel:${m.phone}`} className="hover:text-forest">{m.phone}</a></>} · {formatDate(m.createdAt, true)}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <a
                      href={`mailto:${m.email}?subject=${encodeURIComponent(`Re: your message to ${STORE_FULL_NAME}`)}`}
                      onClick={() => isNew && markRead(m)}
                      className="grid h-9 w-9 place-items-center rounded-full hover:bg-mint hover:text-forest"
                      aria-label="Reply by email"
                    >
                      <Reply size={16} />
                    </a>
                    <button onClick={() => markRead(m, isNew)} className="grid h-9 w-9 place-items-center rounded-full hover:bg-mint hover:text-forest" aria-label={isNew ? "Mark as read" : "Mark as unread"}>
                      {isNew ? <MailOpen size={16} /> : <Mail size={16} />}
                    </button>
                    {canManage && (
                      <button onClick={() => remove(m)} className="grid h-9 w-9 place-items-center rounded-full hover:bg-red-50 hover:text-red-700" aria-label="Delete">
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
                <p className="mt-3 whitespace-pre-line text-sm leading-relaxed">{m.message}</p>
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
}
