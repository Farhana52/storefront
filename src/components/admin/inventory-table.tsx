"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useCMS } from "@/context/cms-context";
import { Product } from "@/types";
import {
  Search,
  Plus,
  Trash2,
  Edit3,
  ExternalLink,
  X,
  Package,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Eye,
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
import { DataTablePagination } from "@/components/ui/pagination";

interface InventoryTableProps {
  externalSearch?: string;
  onOpenAddModal?: () => void;
}

export const InventoryTable: React.FC<InventoryTableProps> = ({
  externalSearch = "",
  onOpenAddModal,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { products, deleteProduct, categories: cmsCategories } = useCMS();

  const urlCategory = searchParams.get("category") || "All";
  const urlStock = searchParams.get("stock") || "all";

  const [selectedCategory, setSelectedCategory] = useState<string>(urlCategory);
  const [stockFilter, setStockFilter] = useState<string>(urlStock);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  useEffect(() => {
    setSelectedCategory(searchParams.get("category") || "All");
    setStockFilter(searchParams.get("stock") || "all");
    setCurrentPage(1);
  }, [searchParams]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, externalSearch]);

  const updateFilters = (cat: string, stock: string) => {
    setSelectedCategory(cat);
    setStockFilter(stock);

    const params = new URLSearchParams();
    if (cat !== "All") params.set("category", cat);
    if (stock !== "all") params.set("stock", stock);

    const qs = params.toString();
    router.push(qs ? `/admin/products?${qs}` : "/admin/products");
  };

  const query = (searchQuery || externalSearch).toLowerCase().trim();

  const categoriesList = useMemo(
    () => ["All", ...cmsCategories.map((c) => c.name)],
    [cmsCategories]
  );

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      All: products.length,
    };
    cmsCategories.forEach((c) => {
      counts[c.name] = products.filter(
        (p) => p.category.toLowerCase() === c.name.toLowerCase()
      ).length;
    });
    return counts;
  }, [products, cmsCategories]);

  const inStockCount = useMemo(
    () => products.filter((p) => p.inStock).length,
    [products]
  );
  const outOfStockCount = useMemo(
    () => products.length - inStockCount,
    [products, inStockCount]
  );

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchCat =
        selectedCategory === "All" || product.category === selectedCategory;
      const matchStock =
        stockFilter === "all" ||
        (stockFilter === "in" && product.inStock) ||
        (stockFilter === "out" && !product.inStock);
      const matchQuery =
        !query ||
        product.title.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query);

      return matchCat && matchStock && matchQuery;
    });
  }, [products, selectedCategory, stockFilter, query]);

  const totalPages = Math.ceil(filteredProducts.length / pageSize) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, currentPage, pageSize]);

  return (
    <div className="space-y-4">
      {/* Stock & Taxonomy Quick Filter Bars */}
      <div className="flex flex-col gap-2">
        {/* Stock Level Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-zinc-200/80 dark:border-zinc-800/80 text-xs">
          <span className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider pr-2 flex items-center gap-1">
            <Package className="w-3 h-3" />
            Stock:
          </span>
          {[
            { id: "all", label: "All products", count: products.length },
            { id: "in", label: "In stock", count: inStockCount },
            { id: "out", label: "Sold out", count: outOfStockCount },
          ].map((st) => {
            const isActive = stockFilter === st.id;
            return (
              <button
                key={st.id}
                type="button"
                onClick={() => updateFilters(selectedCategory, st.id)}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap active:scale-[0.98] ${
                  isActive
                    ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-semibold shadow-xs"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
                }`}
              >
                <span>{st.label}</span>
                <span
                  className={`font-mono text-[10px] px-1.5 py-0.2 rounded-full tabular-nums ${
                    isActive
                      ? "bg-zinc-800 text-zinc-200 dark:bg-zinc-200 dark:text-zinc-800 font-semibold"
                      : "bg-zinc-200/70 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                  }`}
                >
                  {st.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Category Segmented Tabs (shadcn style) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider pr-2 flex items-center gap-1">
            <Layers className="w-3 h-3" />
            Category:
          </span>
          {categoriesList.map((cat) => {
            const isActive = selectedCategory === cat;
            const count = categoryCounts[cat as keyof typeof categoryCounts] || 0;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => updateFilters(cat, stockFilter)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  isActive
                    ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-semibold shadow-xs"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
                }`}
              >
                <span>{cat}</span>
                <span className={`font-mono text-[10px] tabular-nums ${isActive ? "text-zinc-300 dark:text-zinc-600" : "opacity-75"}`}>({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Table Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products by title or category..."
            className="pl-8 text-xs h-9"
          />
        </div>

        <Link href="/admin/products/new">
          <Button
            size="sm"
            className="self-start sm:self-auto gap-1.5 shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add product</span>
          </Button>
        </Link>
      </div>

      {/* Main DataTable */}
      <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden shadow-2xs">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[36%]">Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-12 text-center text-zinc-400">
                  <Package className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">No products found</p>
                  <p className="text-xs mt-1 text-zinc-500">
                    No products match your selected filters or search query.
                  </p>
                  <div className="mt-4 flex items-center justify-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSearchQuery("");
                        updateFilters("All", "all");
                      }}
                      className="text-xs"
                    >
                      Clear filters
                    </Button>
                    <Link href="/admin/products/new">
                      <Button size="sm" className="text-xs">
                        Add product
                      </Button>
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginatedProducts.map((product) => (
                <TableRow key={product.id} className="group hover:bg-zinc-50/80 dark:hover:bg-zinc-900/50 transition-colors">
                  <TableCell>
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="flex items-center gap-3"
                    >
                      <div className="w-10 h-10 rounded-lg overflow-hidden relative bg-zinc-100 dark:bg-zinc-800 shrink-0 border border-zinc-200/80 dark:border-zinc-800 group-hover:ring-2 group-hover:ring-zinc-900/10 dark:group-hover:ring-zinc-100/10 transition-all">
                        <Image
                          src={product.image}
                          alt={product.title}
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-xs text-zinc-900 dark:text-zinc-100 group-hover:underline truncate">
                          {product.title}
                        </div>
                        <div className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                          {product.subtitle}
                        </div>
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-[11px] font-normal">
                      {product.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="font-mono font-semibold text-zinc-900 dark:text-zinc-100 tabular-nums">
                      ৳{product.price.toLocaleString()}
                    </div>
                    {product.originalPrice && (
                      <div className="text-[10px] text-zinc-400 line-through font-mono tabular-nums">
                        ৳{product.originalPrice.toLocaleString()}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={product.inStock ? "success" : "destructive"}
                      className="text-[10px]"
                    >
                      {product.inStock ? "In stock" : "Sold out"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-zinc-500 font-mono text-[11px] tabular-nums">
                    ★ {product.rating || "5.0"} ({product.reviewsCount || 0})
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="p-1.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                        title="View product details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          if (confirm(`Delete "${product.title}"?`)) {
                            deleteProduct(product.id);
                          }
                        }}
                        className="h-8 w-8 text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 cursor-pointer"
                        title="Delete product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                      <Link
                        href={`/products/${product.id}`}
                        target="_blank"
                        className="p-1.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-md transition-colors"
                        title="View on storefront"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination Footer */}
        <DataTablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredProducts.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={(newSize) => {
            setPageSize(newSize);
            setCurrentPage(1);
          }}
          pageSizeOptions={[10, 20, 50]}
        />
      </div>
    </div>
  );
};
