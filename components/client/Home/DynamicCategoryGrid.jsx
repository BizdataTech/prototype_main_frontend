"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { ArrowRight, SquaresFour } from "phosphor-react";

// Fallback high-quality representative images for building material categories if category.image is blank
const categoryImageMap = {
  "acrylic-sheets": "https://res.cloudinary.com/do0hja6ug/image/upload/v1788417093/prototype_products/hm3qf68kbaxa3dk6ps5w.jpg",
  "acp-sheets": "https://res.cloudinary.com/do0hja6ug/image/upload/v1788432934/prototype_products/uig5r0uxvrvojb1stfjk.jpg",
  "solid-colors-acp-sheets": "https://res.cloudinary.com/do0hja6ug/image/upload/v1788435028/prototype_products/vz8kngmbrmpthpcadj3m.jpg",
  "power-tools": "https://res.cloudinary.com/do0hja6ug/image/upload/v1788604691/prototype_products/j9gyyqvewdux0quzlhxs.jpg",
  "hand-tools": "https://res.cloudinary.com/do0hja6ug/image/upload/v1788501223/prototype_products/u28ic0ccgtg0svw3xzow.jpg",
  "safety-equipment": "https://res.cloudinary.com/do0hja6ug/image/upload/v1788606745/prototype_products/v1wviydedkoiwlzkioo1.jpg",
  "bathware": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80",
  "polycarbonate-sheets": "https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?auto=format&fit=crop&w=600&q=80",
};

export default function DynamicCategoryGrid() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    let isCancelled = false;
    const loadCategories = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/auto-categories?filter=all`);
        const cats = res.data?.categories || [];
        // Filter out deleted or level > 1 if subcategories exist
        const rootCats = cats.filter((c) => !c.isDeleted && (!c.parent || c.level === 1));
        if (!isCancelled) {
          setCategories(rootCats);
        }
      } catch (err) {
        console.error("Failed to load categories:", err.message);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    };
    loadCategories();
    return () => {
      isCancelled = true;
    };
  }, [BACKEND_URL]);

  if (loading) {
    return (
      <section className="w-[95%] md:w-[90%] mx-auto my-12">
        <div className="flex items-center justify-between mb-8">
          <div className="h-8 bg-neutral-200 rounded-lg w-48 animate-pulse" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-44 bg-neutral-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  if (!categories.length) return null;

  return (
    <section className="w-[95%] md:w-[90%] mx-auto my-14">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 text-[#b00015] font-bold text-[1.2rem] uppercase tracking-widest mb-1">
            <SquaresFour size={18} weight="bold" />
            <span>Product Catalog</span>
          </div>
          <h2 className="text-[2.6rem] md:text-[3.2rem] font-bold text-neutral-900 tracking-tight">
            Featured Categories
          </h2>
        </div>
        <Link
          href="/products"
          className="flex items-center gap-2 text-[1.4rem] font-semibold text-[#b00015] hover:text-[#8f0011] transition-colors"
        >
          View All <ArrowRight size={16} weight="bold" />
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
        {categories.slice(0, 12).map((category) => {
          const slugKey = category.slug || "";
          const catImg =
            category.image?.trim() ||
            categoryImageMap[slugKey] ||
            categoryImageMap[category.title?.toLowerCase().replace(/\s+/g, "-")] ||
            "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=400&q=80";

          return (
            <Link
              key={category._id}
              href={`/category/${category.slug || category._id}`}
              className="group flex flex-col bg-white rounded-2xl p-4 border border-neutral-200/90 hover:border-[#b00015]/40 hover:shadow-[0_8px_25px_rgba(176,0,21,0.08)] transition-all duration-300 text-center"
            >
              <div className="w-full aspect-square rounded-xl bg-neutral-50 overflow-hidden flex items-center justify-center p-3 mb-3 group-hover:bg-red-50/30 transition-colors">
                <img
                  src={catImg}
                  alt={category.title}
                  className="w-full h-full object-contain mix-blend-multiply group-hover:scale-108 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <h3 className="text-[1.4rem] font-bold text-neutral-800 group-hover:text-[#b00015] transition-colors line-clamp-1">
                {category.title}
              </h3>
              <span className="text-[1.15rem] text-neutral-400 font-medium mt-1">
                Explore Range →
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
