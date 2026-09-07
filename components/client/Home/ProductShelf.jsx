"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "phosphor-react";
import DynamicProductCard from "./DynamicProductCard";

export default function ProductShelf({
  title,
  subtitle,
  badge,
  products = [],
  viewAllLink = "/products",
  layout = "horizontal",
  limit = 10,
}) {
  const scrollContainerRef = useRef(null);

  const displayedProducts = products.slice(0, limit);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 340;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (!displayedProducts || displayedProducts.length === 0) {
    return null;
  }

  return (
    <section className="w-[95%] md:w-[90%] mx-auto my-14">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-7">
        <div>
          {badge && (
            <span className="inline-block bg-red-50 text-[#b00015] font-bold text-[1.15rem] uppercase tracking-wider px-3 py-1 rounded-md mb-2">
              {badge}
            </span>
          )}
          <h2 className="text-[2.6rem] md:text-[3.2rem] font-bold text-neutral-900 tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-[1.4rem] text-neutral-500 mt-1">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex items-center gap-4 self-end sm:self-auto">
          {viewAllLink && (
            <Link
              href={viewAllLink}
              className="text-[1.4rem] font-semibold text-[#b00015] hover:text-[#8f0011] transition-colors flex items-center gap-1.5"
            >
              View All <ArrowRight size={16} weight="bold" />
            </Link>
          )}

          {layout === "horizontal" && displayedProducts.length > 3 && (
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => scroll("left")}
                aria-label="Scroll left"
                className="w-10 h-10 rounded-full border border-neutral-300 hover:border-neutral-500 bg-white flex items-center justify-center text-neutral-700 hover:text-black transition-all hover:scale-105 active:scale-95 shadow-sm"
              >
                <ArrowLeft size={16} weight="bold" />
              </button>
              <button
                onClick={() => scroll("right")}
                aria-label="Scroll right"
                className="w-10 h-10 rounded-full border border-neutral-300 hover:border-neutral-500 bg-white flex items-center justify-center text-neutral-700 hover:text-black transition-all hover:scale-105 active:scale-95 shadow-sm"
              >
                <ArrowRight size={16} weight="bold" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Product Shelf / Grid */}
      {layout === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {displayedProducts.map((product) => (
            <DynamicProductCard
              key={product._id || product.variant?._id}
              product={product}
            />
          ))}
        </div>
      ) : (
        <div
          ref={scrollContainerRef}
          className="flex items-stretch gap-6 overflow-x-auto pb-4 pt-1 scrollbar-none snap-x snap-mandatory scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {displayedProducts.map((product) => (
            <div
              key={product._id || product.variant?._id}
              className="w-[260px] sm:w-[280px] md:w-[300px] shrink-0 snap-start flex flex-col"
            >
              <DynamicProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
