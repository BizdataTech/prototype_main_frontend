"use client";

import Link from "next/link";
import { useHeader } from "./useHeader";
import { Spinner } from "phosphor-react";

export const HeaderBottom = () => {
  const { rootCategories } = useHeader();
  
  return (
    <nav className="bg-white border-b border-neutral-200 relative text-neutral-800">
      <div className="w-[95%] mx-auto relative">
        {rootCategories ? (
          <div className="flex items-center relative text-[1.4rem] font-semibold justify-start gap-1">
            {rootCategories.map((root) => (
              <div
                className="group static"
                key={root._id}
              >
                <Link href={`/category/${root._id}`}>
                  <div className="px-5 py-4 cursor-pointer hover:text-[#b00015] hover:border-b-2 hover:border-[#b00015] border-b-2 border-transparent transition-all flex items-center gap-1 select-none">
                    {root.title}
                  </div>
                </Link>
                
                {/* Meesho-style Full-Width Mega Menu Dropdown */}
                <div className="hidden group-hover:block absolute left-0 right-0 w-full bg-white border-t border-b border-neutral-200 text-black shadow-2xl z-[200] max-h-[45rem] overflow-y-auto animate-fadeIn py-8 px-12">
                  <div className="grid grid-cols-5 gap-8 max-w-7xl mx-auto">
                    {root.subcategories && root.subcategories.length > 0 ? (
                      root.subcategories.map((sub) => (
                        <div key={sub._id} className="flex flex-col gap-3">
                          <Link
                            href={`/category/${sub._id}`}
                            className="font-bold text-[1.35rem] text-[#b00015] hover:underline uppercase tracking-wider pb-1.5 border-b border-neutral-100"
                          >
                            {sub.title}
                          </Link>
                          {sub.subcategories && sub.subcategories.length > 0 && (
                            <div className="flex flex-col gap-2 mt-1">
                              {sub.subcategories.map((subSub) => (
                                <Link
                                  key={subSub._id}
                                  href={`/category/${subSub._id}`}
                                  className="text-[1.3rem] text-neutral-600 hover:text-black font-medium transition-colors"
                                >
                                  {subSub.title}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="col-span-5 text-neutral-500 text-[1.4rem] py-4 text-center font-normal">
                        No subcategories found for {root.title}.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center py-4">
            <span className="text-[1.4rem] mr-2 text-neutral-500">Loading Categories...</span>
            <Spinner className="w-[2rem] h-[2rem] animate-spin text-[#b00015]" />
          </div>
        )}
      </div>
    </nav>
  );
};
