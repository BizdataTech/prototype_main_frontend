"use client";

import Link from "next/link";
import { ArrowRight } from "phosphor-react";

const categories = [
  {
    id: 1,
    name: "Acrylic & Polycarbonate",
    slug: "acrylic-polycarbonate-sheets",
    image: "https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?auto=format&fit=crop&w=400&q=80",
    description: "Durable sheets for roofing and roofing",
  },
  {
    id: 2,
    name: "ACP Sheets",
    slug: "acp-sheets",
    image: "https://images.unsplash.com/photo-1541888086925-eb3225f6c747?auto=format&fit=crop&w=400&q=80",
    description: "Premium aluminum composite panels",
  },
  {
    id: 3,
    name: "Power Tools",
    slug: "power-tools",
    image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=400&q=80",
    description: "Professional grade drilling and cutting",
  },
  {
    id: 4,
    name: "Safety Equipment",
    slug: "safety-equipment",
    image: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=400&q=80",
    description: "Helmets, gloves, and protective gear",
  },
  {
    id: 5,
    name: "Hand Tools",
    slug: "hand-tools",
    image: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=400&q=80",
    description: "Essential tools for every project",
  },
  {
    id: 6,
    name: "Bathware",
    slug: "bathware",
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=400&q=80",
    description: "Modern bathroom fittings & sanitaryware",
  },
];

const CategoryGrid = () => {
  return (
    <section className="w-[95%] md:w-[90%] mx-auto my-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-[2.8rem] font-bold text-neutral-800 tracking-tight">
            Shop by Category
          </h2>
          <p className="text-[1.5rem] text-neutral-500 mt-2">
            Premium materials for your next project
          </p>
        </div>
        <Link
          href="/products"
          className="hidden md:flex items-center gap-2 text-[1.4rem] font-semibold text-orange-600 hover:text-orange-700 transition-colors"
        >
          View All Categories <ArrowRight size={16} weight="bold" />
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/category/${category.slug}`}
            className="group block relative overflow-hidden rounded-2xl bg-white border border-neutral-200 hover:border-orange-300 hover:shadow-lg transition-all duration-300"
          >
            <div className="aspect-square w-full overflow-hidden bg-neutral-100 p-4">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-5 text-center">
              <h3 className="text-[1.5rem] font-semibold text-neutral-800 group-hover:text-orange-600 transition-colors">
                {category.name}
              </h3>
            </div>
          </Link>
        ))}
      </div>
      
      <div className="mt-8 text-center md:hidden">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-[1.4rem] font-semibold text-orange-600 hover:text-orange-700 transition-colors"
        >
          View All Categories <ArrowRight size={16} weight="bold" />
        </Link>
      </div>
    </section>
  );
};

export default CategoryGrid;
