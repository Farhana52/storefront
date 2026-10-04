"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCMS } from "@/context/cms-context";
import { Product } from "@/types";
import { VariationColor } from "@/types/cms";
import {
  ArrowLeft,
  Plus,
  Eye,
  Package,
  Layers,
  Tag,
  DollarSign,
  Image as ImageIcon,
  Check,
  RefreshCw,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

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
  {
    label: "Editorial Luxe",
    url: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800&auto=format&fit=crop",
  },
];

const AVAILABLE_TAGS = ["New Arrival", "Signature Edition", "Bestseller", "Artisanal"];

export default function NewProductPage() {
  const router = useRouter();
  const { addProduct, categories, sizes, colors } = useCMS();

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

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [category, setCategory] = useState(categories[0]?.name || "Fashion");
  const [price, setPrice] = useState<number | "">(4500);
  const [originalPrice, setOriginalPrice] = useState<number | "">(5500);
  const [sku, setSku] = useState(
    `IL-${Math.floor(1000 + Math.random() * 9000)}`
  );
  const [stock, setStock] = useState<number | "">(25);
  const [inStock, setInStock] = useState(true);
  const [mainImage, setMainImage] = useState(PRESET_GALLERY_IMAGES[0].url);
  const [description, setDescription] = useState(
    "Hand-finished tailored silhouette engineered with luxury natural textiles, subtle structure, and refined draping."
  );
  const [selectedSizes, setSelectedSizes] = useState<string[]>(["S", "M", "L"]);
  const [selectedColors, setSelectedColors] = useState<string[]>([
    "Noir Black",
    "Ivory Cream",
  ]);
  const [selectedTag, setSelectedTag] = useState("New Arrival");

  const generateNewSku = () => {
    setSku(`IL-${Math.floor(1000 + Math.random() * 9000)}`);
  };

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !price || !mainImage) return;

    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      title: title.trim(),
      subtitle: subtitle.trim() || "Atelier luxury garment",
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      category,
      rating: 5.0,
      reviewsCount: 1,
      image: mainImage,
      inStock,
      sizes: selectedSizes,
      colors: selectedColors.map((colName) => {
        const matched = availableColors.find((c) => c.name === colName);
        return { name: colName, hex: matched ? matched.hex : "#71717a" };
      }),
      fullDescription: description.trim(),
      tag: selectedTag,
    };

    addProduct(newProduct);
    router.push("/admin/products");
  };

  const numericPrice = Number(price) || 0;
  const numericOriginal = Number(originalPrice) || 0;
  const discountPercent =
    numericOriginal > numericPrice
      ? Math.round(((numericOriginal - numericPrice) / numericOriginal) * 100)
      : 0;

  return (
    <div className="space-y-6">
      {/* Top Navigation Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/products">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 text-zinc-500 hover:text-zinc-900"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 text-balance">
              Add product
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 text-pretty">
              Create and publish a new product to the customer storefront.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/admin/products">
            <Button variant="outline" size="sm">
              Discard
            </Button>
          </Link>
          <Button
            size="sm"
            onClick={handleSubmit}
            className="gap-1.5 shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Publish product</span>
          </Button>
        </div>
      </div>

      {/* Main 2-Column Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols wide): Product Details & Variations */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Information Card */}
          <Card className="p-6 space-y-4">
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
                  placeholder="e.g. Handmade Silk Velvet Gown"
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
                    placeholder="e.g. Hand-finished pure virgin wool"
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
                  placeholder="Describe the silhouette, textile origins, stitch construction, and styling advice..."
                  className="w-full rounded-md border border-zinc-200 bg-white p-3 text-xs text-zinc-900 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 leading-relaxed"
                />
              </div>
            </div>
          </Card>

          {/* Sizing & Variations Card */}
          <Card className="p-6 space-y-4">
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

              {/* Curated Badges */}
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

        {/* Right Column: Pricing, Inventory & Live Card Preview */}
        <div className="space-y-6">
          {/* Live Storefront Preview Card */}
          <Card className="overflow-hidden border-zinc-300 dark:border-zinc-700 shadow-xs">
            <div className="p-3 border-b border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-zinc-500" />
                Storefront preview
              </span>
              <Badge variant="outline" className="text-[10px]">
                {selectedTag}
              </Badge>
            </div>

            <div className="p-4 space-y-3">
              <div className="relative h-48 w-full rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                <Image
                  src={mainImage || "/products/festive-gown.jpg"}
                  alt={title || "Product preview"}
                  fill
                  className="object-cover"
                  sizes="300px"
                />
              </div>

              <div className="space-y-1">
                <div className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 truncate">
                  {title || "Handmade Silk Velvet Gown"}
                </div>
                <div className="text-xs text-zinc-500 truncate">
                  {subtitle || "Atelier luxury garment"}
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-base font-bold font-mono text-zinc-900 dark:text-zinc-50">
                    ৳{(numericPrice || 4500).toLocaleString()}
                  </span>
                  {numericOriginal > numericPrice && (
                    <span className="text-xs font-mono text-zinc-400 line-through">
                      ৳{numericOriginal.toLocaleString()}
                    </span>
                  )}
                </div>
                {discountPercent > 0 && (
                  <Badge variant="success" className="text-[10px]">
                    {discountPercent}% OFF
                  </Badge>
                )}
              </div>
            </div>
          </Card>

          {/* Pricing & Margin Card */}
          <Card className="p-5 space-y-4">
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
            </div>
          </Card>

          {/* Inventory & SKU Card */}
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Tag className="w-4 h-4 text-zinc-500" />
                <span>Inventory & SKU</span>
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={generateNewSku}
                className="h-7 text-[11px] gap-1 text-zinc-500"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Regenerate</span>
              </Button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1.5">
                <label className="font-medium text-zinc-700 dark:text-zinc-300">
                  SKU Code
                </label>
                <Input
                  type="text"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  className="font-mono uppercase text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-medium text-zinc-700 dark:text-zinc-300">
                  Stock Units Count
                </label>
                <Input
                  type="number"
                  min="0"
                  value={stock}
                  onChange={(e) => setStock(Number(e.target.value))}
                  className="font-mono"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="instock-check"
                  checked={inStock}
                  onChange={(e) => setInStock(e.target.checked)}
                  className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-950 cursor-pointer"
                />
                <label
                  htmlFor="instock-check"
                  className="font-medium text-zinc-700 dark:text-zinc-300 cursor-pointer"
                >
                  Mark Available for Online Purchase
                </label>
              </div>
            </div>
          </Card>

          {/* Imagery & Presets Card */}
          <Card className="p-5 space-y-4">
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
                <div className="grid grid-cols-4 gap-2">
                  {PRESET_GALLERY_IMAGES.map((img) => (
                    <button
                      key={img.url}
                      type="button"
                      onClick={() => setMainImage(img.url)}
                      className={`relative h-14 rounded-md overflow-hidden border transition-all cursor-pointer ${
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
                        sizes="60px"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </form>
    </div>
  );
}
