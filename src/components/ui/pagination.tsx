import * as React from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants, ButtonProps } from "@/components/ui/button";

export const Pagination = ({
  className,
  ...props
}: React.ComponentProps<"nav">) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  />
);
Pagination.displayName = "Pagination";

export const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex flex-row items-center gap-1", className)}
    {...props}
  />
));
PaginationContent.displayName = "PaginationContent";

export const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("list-none", className)} {...props} />
));
PaginationItem.displayName = "PaginationItem";

type PaginationLinkProps = {
  isActive?: boolean;
} & Pick<ButtonProps, "size"> &
  React.ButtonHTMLAttributes<HTMLButtonElement>;

export const PaginationLink = ({
  className,
  isActive,
  size = "sm",
  ...props
}: PaginationLinkProps) => (
  <button
    aria-current={isActive ? "page" : undefined}
    type="button"
    className={cn(
      buttonVariants({
        variant: isActive ? "default" : "outline",
        size,
      }),
      "min-w-8 h-8 px-2.5 text-xs font-mono tabular-nums cursor-pointer transition-colors active:scale-[0.96]",
      isActive
        ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-semibold shadow-xs border-zinc-900 dark:border-zinc-100"
        : "border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300",
      className
    )}
    {...props}
  />
);
PaginationLink.displayName = "PaginationLink";

export const PaginationPrevious = ({
  className,
  label = "Previous",
  ...props
}: React.ComponentProps<typeof PaginationLink> & { label?: string }) => (
  <PaginationLink
    aria-label="Go to previous page"
    size="sm"
    className={cn("gap-1 pl-2 pr-3", className)}
    {...props}
  >
    <ChevronLeft className="w-3.5 h-3.5" />
    <span className="hidden sm:inline font-sans text-xs">{label}</span>
  </PaginationLink>
);
PaginationPrevious.displayName = "PaginationPrevious";

export const PaginationNext = ({
  className,
  label = "Next",
  ...props
}: React.ComponentProps<typeof PaginationLink> & { label?: string }) => (
  <PaginationLink
    aria-label="Go to next page"
    size="sm"
    className={cn("gap-1 pl-3 pr-2", className)}
    {...props}
  >
    <span className="hidden sm:inline font-sans text-xs">{label}</span>
    <ChevronRight className="w-3.5 h-3.5" />
  </PaginationLink>
);
PaginationNext.displayName = "PaginationNext";

export const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    aria-hidden
    className={cn("flex h-8 w-8 items-center justify-center text-zinc-400 dark:text-zinc-600", className)}
    {...props}
  >
    <MoreHorizontal className="w-4 h-4" />
    <span className="sr-only">More pages</span>
  </span>
);
PaginationEllipsis.displayName = "PaginationEllipsis";

/* =========================================================================
   High-Level DataTablePagination (Easy UI / shadcn Ready-to-Use Component)
   ========================================================================= */

export interface DataTablePaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  className?: string;
}

export function DataTablePagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50],
  className,
}: DataTablePaginationProps) {
  if (totalItems === 0) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Generate page numbers with ellipsis
  const getVisiblePages = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, "ellipsis", totalPages];
    }
    if (currentPage >= totalPages - 3) {
      return [1, "ellipsis", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, "ellipsis", currentPage - 1, currentPage, currentPage + 1, "ellipsis", totalPages];
  };

  const pages = getVisiblePages();

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 border-t border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/30 text-xs text-zinc-500 dark:text-zinc-400",
        className
      )}
    >
      {/* Left: Range and total counter */}
      <div className="flex items-center gap-2 flex-wrap">
        <span>
          Showing <strong className="font-mono text-zinc-900 dark:text-zinc-100 tabular-nums">{startItem}</strong>–
          <strong className="font-mono text-zinc-900 dark:text-zinc-100 tabular-nums">{endItem}</strong> of{" "}
          <strong className="font-mono text-zinc-900 dark:text-zinc-100 tabular-nums">{totalItems}</strong> items
        </span>

        {onPageSizeChange && pageSizeOptions.length > 1 && (
          <div className="flex items-center gap-1.5 ml-2 border-l border-zinc-200 dark:border-zinc-800 pl-3">
            <span>Per page:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="h-7 px-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded text-xs font-mono tabular-nums text-zinc-800 dark:text-zinc-200 cursor-pointer"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Right: Pagination Controls */}
      <div className="flex items-center gap-1 self-center sm:self-auto">
        {/* Previous Button */}
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage <= 1}
          aria-label="Previous page"
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "h-8 px-2.5 text-xs gap-1 cursor-pointer transition-colors active:scale-[0.96] disabled:opacity-40 disabled:pointer-events-none shadow-2xs"
          )}
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span className="hidden sm:inline font-sans">Previous</span>
        </button>

        {/* Page Buttons (Desktop/Tablet) */}
        <div className="hidden sm:flex items-center gap-1">
          {pages.map((p, idx) => {
            if (p === "ellipsis") {
              return <PaginationEllipsis key={`ell-${idx}`} />;
            }
            const pageNum = p as number;
            const isSelected = pageNum === currentPage;
            return (
              <button
                key={pageNum}
                type="button"
                onClick={() => onPageChange(pageNum)}
                aria-current={isSelected ? "page" : undefined}
                className={cn(
                  "min-w-8 h-8 px-2 rounded-md text-xs font-mono font-medium tabular-nums transition-colors cursor-pointer active:scale-[0.96]",
                  isSelected
                    ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-semibold shadow-xs"
                    : "border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                )}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        {/* Mobile Page indicator */}
        <div className="sm:hidden px-2 text-xs font-mono tabular-nums text-zinc-700 dark:text-zinc-300">
          Page {currentPage} of {totalPages}
        </div>

        {/* Next Button */}
        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage >= totalPages}
          aria-label="Next page"
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "h-8 px-2.5 text-xs gap-1 cursor-pointer transition-colors active:scale-[0.96] disabled:opacity-40 disabled:pointer-events-none shadow-2xs"
          )}
        >
          <span className="hidden sm:inline font-sans">Next</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
