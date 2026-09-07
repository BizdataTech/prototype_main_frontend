"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import HomeBannerSection from "./homebanner/Section";
import ProductListingSection from "./product-listing/Section";

const SectionManagementContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const editId = searchParams.get("edit");
  const editType = searchParams.get("type");

  const isEditMode = !!editId;

  // If editing, derive default section type from the edit param
  const defaultType = editType === "hero_banner"
    ? "home_banner"
    : editType === "mid_page_banner"
    ? "mid_page_banner"
    : editType === "product_listing"
    ? "product_listing"
    : "home_banner";

  const [sectionType, setSectionType] = useState(defaultType);

  return (
    <main className="a-section--box flex flex-col gap-6 text-[1.4rem]">
      <div className="flex items-center justify-between">
        <h1 className="a-section--title">
          {isEditMode ? "✏️ Edit Section" : "➕ Add New Section"}
        </h1>
        {isEditMode && (
          <button
            onClick={() => router.push("/admin/home-layout")}
            className="a-text--button border border-neutral-300 text-neutral-600 hover:bg-neutral-100 cursor-pointer"
          >
            ← Back
          </button>
        )}
      </div>

      {/* Section Type Selection — only shown when creating new */}
      {!isEditMode && (
        <div className="flex flex-col gap-2">
          <div className="font-medium text-neutral-700">Select Section Type</div>
          <div className="flex items-center gap-8 flex-wrap">
            {[
              { value: "home_banner", label: "🏠 Hero Banner" },
              { value: "mid_page_banner", label: "🖼️ Promotional Banner" },
              { value: "product_listing", label: "📦 Product Listing" },
            ].map(({ value, label }) => (
              <label key={value} className={`flex items-center gap-2 cursor-pointer px-4 py-2 rounded-xl border transition-colors ${sectionType === value ? "bg-black text-white border-black" : "bg-white border-neutral-300 hover:border-neutral-400"}`}>
                <input
                  type="radio"
                  name="section_type"
                  checked={sectionType === value}
                  onChange={() => setSectionType(value)}
                  className="hidden"
                />
                {label}
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Render appropriate form */}
      <div className="border-t border-neutral-200 pt-6">
        {isEditMode ? (
          <>
            {editType === "hero_banner" && (
              <HomeBannerSection sectionTypeParam="hero_banner" editId={editId} />
            )}
            {editType === "mid_page_banner" && (
              <HomeBannerSection sectionTypeParam="mid_page_banner" editId={editId} />
            )}
            {editType === "product_listing" && (
              <ProductListingSection editId={editId} />
            )}
          </>
        ) : (
          <>
            {sectionType === "home_banner" && (
              <HomeBannerSection sectionTypeParam="hero_banner" editId={null} />
            )}
            {sectionType === "mid_page_banner" && (
              <HomeBannerSection sectionTypeParam="mid_page_banner" editId={null} />
            )}
            {sectionType === "product_listing" && (
              <ProductListingSection editId={null} />
            )}
          </>
        )}
      </div>
    </main>
  );
};

export default function SectionManagement() {
  return (
    <Suspense fallback={<div className="a-section--box animate-pulse h-[40rem]" />}>
      <SectionManagementContent />
    </Suspense>
  );
}
