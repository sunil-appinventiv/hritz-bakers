import essentials from "@/assets/baking-essentials.jpg";
import cake from "@/assets/cake-product.jpg";
import hero from "@/assets/hero-cupcake.jpg";
import catalog from "@/data/catalog.json";

export type Category = { id: string; label: string };

export type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  tag?: string | null;
  category: "essentials" | "cakes" | "flavors" | "decor";
  description: string;
  rating: number;
  stock: number;
};

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
