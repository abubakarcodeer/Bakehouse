"use client";

import { useEffect, useRef, useState } from "react";
import { doc, getDoc, serverTimestamp, setDoc } from "../../../lib/db";
import { CheckCircle2, ImagePlus, Loader2, ShieldAlert, XCircle } from "lucide-react";
import { db } from "../../../lib/firebase";
import { can } from "../../../lib/admin";
import { DEFAULT_SETTINGS } from "../../../lib/config";
import { uploadImage } from "../../../lib/uploadImage";
import { IMAGES } from "../../../data/images";
import { useAuth } from "../../../context/AuthContext";
import { useToast } from "../../../context/ToastContext";
import { Card, EmptyState, Field, Loading, PageHeader } from "../../../components/admin/ui";
import ImageCropper from "../../../components/admin/ImageCropper";

// Upload + preview for one settings image (hero, story).
function ImageSetting({ label, value, fallback, busy, onPick, onReset }) {
  const fileRef = useRef(null);
  return (
    <Field label={label}>
      <div className="flex items-center gap-4">
        <img src={value || fallback} alt="" className="h-24 w-24 rounded-full border border-line object-cover" />
        <div className="flex flex-col gap-2">
          <button type="button" onClick={() => fileRef.current?.click()} disabled={busy} className="btn-outline gap-2 py-2">
            {busy ? <Loader2 size={15} className="animate-spin" /> : <ImagePlus size={15} />}
            {busy ? "Uploading…" : "Upload image"}
          </button>
          {value && (
            <button type="button" onClick={onReset} className="text-left text-xs text-muted link-underline">
              Reset to default image
            </button>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => e.target.files?.[0] && onPick(e.target.files[0])} />
      </div>
    </Field>
  );
}

export default function SettingsPage() {
  const { userProfile } = useAuth();
  const { addToast } = useToast();
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(null);
  const [cropState, setCropState] = useState({ open: false, image: null, key: null });
  const [emailConfigured, setEmailConfigured] = useState(null);

  useEffect(() => {
    getDoc(doc(db, "settings", "store"))
      .then((snap) => setForm({ ...DEFAULT_SETTINGS, ...(snap.exists() ? snap.data() : {}) }))
      .catch(() => setForm(DEFAULT_SETTINGS));
    fetch("/api/send-email")
      .then((r) => r.json())
      .then((d) => setEmailConfigured(Boolean(d.configured)))
      .catch(() => setEmailConfigured(false));
  }, []);

  if (!can(userProfile?.role, "manageSettings")) {
    return <EmptyState icon={ShieldAlert} title="No permission" text="Only admins and managers can change store settings." />;
  }
  if (!form) return <Loading />;

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  function pickImage(key, file) {
    const reader = new FileReader();
    reader.onload = () => setCropState({ open: true, image: reader.result, key });
    reader.readAsDataURL(file);
  }

  async function handleCropComplete(blob) {
    const key = cropState.key;
    setCropState({ open: false, image: null, key: null });
    setUploading(key);
    try {
      const url = await uploadImage(blob);
      setForm((f) => ({ ...f, [key]: url }));
      addToast("Image uploaded. Save to publish it.");
    } catch (err) {
      addToast(err.message, "error", 5000);
    } finally {
      setUploading(null);
    }
  }

  async function save(e) {
    e.preventDefault();
    const threshold = Number(form.freeShippingThreshold);
    const flat = Number(form.flatShipping);
    if (!(threshold >= 0) || !(flat >= 0)) return addToast("Delivery values must be 0 or more", "error");

    setSaving(true);
    try {
      await setDoc(doc(db, "settings", "store"), { ...form, freeShippingThreshold: threshold, flatShipping: flat, updatedAt: serverTimestamp() }, { merge: true });
      addToast("Settings saved. The store updates instantly.");
    } catch (err) {
      console.error(err);
      addToast("Could not save settings", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={save}>
      <PageHeader
        title="Settings"
        subtitle="Changes go live on the storefront as soon as you save."
        actions={
          <button disabled={saving || Boolean(uploading)} className="btn-dark py-2.5">
            {saving ? "Saving…" : "Save settings"}
          </button>
        }
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="space-y-6">
          <Card className="space-y-5 p-6">
            <h2 className="font-semibold">Homepage hero</h2>
            <Field label="Script line" hint='The handwritten line above the headline, e.g. "Freshly Baked"'>
              <input className="field" value={form.heroEyebrow} onChange={set("heroEyebrow")} />
            </Field>
            <Field label="Headline" hint="Press Enter to start the second (dark) line">
              <textarea className="field min-h-[80px]" value={form.heroTitle} onChange={set("heroTitle")} />
            </Field>
            <Field label="Intro text" hint='Follows "At Hearthly Bakehouse,"'>
              <textarea className="field min-h-[80px]" value={form.heroSubtitle} onChange={set("heroSubtitle")} />
            </Field>
            <ImageSetting
              label="Hero image"
              value={form.heroImage}
              fallback={IMAGES.hero}
              busy={uploading === "heroImage"}
              onPick={(file) => pickImage("heroImage", file)}
              onReset={() => setForm({ ...form, heroImage: "" })}
            />
          </Card>

          <Card className="space-y-5 p-6">
            <h2 className="font-semibold">“Baked with Love” story</h2>
            <Field label="Title">
              <input className="field" value={form.storyTitle} onChange={set("storyTitle")} />
            </Field>
            <Field label="Text">
              <textarea className="field min-h-[110px]" value={form.storyText} onChange={set("storyText")} />
            </Field>
            <ImageSetting
              label="Story image"
              value={form.storyImage}
              fallback={IMAGES.story}
              busy={uploading === "storyImage"}
              onPick={(file) => pickImage("storyImage", file)}
              onReset={() => setForm({ ...form, storyImage: "" })}
            />
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="space-y-5 p-6">
            <h2 className="font-semibold">Announcement & delivery</h2>
            <Field label="Announcement bar" hint="Leave empty to hide the green bar above the header">
              <input className="field" value={form.announcement} onChange={set("announcement")} placeholder="Free delivery on orders over Rs 3,000" />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Free delivery from (Rs)">
                <input type="number" min="0" step="1" className="field" value={form.freeShippingThreshold} onChange={set("freeShippingThreshold")} />
              </Field>
              <Field label="Delivery charge (Rs)">
                <input type="number" min="0" step="1" className="field" value={form.flatShipping} onChange={set("flatShipping")} />
              </Field>
            </div>
            <Field label="Delivery note" hint="Shown on product pages">
              <input className="field" value={form.deliveryTime} onChange={set("deliveryTime")} />
            </Field>
          </Card>

          <Card className="space-y-5 p-6">
            <h2 className="font-semibold">Bakery & contact</h2>
            <Field label="Address">
              <input className="field" value={form.address} onChange={set("address")} placeholder="Shop 12, Main Boulevard, Lahore" />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Phone">
                <input type="tel" className="field" value={form.contactPhone} onChange={set("contactPhone")} placeholder="042 1234567" />
              </Field>
              <Field label="WhatsApp number" hint="Adds a chat button on Contact">
                <input type="tel" className="field" value={form.whatsappNumber} onChange={set("whatsappNumber")} placeholder="03XX XXXXXXX" />
              </Field>
            </div>
            <Field label="Contact email">
              <input type="email" className="field" value={form.contactEmail} onChange={set("contactEmail")} placeholder="hello@hearthlybakehouse.com" />
            </Field>
            <Field label="Opening hours">
              <input className="field" value={form.openingHours} onChange={set("openingHours")} />
            </Field>
          </Card>

          <Card className="space-y-5 p-6">
            <h2 className="font-semibold">Social links</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Instagram URL">
                <input type="url" className="field" value={form.instagramUrl} onChange={set("instagramUrl")} />
              </Field>
              <Field label="Facebook URL">
                <input type="url" className="field" value={form.facebookUrl} onChange={set("facebookUrl")} />
              </Field>
              <Field label="Twitter / X URL">
                <input type="url" className="field" value={form.twitterUrl} onChange={set("twitterUrl")} />
              </Field>
              <Field label="YouTube URL">
                <input type="url" className="field" value={form.youtubeUrl} onChange={set("youtubeUrl")} />
              </Field>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="font-semibold">Integrations</h2>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-start gap-3">
                {emailConfigured ? <CheckCircle2 size={18} className="mt-0.5 text-emerald-600" /> : <XCircle size={18} className="mt-0.5 text-red-600" />}
                <div>
                  <p className="font-medium">New order email alerts (EmailJS)</p>
                  <p className="text-xs text-muted">
                    {emailConfigured === null
                      ? "Checking…"
                      : emailConfigured
                        ? "Configured. Admin is emailed for every new order."
                        : "Not configured. Add EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_PUBLIC_KEY and ADMIN_EMAIL to .env.local."}
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 size={18} className="mt-0.5 text-emerald-600" />
                <div>
                  <p className="font-medium">Image uploads (ImgBB)</p>
                  <p className="text-xs text-muted">Uses IMGBB_API_KEY from .env.local. Try an upload above to confirm it works.</p>
                </div>
              </li>
            </ul>
          </Card>
        </div>
      </div>

      <ImageCropper open={cropState.open} image={cropState.image} onCancel={() => setCropState({ open: false, image: null, key: null })} onComplete={handleCropComplete} />
    </form>
  );
}
