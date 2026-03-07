"use client";

import BrandCreation from "./BrandCreation";
import BrandList from "./BrandList";
import useBrand from "./useBrand";

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
    <main className="flex gap-6">
      <BrandList brands={brands} />
      <BrandCreation utils={creation_utils} />
    </main>
  );
};

export default Brands;
