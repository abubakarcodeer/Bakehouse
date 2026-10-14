// Ordered gallery for a product: the main image first, then any extra images.
export function getGallery(product) {
  if (!product) return [];
  const all = [product.image, ...(product.images || [])].filter(Boolean);
  return [...new Set(all)];
}

// Splits long-form text into paragraphs and bullet lists ("- " or "• " lines).
export function parseRichText(text = "") {
  return String(text)
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
      const isList = lines.every((l) => /^[-•*]\s+/.test(l));
      return isList ? { type: "list", items: lines.map((l) => l.replace(/^[-•*]\s+/, "")) } : { type: "paragraph", text: lines.join(" ") };
    });
}

export function isSoldOut(product) {
  return product.stock !== undefined && product.stock !== null && Number(product.stock) <= 0;
}

// Price for a chosen pack option (e.g. "Box of 6"), falling back to the base price.
export function optionPrice(product, optionName) {
  const option = product.options?.find((o) => o.name === optionName);
  return option ? Number(option.price) : Number(product.price);
}

// The next items after `index` in a circular list, so every item gets picked by its predecessors.
function after(list, index, count) {
  return Array.from({ length: Math.min(count, list.length) }, (_, i) => list[(index + 1 + i) % list.length]);
}

// "You may also like": same-category products first, topped up from other categories.
export function getRelatedProducts(products, product, limit = 4) {
  const ordered = [...products].sort((a, b) => a.id.localeCompare(b.id));
  const inStock = ordered.filter((p) => p.id === product.id || !isSoldOut(p));

  const pick = (list) => {
    const index = list.findIndex((p) => p.id === product.id);
    return after(list, index, list.length).filter((p) => p.id !== product.id);
  };

  const sameCategory = pick(inStock.filter((p) => p.category === product.category || p.id === product.id));
  const otherCategories = pick(inStock.filter((p) => p.category !== product.category || p.id === product.id));

  return [...sameCategory.slice(0, Math.max(limit - 1, 0)), ...otherCategories].slice(0, limit);
}
