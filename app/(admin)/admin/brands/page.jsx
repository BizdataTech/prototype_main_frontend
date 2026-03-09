"use client";

import SearchSection from "@/components/admin/SearchSections";
import BrandCreation from "./BrandCreation";
import useBrand from "./useBrand";
import TableLoadingRow from "@/components/admin/LoadingRow";
import TableEmptyRow from "@/components/admin/TableEmptyRow";

const Brands = () => {
  const {
    status,
    brandName,
    handleBrandName,
    fileInputRef,
    openSystemFiles,
    handleFileChange,
    previewURL,
    submitBrand,
    errors,
    brands,
  } = useBrand();

  let creation_utils = {
    status,
    brandName,
    handleBrandName,
    fileInputRef,
    openSystemFiles,
    handleFileChange,
    previewURL,
    submitBrand,
    errors,
  };

  return (
    <main className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <SearchSection placeholder={"Search for Brands"} />
        <button className="a-text--button bg-black text-white">
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
        {brands && brands.length >= 1 && <div></div>}
      </div>
    </main>
  );
};

export default Brands;
