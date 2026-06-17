import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { products, type Product } from "@/lib/products";

export type CartItem = {
  id: string;
  qty: number;
};

type CartContextValue = {
  items: CartItem[];
  detailedItems: (CartItem & { product: Product })[];
  count: number;
  subtotal: number;
  shipping: number;
  total: number;
  add: (id: string, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "bakesto.cart.v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items, hydrated]);

  const value = useMemo<CartContextValue>(() => {
    const detailedItems = items
      .map((it) => {
        const product = products.find((p) => p.id === it.id);
        return product ? { ...it, product } : null;
      })
      .filter((x): x is CartItem & { product: Product } => x !== null);

    const count = detailedItems.reduce((s, it) => s + it.qty, 0);
    const subtotal = detailedItems.reduce(
      (s, it) => s + it.product.price * it.qty,
      0,
    );
    const shipping = subtotal === 0 || subtotal >= 999 ? 0 : 79;
    const total = subtotal + shipping;

    return {
      items,
      detailedItems,
      count,
      subtotal,
      shipping,
      total,
      add: (id, qty = 1) =>
        setItems((prev) => {
          const existing = prev.find((i) => i.id === id);
          if (existing) {
            return prev.map((i) =>
              i.id === id ? { ...i, qty: i.qty + qty } : i,
            );
          }
          return [...prev, { id, qty }];
        }),
      remove: (id) => setItems((prev) => prev.filter((i) => i.id !== id)),
      setQty: (id, qty) =>
        setItems((prev) =>
          qty <= 0
            ? prev.filter((i) => i.id !== id)
            : prev.map((i) => (i.id === id ? { ...i, qty } : i)),
        ),
      clear: () => setItems([]),
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
