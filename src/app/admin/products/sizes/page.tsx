"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useCMS } from "@/context/cms-context";
import { VariationSize } from "@/types/cms";
import {
  Ruler,
  Palette,
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

export default function ProductSizesPage() {
  const { sizes, addSize, updateSize, deleteSize, products } = useCMS();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");

  // Modal dialog states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSize, setEditingSize] = useState<VariationSize | null>(null);
  const [sizeToDelete, setSizeToDelete] = useState<VariationSize | null>(null);

  // Form state
  const [formState, setFormState] = useState<{
    name: string;
    code: string;
    description: string;
    active: boolean;
  }>({
    name: "",
    code: "",
    description: "",
    active: true,
  });

  // Accessible Escape key listener for dialog dismissal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsModalOpen(false);
        setSizeToDelete(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Compute products utilizing this size
  const getLinkedProductsCount = (sizeCode: string) => {
    const code = sizeCode.trim().toLowerCase();
    return products.filter((p) =>
      (p.sizes || []).some((s) => s.trim().toLowerCase() === code)
    ).length;
  };

  // Executive KPI metrics
  const totalSizes = sizes.length;
  const activeSizesCount = useMemo(
    () => sizes.filter((s) => s.active).length,
    [sizes]
  );
  const inactiveSizesCount = totalSizes - activeSizesCount;

  const totalLinkedProducts = useMemo(() => {
    return products.filter((p) => (p.sizes || []).length > 0).length;
  }, [products]);

  // Filter sizes
  const filteredSizes = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return sizes.filter((sz) => {
      const matchStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && sz.active) ||
        (statusFilter === "inactive" && !sz.active);

      const matchSearch =
        !q ||
        sz.name.toLowerCase().includes(q) ||
        sz.code.toLowerCase().includes(q) ||
        (sz.description && sz.description.toLowerCase().includes(q));

      return matchStatus && matchSearch;
    });
  }, [sizes, statusFilter, searchQuery]);

  const handleOpenAdd = () => {
    setEditingSize(null);
    setFormState({
      name: "",
      code: "",
      description: "",
      active: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (sz: VariationSize) => {
    setEditingSize(sz);
    setFormState({
      name: sz.name,
      code: sz.code,
      description: sz.description || "",
      active: sz.active,
    });
    setIsModalOpen(true);
  };

  const handleToggleActive = (sz: VariationSize) => {
    updateSize(sz.id, { active: !sz.active });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.code.trim() || !formState.name.trim()) return;

    if (editingSize) {
      updateSize(editingSize.id, {
        name: formState.name.trim(),
        code: formState.code.trim().toUpperCase(),
        description: formState.description.trim(),
        active: formState.active,
      });
    } else {
      addSize({
        id: `size-${Date.now()}`,
        name: formState.name.trim(),
        code: formState.code.trim().toUpperCase(),
        description: formState.description.trim(),
        active: formState.active,
      });
    }

    setIsModalOpen(false);
    setEditingSize(null);
  };

  const handleConfirmDelete = () => {
    if (!sizeToDelete) return;
    deleteSize(sizeToDelete.id);
    setSizeToDelete(null);
  };

  return (
    <div className="space-y-6">
      {/* Executive Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 text-balance">
            Sizes Management
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 text-pretty">
            Configure atelier product sizing standards, dimensions, and catalog availability.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            onClick={handleOpenAdd}
            size="sm"
            className="gap-1.5 shadow-2xs active:scale-[0.98] transition-transform"
          >
            <Plus className="w-4 h-4" />
            <span>Add size</span>
          </Button>
        </div>
      </div>

      {/* Variation Switcher Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-200/80 dark:border-zinc-800 pb-3">
        <Link
          href="/admin/products/sizes"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-2xs transition-colors"
          aria-current="page"
        >
          <Ruler className="w-3.5 h-3.5" />
          <span>Sizes</span>
          <span className="font-mono text-[10px] bg-white/20 dark:bg-black/20 px-1.5 py-0.2 rounded-full">
            {totalSizes}
          </span>
        </Link>
        <Link
          href="/admin/products/colors"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-850 transition-colors"
        >
          <Palette className="w-3.5 h-3.5" />
          <span>Color shades</span>
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
            <Ruler className="w-3.5 h-3.5 text-zinc-400" />
            Configured sizes
          </span>
          <div className="text-xl font-bold font-mono text-zinc-900 dark:text-zinc-50 tabular-nums">
            {totalSizes}
          </div>
          <span className="text-[10px] text-zinc-400 dark:text-zinc-500 block truncate">
            All size variations
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
            {activeSizesCount}
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
              Sized products
            </span>
            <ArrowUpRight className="w-3 h-3 text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors" />
          </span>
          <div className="text-xl font-bold font-mono text-zinc-900 dark:text-zinc-50 tabular-nums">
            {totalLinkedProducts}
          </div>
          <span className="text-[10px] text-zinc-400 dark:text-zinc-500 block truncate">
            Products with size variants
          </span>
        </Link>

        <div className="p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-2xs space-y-1">
          <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-zinc-400" />
            Standard coverage
          </span>
          <div className="text-xl font-bold font-mono text-zinc-900 dark:text-zinc-50 tabular-nums">
            XS · XXL
          </div>
          <span className="text-[10px] text-zinc-400 dark:text-zinc-500 block truncate">
            Plus universal free-size
          </span>
        </div>
      </div>

      {/* Control Bar: Search & Status Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-zinc-950 p-2.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800 shadow-2xs">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <Input
            type="text"
            placeholder="Filter sizes by code, name, or measurements..."
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
            All ({totalSizes})
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
            Active ({activeSizesCount})
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
            Inactive ({inactiveSizesCount})
          </button>
        </div>
      </div>

      {/* Main Sizes DataTable */}
      {filteredSizes.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-300 dark:border-zinc-800 p-12 text-center bg-white/50 dark:bg-zinc-950/50">
          <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto text-zinc-400 mb-3">
            <Ruler className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            No sizes located
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-sm mx-auto">
            {searchQuery || statusFilter !== "all"
              ? "No size specifications match your search criteria. Try modifying your filter."
              : "No size variations have been established yet."}
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
                    Size Code & Label
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 py-3">
                    Dimensions & Measurements
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
                {filteredSizes.map((sz) => {
                  const productCount = getLinkedProductsCount(sz.code);

                  return (
                    <TableRow
                      key={sz.id}
                      className="border-b border-zinc-100 dark:border-zinc-800/60 hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-colors"
                    >
                      {/* Code Badge & Name */}
                      <TableCell className="py-3.5 pl-4">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 tracking-wide min-w-[36px] text-center shadow-2xs">
                            {sz.code}
                          </span>
                          <div>
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(sz)}
                              className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 hover:underline hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors text-left"
                            >
                              {sz.name}
                            </button>
                            <span className="text-[10px] text-zinc-400 font-mono block">
                              ID: {sz.id}
                            </span>
                          </div>
                        </div>
                      </TableCell>

                      {/* Dimensions / Measurements */}
                      <TableCell className="py-3.5">
                        <span className="text-xs text-zinc-600 dark:text-zinc-400">
                          {sz.description || "Standard atelier tailored dimensions"}
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
                          onClick={() => handleToggleActive(sz)}
                          title="Click to toggle availability"
                          className="group focus:outline-none"
                        >
                          {sz.active ? (
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
                            onClick={() => handleOpenEdit(sz)}
                            aria-label={`Edit size ${sz.code}`}
                            title="Edit size specification"
                            className="h-8 w-8 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSizeToDelete(sz)}
                            aria-label={`Delete size ${sz.code}`}
                            title="Delete size specification"
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

      {/* Accessible Add / Edit Size Modal */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="size-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsModalOpen(false);
          }}
        >
          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl max-w-md w-full p-6 space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-zinc-200/80 dark:border-zinc-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-900 dark:text-zinc-50 border border-zinc-200/60 dark:border-zinc-700/60">
                  <Ruler className="w-4 h-4" />
                </div>
                <div>
                  <h3
                    id="size-modal-title"
                    className="font-semibold text-sm text-zinc-900 dark:text-zinc-50"
                  >
                    {editingSize ? "Edit Size Specification" : "Create Size Specification"}
                  </h3>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                    Define standard dimensions and display tag
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
                  htmlFor="size-code-input"
                  className="font-medium text-zinc-700 dark:text-zinc-300 flex items-center justify-between"
                >
                  <span>Size code / display badge</span>
                  <span className="text-[10px] text-zinc-400 font-mono">e.g. XS, M, XXL</span>
                </label>
                <Input
                  id="size-code-input"
                  type="text"
                  required
                  placeholder="e.g. XXL"
                  value={formState.code}
                  onChange={(e) =>
                    setFormState({ ...formState, code: e.target.value })
                  }
                  autoFocus
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="size-name-input"
                  className="font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Full name / fit description
                </label>
                <Input
                  id="size-name-input"
                  type="text"
                  required
                  placeholder="e.g. Double Extra Large"
                  value={formState.name}
                  onChange={(e) =>
                    setFormState({ ...formState, name: e.target.value })
                  }
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="size-desc-input"
                  className="font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Body dimensions / measurements
                </label>
                <textarea
                  id="size-desc-input"
                  rows={2}
                  value={formState.description}
                  onChange={(e) =>
                    setFormState({ ...formState, description: e.target.value })
                  }
                  placeholder="e.g. Chest 44-46 in · Waist 38-40 in"
                  className="w-full rounded-md border border-zinc-200 bg-white p-2.5 text-xs text-zinc-900 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 focus:outline-none focus:ring-1 focus:ring-zinc-950 dark:focus:ring-zinc-300"
                />
              </div>

              <div className="flex items-start gap-2.5 pt-1 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800">
                <input
                  type="checkbox"
                  id="size-active-check"
                  checked={formState.active}
                  onChange={(e) =>
                    setFormState({ ...formState, active: e.target.checked })
                  }
                  className="mt-0.5 rounded border-zinc-300 dark:border-zinc-700 text-zinc-900 focus:ring-zinc-950 cursor-pointer w-4 h-4"
                />
                <div className="space-y-0.5">
                  <label
                    htmlFor="size-active-check"
                    className="font-medium text-zinc-900 dark:text-zinc-100 cursor-pointer block"
                  >
                    Active in catalog
                  </label>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                    When enabled, this size appears in product creator and editor chips.
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
                  {editingSize ? "Save size" : "Create size"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Accessible Delete Confirmation Dialog */}
      {sizeToDelete && (
        <div
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="delete-size-title"
          aria-describedby="delete-size-desc"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSizeToDelete(null);
          }}
        >
          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-50 dark:bg-rose-950/60 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0 border border-rose-200/60 dark:border-rose-900/60">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3
                  id="delete-size-title"
                  className="font-semibold text-sm text-zinc-900 dark:text-zinc-50"
                >
                  Delete Size Specification
                </h3>
                <p
                  id="delete-size-desc"
                  className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed"
                >
                  Are you sure you want to remove size{" "}
                  <strong className="text-zinc-900 dark:text-zinc-100 font-semibold font-mono">
                    {sizeToDelete.code}
                  </strong>{" "}
                  ({sizeToDelete.name}) from available catalog variations?
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
                  {getLinkedProductsCount(sizeToDelete.code)}
                </strong>{" "}
                products. Existing inventory records will retain the size in history, but it will be removed from future selection chips.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-zinc-200/80 dark:border-zinc-800">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSizeToDelete(null)}
              >
                Keep size
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleConfirmDelete}
                className="bg-rose-600 hover:bg-rose-700 text-white shadow-2xs"
              >
                Delete size
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
