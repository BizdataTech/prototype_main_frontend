"use client";

import { useState } from "react";
import Link from "next/link";
import { useHeader } from "@/components/client/Header/useHeader";
import {
  CaretDown,
  CaretRight,
  House,
  Package,
  ListBullets,
  FolderSimple,
} from "phosphor-react";

export const ProductNavSidebar = () => {
  const { rootCategories } = useHeader();
  const [expanded, setExpanded] = useState({});
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggle = (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <aside className="w-full md:w-[260px] lg:w-[280px] shrink-0">
      {/* Mobile Toggle Button */}
      <div className="md:hidden mb-4">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="w-full flex items-center justify-between bg-white border border-neutral-200 px-4 py-3 rounded-xl font-semibold text-[1.4rem] text-neutral-800 shadow-sm"
        >
          <span className="flex items-center gap-2">
            <ListBullets size={20} className="text-[#b00015]" />
            Navbar Categories & Menu
          </span>
          <CaretDown
            size={18}
            className={`transition-transform duration-200 ${mobileMenuOpen ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {/* Sidebar Navigation Box */}
      <div
        className={`bg-white border border-neutral-200/90 rounded-2xl shadow-sm p-4 text-neutral-800 transition-all duration-300 ${
          mobileMenuOpen ? "block mb-6" : "hidden md:block"
        }`}
      >
        {/* Navigation Header */}
        <div className="flex items-center gap-2 font-bold text-[1.5rem] text-[#b00015] pb-3 mb-3 border-b border-neutral-200">
          <ListBullets size={20} weight="bold" />
          <span>Navbar Categories</span>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col gap-1 mb-4 pb-3 border-b border-neutral-100">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-[1.35rem] font-medium text-neutral-700 hover:bg-neutral-100 hover:text-black transition-colors"
          >
            <House size={18} className="text-neutral-500" />
            <span>Home</span>
          </Link>
          <Link
            href="/products"
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-[1.35rem] font-medium text-neutral-700 hover:bg-neutral-100 hover:text-black transition-colors"
          >
            <Package size={18} className="text-neutral-500" />
            <span>All Products</span>
          </Link>
        </div>

        {/* Categories List (Full Navbar Menu List) */}
        {!rootCategories ? (
          <div className="flex flex-col gap-2 py-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-8 bg-neutral-100 animate-pulse rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-1 max-h-[50rem] overflow-y-auto pr-1">
            {rootCategories.map((root) => {
              const hasSubs = root.subcategories && root.subcategories.length > 0;
              const isExpanded = expanded[root._id] !== undefined ? expanded[root._id] : true; // Default expanded for main categories

              return (
                <div key={root._id} className="flex flex-col mb-1">
                  {/* Root Category Row */}
                  <div className="flex items-center justify-between rounded-xl hover:bg-neutral-100/80 transition-colors group">
                    <Link
                      href={`/category/${root._id}`}
                      className="flex-1 flex items-center gap-2 px-3 py-2 text-[1.35rem] font-bold text-neutral-800 group-hover:text-[#b00015] transition-colors truncate"
                    >
                      <FolderSimple size={16} className="text-neutral-500 group-hover:text-[#b00015] shrink-0" />
                      <span className="truncate">{root.title}</span>
                    </Link>
                    {hasSubs && (
                      <button
                        onClick={(e) => toggle(root._id, e)}
                        className="p-2 text-neutral-400 hover:text-neutral-800 transition-colors"
                        title="Toggle subcategories"
                      >
                        {isExpanded ? <CaretDown size={14} weight="bold" /> : <CaretRight size={14} weight="bold" />}
                      </button>
                    )}
                  </div>

                  {/* Level 2 Subcategories */}
                  {hasSubs && isExpanded && (
                    <div className="ml-4 pl-3 border-l-2 border-[#b00015]/30 flex flex-col gap-1 my-1">
                      {root.subcategories.map((sub) => {
                        const hasSubSubs = sub.subcategories && sub.subcategories.length > 0;
                        const isSubExpanded = !!expanded[sub._id];

                        return (
                          <div key={sub._id} className="flex flex-col">
                            <div className="flex items-center justify-between rounded-lg hover:bg-neutral-100/60 transition-colors group/sub">
                              <Link
                                href={`/category/${sub._id}`}
                                className="flex-1 px-2 py-1.5 text-[1.3rem] font-semibold text-[#b00015] hover:underline truncate"
                              >
                                {sub.title}
                              </Link>
                              {hasSubSubs && (
                                <button
                                  onClick={(e) => toggle(sub._id, e)}
                                  className="p-1 text-neutral-400 hover:text-neutral-700 transition-colors"
                                >
                                  {isSubExpanded ? <CaretDown size={12} weight="bold" /> : <CaretRight size={12} weight="bold" />}
                                </button>
                              )}
                            </div>

                            {/* Level 3 Sub-subcategories */}
                            {hasSubSubs && isSubExpanded && (
                              <div className="ml-3 pl-2 border-l border-neutral-200 flex flex-col gap-1 my-1">
                                {sub.subcategories.map((subSub) => (
                                  <Link
                                    key={subSub._id}
                                    href={`/category/${subSub._id}`}
                                    className="px-2 py-1 text-[1.2rem] text-neutral-600 hover:text-black font-medium transition-colors truncate"
                                  >
                                    {subSub.title}
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
};
