"use client";

import React, { useState, useEffect, use, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useCMS } from "@/context/cms-context";
import { Product } from "@/types";
import { VariationColor } from "@/types/cms";
import {
  ArrowLeft,
  Package,
  Layers,
  Tag,
  DollarSign,
  Image as ImageIcon,
  Check,
  Trash2,
  ExternalLink,
  Star,
  Save,
  Eye,
  Edit3,
  TrendingUp,
  ShoppingBag,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

const PRESET_GALLERY_IMAGES = [
  {
    label: "Festive Gown",
    url: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=900&auto=format&fit=crop",
  },
  {
    label: "Royal Coat",
    url: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=900&auto=format&fit=crop",
  },
  {
    label: "Chiffon Wrap",
    url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=900&auto=format&fit=crop",
  },
  {
    label: "Rose Botanical",
    url: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=900&auto=format&fit=crop",
  },
  {
    label: "Silk Scarf",
    url: "https://images.unsplash.com/photo-1509319117193-57bab727e09d?q=80&w=900&auto=format&fit=crop",
  },
];

const AVAILABLE_TAGS = ["New Arrival", "Signature Edition", "Bestseller", "Artisanal"];

export default function ProductDetailPage({
  params,
}: {
  params?: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resolvedParams = params ? use(params) : null;
  const clientParams = useParams();
  const productId =
    resolvedParams?.id || (clientParams?.id as string) || "";

  const { products, updateProduct, deleteProduct, categories, sizes, colors } = useCMS();

  // Dynamic available sizes and colors from CMS
  const availableSizes: string[] = useMemo(() => {
    const activeSizes = sizes.filter((s) => s.active).map((s) => s.code);
    return activeSizes.length > 0 ? activeSizes : ["XS", "S", "M", "L", "XL", "Free Size"];
  }, [sizes]);

  const availableColors: VariationColor[] = useMemo(() => {
    const activeColors = colors.filter((c) => c.active);
    return activeColors.length > 0
      ? activeColors
      : [
          { id: "col-1", name: "Noir Black", hex: "#18181b", active: true },
          { id: "col-2", name: "Ivory Cream", hex: "#f5f5f0", active: true },
          { id: "col-3", name: "Midnight Navy", hex: "#1e293b", active: true },
          { id: "col-4", name: "Champagne Gold", hex: "#d4af37", active: true },
          { id: "col-5", name: "Olive Sage", hex: "#556b2f", active: true },
        ];
  }, [colors]);

  const product = products.find(
    (p) => p.id === productId || p.id === `prod-${productId}`
  );

  // Active view tab: "overview" (full info) or "edit" (form)
  const initialMode = searchParams.get("mode") === "edit" ? "edit" : "overview";
  const [activeTab, setActiveTab] = useState<"overview" | "edit">(initialMode);

  // Editable Form States
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [category, setCategory] = useState("Fashion");
  const [price, setPrice] = useState<number | "">(4500);
  const [originalPrice, setOriginalPrice] = useState<number | "">(5500);
  const [inStock, setInStock] = useState(true);
  const [mainImage, setMainImage] = useState("/products/festive-gown.jpg");
  const [description, setDescription] = useState("");
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState("New Arrival");
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (product) {
      setTitle(product.title);
      setSubtitle(product.subtitle || "");
      setCategory(product.category);
      setPrice(product.price);
      setOriginalPrice(product.originalPrice || "");
      setInStock(product.inStock);
      setMainImage(product.image);
      setDescription(product.fullDescription || "");
      setSelectedSizes(product.sizes || ["S", "M", "L"]);
      setSelectedColors(
        product.colors && Array.isArray(product.colors)
          ? product.colors.map((c: any) => (typeof c === "string" ? c : c.name))
          : ["Noir Black"]
      );
      setSelectedTag(product.tag || "New Arrival");
    }
  }, [product]);

  if (!product) {
    return (
      <div className="p-16 text-center space-y-4">
        <Package className="w-12 h-12 text-zinc-400 mx-auto opacity-40" />
        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
          Product Not Found
        </h2>
        <p className="text-xs text-zinc-500">
          The requested product ID does not exist in the active catalog.
        </p>
        <Link href="/admin/products">
          <Button variant="outline" size="sm" className="mt-2 text-xs">
            Back to Products
          </Button>
        </Link>
      </div>
    );
  }

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !price || !mainImage) return;

    updateProduct(product.id, {
      title: title.trim(),
      subtitle: subtitle.trim(),
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      category,
      inStock,
      image: mainImage,
      sizes: selectedSizes,
      colors: selectedColors.map((cName) => {
        const found = availableColors.find((ac) => ac.name === cName);
        return { name: cName, hex: found ? found.hex : "#71717a" };
      }),
      fullDescription: description.trim(),
      tag: selectedTag,
    });

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to remove "${product.title}" from the catalog?`)) {
      deleteProduct(product.id);
      router.push("/admin/products");
    }
  };

  const numericPrice = Number(product.price) || 0;
  const numericOriginal = Number(product.originalPrice) || 0;
  const discountPercent =
    numericOriginal > numericPrice
      ? Math.round(((numericOriginal - numericPrice) / numericOriginal) * 100)
      : 0;

  return (
    <div className="space-y-6">
      {/* Top Header & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1 border-b border-zinc-200/80 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <Link href="/admin/products">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 shadow-2xs"
              title="Back to products list"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                {product.title}
              </h1>
              <Badge variant={product.inStock ? "success" : "destructive"}>
                {product.inStock ? "In stock" : "Sold out"}
              </Badge>
              <Badge variant="outline" className="text-zinc-600 dark:text-zinc-400">
                {product.category}
              </Badge>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              SKU: <span className="font-mono tabular-nums text-zinc-700 dark:text-zinc-300">{product.id}</span>
              {product.subtitle && <span> • {product.subtitle}</span>}
            </p>
          </div>
        </div>

        {/* View Mode Switcher & Global Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Segmented Control: Overview vs Edit Mode */}
          <div className="flex items-center p-1 rounded-lg bg-zinc-100 dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-800 text-xs shadow-2xs">
            <button
              type="button"
              onClick={() => setActiveTab("overview")}
              className={`px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "overview"
                  ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs font-semibold"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Full info</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("edit")}
              className={`px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "edit"
                  ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs font-semibold"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit catalog</span>
            </button>
          </div>

          <Link href={`/shop/${product.id}`} target="_blank">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs shadow-2xs">
              <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
              <span>Storefront</span>
            </Button>
          </Link>

          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 border-rose-200 dark:border-rose-900 text-xs shadow-2xs"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Delete</span>
          </Button>

          {activeTab === "edit" && (
            <Button
              size="sm"
              onClick={handleUpdate}
              className="gap-1.5 shadow-2xs text-xs"
            >
              {isSaved ? <Check className="w-4 h-4 text-emerald-400" /> : <Save className="w-3.5 h-3.5" />}
              <span>{isSaved ? "Saved" : "Save changes"}</span>
            </Button>
          )}
        </div>
      </div>

      {/* 4 Executive KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Retail Price Card */}
        <Card className="p-4 bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-2xs rounded-xl space-y-1">
          <div className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-zinc-400" />
              Retail price
            </span>
            {discountPercent > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60">
                {discountPercent}% OFF
              </span>
            )}
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-zinc-950 dark:text-zinc-50 tabular-nums">
            ৳{numericPrice.toLocaleString()}
          </div>
          {numericOriginal > numericPrice && (
            <div className="text-[11px] text-zinc-400 font-mono line-through tabular-nums">
              ৳{numericOriginal.toLocaleString()} regular
            </div>
          )}
        </Card>

        {/* Inventory Stock Card */}
        <Card className="p-4 bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-2xs rounded-xl space-y-1">
          <div className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
            <Package className="w-3.5 h-3.5 text-zinc-400" />
            Stock availability
          </div>
          <div className="text-xl sm:text-2xl font-bold text-zinc-950 dark:text-zinc-50 flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-full ${product.inStock ? "bg-emerald-500" : "bg-rose-500"}`} />
            <span className="text-base sm:text-lg font-semibold">{product.inStock ? "Ready to ship" : "Out of stock"}</span>
          </div>
          <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
            {product.inStock ? "Available on live store" : "Requires replenishment"}
          </div>
        </Card>

        {/* Customer Rating Card */}
        <Card className="p-4 bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-2xs rounded-xl space-y-1">
          <div className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            Rating & reviews
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-zinc-950 dark:text-zinc-50 tabular-nums">
            ★ {product.rating || "5.0"}
          </div>
          <div className="text-[11px] text-zinc-500 dark:text-zinc-400 font-sans">
            <span className="font-mono tabular-nums">{product.reviewsCount || 24}</span> verified patron reviews
          </div>
        </Card>

        {/* Catalog Tier & Collection */}
        <Card className="p-4 bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-2xs rounded-xl space-y-1">
          <div className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            Edition tag
          </div>
          <div className="text-base sm:text-lg font-bold text-zinc-950 dark:text-zinc-50 truncate">
            {product.tag || "Signature Edition"}
          </div>
          <div className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
            {product.category} collection
          </div>
        </Card>
      </div>

      {/* Main Content: Tab 1 (Full Info Overview) OR Tab 2 (Catalog Editor) */}
      {activeTab === "overview" ? (
        /* ========================================================================= */
        /* TAB 1: PRODUCT 360° OVERVIEW (FULL INFORMATION AT A GLANCE)              */
        /* ========================================================================= */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column (2 Cols): High-Res Visual Showcase & Editorial Story */}
          <div className="lg:col-span-2 space-y-6">
            {/* Visual Showcase Card */}
            <Card className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-2xs rounded-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-zinc-400" />
                  <span>Visual Showcase & Imagery</span>
                </h3>
                <span className="text-[11px] text-zinc-400">High-Resolution Asset</span>
              </div>

              {/* Large Hero Preview */}
              <div className="relative h-80 sm:h-96 w-full rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-800 shadow-xs">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  priority
                />
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <Badge variant="secondary" className="backdrop-blur-md bg-white/80 dark:bg-zinc-900/80 text-xs font-semibold shadow-2xs">
                    {product.tag || "Atelier Luxury"}
                  </Badge>
                </div>
              </div>

              {/* Gallery Presets / Angles */}
              <div>
                <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300 block mb-2">
                  Catalog Gallery Presets
                </span>
                <div className="grid grid-cols-5 gap-2">
                  {PRESET_GALLERY_IMAGES.map((img, idx) => (
                    <div
                      key={img.url}
                      className="relative h-16 sm:h-20 rounded-lg overflow-hidden border border-zinc-200/80 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800"
                    >
                      <Image
                        src={img.url}
                        alt={img.label}
                        fill
                        className="object-cover hover:scale-105 transition-transform"
                        sizes="100px"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Editorial Narrative & Craftsmanship Details */}
            <Card className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-2xs rounded-xl space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                <Package className="w-4 h-4 text-zinc-400" />
                <span>Editorial Narrative & Material Details</span>
              </h3>
              <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-line font-sans text-pretty">
                {product.fullDescription ||
                  "Hand-finished in our master artisan atelier using sustainable organic raw fibers. Every stitch is calibrated for seamless drape, maximum durability, and supreme tactile comfort across seasons."}
              </p>

              {/* Variations: Sizes & Colors */}
              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Available Sizes */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                    Available Sizes:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {(product.sizes || ["XS", "S", "M", "L", "XL"]).map((sz) => (
                      <span
                        key={sz}
                        className="px-2.5 py-1 rounded-md text-xs font-mono font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200/80 dark:border-zinc-700 tabular-nums"
                      >
                        {sz}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Available Colors */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                    Color Palette Variations:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {(product.colors && Array.isArray(product.colors)
                      ? product.colors
                      : [
                          { name: "Noir Black", hex: "#09090b" },
                          { name: "Ivory Cream", hex: "#fafaf9" },
                        ]
                    ).map((col: any) => (
                      <div
                        key={typeof col === "string" ? col : col.name}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-700 text-xs text-zinc-700 dark:text-zinc-300 font-medium"
                      >
                        <span
                          className="w-3 h-3 rounded-full border border-black/10 shrink-0 shadow-2xs"
                          style={{
                            backgroundColor:
                              typeof col === "string"
                                ? col.toLowerCase().includes("black")
                                  ? "#09090b"
                                  : "#fafaf9"
                                : col.hex || "#09090b",
                          }}
                        />
                        <span>{typeof col === "string" ? col : col.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column (1 Col): Commercial Specs & Metadata */}
          <div className="space-y-6">
            {/* Commercial Pricing Card */}
            <Card className="p-5 bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-2xs rounded-xl space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-zinc-400" />
                <span>Commercial Valuation</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
                  <span className="text-zinc-500">Retail Selling Price</span>
                  <span className="font-mono font-bold text-sm text-zinc-900 dark:text-zinc-100 tabular-nums">
                    ৳{numericPrice.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
                  <span className="text-zinc-500">Compare-at Price</span>
                  <span className="font-mono text-zinc-700 dark:text-zinc-300 tabular-nums">
                    {numericOriginal > 0 ? `৳${numericOriginal.toLocaleString()}` : "None"}
                  </span>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
                  <span className="text-zinc-500">Customer Discount</span>
                  <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">
                    {discountPercent > 0 ? `${discountPercent}% Saved` : "Full Price"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-zinc-500">Tax Treatment</span>
                  <span className="text-zinc-700 dark:text-zinc-300 font-medium">Inclusive of Luxury VAT</span>
                </div>
              </div>
            </Card>

            {/* Inventory & Logistics Card */}
            <Card className="p-5 bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-2xs rounded-xl space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                <Package className="w-4 h-4 text-zinc-400" />
                <span>Inventory & Fulfillment</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
                  <span className="text-zinc-500">Stock Availability</span>
                  <span className={`font-semibold ${product.inStock ? "text-emerald-600" : "text-rose-600"}`}>
                    {product.inStock ? "Active Stock" : "Sold Out"}
                  </span>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
                  <span className="text-zinc-500">Fulfillment Method</span>
                  <span className="text-zinc-800 dark:text-zinc-200 font-medium">In-House Concierge</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-zinc-500">Catalog Publication</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">Published Live</span>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveTab("edit")}
                  className="w-full text-xs gap-1.5 shadow-2xs"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit this product</span>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* TAB 2: EDIT CATALOG FORM (FULL EDITOR MODE)                              */
        /* ========================================================================= */
        <form onSubmit={handleUpdate} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column (2 Cols): Edit Fields */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-2xs rounded-xl space-y-4">
              <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Package className="w-4 h-4 text-zinc-500" />
                <span>General Information</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div className="space-y-1.5">
                  <label className="font-medium text-zinc-700 dark:text-zinc-300">
                    Product Title *
                  </label>
                  <Input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="h-10 text-sm font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="font-medium text-zinc-700 dark:text-zinc-300">
                      Subtitle / Fabric Detail
                    </label>
                    <Input
                      type="text"
                      value={subtitle}
                      onChange={(e) => setSubtitle(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-medium text-zinc-700 dark:text-zinc-300">
                      Department / Category *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full h-9 px-3 text-xs bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md text-zinc-900 dark:text-zinc-100"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5 pt-1">
                  <label className="font-medium text-zinc-700 dark:text-zinc-300">
                    Full Editorial Story & Craftsmanship Details
                  </label>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full rounded-md border border-zinc-200 bg-white p-3 text-xs text-zinc-900 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 leading-relaxed"
                  />
                </div>
              </div>
            </Card>

            {/* Sizing & Variations */}
            <Card className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-2xs rounded-xl space-y-4">
              <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Layers className="w-4 h-4 text-zinc-500" />
                <span>Sizes & Color Variations</span>
              </h3>

              <div className="space-y-4 text-xs">
                {/* Size Chips */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-zinc-700 dark:text-zinc-300">
                      Available Atelier Sizes
                    </span>
                    <Link
                      href="/admin/products/sizes"
                      target="_blank"
                      className="text-[11px] text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 flex items-center gap-1 transition-colors"
                    >
                      <span>Manage sizes</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </Link>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {availableSizes.map((sz) => {
                      const isSelected = selectedSizes.includes(sz);
                      return (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => toggleSize(sz)}
                          className={`px-3 py-1.5 rounded-md text-xs font-semibold tracking-wide transition-colors cursor-pointer border ${
                            isSelected
                              ? "bg-zinc-900 text-white border-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100 shadow-2xs"
                              : "bg-white text-zinc-600 border-zinc-200 dark:bg-zinc-900 dark:text-zinc-400 dark:border-zinc-800 hover:border-zinc-300"
                          }`}
                        >
                          {sz}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Color Chips */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-zinc-700 dark:text-zinc-300">
                      Color Shade Variations
                    </span>
                    <Link
                      href="/admin/products/colors"
                      target="_blank"
                      className="text-[11px] text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 flex items-center gap-1 transition-colors"
                    >
                      <span>Manage colors</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </Link>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {availableColors.map((col) => {
                      const isSelected = selectedColors.includes(col.name);
                      return (
                        <button
                          key={col.id || col.name}
                          type="button"
                          onClick={() => toggleColor(col.name)}
                          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer border ${
                            isSelected
                              ? "bg-zinc-900 text-white border-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100 shadow-2xs"
                              : "bg-white text-zinc-600 border-zinc-200 dark:bg-zinc-900 dark:text-zinc-400 dark:border-zinc-800 hover:border-zinc-300"
                          }`}
                        >
                          <span
                            className="w-3 h-3 rounded-full border border-black/20 shrink-0 shadow-2xs"
                            style={{ backgroundColor: col.hex }}
                            aria-hidden="true"
                          />
                          <span>{col.name}</span>
                          {isSelected && <Check className="w-3 h-3 ml-0.5" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Tag Selection */}
                <div className="space-y-2 pt-2">
                  <span className="font-medium text-zinc-700 dark:text-zinc-300">
                    Highlight Ribbon / Badge
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {AVAILABLE_TAGS.map((tg) => (
                      <button
                        key={tg}
                        type="button"
                        onClick={() => setSelectedTag(tg)}
                        className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                          selectedTag === tg
                            ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                            : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 hover:bg-zinc-200"
                        }`}
                      >
                        {tg}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column: Pricing & Media Inputs */}
          <div className="space-y-6">
            {/* Pricing Card */}
            <Card className="p-5 bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-2xs rounded-xl space-y-4">
              <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-zinc-500" />
                <span>Pricing (BDT)</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div className="space-y-1.5">
                  <label className="font-medium text-zinc-700 dark:text-zinc-300">
                    Selling Price (৳) *
                  </label>
                  <Input
                    type="number"
                    min="0"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="font-mono text-sm font-semibold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-medium text-zinc-700 dark:text-zinc-300">
                    Compare-at Original Price (৳)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(Number(e.target.value))}
                    placeholder="Optional strike-through price"
                    className="font-mono"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-zinc-200/80 dark:border-zinc-800">
                  <input
                    type="checkbox"
                    id="instock-edit-check"
                    checked={inStock}
                    onChange={(e) => setInStock(e.target.checked)}
                    className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-950 cursor-pointer"
                  />
                  <label
                    htmlFor="instock-edit-check"
                    className="font-medium text-zinc-700 dark:text-zinc-300 cursor-pointer"
                  >
                    Mark Available for Online Purchase
                  </label>
                </div>
              </div>
            </Card>

            {/* Media Asset Card */}
            <Card className="p-5 bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-2xs rounded-xl space-y-4">
              <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-zinc-500" />
                <span>Image Asset</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div className="space-y-1.5">
                  <label className="font-medium text-zinc-700 dark:text-zinc-300">
                    Image Path / URL *
                  </label>
                  <Input
                    type="text"
                    required
                    value={mainImage}
                    onChange={(e) => setMainImage(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-medium text-zinc-500">
                    Quick Preset Gallery:
                  </span>
                  <div className="grid grid-cols-5 gap-1.5">
                    {PRESET_GALLERY_IMAGES.map((img) => (
                      <button
                        key={img.url}
                        type="button"
                        onClick={() => setMainImage(img.url)}
                        className={`relative h-12 rounded-md overflow-hidden border transition-all cursor-pointer ${
                          mainImage === img.url
                            ? "ring-2 ring-zinc-950 dark:ring-white border-transparent"
                            : "border-zinc-200 dark:border-zinc-800 opacity-70 hover:opacity-100"
                        }`}
                      >
                        <Image
                          src={img.url}
                          alt={img.label}
                          fill
                          className="object-cover"
                          sizes="50px"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </form>
      )}
    </div>
  );
}
