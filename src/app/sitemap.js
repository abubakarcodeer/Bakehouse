import { getActiveProducts } from "../lib/server/products";
import { SITE_URL } from "../lib/config";

export default async function sitemap() {
  const pages = ["", "/products", "/about", "/recipes", "/contact", "/book-a-table"].map((path) => ({ url: `${SITE_URL}${path}`, changeFrequency: "weekly" }));
  const products = (await getActiveProducts()).map((p) => ({ url: `${SITE_URL}/products/${p.id}`, changeFrequency: "weekly" }));
  return [...pages, ...products];
}
