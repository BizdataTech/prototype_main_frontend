"use client";

import { X, CaretRight } from "phosphor-react";
import Link from "next/link";
import { useHeader } from "./useHeader";
import { useState } from "react";
import { usePathname } from "next/navigation";

const MobileMenuDrawer = ({ isOpen, onClose }) => {
  const { rootCategories } = useHeader();
  const pathname = usePathname();
  const [expandedCats, setExpandedCats] = useState({});

  if (!isOpen) return null;

  const toggleCat = (id) => {
    setExpandedCats((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="fixed inset-0 z-[200] overflow-hidden lg:hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="absolute inset-y-0 left-0 flex max-w-full">
        <div className="w-[30rem] max-w-[85vw] transform bg-white shadow-2xl transition-all duration-300 flex flex-col h-full animate-fadeIn">
          
          {/* Header */}
          <div className="px-6 py-6 border-b border-neutral-200 flex items-center justify-between bg-white">
            <h2 className="text-[1.6rem] font-bold text-black tracking-wide">
              Menu
            </h2>
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-black transition-colors p-2"
            >
              <X size={24} weight="bold" />
            </button>
          </div>

          {/* Categories List */}
          <div className="flex-1 overflow-y-auto bg-white py-4">
            {rootCategories && rootCategories.length > 0 ? (
              <div className="flex flex-col">
                {rootCategories.map((root) => {
                  const isExpanded = expandedCats[root._id];
                  const hasSub = root.subcategories && root.subcategories.length > 0;
                  
                  return (
                    <div key={root._id} className="border-b border-neutral-100 last:border-0">
                      <div className="flex items-center justify-between px-6 py-4">
                        <Link 
                          href={`/category/${root._id}`} 
                          onClick={onClose}
                          className="flex-1 text-[1.4rem] font-bold text-neutral-800 uppercase"
                        >
                          {root.title}
                        </Link>
                        {hasSub && (
                          <button 
                            onClick={() => toggleCat(root._id)}
                            className="p-2 -mr-2 text-neutral-500 hover:text-black"
                          >
                            <CaretRight 
                              size={20} 
                              weight="bold" 
                              className={`transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
                            />
                          </button>
                        )}
                      </div>
                      
                      {/* Subcategories */}
                      {hasSub && isExpanded && (
                        <div className="bg-neutral-50 px-6 py-2 pb-4">
                          {root.subcategories.map((sub) => (
                            <div key={sub._id} className="mt-3">
                              <Link
                                href={`/category/${sub._id}`}
                                onClick={onClose}
                                className="text-[1.3rem] font-bold text-[#b00015] block mb-2"
                              >
                                {sub.title}
                              </Link>
                              
                              {sub.subcategories && sub.subcategories.length > 0 && (
                                <div className="flex flex-col gap-2 pl-4 border-l-2 border-neutral-200 mt-2">
                                  {sub.subcategories.map((subSub) => (
                                    <Link
                                      key={subSub._id}
                                      href={`/category/${subSub._id}`}
                                      onClick={onClose}
                                      className="text-[1.25rem] text-neutral-600 hover:text-black py-1"
                                    >
                                      {subSub.title}
                                    </Link>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-6 text-[1.4rem] text-neutral-500 text-center">
                Loading categories...
              </div>
            )}
          </div>

          {/* Footer Area / Links */}
          <div className="border-t border-neutral-200 p-6 bg-neutral-50">
            <Link 
              href="/register/sign-in" 
              onClick={onClose}
              className="block w-full bg-[#b00015] text-white text-center text-[1.4rem] font-bold py-3 rounded-full hover:bg-red-800 transition-colors"
            >
              Sign In / Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenuDrawer;
