"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useCMS } from "@/context/cms-context";
import { Product } from "@/types";
import {
  X,
  Package,
  Plus,
  Trash2,
  Tag,
  DollarSign,
  Layers,
  Image as ImageIcon,
  Check,
} from "lucide-react";

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const PRESET_GALLERY_IMAGES = [
  "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=800&auto=format&fit=crop",
];

export const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { addProduct, categories, sizes, colors } = useCMS();

  // Dynamic available sizes and colors from CMS
  const availableSizes = React.useMemo(() => {
    const activeSizes = sizes.filter((s) => s.active).map((s) => s.code);
    return activeSizes.length > 0 ? activeSizes : ["XS", "S", "M", "L", "XL", "Free Size"];
  }, [sizes]);

  const availableColors = React.useMemo(() => {
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
  const [category, setCategory] = useState<string>("Fashion");
  const [price, setPrice] = useState<number | "">(4500);
  const [originalPrice, setOriginalPrice] = useState<number | "">(5500);
  const [sku, setSku] = useState(`IL-${Math.floor(1000 + Math.random() * 9000)}`);
  const [stock, setStock] = useState<number | "">(25);
  const [mainImage, setMainImage] = useState(PRESET_GALLERY_IMAGES[0]);
  const [description, setDescription] = useState(
    "Hand-finished tailored silhouette engineered with luxury natural textiles, subtle structure, and refined draping."
  );
  const [selectedSizes, setSelectedSizes] = useState<string[]>(["S", "M", "L"]);
  const [selectedColors, setSelectedColors] = useState<string[]>(["Noir Black", "Ivory Cream"]);

  if (!isOpen) return null;

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
      inStock: true,
      sizes: selectedSizes,
      colors: selectedColors.map((colName) => {
        const matched = availableColors.find((c) => c.name === colName);
        return { name: colName, hex: matched ? matched.hex : "#71717a" };
      }),
      fullDescription: description.trim(),
      tag: "New Arrival",
    };

    addProduct(newProduct);
    if (onSuccess) onSuccess();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs transition-opacity duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-900/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center font-bold text-xs shadow-2xs">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                Add product
              </h3>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                Add a new product to your catalog.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-5 space-y-5 text-xs">
          {/* Basic Identity */}
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Product title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Signature Double-Breasted Virgin Wool Coat"
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400"
                />
              </div>

              <div>
                <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100 focus:outline-none cursor-pointer"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Subtitle or fabric detail
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="e.g. Hand-finished double-face virgin wool"
                className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400"
              />
            </div>
          </div>

          {/* Pricing & Stock */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-zinc-50/70 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800/80">
            <div>
              <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Selling price (৳) *
              </label>
              <input
                type="number"
                min="0"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value === "" ? "" : Number(e.target.value))}
                className="w-full px-3 py-1.5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100 font-mono font-semibold tabular-nums"
              />
            </div>

            <div>
              <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Original price (৳)
              </label>
              <input
                type="number"
                min="0"
                value={originalPrice}
                onChange={(e) =>
                  setOriginalPrice(e.target.value === "" ? "" : Number(e.target.value))
                }
                placeholder="Optional"
                className="w-full px-3 py-1.5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100 font-mono tabular-nums"
              />
            </div>

            <div>
              <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Stock quantity *
              </label>
              <input
                type="number"
                min="0"
                required
                value={stock}
                onChange={(e) => setStock(e.target.value === "" ? "" : Number(e.target.value))}
                className="w-full px-3 py-1.5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100 font-mono tabular-nums"
              />
            </div>

            <div>
              <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                SKU
              </label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full px-3 py-1.5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100 font-mono"
              />
            </div>
          </div>

          {/* Image URL & Gallery Presets */}
          <div className="space-y-2">
            <label className="block font-medium text-zinc-700 dark:text-zinc-300">
              Primary product image *
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                required
                value={mainImage}
                onChange={(e) => setMainImage(e.target.value)}
                placeholder="https://... or /products/..."
                className="flex-1 px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100 font-mono focus:outline-none"
              />
              <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 shrink-0 bg-zinc-100 dark:bg-zinc-800">
                <Image src={mainImage} alt="Thumbnail preview" fill className="object-cover" />
              </div>
            </div>

            {/* Quick Gallery Picker Presets */}
            <div className="flex items-center gap-2 pt-1">
              <span className="text-[10px] text-zinc-400 font-medium">Quick presets:</span>
              <div className="flex items-center gap-1.5">
                {PRESET_GALLERY_IMAGES.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setMainImage(img)}
                    className={`relative w-7 h-7 rounded-md overflow-hidden border cursor-pointer transition-transform hover:scale-105 ${
                      mainImage === img
                        ? "ring-2 ring-zinc-900 dark:ring-white border-transparent"
                        : "border-zinc-200 dark:border-zinc-800 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image src={img} alt={`Preset ${idx}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Variants: Sizes & Colors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                Available sizes
              </span>
              <div className="flex flex-wrap gap-1.5">
                {availableSizes.map((sz) => {
                  const isChecked = selectedSizes.includes(sz);
                  return (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => toggleSize(sz)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                        isChecked
                          ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                          : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                      }`}
                    >
                      {sz}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <span className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                Color options
              </span>
              <div className="flex flex-wrap gap-1.5">
                {availableColors.map((col) => {
                  const isChecked = selectedColors.includes(col.name);
                  return (
                    <button
                      key={col.id || col.name}
                      type="button"
                      onClick={() => toggleColor(col.name)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer border ${
                        isChecked
                          ? "bg-zinc-900 text-white border-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100"
                          : "bg-zinc-100 dark:bg-zinc-800 border-transparent text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                      }`}
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full border border-black/20 shrink-0"
                        style={{ backgroundColor: col.hex }}
                        aria-hidden="true"
                      />
                      <span>{col.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Long Description */}
          <div>
            <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Editorial description & garment craftsmanship
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed specs, fabric origin, and care instructions..."
              className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100 focus:outline-none resize-none"
            />
          </div>

          {/* Footer Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-900">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 font-medium cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-semibold hover:bg-zinc-800 dark:hover:bg-white active:scale-[0.97] transition-transform duration-150 cursor-pointer shadow-xs"
            >
              Add product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
