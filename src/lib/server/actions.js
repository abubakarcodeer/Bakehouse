"use server";

import { revalidatePath } from "next/cache";

/**
 * Revalidates the product page, menu and home page.
 * Called from the admin dashboard when a product is created, updated or deleted.
 */
export async function revalidateProduct(id) {
  try {
    revalidatePath(`/products/${id}`);
    revalidatePath("/products");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Revalidation failed:", error);
    return { success: false, error: error.message };
  }
}
