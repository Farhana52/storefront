"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCMS } from "@/context/cms-context";
import { CategoryItem } from "@/types/cms";
import {
  Plus,
  Edit2,
  Trash2,
  Layers,
  X,
  Check,
  Search,
  LayoutGrid,
  List,
  ExternalLink,
  Sparkles,
  ShoppingBag,
  FolderTree,
  Copy,
  ArrowUpRight,
  AlertTriangle,
  RotateCcw,
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

const PRESET_IMAGES = [
  "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=900&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=900&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=900&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1509319117193-57bab727e09d?q=80&w=900&auto=format&fit=crop",
];

export const CategoriesCMS: React.FC = () => {
  const { categories, products, addCategory, updateCategory, deleteCategory } =
    useCMS();

  // View presentation state: default to table view for operational density
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "featured" | "standard">("all");
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  // Modal dialog states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryItem | null>(null);

  // Category form state
  const [formState, setFormState] = useState<{
    name: string;
    slug: string;
    description: string;
    image: string;
    featured: boolean;
  }>({
    name: "",
    slug: "",
    description: "",
    image: PRESET_IMAGES[0],
    featured: true,
  });
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);

  // Close modals on Escape key press for accessible keyboard interaction
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsModalOpen(false);
        setCategoryToDelete(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Compute category product associations
  const getProductCount = useCallback(
    (categoryName: string) => {
      const target = categoryName.trim().toLowerCase();
      return products.filter((p) => (p.category || "").trim().toLowerCase() === target).length;
    },
    [products]
  );

  // Calculate high-level executive KPI metrics
  const totalCategories = categories.length;
  const featuredCount = useMemo(
    () => categories.filter((c) => c.featured).length,
    [categories]
  );
  const standardCount = totalCategories - featuredCount;

  const totalMappedProducts = useMemo(() => {
    return categories.reduce((sum, cat) => sum + getProductCount(cat.name), 0);
  }, [categories, getProductCount]);

  const avgProductsPerCategory = useMemo(() => {
    if (totalCategories === 0) return "0.0";
    return (totalMappedProducts / totalCategories).toFixed(1);
  }, [totalCategories, totalMappedProducts]);

  // Filter categories according to search and status criteria
  const filteredCategories = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return categories.filter((cat) => {
      const matchStatus =
        statusFilter === "all" ||
        (statusFilter === "featured" && cat.featured) ||
        (statusFilter === "standard" && !cat.featured);

      const matchSearch =
        !query ||
        cat.name.toLowerCase().includes(query) ||
        cat.slug.toLowerCase().includes(query) ||
        (cat.description && cat.description.toLowerCase().includes(query));

      return matchStatus && matchSearch;
    });
  }, [categories, statusFilter, searchQuery]);

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setIsSlugManuallyEdited(false);
    setFormState({
      name: "",
      slug: "",
      description: "",
      image: PRESET_IMAGES[0],
      featured: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: CategoryItem) => {
    setEditingCategory(cat);
    setIsSlugManuallyEdited(true);
    setFormState({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || "",
      image: cat.image || PRESET_IMAGES[0],
      featured: cat.featured ?? false,
    });
    setIsModalOpen(true);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    if (!isSlugManuallyEdited && !editingCategory) {
      const generatedSlug = newName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setFormState((prev) => ({ ...prev, name: newName, slug: generatedSlug }));
    } else {
      setFormState((prev) => ({ ...prev, name: newName }));
    }
  };

  const handleCopySlug = (slug: string) => {
    navigator.clipboard.writeText(`/${slug}`);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 1600);
  };

  const handleToggleFeatured = (cat: CategoryItem) => {
    updateCategory(cat.id, { featured: !cat.featured });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name.trim()) return;

    const slug =
      formState.slug.trim() ||
      formState.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

    if (editingCategory) {
      updateCategory(editingCategory.id, {
        name: formState.name.trim(),
        slug,
        description: formState.description.trim(),
        image: formState.image.trim(),
        featured: formState.featured,
      });
    } else {
      addCategory({
        id: `cat-${Date.now()}`,
        name: formState.name.trim(),
        slug,
        description: formState.description.trim(),
        image: formState.image.trim(),
        featured: formState.featured,
      });
    }

    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleConfirmDelete = () => {
    if (!categoryToDelete) return;
    deleteCategory(categoryToDelete.id);
    setCategoryToDelete(null);
  };

  return (
    <div className="space-y-6">
      {/* Executive Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 text-balance">
            Categories
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 text-pretty">
            Organize catalog departments, navigation taxonomies, cover imagery, and storefront showcase visibility.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            onClick={handleOpenAdd}
            size="sm"
            className="gap-1.5 shadow-2xs active:scale-[0.98] transition-transform"
          >
            <Plus className="w-4 h-4" />
            <span>Add category</span>
          </Button>
        </div>
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
            <FolderTree className="w-3.5 h-3.5 text-zinc-400" />
            Total departments
          </span>
          <div className="text-xl font-bold font-mono text-zinc-900 dark:text-zinc-50 tabular-nums">
            {totalCategories}
          </div>
          <span className="text-[10px] text-zinc-400 dark:text-zinc-500 block truncate">
            Catalog taxonomies
          </span>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter("featured")}
          className={`p-4 rounded-xl border text-left bg-white dark:bg-zinc-950 shadow-2xs space-y-1 transition-all cursor-pointer ${
            statusFilter === "featured"
              ? "border-emerald-600 dark:border-emerald-500 ring-1 ring-emerald-600/20"
              : "border-zinc-200/80 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
          }`}
        >
          <span className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            Storefront featured
          </span>
          <div className="text-xl font-bold font-mono text-zinc-900 dark:text-zinc-50 tabular-nums">
            {featuredCount}
          </div>
          <span className="text-[10px] text-zinc-400 dark:text-zinc-500 block truncate">
            Active on homepage rail
          </span>
        </button>

        <Link
          href="/admin/products"
          className="p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-2xs space-y-1 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors group"
        >
          <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <ShoppingBag className="w-3.5 h-3.5 text-zinc-400" />
              Mapped products
            </span>
            <ArrowUpRight className="w-3 h-3 text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors" />
          </span>
          <div className="text-xl font-bold font-mono text-zinc-900 dark:text-zinc-50 tabular-nums">
            {totalMappedProducts}
          </div>
          <span className="text-[10px] text-zinc-400 dark:text-zinc-500 block truncate">
            Live catalog items
          </span>
        </Link>

        <div className="p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-2xs space-y-1">
          <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-zinc-400" />
            Catalog density
          </span>
          <div className="text-xl font-bold font-mono text-zinc-900 dark:text-zinc-50 tabular-nums">
            {avgProductsPerCategory}
          </div>
          <span className="text-[10px] text-zinc-400 dark:text-zinc-500 block truncate">
            Avg. items / department
          </span>
        </div>
      </div>

      {/* Control Bar: Search, Status Filter & View Switcher */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-zinc-950 p-2.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800 shadow-2xs">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <Input
            type="text"
            placeholder="Filter categories by name, slug, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-8 h-9 text-xs border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 shadow-none focus-visible:ring-1"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Status Filters and View Switcher */}
        <div className="flex items-center gap-2 justify-between sm:justify-end flex-wrap">
          {/* Segmented Filter Pills */}
          <div className="flex items-center rounded-lg bg-zinc-100 dark:bg-zinc-900 p-0.5 border border-zinc-200/60 dark:border-zinc-800/80 text-xs">
            <button
              type="button"
              onClick={() => setStatusFilter("all")}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                statusFilter === "all"
                  ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 shadow-2xs"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
              }`}
            >
              All ({totalCategories})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("featured")}
              className={`px-2.5 py-1 rounded-md font-medium transition-all flex items-center gap-1.5 ${
                statusFilter === "featured"
                  ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 shadow-2xs"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Featured ({featuredCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("standard")}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                statusFilter === "standard"
                  ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 shadow-2xs"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
              }`}
            >
              Standard ({standardCount})
            </button>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center rounded-lg bg-zinc-100 dark:bg-zinc-900 p-0.5 border border-zinc-200/60 dark:border-zinc-800/80">
            <button
              type="button"
              onClick={() => setViewMode("table")}
              aria-label="Table view"
              title="Switch to high-density table view"
              className={`p-1.5 rounded-md transition-all ${
                viewMode === "table"
                  ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 shadow-2xs"
                  : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
              }`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              aria-label="Grid view"
              title="Switch to visual grid view"
              className={`p-1.5 rounded-md transition-all ${
                viewMode === "grid"
                  ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 shadow-2xs"
                  : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {filteredCategories.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-300 dark:border-zinc-800 p-12 text-center bg-white/50 dark:bg-zinc-950/50">
          <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto text-zinc-400 mb-3">
            <FolderTree className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            No categories located
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-sm mx-auto">
            {searchQuery || statusFilter !== "all"
              ? "No department taxonomies match the active filter criteria. Try adjusting your search query or reset filters."
              : "No catalog categories have been established yet. Begin by adding your primary collection."}
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
              <span>Reset filter criteria</span>
            </Button>
          )}
        </div>
      ) : viewMode === "table" ? (
        /* High-Density Luxury DataTable */
        <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/40 hover:bg-zinc-50/50">
                  <TableHead className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 py-3 pl-4">
                    Department & Editorial Summary
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 py-3">
                    Route Slug
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 py-3">
                    Assigned Catalog Items
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 py-3">
                    Storefront Visibility
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 py-3 pr-4 text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.map((cat) => {
                  const productCount = getProductCount(cat.name);
                  const isCopied = copiedSlug === cat.slug;

                  return (
                    <TableRow
                      key={cat.id}
                      className="border-b border-zinc-100 dark:border-zinc-800/60 hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-colors"
                    >
                      {/* Department with Thumbnail, Title & Description */}
                      <TableCell className="py-3.5 pl-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-11 h-11 rounded-lg overflow-hidden border border-zinc-200/80 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800 shrink-0">
                            <Image
                              src={cat.image || PRESET_IMAGES[0]}
                              alt={cat.name}
                              fill
                              className="object-cover"
                              sizes="44px"
                            />
                          </div>
                          <div className="min-w-0">
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(cat)}
                              className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 hover:underline hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors text-left truncate block"
                            >
                              {cat.name}
                            </button>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1 max-w-sm mt-0.5 text-pretty">
                              {cat.description || "Artisanal collection department."}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      {/* Route Slug */}
                      <TableCell className="py-3.5">
                        <div className="flex items-center gap-1.5">
                          <code className="font-mono text-xs text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800/80 px-2 py-0.5 rounded border border-zinc-200/60 dark:border-zinc-700/60">
                            /{cat.slug}
                          </code>
                          <button
                            type="button"
                            onClick={() => handleCopySlug(cat.slug)}
                            aria-label={`Copy slug for ${cat.name}`}
                            title="Copy path slug"
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

                      {/* Assigned Catalog Items (Clickable to Products Page) */}
                      <TableCell className="py-3.5">
                        <Link
                          href={`/admin/products?category=${encodeURIComponent(cat.name)}`}
                          title={`View and manage ${cat.name} products in catalog`}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono tabular-nums bg-zinc-100 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-zinc-50 border border-zinc-200/60 dark:border-zinc-700/60 transition-colors group"
                        >
                          <span>{productCount} {productCount === 1 ? "product" : "products"}</span>
                          <ArrowUpRight className="w-3 h-3 text-zinc-400 group-hover:text-zinc-800 dark:group-hover:text-zinc-200 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </Link>
                      </TableCell>

                      {/* Storefront Visibility Status Toggle */}
                      <TableCell className="py-3.5">
                        <button
                          type="button"
                          onClick={() => handleToggleFeatured(cat)}
                          title="Click to toggle homepage visibility"
                          className="group focus:outline-none"
                        >
                          {cat.featured ? (
                            <Badge
                              variant="outline"
                              className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200/80 dark:border-emerald-800/80 gap-1.5 text-[11px] font-medium cursor-pointer hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              <span>Homepage Featured</span>
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="bg-zinc-100/80 dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 gap-1.5 text-[11px] font-medium cursor-pointer hover:bg-zinc-200/80 dark:hover:bg-zinc-700/80 transition-colors"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                              <span>Standard Catalog</span>
                            </Badge>
                          )}
                        </button>
                      </TableCell>

                      {/* Row Actions */}
                      <TableCell className="py-3.5 pr-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/shop?category=${encodeURIComponent(cat.slug)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`View ${cat.name} on storefront`}
                            title="Preview department on live storefront"
                            className="h-8 w-8 inline-flex items-center justify-center rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenEdit(cat)}
                            aria-label={`Edit ${cat.name}`}
                            title="Edit category"
                            className="h-8 w-8 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setCategoryToDelete(cat)}
                            aria-label={`Delete ${cat.name}`}
                            title="Delete category"
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
      ) : (
        /* Visual Card Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredCategories.map((cat) => {
            const productCount = getProductCount(cat.name);

            return (
              <div
                key={cat.id}
                className="group rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden shadow-2xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors flex flex-col justify-between"
              >
                <div>
                  {/* Category Cover Imagery */}
                  <div className="relative h-40 w-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                    <Image
                      src={cat.image || PRESET_IMAGES[0]}
                      alt={cat.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute top-3 right-3">
                      {cat.featured ? (
                        <Badge className="bg-emerald-600/90 text-white border-0 text-[10px] gap-1 shadow-xs backdrop-blur-xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                          Featured
                        </Badge>
                      ) : (
                        <Badge
                          variant="secondary"
                          className="bg-black/40 text-white/80 border-0 text-[10px] backdrop-blur-xs"
                        >
                          Standard
                        </Badge>
                      )}
                    </div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <span className="text-white font-semibold text-sm truncate block drop-shadow-xs">
                        {cat.name}
                      </span>
                      <span className="font-mono text-zinc-300 text-[11px]">
                        /{cat.slug}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 space-y-2.5">
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 min-h-[32px] text-pretty">
                      {cat.description || "Artisanal collection department."}
                    </p>
                    <div className="flex items-center justify-between text-xs pt-1 border-t border-zinc-100 dark:border-zinc-800/80">
                      <span className="text-[11px] text-zinc-400">Inventory</span>
                      <Link
                        href={`/admin/products?category=${encodeURIComponent(cat.name)}`}
                        className="font-mono text-xs tabular-nums text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white flex items-center gap-1 group/link"
                      >
                        <span>{productCount} {productCount === 1 ? "product" : "products"}</span>
                        <ArrowUpRight className="w-3 h-3 text-zinc-400 group-hover/link:text-zinc-800 dark:group-hover/link:text-zinc-200" />
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-3 bg-zinc-50/50 dark:bg-zinc-900/30 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
                  <Link
                    href={`/shop?category=${encodeURIComponent(cat.slug)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View ${cat.name} on storefront`}
                    className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-200/50 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenEdit(cat)}
                      aria-label={`Edit ${cat.name}`}
                      title="Edit category"
                      className="h-7 w-7 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setCategoryToDelete(cat)}
                      aria-label={`Delete ${cat.name}`}
                      title="Delete category"
                      className="h-7 w-7 text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Accessible Add / Edit Modal Dialog */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="category-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsModalOpen(false);
          }}
        >
          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl max-w-lg w-full p-6 space-y-5 animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-zinc-200/80 dark:border-zinc-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-900 dark:text-zinc-50 border border-zinc-200/60 dark:border-zinc-700/60">
                  <FolderTree className="w-4 h-4" />
                </div>
                <div>
                  <h3
                    id="category-modal-title"
                    className="font-semibold text-sm text-zinc-900 dark:text-zinc-50"
                  >
                    {editingCategory ? "Edit Department" : "Create New Department"}
                  </h3>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                    Configure catalog taxonomy and storefront display settings
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

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label
                  htmlFor="category-name-input"
                  className="font-medium text-zinc-700 dark:text-zinc-300 flex items-center justify-between"
                >
                  <span>Department name</span>
                  <span className="text-[10px] text-zinc-400 font-normal">Required</span>
                </label>
                <Input
                  id="category-name-input"
                  type="text"
                  required
                  placeholder="e.g. Silk Wraps & Stoles"
                  value={formState.name}
                  onChange={handleNameChange}
                  autoFocus
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="category-slug-input"
                  className="font-medium text-zinc-700 dark:text-zinc-300 flex items-center justify-between"
                >
                  <span>Route slug</span>
                  <span className="text-[10px] text-zinc-400 font-mono">/shop?category={formState.slug || "..."}</span>
                </label>
                <Input
                  id="category-slug-input"
                  type="text"
                  required
                  placeholder="e.g. silk-wraps"
                  value={formState.slug}
                  onChange={(e) => {
                    setIsSlugManuallyEdited(true);
                    setFormState({ ...formState, slug: e.target.value });
                  }}
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="category-desc-input"
                  className="font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Editorial description
                </label>
                <textarea
                  id="category-desc-input"
                  rows={2}
                  value={formState.description}
                  onChange={(e) =>
                    setFormState({ ...formState, description: e.target.value })
                  }
                  placeholder="Short editorial summary for collection headers..."
                  className="w-full rounded-md border border-zinc-200 bg-white p-2.5 text-xs text-zinc-900 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 focus:outline-none focus:ring-1 focus:ring-zinc-950 dark:focus:ring-zinc-300"
                />
              </div>

              {/* Cover Image with Live Visual Preview */}
              <div className="space-y-2">
                <label
                  htmlFor="category-image-input"
                  className="font-medium text-zinc-700 dark:text-zinc-300 flex items-center justify-between"
                >
                  <span>Cover photography URL</span>
                  <span className="text-[10px] text-zinc-400 font-normal">Live preview below</span>
                </label>
                <div className="flex gap-3 items-center">
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 shrink-0">
                    <Image
                      src={formState.image || PRESET_IMAGES[0]}
                      alt="Preview"
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>
                  <Input
                    id="category-image-input"
                    type="url"
                    value={formState.image}
                    onChange={(e) =>
                      setFormState({ ...formState, image: e.target.value })
                    }
                    placeholder="https://..."
                    className="flex-1"
                  />
                </div>
                {/* Preset Suggestions */}
                <div className="flex items-center gap-1.5 pt-1 flex-wrap">
                  <span className="text-[10px] text-zinc-400 mr-1">Atelier Presets:</span>
                  {PRESET_IMAGES.map((preset, idx) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setFormState({ ...formState, image: preset })}
                      className={`text-[10px] px-2 py-0.5 rounded border transition-colors cursor-pointer tabular-nums ${
                        formState.image === preset
                          ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-transparent font-medium"
                          : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 hover:text-zinc-900"
                      }`}
                    >
                      Style {idx + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* Storefront Feature Checkbox */}
              <div className="flex items-start gap-2.5 pt-2 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800">
                <input
                  type="checkbox"
                  id="featured-checkbox"
                  checked={formState.featured}
                  onChange={(e) =>
                    setFormState({ ...formState, featured: e.target.checked })
                  }
                  className="mt-0.5 rounded border-zinc-300 dark:border-zinc-700 text-zinc-900 focus:ring-zinc-950 cursor-pointer w-4 h-4"
                />
                <div className="space-y-0.5">
                  <label
                    htmlFor="featured-checkbox"
                    className="font-medium text-zinc-900 dark:text-zinc-100 cursor-pointer block"
                  >
                    Feature on storefront homepage
                  </label>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                    Displays this department prominently in the curated homepage department carousel.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
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
                  {editingCategory ? "Save changes" : "Create department"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Accessible In-App Delete Confirmation Dialog */}
      {categoryToDelete && (
        <div
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="delete-dialog-title"
          aria-describedby="delete-dialog-desc"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setCategoryToDelete(null);
          }}
        >
          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-50 dark:bg-rose-950/60 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0 border border-rose-200/60 dark:border-rose-900/60">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3
                  id="delete-dialog-title"
                  className="font-semibold text-sm text-zinc-900 dark:text-zinc-50"
                >
                  Delete Department
                </h3>
                <p
                  id="delete-dialog-desc"
                  className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed"
                >
                  Are you sure you want to remove{" "}
                  <strong className="text-zinc-900 dark:text-zinc-100 font-semibold">
                    {categoryToDelete.name}
                  </strong>{" "}
                  from catalog departments?
                </p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800 text-xs space-y-1">
              <span className="font-medium text-zinc-700 dark:text-zinc-300 block">
                Catalog Impact Note:
              </span>
              <p className="text-zinc-500 dark:text-zinc-400 text-[11px] leading-relaxed">
                This department currently maps to{" "}
                <strong className="font-mono text-zinc-800 dark:text-zinc-200">
                  {getProductCount(categoryToDelete.name)}
                </strong>{" "}
                products. The products will remain intact in inventory, but their category association will be cleared.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-zinc-200/80 dark:border-zinc-800">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCategoryToDelete(null)}
              >
                Keep department
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleConfirmDelete}
                className="bg-rose-600 hover:bg-rose-700 text-white shadow-2xs"
              >
                Delete department
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
