import React from "react";
import Link from "next/link";
import Image from "next/image";

interface AccessoriesBannerProps {
  imageSrc?: string;
  altText?: string;
  href?: string;
}

export const AccessoriesBanner: React.FC<AccessoriesBannerProps> = ({
  imageSrc = "/banners/accessories-banner.jpg",
  altText = "Curated Accessories & Leather Goods",
  href = "/shop",
}) => {
  return (
    <div className="w-full mb-8 sm:mb-10">
      <Link
        href={href}
        className="group block relative w-full aspect-[16/6] sm:aspect-[3.1/1] md:aspect-[3.3/1] rounded-2xl sm:rounded-3xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-2xs hover:shadow-md transition-all duration-300"
      >
        <Image
          src={imageSrc}
          alt={altText}
          fill
          priority
          sizes="(max-width: 1280px) 100vw, 1200px"
          className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.02]"
        />
        {/* Subtle vignette overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
      </Link>
    </div>
  );
};
