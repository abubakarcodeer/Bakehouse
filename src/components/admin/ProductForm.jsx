"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { doc, serverTimestamp, setDoc } from "../../lib/db";
import { ArrowLeft, ImagePlus, Loader2, Plus, X } from "lucide-react";
import { db } from "../../lib/firebase";
import { uploadImage } from "../../lib/uploadImage";
import { CATEGORIES, formatPrice, LOW_STOCK_THRESHOLD } from "../../lib/config";
import { OPTION_PRESETS } from "../../data/products";
import RichText from "../product/RichText";
import { useToast } from "../../context/ToastContext";
import { Card, Field, PageHeader, Toggle } from "./ui";
import GalleryPicker from "./GalleryPicker";
import ImageCropper from "./ImageCropper";

const EMPTY = {
  title: "",
  category: "cookies",
  price: "",
  compareAtPrice: "",
  stock: "",
  description: "",
  longDescription: "",
  ingredients: "",
  image: "",
  extraImages: [],
  options: [],
  bestseller: false,
  isActive: true,
};

const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 48);

function fromProduct(product) {
  if (!product) return EMPTY;
  return {
    ...EMPTY,
    ...product,
    price: product.price ?? "",
    compareAtPrice: product.compareAtPrice ?? "",
    stock: product.stock ?? "",
    longDescription: product.longDescription || "",
    ingredients: product.ingredients || "",
    image: product.image || "",
    extraImages: (product.images || []).filter((src) => src && src !== product.image),
    options: (product.options || []).map((o) => ({ name: o.name, price: String(o.price) })),
  };
}

function MainImageSlot({ src, busy, onFile, onRemove }) {
  const inputRef = useRef(null);
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        if (e.dataTransfer.files?.[0]) onFile(e.dataTransfer.files[0]);
      }}
      className={`group relative flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl text-center text-xs transition ${
        src ? "border border-line bg-cream" : "border-2 border-dashed border-forest-soft bg-mint/40 text-muted hover:border-forest hover:text-forest"
      }`}
    >
      {src ? (
        <>
          <img src={src} alt="Main product photo" className="absolute inset-0 h-full w-full object-cover" />
          <span className="absolute inset-0 grid place-items-center bg-black/40 text-xs font-semibold text-white opacity-0 transition group-hover:opacity-100">Replace</span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-white text-ink shadow"
            aria-label="Remove main image"
          >
            <X size={13} />
          </button>
        </>
      ) : busy ? (
        <Loader2 size={22} className="animate-spin text-forest" />
      ) : (
        <>
          <ImagePlus size={26} />
          <span className="px-4">Drop the main photo here or click to upload. Square photos look best.</span>
        </>
      )}
      {src && busy && (
        <span className="absolute inset-0 grid place-items-center bg-white/70">
          <Loader2 size={22} className="animate-spin text-forest" />
        </span>
      )}
      <input ref={inputRef} type="file" accept="image/*" hidden onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
    </div>
  );
}

