"use client";

import { useState } from "react";
import Link from "next/link";
import { useHeader } from "@/components/client/Header/useHeader";
import {
  CaretDown,
  CaretRight,
  FolderSimple,
  ListBullets,
  Funnel,
} from "phosphor-react";

const ProductlistSidebar = ({ sidebar = [], filterProducts }) => {
  const { rootCategories } = useHeader();
  const [expanded, setExpanded] = useState({});

  const toggle = (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="w-full md:w-[260px] lg:w-[280px] bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-sm space-y-6 md:sticky md:top-[11rem] self-start shrink-0 text-neutral-800">
      {/* Category Navigation List */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 font-bold text-[1.5rem] text-[#b00015] pb-3 mb-2 border-b border-neutral-100">
          <ListBullets size={20} weight="bold" />
          <span>Categories</span>
        </div>

        {!rootCategories ? (
          <div className="flex flex-col gap-2 py-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-7 bg-neutral-100 animate-pulse rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-1 max-h-[35rem] overflow-y-auto pr-1">
            {rootCategories.map((root) => {
              const hasSubs = root.subcategories && root.subcategories.length > 0;
              const isExpanded = expanded[root._id] !== undefined ? expanded[root._id] : true;

              return (
                <div key={root._id} className="flex flex-col mb-1">
                  <div className="flex items-center justify-between rounded-xl hover:bg-neutral-100/80 transition-colors group">
                    <Link
                      href={`/category/${root._id}`}
                      className="flex-1 flex items-center gap-2 px-2.5 py-1.5 text-[1.3rem] font-bold text-neutral-800 group-hover:text-[#b00015] transition-colors truncate"
                    >
                      <FolderSimple size={15} className="text-neutral-400 group-hover:text-[#b00015] shrink-0" />
                      <span className="truncate">{root.title}</span>
                    </Link>
                    {hasSubs && (
                      <button
                        onClick={(e) => toggle(root._id, e)}
                        className="p-1.5 text-neutral-400 hover:text-neutral-800 transition-colors"
                        title="Toggle subcategories"
                      >
                        {isExpanded ? <CaretDown size={13} weight="bold" /> : <CaretRight size={13} weight="bold" />}
                      </button>
                    )}
                  </div>

                  {/* Level 2 Subcategories */}
                  {hasSubs && isExpanded && (
                    <div className="ml-3.5 pl-2.5 border-l-2 border-[#b00015]/30 flex flex-col gap-1 my-1">
                      {root.subcategories.map((sub) => {
                        const hasSubSubs = sub.subcategories && sub.subcategories.length > 0;
                        const isSubExpanded = !!expanded[sub._id];

                        return (
                          <div key={sub._id} className="flex flex-col">
                            <div className="flex items-center justify-between rounded-lg hover:bg-neutral-100/60 transition-colors group/sub">
                              <Link
                                href={`/category/${sub._id}`}
                                className="flex-1 px-2 py-1 text-[1.25rem] font-semibold text-[#b00015] hover:underline truncate"
                              >
                                {sub.title}
                              </Link>
                              {hasSubSubs && (
                                <button
                                  onClick={(e) => toggle(sub._id, e)}
                                  className="p-1 text-neutral-400 hover:text-neutral-700 transition-colors"
                                >
                                  {isSubExpanded ? <CaretDown size={11} weight="bold" /> : <CaretRight size={11} weight="bold" />}
                                </button>
                              )}
                            </div>

                            {/* Level 3 Sub-subcategories */}
                            {hasSubSubs && isSubExpanded && (
                              <div className="ml-2.5 pl-2 border-l border-neutral-200 flex flex-col gap-1 my-1">
                                {sub.subcategories.map((subSub) => (
                                  <Link
                                    key={subSub._id}
                                    href={`/category/${subSub._id}`}
                                    className="px-2 py-0.5 text-[1.2rem] text-neutral-600 hover:text-black font-medium transition-colors truncate"
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

      {/* Brand & Attribute Filters Section */}
      {sidebar && sidebar.length > 0 && sidebar.some(s => s.data && s.data.length > 0) && (
        <div className="pt-4 border-t border-neutral-200 flex flex-col gap-4">
          <div className="flex items-center gap-2 font-bold text-[1.4rem] text-neutral-800">
            <Funnel size={16} className="text-neutral-600" />
            <span>Filter By</span>
          </div>

          {sidebar.map((content, index) => {
            if (content.data && content.data.length > 0) {
              return (
                <div key={content.label || index} className="flex flex-col gap-2">
                  <h3 className="text-[1.35rem] capitalize font-semibold text-neutral-700">
                    {content.head}
                  </h3>
                  <ul className="flex flex-col gap-1.5 max-h-[20rem] overflow-y-auto">
                    {content.data.map((d, dIdx) => (
                      <li key={dIdx} className="list-none">
                        <label className="flex gap-2.5 items-center cursor-pointer hover:text-black transition-colors">
                          <input
                            name={content.label}
                            type="checkbox"
                            onChange={filterProducts}
                            value={d}
                            className="w-4 h-4 rounded border-neutral-300 text-[#b00015] focus:ring-[#b00015]"
                          />
                          <span className="text-[1.3rem] text-neutral-600 font-medium select-none truncate">
                            {d}
                          </span>
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            }
            return null;
          })}
        </div>
      )}
    </div>
  );
};

export default ProductlistSidebar;
