"use client";

import SearchSection from "@/components/admin/SearchSections";
import BrandForm from "./BrandForm";
import useBrand from "./useBrand";
import TableLoadingRow from "@/components/admin/LoadingRow";
import TableEmptyRow from "@/components/admin/TableEmptyRow";
import { useState } from "react";
import { createPortal } from "react-dom";
import Brand from "./Brand";

const Brands = () => {
  const { brands, refetch } = useBrand();
  const [box, setBox] = useState(false);

  return (
    <main className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <SearchSection placeholder={"Search for Brands"} />
        <button
          className="a-text--button bg-black text-white"
          onClick={() => setBox(true)}
        >
          Create New Brand
        </button>
      </div>
      <div className="a-section--box text-[1.4rem] !p-0">
        <div className="grid grid-cols-5">
          {["Sl No", "Brand Name", "Logo", "Created At", "Options"].map(
            (item, i) => (
              <div key={i} className="font-medium last:text-end p-4">
                {item}
              </div>
            ),
          )}
        </div>
        {brands === null && <TableLoadingRow />}
        {brands && !brands.length && (
          <TableEmptyRow message={"No Result Found"} />
        )}

        {brands &&
          brands.length >= 1 &&
          brands.map((brand, i) => (
            <Brand brand={brand} key={brand._id} slno={i + 1} />
          ))}
      </div>
      {box &&
        createPortal(
          <div className="fixed inset-0 bg-black/30 z-100 flex items-center justify-center">
            <BrandForm refetch={refetch} close={() => setBox(false)} />
          </div>,
          document.body,
        )}
    </main>
  );
};

export default Brands;
