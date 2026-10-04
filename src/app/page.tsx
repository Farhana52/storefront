import { HeroBanner } from "@/components/home/hero-banner";
import { ProductGrid } from "@/components/home/product-grid";
import { AccessoriesSection } from "@/components/home/accessories-section";

export default function HomePage() {
  return (
    <div className="flex flex-col w-full">
      <HeroBanner />
      <ProductGrid />
      <AccessoriesSection />
    </div>
  );
}
