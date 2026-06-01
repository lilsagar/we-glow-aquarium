export type { Product } from "@/lib/types/product";

export {
  fetchProducts,
  subscribeToProducts,
  fetchProductBySlug,
  seedProductsIfEmpty,
  createUniqueSlug,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategoriesFromProducts,
} from "@/lib/firestore/products";
