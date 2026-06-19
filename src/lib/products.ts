import essentials from "@/assets/baking-essentials.jpg";
import cake from "@/assets/cake-product.jpg";
import hero from "@/assets/hero-cupcake.jpg";
import catalog from "@/data/catalog.json";

export type Category = {
  id: string;
  label: string;
  subcategories?: { id: string; label: string }[];
};

export type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  tag?: string | null;
  category: string;
  subcategory?: string;
  description: string;
  rating: number;
  stock: number;
};

export function buildCategoriesFromProducts(products: Product[]) {
  const map = new Map<string, Set<string>>();

  for (const p of products) {
    const category = p.category?.trim();
    const subcategory = p.subcategory?.trim();
    if (!category) continue;

    if (!map.has(category)) map.set(category, new Set());
    if (subcategory) map.get(category)!.add(subcategory);
  }

  const categories: Category[] = [{ id: "all", label: "All", subcategories: [] }];

  [...map.keys()]
    .sort((a, b) => a.localeCompare(b))
    .forEach((category) => {
      const subs = [...map.get(category)!].sort((a, b) => a.localeCompare(b));
      categories.push({
        id: category,
        label: category,
        subcategories: subs.map((sub) => ({ id: sub, label: sub })),
      });
    });

  return categories;
}

const imageMap: Record<string, string> = { essentials, cake, hero };

export const categories: Category[] = catalog.categories;

export const products: Product[] = catalog.products.map((p) => ({
  ...p,
  image: imageMap[p.image] ?? p.image,
})) as Product[];

export const getProduct = (id: string) => products.find((p) => p.id === id);

export const formatINR = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
