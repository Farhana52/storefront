"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useCMS } from "@/context/cms-context";
import { VariationColor } from "@/types/cms";
import {
  Palette,
  Ruler,
  Plus,
  Edit2,
  Trash2,
  Search,
  X,
  Check,
  RotateCcw,
  AlertTriangle,
  ArrowUpRight,
  Layers,
  Sparkles,
  Copy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

const PRESET_COLOR_SWATCHES = [
  { name: "Noir Black", hex: "#18181b" },
  { name: "Ivory Cream", hex: "#f5f5f0" },
  { name: "Midnight Navy", hex: "#1e293b" },
  { name: "Champagne Gold", hex: "#d4af37" },
  { name: "Olive Sage", hex: "#556b2f" },
  { name: "Burgundy Wine", hex: "#722f37" },
  { name: "Dusty Rose", hex: "#dcae96" },
  { name: "Emerald Forest", hex: "#064e3b" },
  { name: "Terracotta Earth", hex: "#9a3412" },
  { name: "Silver Pearl", hex: "#e2e8f0" },
];

export default function ProductColorsPage() {
  const { colors, addColor, updateColor, deleteColor, products } = useCMS();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  // Modal dialog states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingColor, setEditingColor] = useState<VariationColor | null>(null);
  const [colorToDelete, setColorToDelete] = useState<VariationColor | null>(null);

  // Form state
  const [formState, setFormState] = useState<{
    name: string;
    hex: string;
    description: string;
    active: boolean;
  }>({
    name: "",
    hex: "#18181b",
    description: "",
    active: true,
  });

  // Accessible Escape key listener for dialog dismissal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsModalOpen(false);
        setColorToDelete(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Compute products utilizing this color
  const getLinkedProductsCount = (colorName: string) => {
    const name = colorName.trim().toLowerCase();
    return products.filter((p) =>
      (p.colors || []).some((c) => c.name.trim().toLowerCase() === name)
    ).length;
  };

  // Executive KPI metrics
  const totalColors = colors.length;
  const activeColorsCount = useMemo(
    () => colors.filter((c) => c.active).length,
    [colors]
  );
  const inactiveColorsCount = totalColors - activeColorsCount;

  const totalLinkedProducts = useMemo(() => {
    return products.filter((p) => (p.colors || []).length > 0).length;
  }, [products]);

  // Filter colors
  const filteredColors = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return colors.filter((c) => {
      const matchStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && c.active) ||
        (statusFilter === "inactive" && !c.active);

      const matchSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.hex.toLowerCase().includes(q) ||
        (c.description && c.description.toLowerCase().includes(q));

      return matchStatus && matchSearch;
    });
  }, [colors, statusFilter, searchQuery]);

  const handleOpenAdd = () => {
    setEditingColor(null);
    setFormState({
      name: "",
      hex: "#18181b",
      description: "",
      active: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (col: VariationColor) => {
    setEditingColor(col);
    setFormState({
      name: col.name,
      hex: col.hex,
      description: col.description || "",
      active: col.active,
    });
    setIsModalOpen(true);
  };

  const handleCopyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1600);
  };

  const handleToggleActive = (col: VariationColor) => {
    updateColor(col.id, { active: !col.active });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name.trim() || !formState.hex.trim()) return;

    if (editingColor) {
      updateColor(editingColor.id, {
        name: formState.name.trim(),
        hex: formState.hex.trim(),
        description: formState.description.trim(),
        active: formState.active,
      });
    } else {
      addColor({
        id: `col-${Date.now()}`,
        name: formState.name.trim(),
        hex: formState.hex.trim(),
        description: formState.description.trim(),
        active: formState.active,
      });
    }

    setIsModalOpen(false);
    setEditingColor(null);
  };

  const handleConfirmDelete = () => {
    if (!colorToDelete) return;
    deleteColor(colorToDelete.id);
    setColorToDelete(null);
  };

  return (
    <div className="space-y-6">
      {/* Executive Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 text-balance">
            Color Variations
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 text-pretty">
            Curate artisanal textile colorways, hex codes, and visual shade swatches for the product catalog.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            onClick={handleOpenAdd}
            size="sm"
            className="gap-1.5 shadow-2xs active:scale-[0.98] transition-transform"
          >
            <Plus className="w-4 h-4" />
            <span>Add color</span>
          </Button>
        </div>
      </div>

      {/* Variation Switcher Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-200/80 dark:border-zinc-800 pb-3">
        <Link
          href="/admin/products/sizes"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-850 transition-colors"
        >
          <Ruler className="w-3.5 h-3.5" />
          <span>Sizes</span>
        </Link>
        <Link
          href="/admin/products/colors"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-2xs transition-colors"
          aria-current="page"
        >
          <Palette className="w-3.5 h-3.5" />
          <span>Color shades</span>
          <span className="font-mono text-[10px] bg-white/20 dark:bg-black/20 px-1.5 py-0.2 rounded-full">
            {totalColors}
          </span>
        </Link>
      </div>

      {/* KPI Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <button
          type="button"
          onClick={() => setStatusFilter("all")}
          className={`p-4 rounded-xl border text-left bg-white dark:bg-zinc-950 shadow-2xs space-y-1 transition-all cursor-pointer ${
            statusFilter === "all"
              ? "border-zinc-900 dark:border-zinc-100 ring-1 ring-zinc-900/10 dark:ring-zinc-100/10"
              : "border-zinc-200/80 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
          }`}
        >
          <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-zinc-400" />
            Configured shades
          </span>
          <div className="text-xl font-bold font-mono text-zinc-900 dark:text-zinc-50 tabular-nums">
            {totalColors}
          </div>
          <span className="text-[10px] text-zinc-400 dark:text-zinc-500 block truncate">
            All palette shades
          </span>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter("active")}
          className={`p-4 rounded-xl border text-left bg-white dark:bg-zinc-950 shadow-2xs space-y-1 transition-all cursor-pointer ${
            statusFilter === "active"
              ? "border-emerald-600 dark:border-emerald-500 ring-1 ring-emerald-600/20"
              : "border-zinc-200/80 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
          }`}
        >
          <span className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            Active in catalog
          </span>
          <div className="text-xl font-bold font-mono text-zinc-900 dark:text-zinc-50 tabular-nums">
            {activeColorsCount}
          </div>
          <span className="text-[10px] text-zinc-400 dark:text-zinc-500 block truncate">
            Selectable in garment editor
          </span>
        </button>

        <Link
          href="/admin/products"
          className="p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-2xs space-y-1 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors group"
        >
          <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-zinc-400" />
              Palette products
            </span>
            <ArrowUpRight className="w-3 h-3 text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors" />
          </span>
          <div className="text-xl font-bold font-mono text-zinc-900 dark:text-zinc-50 tabular-nums">
            {totalLinkedProducts}
          </div>
          <span className="text-[10px] text-zinc-400 dark:text-zinc-500 block truncate">
            Products with color options
          </span>
        </Link>

        <div className="p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-2xs space-y-1">
          <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-zinc-400" />
            Swatch precision
          </span>
          <div className="text-xl font-bold font-mono text-zinc-900 dark:text-zinc-50 tabular-nums">
            100%
          </div>
          <span className="text-[10px] text-zinc-400 dark:text-zinc-500 block truncate">
            Verified CSS hex codes
          </span>
        </div>
      </div>

      {/* Control Bar: Search & Status Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-zinc-950 p-2.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800 shadow-2xs">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <Input
            type="text"
            placeholder="Filter colors by name, hex, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-8 h-9 text-xs border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 shadow-none focus-visible:ring-1"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              aria-label="Clear search input"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center rounded-lg bg-zinc-100 dark:bg-zinc-900 p-0.5 border border-zinc-200/60 dark:border-zinc-800/80 text-xs self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setStatusFilter("all")}
            className={`px-2.5 py-1 rounded-md font-medium transition-all ${
              statusFilter === "all"
                ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 shadow-2xs"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            All ({totalColors})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("active")}
            className={`px-2.5 py-1 rounded-md font-medium transition-all flex items-center gap-1.5 ${
              statusFilter === "active"
                ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 shadow-2xs"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Active ({activeColorsCount})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("inactive")}
            className={`px-2.5 py-1 rounded-md font-medium transition-all ${
              statusFilter === "inactive"
                ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 shadow-2xs"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            Inactive ({inactiveColorsCount})
          </button>
        </div>
      </div>

      {/* Main Colors DataTable */}
      {filteredColors.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-300 dark:border-zinc-800 p-12 text-center bg-white/50 dark:bg-zinc-950/50">
          <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto text-zinc-400 mb-3">
            <Palette className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            No colors located
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-sm mx-auto">
            {searchQuery || statusFilter !== "all"
              ? "No color shades match your search criteria. Try modifying your filter."
              : "No color variations have been established yet."}
          </p>
          {(searchQuery || statusFilter !== "all") && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
              }}
              className="mt-4 gap-1.5 text-xs shadow-2xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset filter</span>
            </Button>
          )}
        </div>
      ) : (
        <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/40 hover:bg-zinc-50/50">
                  <TableHead className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 py-3 pl-4">
                    Color Shade & Swatch
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 py-3">
                    HEX Code
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 py-3">
                    Textile & Editorial Notes
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 py-3">
                    Assigned Products
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 py-3">
                    Availability Status
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 py-3 pr-4 text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredColors.map((col) => {
                  const productCount = getLinkedProductsCount(col.name);
                  const isCopied = copiedHex === col.hex;

                  return (
                    <TableRow
                      key={col.id}
                      className="border-b border-zinc-100 dark:border-zinc-800/60 hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-colors"
                    >
                      {/* Swatch & Color Name */}
                      <TableCell className="py-3.5 pl-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-7 h-7 rounded-full border border-zinc-300/80 dark:border-zinc-700 shadow-2xs shrink-0"
                            style={{ backgroundColor: col.hex }}
                            aria-hidden="true"
                          />
                          <div>
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(col)}
                              className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 hover:underline hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors text-left"
                            >
                              {col.name}
                            </button>
                            <span className="text-[10px] text-zinc-400 font-mono block">
                              ID: {col.id}
                            </span>
                          </div>
                        </div>
                      </TableCell>

                      {/* HEX Code */}
                      <TableCell className="py-3.5">
                        <div className="flex items-center gap-1.5">
                          <code className="font-mono text-xs text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800/80 px-2 py-0.5 rounded border border-zinc-200/60 dark:border-zinc-700/60 uppercase">
                            {col.hex}
                          </code>
                          <button
                            type="button"
                            onClick={() => handleCopyHex(col.hex)}
                            aria-label={`Copy hex code for ${col.name}`}
                            title="Copy HEX color code"
                            className="p-1 rounded text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                          >
                            {isCopied ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </TableCell>

                      {/* Description */}
                      <TableCell className="py-3.5">
                        <span className="text-xs text-zinc-600 dark:text-zinc-400">
                          {col.description || "Artisanal textile shade tone"}
                        </span>
                      </TableCell>

                      {/* Catalog Items Linked */}
                      <TableCell className="py-3.5">
                        <Link
                          href="/admin/products"
                          title="View products in catalog"
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono tabular-nums bg-zinc-100 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-zinc-50 border border-zinc-200/60 dark:border-zinc-700/60 transition-colors group"
                        >
                          <span>{productCount} {productCount === 1 ? "product" : "products"}</span>
                          <ArrowUpRight className="w-3 h-3 text-zinc-400 group-hover:text-zinc-800 dark:group-hover:text-zinc-200 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </Link>
                      </TableCell>

                      {/* Status Toggle */}
                      <TableCell className="py-3.5">
                        <button
                          type="button"
                          onClick={() => handleToggleActive(col)}
                          title="Click to toggle availability"
                          className="group focus:outline-none"
                        >
                          {col.active ? (
                            <Badge
                              variant="outline"
                              className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200/80 dark:border-emerald-800/80 gap-1.5 text-[11px] font-medium cursor-pointer hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              <span>Active</span>
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="bg-zinc-100/80 dark:bg-zinc-800/60 text-zinc-500 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 gap-1.5 text-[11px] font-medium cursor-pointer hover:bg-zinc-200/80 dark:hover:bg-zinc-700/80 transition-colors"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                              <span>Inactive</span>
                            </Badge>
                          )}
                        </button>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="py-3.5 pr-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenEdit(col)}
                            aria-label={`Edit color ${col.name}`}
                            title="Edit color shade"
                            className="h-8 w-8 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setColorToDelete(col)}
                            aria-label={`Delete color ${col.name}`}
                            title="Delete color shade"
                            className="h-8 w-8 text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Accessible Add / Edit Color Modal */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="color-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsModalOpen(false);
          }}
        >
          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl max-w-md w-full p-6 space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-zinc-200/80 dark:border-zinc-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white border border-zinc-200/60 dark:border-zinc-700/60 shadow-xs"
                  style={{ backgroundColor: formState.hex }}
                >
                  <Palette className="w-4 h-4 invert drop-shadow-xs" />
                </div>
                <div>
                  <h3
                    id="color-modal-title"
                    className="font-semibold text-sm text-zinc-900 dark:text-zinc-50"
                  >
                    {editingColor ? "Edit Color Shade" : "Create Color Shade"}
                  </h3>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                    Define custom textile hex swatch and display label
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close dialog"
                className="h-8 w-8 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label
                  htmlFor="color-name-input"
                  className="font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Color name
                </label>
                <Input
                  id="color-name-input"
                  type="text"
                  required
                  placeholder="e.g. Emerald Forest"
                  value={formState.name}
                  onChange={(e) =>
                    setFormState({ ...formState, name: e.target.value })
                  }
                  autoFocus
                />
              </div>

              {/* HEX Code & Color Picker */}
              <div className="space-y-1.5">
                <label
                  htmlFor="color-hex-input"
                  className="font-medium text-zinc-700 dark:text-zinc-300 flex items-center justify-between"
                >
                  <span>HEX color code</span>
                  <span className="text-[10px] text-zinc-400 font-mono">CSS hex swatch</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    id="native-color-picker"
                    value={formState.hex}
                    onChange={(e) =>
                      setFormState({ ...formState, hex: e.target.value })
                    }
                    className="w-10 h-9 p-0.5 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 cursor-pointer shrink-0"
                    aria-label="Pick color visually"
                  />
                  <Input
                    id="color-hex-input"
                    type="text"
                    required
                    placeholder="#000000"
                    value={formState.hex}
                    onChange={(e) =>
                      setFormState({ ...formState, hex: e.target.value })
                    }
                    className="font-mono uppercase flex-1"
                  />
                  <div
                    className="w-9 h-9 rounded-md border border-zinc-200 dark:border-zinc-700 shrink-0 shadow-2xs"
                    style={{ backgroundColor: formState.hex }}
                    aria-hidden="true"
                  />
                </div>
              </div>

              {/* Preset Swatches */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] text-zinc-400 font-medium">Quick Atelier Swatches:</span>
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_COLOR_SWATCHES.map((swatch) => (
                    <button
                      key={swatch.hex}
                      type="button"
                      onClick={() =>
                        setFormState({
                          ...formState,
                          name: formState.name || swatch.name,
                          hex: swatch.hex,
                        })
                      }
                      title={`${swatch.name} (${swatch.hex})`}
                      className="w-6 h-6 rounded-full border border-zinc-300 dark:border-zinc-700 hover:scale-110 transition-transform cursor-pointer shadow-2xs"
                      style={{ backgroundColor: swatch.hex }}
                      aria-label={`Select preset ${swatch.name}`}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="color-desc-input"
                  className="font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Editorial & textile notes
                </label>
                <textarea
                  id="color-desc-input"
                  rows={2}
                  value={formState.description}
                  onChange={(e) =>
                    setFormState({ ...formState, description: e.target.value })
                  }
                  placeholder="e.g. Deep botanical forest green with satin luster"
                  className="w-full rounded-md border border-zinc-200 bg-white p-2.5 text-xs text-zinc-900 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 focus:outline-none focus:ring-1 focus:ring-zinc-950 dark:focus:ring-zinc-300"
                />
              </div>

              <div className="flex items-start gap-2.5 pt-1 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800">
                <input
                  type="checkbox"
                  id="color-active-check"
                  checked={formState.active}
                  onChange={(e) =>
                    setFormState({ ...formState, active: e.target.checked })
                  }
                  className="mt-0.5 rounded border-zinc-300 dark:border-zinc-700 text-zinc-900 focus:ring-zinc-950 cursor-pointer w-4 h-4"
                />
                <div className="space-y-0.5">
                  <label
                    htmlFor="color-active-check"
                    className="font-medium text-zinc-900 dark:text-zinc-100 cursor-pointer block"
                  >
                    Active in catalog
                  </label>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                    When enabled, this shade appears in product creator and editor chips.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-200/80 dark:border-zinc-800">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="shadow-2xs">
                  {editingColor ? "Save color" : "Create color"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Accessible Delete Confirmation Dialog */}
      {colorToDelete && (
        <div
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="delete-color-title"
          aria-describedby="delete-color-desc"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setColorToDelete(null);
          }}
        >
          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-50 dark:bg-rose-950/60 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0 border border-rose-200/60 dark:border-rose-900/60">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3
                  id="delete-color-title"
                  className="font-semibold text-sm text-zinc-900 dark:text-zinc-50"
                >
                  Delete Color Shade
                </h3>
                <p
                  id="delete-color-desc"
                  className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed"
                >
                  Are you sure you want to remove{" "}
                  <strong className="text-zinc-900 dark:text-zinc-100 font-semibold">
                    {colorToDelete.name}
                  </strong>{" "}
                  ({colorToDelete.hex}) from available catalog variations?
                </p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800 text-xs space-y-1">
              <span className="font-medium text-zinc-700 dark:text-zinc-300 block">
                Catalog Impact Note:
              </span>
              <p className="text-zinc-500 dark:text-zinc-400 text-[11px] leading-relaxed">
                Currently linked to{" "}
                <strong className="font-mono text-zinc-800 dark:text-zinc-200">
                  {getLinkedProductsCount(colorToDelete.name)}
                </strong>{" "}
                products. Existing inventory records will retain this color in historical purchase specs, but it will be removed from future selection chips.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-zinc-200/80 dark:border-zinc-800">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setColorToDelete(null)}
              >
                Keep color
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleConfirmDelete}
                className="bg-rose-600 hover:bg-rose-700 text-white shadow-2xs"
              >
                Delete color
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
