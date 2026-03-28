"use client";

import { useState } from "react";
import HomeBannerSection from "./homebanner/Section";

const SectionManagement = () => {
  const [sectionType, setSectionType] = useState("home_banner");
  return (
    <main className="a-section--box flex flex-col gap-4 text-[1.4rem]">
      <div className="flex flex-col gap-1">
        <div>Section Type</div>
        <div className="flex items-center gap-12">
          <div className="flex items-center gap-4">
            <input
              type="radio"
              name="section_type"
              id="home_banner"
              checked={sectionType === "home_banner"}
            />
            <label htmlFor="home_banner">Home Banner</label>
          </div>
          <div className="flex items-center gap-4">
            <input
              type="radio"
              name="section_type"
              id="mid_page_banner"
              checked={sectionType === "mid_page_banner"}
            />
            <label htmlFor="mid_page_banner">Mid Page Banner</label>
          </div>
          <div className="flex items-center gap-4">
            <input
              type="radio"
              name="section_type"
              id="product_listing"
              checked={sectionType === "product_listing"}
            />
            <label htmlFor="product_listing">Product Listing</label>
          </div>
        </div>
      </div>
      {sectionType === "home_banner" && <HomeBannerSection />}
    </main>
  );
};

export default SectionManagement;
