"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useCMS } from "@/context/cms-context";
import { HeroSlide } from "@/types/cms";
import {
  Plus,
  Trash2,
  Edit3,
  Eye,
  MoveUp,
  MoveDown,
  ExternalLink,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export const HeroCMS: React.FC = () => {
  const { heroSlides, addHeroSlide, updateHeroSlide, deleteHeroSlide } = useCMS();
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [previewSlideId, setPreviewSlideId] = useState<string>(
    heroSlides[0]?.id || ""
  );

  // Form State
  const [formData, setFormData] = useState({
    badge: "",
    title: "",
    description: "",
    ctaText: "Shop collection",
    href: "/shop",
    image: "",
    alt: "",
    active: true,
  });

  const activeSlide = heroSlides.find((s) => s.id === previewSlideId) || heroSlides[0];

  const handleStartCreate = () => {
    setFormData({
      badge: "Curated collection",
      title: "Modern elegance for every occasion",
      description: "Crafted with refined silhouettes and premium textiles for everyday luxury.",
      ctaText: "Explore lookbook",
      href: "/shop",
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1400&auto=format&fit=crop",
      alt: "Hero showcase banner",
      active: true,
    });
    setIsCreating(true);
    setEditingSlide(null);
  };

  const handleStartEdit = (slide: HeroSlide) => {
    setEditingSlide(slide);
    setFormData({
      badge: slide.badge,
      title: slide.title,
      description: slide.description,
      ctaText: slide.ctaText,
      href: slide.href,
      image: slide.image,
      alt: slide.alt,
      active: slide.active,
    });
    setIsCreating(false);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.image.trim()) return;

    if (editingSlide) {
      updateHeroSlide(editingSlide.id, formData);
      setEditingSlide(null);
    } else {
      addHeroSlide(formData);
      setIsCreating(false);
    }
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= heroSlides.length) return;

    const newSlides = [...heroSlides];
    const [moved] = newSlides.splice(index, 1);
    newSlides.splice(targetIndex, 0, moved);

    // Save order
    newSlides.forEach((slide) => {
      updateHeroSlide(slide.id, { id: slide.id });
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Hero slides
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Storefront homepage carousel banners and promotions
          </p>
        </div>

        <Button
          onClick={handleStartCreate}
          size="sm"
          className="gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add slide</span>
        </Button>
      </div>

      {/* Live Preview Container */}
      {activeSlide && (
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-4 sm:p-5 space-y-3 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-zinc-500" />
              <span>Storefront live preview</span>
            </span>
            <span className="text-[11px] text-zinc-400 font-mono tabular-nums">
              Slide {heroSlides.findIndex((s) => s.id === activeSlide.id) + 1} of {heroSlides.length}
            </span>
          </div>

          <div className="relative w-full h-48 sm:h-64 rounded-lg overflow-hidden bg-zinc-950 isolate border border-zinc-200/50 dark:border-zinc-800/80">
            <Image
              src={activeSlide.image}
              alt={activeSlide.alt || activeSlide.title}
              fill
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />

            <div className="absolute bottom-5 left-5 right-5 z-10 text-white flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <div className="max-w-md">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/80 block mb-1">
                  {activeSlide.badge || "Inspire Lifestyle"}
                </span>
                <h2 className="text-base sm:text-xl font-bold tracking-tight text-white leading-tight">
                  {activeSlide.title}
                </h2>
                <p className="text-xs text-white/70 line-clamp-1 mt-1">
                  {activeSlide.description}
                </p>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-zinc-950 text-xs font-semibold shadow-xs shrink-0 self-start sm:self-auto">
                <span>{activeSlide.ctaText}</span>
                <ExternalLink className="w-3 h-3" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal / Inline Editor if Creating or Editing */}
      {(isCreating || editingSlide) && (
        <div className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {editingSlide ? "Edit slide" : "Create slide"}
            </h2>
            <button
              type="button"
              onClick={() => {
                setIsCreating(false);
                setEditingSlide(null);
              }}
              className="p-1 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-md cursor-pointer"
              aria-label="Close slide editor"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSaveForm} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="slide-badge"
                  className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1"
                >
                  Badge
                </label>
                <input
                  id="slide-badge"
                  type="text"
                  value={formData.badge}
                  onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                  placeholder="e.g. Autumn / Winter '26"
                  className="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-500"
                />
              </div>

              <div>
                <label
                  htmlFor="slide-cta"
                  className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1"
                >
                  Button label
                </label>
                <input
                  id="slide-cta"
                  type="text"
                  value={formData.ctaText}
                  onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                  placeholder="Shop collection"
                  className="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-500"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="slide-title"
                className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1"
              >
                Headline
              </label>
              <input
                id="slide-title"
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Curated wardrobe collection"
                className="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-500"
              />
            </div>

            <div>
              <label
                htmlFor="slide-description"
                className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1"
              >
                Description
              </label>
              <textarea
                id="slide-description"
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief narrative for the slide..."
                className="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-500 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="slide-image"
                  className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1"
                >
                  Image URL
                </label>
                <input
                  id="slide-image"
                  type="text"
                  required
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="/banners/hero-festive.jpg or Unsplash URL"
                  className="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-500 font-mono"
                />
              </div>

              <div>
                <label
                  htmlFor="slide-href"
                  className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1"
                >
                  Target URL
                </label>
                <input
                  id="slide-href"
                  type="text"
                  value={formData.href}
                  onChange={(e) => setFormData({ ...formData, href: e.target.value })}
                  placeholder="/shop"
                  className="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-500 font-mono"
                />
              </div>
            </div>

            {/* Toggle switch for slide visibility */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2.5">
                <Switch
                  checked={formData.active}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, active: checked })
                  }
                  aria-label="Toggle slide visibility on storefront"
                />
                <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  {formData.active ? "Slide active" : "Slide hidden"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsCreating(false);
                    setEditingSlide(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                >
                  {editingSlide ? "Save changes" : "Create slide"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Slide Table / List */}
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden shadow-2xs">
        <div className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <h2 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
            All slides ({heroSlides.length})
          </h2>
          <span className="text-[11px] text-zinc-500 font-mono tabular-nums">
            {heroSlides.filter((s) => s.active).length} active
          </span>
        </div>

        <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {heroSlides.map((slide, index) => {
            const isSelected = previewSlideId === slide.id;

            return (
              <div
                key={slide.id}
                className={`p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 transition-colors ${
                  isSelected
                    ? "bg-zinc-50/80 dark:bg-zinc-900/50"
                    : "hover:bg-zinc-50/50 dark:hover:bg-zinc-900/20"
                }`}
              >
                {/* Left: Thumbnail & Info */}
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    type="button"
                    onClick={() => setPreviewSlideId(slide.id)}
                    className="relative w-16 h-12 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0 cursor-pointer border border-zinc-200 dark:border-zinc-700"
                    aria-label={`Preview slide ${slide.title}`}
                  >
                    <Image
                      src={slide.image}
                      alt={slide.alt || slide.title}
                      fill
                      className="object-cover"
                    />
                  </button>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                        {slide.title}
                      </span>
                      <span
                        className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium ${
                          slide.active
                            ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800"
                            : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
                        }`}
                      >
                        {slide.active ? "Active" : "Hidden"}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                      <span>Badge: {slide.badge || "None"}</span>
                      <span>•</span>
                      <span>CTA: {slide.ctaText} ({slide.href})</span>
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  {/* Inline Toggle switch */}
                  <div className="flex items-center gap-1.5 mr-1">
                    <Switch
                      checked={slide.active}
                      onCheckedChange={(checked) =>
                        updateHeroSlide(slide.id, { active: checked })
                      }
                      aria-label={`Toggle slide ${slide.title} active`}
                    />
                  </div>

                  {/* Preview selection */}
                  <button
                    type="button"
                    onClick={() => setPreviewSlideId(slide.id)}
                    className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                        : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    }`}
                    aria-label={`Preview slide ${slide.title} in mock player`}
                    title="Preview in mock player"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>

                  {/* Move Up */}
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => handleMove(index, "up")}
                    className="p-1.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 disabled:opacity-30 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                    aria-label="Move slide up"
                    title="Move slide up"
                  >
                    <MoveUp className="w-3.5 h-3.5" />
                  </button>

                  {/* Move Down */}
                  <button
                    type="button"
                    disabled={index === heroSlides.length - 1}
                    onClick={() => handleMove(index, "down")}
                    className="p-1.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 disabled:opacity-30 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                    aria-label="Move slide down"
                    title="Move slide down"
                  >
                    <MoveDown className="w-3.5 h-3.5" />
                  </button>

                  {/* Edit */}
                  <button
                    type="button"
                    onClick={() => handleStartEdit(slide)}
                    className="p-1.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                    aria-label="Edit slide"
                    title="Edit slide"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() => deleteHeroSlide(slide.id)}
                    className="p-1.5 text-zinc-400 hover:text-rose-600 rounded-md hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                    aria-label="Delete slide"
                    title="Delete slide"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
