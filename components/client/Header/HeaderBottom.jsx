"use client";

import Link from "next/link";
import { useHeader } from "./useHeader";
import { Spinner } from "phosphor-react";
import { usePathname } from "next/navigation";

export const HeaderBottom = () => {
  const { rootCategories } = useHeader();
  const pathname = usePathname();

  // Check if current path is under a given category id (root or any descendant)
  const isCategoryActive = (root) => {
    if (!pathname.startsWith("/category/")) return false;
    const activeCatId = pathname.split("/category/")[1]?.split("/")[0];
    if (!activeCatId) return false;
    // Match root itself
    if (root._id === activeCatId) return true;
    // Match any subcategory or grandchild
    return (root.subcategories || []).some(
      (sub) =>
        sub._id === activeCatId ||
        (sub.subcategories || []).some((gs) => gs._id === activeCatId)
    );
  };

  return (
    <nav className="hidden lg:block bg-white border-b border-neutral-200 relative text-neutral-800">
      <div className="w-[95%] mx-auto relative">
        {rootCategories ? (
          <div className="flex items-center relative text-[1.4rem] font-bold tracking-wide justify-start gap-0.5">
            {rootCategories.map((root) => {
              const active = isCategoryActive(root);
              return (
                <div className="group static" key={root._id}>
                  <Link href={`/category/${root._id}`}>
                    <div
                      className={`px-5 py-4 cursor-pointer border-b-[2.5px] transition-all duration-200 flex items-center gap-1.5 select-none tracking-wide
                        ${
                          active
                            ? "text-[#b00015] font-extrabold border-[#b00015] bg-red-50/70"
                            : "text-neutral-700 font-bold border-transparent hover:text-[#b00015] hover:border-[#b00015] hover:bg-red-50/40"
                        }`}
                      style={active ? { textShadow: "0 0 12px rgba(176,0,21,0.18)" } : {}}
                    >
                      {root.title}
                      {active && (
                        <span className="ml-1 inline-block w-1.5 h-1.5 rounded-full bg-[#b00015]" />
                      )}
                    </div>
                  </Link>

                  {/* Mega Menu Dropdown */}
                  <div className="hidden group-hover:block absolute left-0 right-0 w-full bg-white border-t border-b border-neutral-200 text-black shadow-2xl z-[200] max-h-[45rem] overflow-y-auto animate-fadeIn py-8 px-12">
                    <div className="grid grid-cols-5 gap-8 max-w-7xl mx-auto">
                      {root.subcategories && root.subcategories.length > 0 ? (
                        root.subcategories.map((sub) => {
                          const subActive = pathname === `/category/${sub._id}`;
                          return (
                            <div key={sub._id} className="flex flex-col gap-3">
                              <Link
                                href={`/category/${sub._id}`}
                                className={`font-bold text-[1.35rem] uppercase tracking-wider pb-1.5 border-b transition-colors
                                  ${
                                    subActive
                                      ? "text-[#b00015] border-[#b00015]/40 underline underline-offset-2"
                                      : "text-[#b00015] border-neutral-100 hover:underline"
                                  }`}
                              >
                                {sub.title}
                              </Link>
                              {sub.subcategories && sub.subcategories.length > 0 && (
                                <div className="flex flex-col gap-2 mt-1">
                                  {sub.subcategories.map((subSub) => {
                                    const gsActive = pathname === `/category/${subSub._id}`;
                                    return (
                                      <Link
                                        key={subSub._id}
                                        href={`/category/${subSub._id}`}
                                        className={`text-[1.3rem] font-medium transition-colors
                                          ${
                                            gsActive
                                              ? "text-[#b00015] font-bold"
                                              : "text-neutral-600 hover:text-black"
                                          }`}
                                      >
                                        {gsActive && <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#b00015] mr-1.5 mb-0.5" />}
                                        {subSub.title}
                                      </Link>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        })
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}
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
