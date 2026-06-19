import { Link } from "react-router-dom";
import SiteLayout from "@/components/SiteLayout";
import { formatINR, buildCategoriesFromProducts } from "@/lib/products";
import { useCart } from "@/context/CartContext";
import { useState, useMemo, useEffect } from "react";
import { Minus, Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { SITE } from "@/lib/site";
import { usePageTitle } from "@/hooks/usePageTitle";

const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbwtaFad-axrTHvpaPMt4VEPTf8DOH4OT6HGu1Qg0rarHECad551Yuc_qzw-DCmMDaeSTw/exec";

export default function Products() {
  usePageTitle(`Products — ${SITE.name}`);

  const [cat, setCat] = useState("all");
  const [subCat, setSubCat] = useState("");
  const [query, setQuery] = useState("");
  const [productsList, setProductsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(SCRIPT_URL);
        const data = await response.json();
        const formattedData = data.map((item) => ({
          ...item,
          price: Number(item.price),
          rating: Number(item.rating),
          stock: Number(item.stock),
        }));
        setProductsList(formattedData);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to load products. Please try refreshing.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categories = useMemo(
    () => buildCategoriesFromProducts(productsList),
    [productsList],
  );

  const activeCategoryObj = categories.find((c) => c.id === cat);

  const visible = useMemo(() => {
    return productsList.filter((p) => {
      const matchCat = cat === "all" || p.category === cat;
      const matchSubCat = subCat === "" || p.subcategory === subCat;
      const matchQ = !query || p.name.toLowerCase().includes(query.toLowerCase());
      return matchCat && matchSubCat && matchQ;
    });
  }, [productsList, cat, subCat, query]);

  const handleCategoryChange = (categoryId) => {
    setCat(categoryId);
    setSubCat("");
  };

  const handleSubCatToggle = (subCategoryId) => {
    setSubCat((prev) => (prev === subCategoryId ? "" : subCategoryId));
  };

  return (
    <SiteLayout>
      <section className="bg-secondary/40 py-12">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold">Our Products</h1>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Hand-picked baking supplies and ingredients for every occasion.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col md:flex-row gap-4 md:items-start md:justify-between mb-8">
          <div className="flex-1">
            {!loading && categories.length > 1 && (
              <div className="flex flex-wrap gap-2">
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handleCategoryChange(c.id)}
                    className={`rounded-full px-4 py-1.5 text-sm font-medium border transition ${
                      cat === c.id
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background border-border hover:bg-muted"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            )}

            {activeCategoryObj?.subcategories?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3 pl-2 border-l-2 border-primary/20">
                {activeCategoryObj.subcategories.map((sc) => (
                  <button
                    key={sc.id}
                    onClick={() => handleSubCatToggle(sc.id)}
                    className={`rounded-full px-3 py-1 text-xs font-medium border transition ${
                      subCat === sc.id
                        ? "bg-secondary text-secondary-foreground border-border"
                        : "bg-background border-border text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {sc.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <input
            type="search"
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="rounded-full border border-border bg-background px-4 py-2 text-sm w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin mb-4 text-primary" />
            <p>Loading products...</p>
          </div>
        ) : visible.length === 0 ? (
          <p className="text-center text-muted-foreground py-16">No products found.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {visible.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}

function ProductCard({ product: p }) {
  const { add, setQty, items } = useCart();
  const inCart = items.find((it) => it.id === p.id);

  return (
    <article className="group rounded-2xl overflow-hidden border border-border bg-card hover:shadow-lg transition flex flex-col">
      <Link
        to={`/products/${p.id}`}
        className="relative aspect-square overflow-hidden bg-muted block"
      >
        <img
          src={p.image}
          alt={p.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          onError={(e) => {
            e.currentTarget.src =
              "https://placehold.co/400x400/eeeeee/999999?text=Image+Not+Found";
          }}
        />
        {p.tag && (
          <span className="absolute top-3 left-3 rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground">
            {p.tag}
          </span>
        )}
      </Link>
      <div className="p-4 flex flex-col flex-1">
        <Link
          to={`/products/${p.id}`}
          className="font-semibold leading-snug hover:text-primary line-clamp-2"
        >
          {p.name}
        </Link>
        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="text-lg font-bold text-primary">{formatINR(p.price)}</span>
          {inCart ? (
            <div className="inline-flex items-center rounded-full border border-primary bg-primary/5">
              <button
                onClick={() => setQty(p.id, inCart.qty - 1)}
                className="h-8 w-8 inline-flex items-center justify-center text-primary hover:bg-primary/10 rounded-l-full"
                aria-label="Decrease"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="w-8 text-center text-sm font-bold text-primary">{inCart.qty}</span>
              <button
                onClick={() => {
                  if (inCart.qty >= p.stock) {
                    toast.error(`Only ${p.stock} units available in stock.`);
                  } else {
                    setQty(p.id, inCart.qty + 1);
                  }
                }}
                className="h-8 w-8 inline-flex items-center justify-center text-primary hover:bg-primary/10 rounded-r-full"
                aria-label="Increase"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <button
              disabled={p.stock <= 0}
              onClick={() => {
                if (p.stock <= 0) {
                  toast.error(`${p.name} is out of stock.`);
                  return;
                }
                add(p);
                toast.success(`${p.name} added to cart`);
              }}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                p.stock <= 0
                  ? "bg-muted text-muted-foreground cursor-not-allowed"
                  : "bg-foreground/90 text-background hover:bg-foreground"
              }`}
            >
              {p.stock <= 0 ? "Out of Stock" : "Add to Cart"}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