export default function ProductForm({ product }) {
  const router = useRouter();
  const { addToast } = useToast();
  const fileRef = useRef(null);
  const [form, setForm] = useState(() => fromProduct(product));
  const [uploading, setUploading] = useState(0);
  const [mainBusy, setMainBusy] = useState(false);
  const [saving, setSaving] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [urlTarget, setUrlTarget] = useState("main");
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [cropState, setCropState] = useState({ open: false, image: null, target: null });
  const [descTab, setDescTab] = useState("write");
  const [option, setOption] = useState({ name: "", price: "" });

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  const isEdit = Boolean(product);

  function openCropper(file, target) {
    if (!file.type.startsWith("image/")) return addToast("Please choose an image file", "error");
    const reader = new FileReader();
    reader.onload = () => setCropState({ open: true, image: reader.result, target });
    reader.readAsDataURL(file);
  }

  async function handleCropComplete(blob) {
    const target = cropState.target;
    setCropState({ open: false, image: null, target: null });

    if (target === "extra") {
      setUploading((n) => n + 1);
      try {
        const url = await uploadImage(blob);
        setForm((f) => ({ ...f, extraImages: [...f.extraImages, url] }));
      } catch (err) {
        addToast(`Upload failed: ${err.message}`, "error");
      } finally {
        setUploading((n) => n - 1);
      }
      return;
    }

    setMainBusy(true);
    try {
      set("image", await uploadImage(blob));
    } catch (err) {
      addToast(`Upload failed: ${err.message}`, "error");
    } finally {
      setMainBusy(false);
    }
  }

  async function handleFiles(files) {
    const list = [...files].filter((f) => f.type.startsWith("image/"));
    if (!list.length) return;

    // A single image goes through the cropper; several are uploaded as they are.
    if (list.length === 1) return openCropper(list[0], "extra");

    setUploading((n) => n + list.length);
    await Promise.all(
      list.map(async (file) => {
        try {
          const url = await uploadImage(file);
          setForm((f) => ({ ...f, extraImages: [...f.extraImages, url] }));
        } catch (err) {
          addToast(`${file.name}: ${err.message}`, "error", 5000);
        } finally {
          setUploading((n) => n - 1);
        }
      })
    );
  }

  function addFromSource(url, target) {
    if (target === "extra") set("extraImages", [...form.extraImages, url]);
    else set("image", url);
  }

  function addImageUrl() {
    const url = imageUrl.trim();
    if (!/^https?:\/\//.test(url)) return addToast("Enter a full image URL starting with https://", "error");
    addFromSource(url, urlTarget);
    setImageUrl("");
  }

  function addOption(name = option.name, price = option.price) {
    const clean = name.trim();
    if (!clean) return;
    if (form.options.some((o) => o.name.toLowerCase() === clean.toLowerCase())) return addToast(`${clean} is already added`, "error");
    set("options", [...form.options, { name: clean, price: price || form.price || "" }]);
    setOption({ name: "", price: "" });
  }

  const setOptionPrice = (i, price) => set("options", form.options.map((o, j) => (j === i ? { ...o, price } : o)));

  async function handleSubmit(e) {
    e.preventDefault();
    const options = form.options.map((o) => ({ name: o.name, price: Number(o.price) }));
    if (!form.title.trim()) return addToast("Add a product name", "error");
    if (options.some((o) => !(o.price > 0))) return addToast("Every size needs a price greater than 0", "error");
    // With sizes, the base price is the cheapest one so cards can say "From Rs …".
    const price = options.length ? Math.min(...options.map((o) => o.price)) : Number(form.price);
    if (!(price > 0)) return addToast("Price must be greater than 0", "error");
    if (!form.image) return addToast("Add a main photo", "error");

    setSaving(true);
    const id = product?.id || `${slugify(form.title)}-${Math.random().toString(36).slice(2, 6)}`;
    const compareAtPrice = Number(form.compareAtPrice);
    const data = {
      id,
      title: form.title.trim(),
      category: form.category,
      price,
      compareAtPrice: compareAtPrice > price ? compareAtPrice : null,
      stock: form.stock === "" ? null : Math.max(0, Math.floor(Number(form.stock))),
      description: form.description.trim(),
      longDescription: form.longDescription.trim(),
      ingredients: form.ingredients.trim(),
      image: form.image,
      images: [form.image, ...form.extraImages].filter(Boolean),
      options,
      bestseller: form.bestseller,
      isActive: form.isActive,
      updatedAt: serverTimestamp(),
      ...(isEdit ? {} : { createdAt: serverTimestamp() }),
    };

    try {
      await setDoc(doc(db, "products", id), data, { merge: true });

      // Trigger on-demand ISR revalidation
      try {
        const { revalidateProduct } = await import("../../lib/server/actions");
        await revalidateProduct(id);
      } catch (revalErr) {
        console.warn("Revalidation skipped:", revalErr);
      }

      addToast(isEdit ? "Product updated" : "Product created");
      router.push("/admin/products");
    } catch (err) {
      console.error(err);
      addToast("Could not save the product", "error");
      setSaving(false);
    }
  }

  const unusedPresets = OPTION_PRESETS.filter((p) => !form.options.some((o) => o.name === p));

  return (
    <form onSubmit={handleSubmit}>
      <Link href="/admin/products" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted hover:text-forest">
        <ArrowLeft size={15} /> Products
      </Link>
      <PageHeader
        title={isEdit ? "Edit product" : "New product"}
        subtitle={isEdit ? form.title : "Add a new bake to the menu"}
        actions={
          <>
            {isEdit && (
              <Link href={`/products/${product.id}`} target="_blank" className="btn-outline bg-white py-2.5">
                View in store
              </Link>
            )}
            <button disabled={saving || uploading > 0 || mainBusy} className="btn-dark py-2.5">
              {saving ? "Saving…" : isEdit ? "Save changes" : "Create product"}
            </button>
          </>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <Card className="space-y-5 p-6">
            <Field label="Product name">
              <input className="field" value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. Triple Chocolate Cookie" required />
            </Field>
            <Field label="Short description" hint="One or two sentences shown on the product page">
              <textarea
                className="field min-h-[80px]"
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="Thick, gooey and loaded with three kinds of chocolate…"
              />
            </Field>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">Long description</span>
                <div className="flex rounded-full border border-line p-0.5 text-xs">
                  {["write", "preview"].map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setDescTab(tab)}
                      className={`rounded-full px-3 py-1 capitalize ${descTab === tab ? "bg-forest text-white" : "text-muted hover:text-forest"}`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>
              {descTab === "write" ? (
                <textarea
                  className="field min-h-[180px] font-[inherit] leading-relaxed"
                  value={form.longDescription}
                  onChange={(e) => set("longDescription", e.target.value)}
                  placeholder={"Tell the story: how it's made, how it tastes, how to enjoy it.\n\nLeave an empty line between paragraphs.\n\n- Start a line with a dash for bullet points\n- Like this"}
                />
              ) : (
                <div className="min-h-[180px] rounded-xl border border-line bg-cream/50 p-4 text-sm">
                  {form.longDescription.trim() ? <RichText text={form.longDescription} /> : <p className="text-muted">Nothing to preview yet.</p>}
                </div>
              )}
              <span className="mt-1 block text-xs text-muted">Shown under "About this bake". Empty line = new paragraph, "- " = bullet.</span>
            </div>

            <Field label="Ingredients & allergens" hint="Shown on the product page. New lines are kept.">
              <textarea
                className="field min-h-[100px]"
                value={form.ingredients}
                onChange={(e) => set("ingredients", e.target.value)}
                placeholder={"Flour, butter, brown sugar, dark chocolate, eggs, vanilla.\nContains: gluten, dairy, eggs."}
              />
            </Field>
          </Card>

          <Card className="p-6">
            <div className="mb-5">
              <h2 className="font-semibold">Photos</h2>
              <p className="text-xs text-muted">The main photo is used on menu cards. Extra photos appear as thumbnails on the product page.</p>
            </div>

            <div className="grid gap-5 sm:grid-cols-[240px_1fr]">
              <div>
                <MainImageSlot src={form.image} busy={mainBusy} onFile={(file) => openCropper(file, "main")} onRemove={() => set("image", "")} />
                <p className="mt-2 text-center text-xs font-semibold uppercase tracking-[0.1em]">
                  Main photo <span className="text-forest">*</span>
                </p>
              </div>
              <div>
                <h3 className="mb-3 text-sm font-semibold">
                  Extra photos <span className="font-normal text-muted">(optional)</span>
                </h3>
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                  {form.extraImages.map((src, i) => (
                    <div key={src + i} className="group relative aspect-square overflow-hidden rounded-xl border border-line bg-cream">
                      <img src={src} alt="" className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => set("extraImages", form.extraImages.filter((_, j) => j !== i))}
                        className="absolute right-1.5 top-1.5 grid h-6 w-6 place-items-center rounded-full bg-white shadow"
                        aria-label="Remove image"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      handleFiles(e.dataTransfer.files);
                    }}
                    className="flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-line text-xs text-muted transition hover:border-forest hover:text-forest"
                  >
                    {uploading ? <Loader2 size={18} className="animate-spin text-forest" /> : <Plus size={18} />}
                    {uploading ? `${uploading}…` : "Add"}
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={(e) => handleFiles(e.target.files)} />
                </div>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
              <select value={urlTarget} onChange={(e) => setUrlTarget(e.target.value)} className="field py-2.5 sm:w-40" aria-label="Where to add the URL">
                <option value="main">Main photo</option>
                <option value="extra">Extra photo</option>
              </select>
              <input
                className="field py-2.5"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addImageUrl())}
                placeholder="…or paste an image URL"
              />
              <button type="button" onClick={addImageUrl} className="btn-outline py-2.5">
                Add
              </button>
              <button type="button" onClick={() => setGalleryOpen(true)} className="btn-outline gap-2 py-2.5">
                <ImagePlus size={16} /> Gallery
              </button>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="font-semibold">Sizes & pack prices</h2>
            <p className="mb-4 text-xs text-muted">Optional. Add pack sizes (Single, Box of 6, 2 lb…) each with its own price. Leave empty to sell at one price.</p>

            {form.options.length > 0 && (
              <ul className="mb-4 divide-y divide-line rounded-xl border border-line">
                {form.options.map((o, i) => (
                  <li key={o.name} className="flex items-center gap-3 px-4 py-2.5">
                    <span className="flex-1 text-sm font-medium">{o.name}</span>
                    <span className="text-xs text-muted">Rs</span>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={o.price}
                      onChange={(e) => setOptionPrice(i, e.target.value)}
                      className="field w-28 py-2"
                      aria-label={`${o.name} price`}
                    />
                    <button type="button" onClick={() => set("options", form.options.filter((_, j) => j !== i))} aria-label={`Remove ${o.name}`}>
                      <X size={16} className="text-muted hover:text-red-700" />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {unusedPresets.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {unusedPresets.map((p) => (
                  <button key={p} type="button" onClick={() => addOption(p, "")} className="rounded-full border border-line px-3 py-1.5 text-xs transition hover:border-forest hover:text-forest">
                    + {p}
                  </button>
                ))}
              </div>
            )}
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                className="field py-2.5 sm:w-56"
                value={option.name}
                onChange={(e) => setOption({ ...option, name: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addOption())}
                placeholder="Custom size, e.g. Party box of 24"
              />
              <input
                type="number"
                min="0"
                className="field py-2.5 sm:w-32"
                value={option.price}
                onChange={(e) => setOption({ ...option, price: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addOption())}
                placeholder="Price"
              />
              <button type="button" onClick={() => addOption()} className="btn-outline gap-1 py-2.5">
                <Plus size={15} /> Add
              </button>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="space-y-4 p-6">
            <h2 className="font-semibold">Visibility</h2>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium">Visible in store</p>
                <p className="text-xs text-muted">Hidden products stay in the dashboard</p>
              </div>
              <Toggle label="Visible in store" checked={form.isActive} onChange={(v) => set("isActive", v)} />
            </div>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium">Bestseller</p>
                <p className="text-xs text-muted">Shows a Bestseller badge on the menu</p>
              </div>
              <Toggle label="Bestseller" checked={form.bestseller} onChange={(v) => set("bestseller", v)} />
            </div>
          </Card>

          <Card className="space-y-4 p-6">
            <h2 className="font-semibold">Organisation</h2>
            <Field label="Category">
              <select className="field" value={form.category} onChange={(e) => set("category", e.target.value)}>
                {CATEGORIES.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>
          </Card>

          <Card className="space-y-4 p-6">
            <h2 className="font-semibold">Pricing & stock</h2>
            {form.options.length ? (
              <p className="rounded-xl bg-mint px-3 py-2 text-xs text-forest">
                Priced by size. Menu cards show “From {formatPrice(Math.min(...form.options.map((o) => Number(o.price) || Infinity)) || 0)}”.
              </p>
            ) : (
              <Field label="Price (Rs)">
                <input type="number" min="0" step="1" className="field" value={form.price} onChange={(e) => set("price", e.target.value)} required />
              </Field>
            )}
            <Field label="Compare-at price" hint="Higher than the price to show it as on sale">
              <input type="number" min="0" step="1" className="field" value={form.compareAtPrice} onChange={(e) => set("compareAtPrice", e.target.value)} />
            </Field>
            <Field
              label="Stock"
              hint={form.stock !== "" && Number(form.stock) <= LOW_STOCK_THRESHOLD ? "Low stock warning active" : "Leave empty to not track stock"}
              className={form.stock !== "" && Number(form.stock) <= LOW_STOCK_THRESHOLD ? "text-amber-700" : ""}
            >
              <input
                type="number"
                min="0"
                step="1"
                className={`field ${form.stock !== "" && Number(form.stock) <= LOW_STOCK_THRESHOLD ? "border-amber-500" : ""}`}
                value={form.stock}
                onChange={(e) => set("stock", e.target.value)}
              />
            </Field>
          </Card>
        </div>
      </div>

      <GalleryPicker open={galleryOpen} onClose={() => setGalleryOpen(false)} onSelect={(src) => addFromSource(src, urlTarget)} />

      <ImageCropper
        open={cropState.open}
        image={cropState.image}
        onCancel={() => setCropState({ open: false, image: null, target: null })}
        onComplete={handleCropComplete}
      />
    </form>
  );
}
