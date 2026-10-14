"use client";

import { auth } from "./firebase";
import { isDemoMode } from "./demo";

// Local demo mode has no image host: shrink the image and keep it as a data URL in the browser.
async function toDataUrl(file, max = 900) {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
  const canvas = Object.assign(document.createElement("canvas"), {
    width: Math.round(bitmap.width * scale),
    height: Math.round(bitmap.height * scale),
  });
  canvas.getContext("2d").drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", 0.85);
}

// Uploads through /api/upload (ImgBB); the route checks the caller is an admin or manager.
export async function uploadImage(file) {
  if (isDemoMode()) return toDataUrl(file);

  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error("Please sign in again");

  const body = new FormData();
  body.append("image", file);
  const res = await fetch("/api/upload", { method: "POST", headers: { Authorization: `Bearer ${token}` }, body });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.success) throw new Error(data.error || "Upload failed");
  return data.url;
}
