import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { db, firebaseConfigured } from "../firebase";
import { SEED_PRODUCTS } from "../../data/products";

const serialize = (id, data) =>
  JSON.parse(
    JSON.stringify({
      id,
      ...data,
      createdAt: data.createdAt?.toDate?.() || null,
      updatedAt: data.updatedAt?.toDate?.() || null,
    })
  );

/**
 * Fetches all active products for the sitemap and pre-rendering.
 * Falls back to the sample menu while Firebase is not configured or the catalogue is empty.
 */
export async function getActiveProducts() {
  if (!firebaseConfigured) return SEED_PRODUCTS;
  try {
    const snap = await getDocs(query(collection(db, "products"), where("isActive", "==", true)));
    const live = snap.docs.map((d) => serialize(d.id, d.data()));
    return live.length ? live : SEED_PRODUCTS;
  } catch (error) {
    console.error("Error fetching products:", error);
    return SEED_PRODUCTS;
  }
}

// Card-sized copy of the catalogue for the layout: it is embedded in every page's HTML, so the long
// text fields (only shown on the product page, which loads its own product) are left out.
export async function getCatalogue() {
  const products = await getActiveProducts();
  return products.map(({ longDescription, ingredients, createdAt, ...card }) => card);
}

export async function getProductById(id) {
  const seed = SEED_PRODUCTS.find((p) => p.id === id) || null;
  if (!firebaseConfigured) return seed;
  try {
    const snap = await getDoc(doc(db, "products", id));
    return snap.exists() ? serialize(snap.id, snap.data()) : seed;
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    return seed;
  }
}
