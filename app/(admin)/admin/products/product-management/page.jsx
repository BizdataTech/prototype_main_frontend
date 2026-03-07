"use client";

import { useState } from "react";
import { Spinner } from "phosphor-react";
import useProducts from "../useProducts";
import CategoryList from "./CategoryList";
import { InputLabel } from "@/components/admin/InputLabel";
import Images from "./Images";

const ProductManagement = () => {
  const {
    data,
    categories,
    brands,
    selectedCategory,
    selectedBrand,
    handleBrand,
    handleCategory,
    images,
    handleImages,
    createProduct,
    apiLoading,
    errors,
  } = useProducts();

  let { generalData, adminFields, handleInput } = data;
  const levelCategories = categories.filter((category) => category.level === 1);
  const [isOpen, setIsOpen] = useState(false);
  const [brandOpen, setBrandOpen] = useState(false);

  const handleIsOpen = () => {
    setIsOpen(!isOpen);
  };

  const utilObject = {
    categories: levelCategories,
    handleCategory,
    handleIsOpen,
  };

  const image_util = {
    images,
    handleImages,
  };

  return (
    <section className="flex gap-6 mb-8 pb-[7rem]">
      <div className="w-full flex flex-col gap-6">
        <div className="a-section--box flex flex-col gap-2">
          <div className="flex gap-4 items-center">
            <div className="space-y-2 w-full">
              <InputLabel label="Title" error={errors.product_title} />
              <input
                type="text"
                name="product_title"
                placeholder="Eg: PM25 CABIN AIR FILTER BREZZA/S-CR"
                className="a-input"
                value={generalData?.product_title}
                onChange={handleInput}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="w-full space-y-2">
              <InputLabel label="Brand" error={errors.brand} />
              <div className="relative z-10">
                <div
                  className="a-input cursor-pointer"
                  onClick={() => setBrandOpen(!brandOpen)}
                >
                  {selectedBrand ? selectedBrand.brand_name : "Select Brand"}
                </div>
                {brandOpen && (
                  <div className="absolute w-full shadow-sm bg-white p-4">
                    {brands.map((brand) => (
                      <div
                        key={brand._id}
                        className="p-2 text-[1.4rem] hover:bg-neutral-100 rounded-[.2rem] cursor-pointer"
                        onClick={() => {
                          handleBrand(brand);
                          setBrandOpen(false);
                        }}
                      >
                        {brand.brand_name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="w-full space-y-2">
              {/* label */}
              <InputLabel label="Category" error={errors.category} />
              {/* input field */}
              <div className="relative">
                <div className="a-input cursor-pointer" onClick={handleIsOpen}>
                  {selectedCategory
                    ? selectedCategory.title
                    : "Select Category"}
                </div>
                {isOpen && <CategoryList utils={utilObject} />}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-full flex flex-col gap-2">
              <InputLabel label="Part Number" error={errors.part_number} />
              <input
                name="part_number"
                type="text"
                className="a-input uppercase"
                placeholder="Eg: 72180TM0T51"
                value={adminFields?.part_number}
                onChange={handleInput}
              />
            </div>
            <div className="w-full flex flex-col gap-2">
              <InputLabel label="OEM Reference" error={errors.oem_number} />
              <input
                name="oem_number"
                type="text"
                className="a-input uppercase"
                placeholder="Eg: 0242236566"
                value={adminFields?.oem_number}
                onChange={handleInput}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2">
            <div className="w-full flex flex-col gap-2">
              <InputLabel label="Price" error={errors.price} />
              <div className="relative z-0">
                <input
                  type="number"
                  name="price"
                  className="a-input !pl-10"
                  value={generalData?.price.toLocaleString("en-IN")}
                  onChange={handleInput}
                />
                <div className="absolute text-[1.5rem] left-4 top-[50%] -translate-y-[50%]">
                  &#8377;
                </div>
              </div>
            </div>
            <div className="w-full flex flex-col gap-2">
              <InputLabel label="Stock" error={errors.stock} />
              <input
                type="number"
                name="stock"
                className="a-input"
                placeholder="Eg: 2"
                value={generalData?.stock.toLocaleString("en-IN")}
                onChange={handleInput}
              />
            </div>
          </div>

          <div className="space-y-2">
            <InputLabel label="Description" error={errors.description} />
            <textarea
              name="description"
              placeholder="Eg: A premium Android smartphone with AMOLED display..."
              rows={6}
              className="a-input"
              value={generalData?.description}
              onChange={handleInput}
            />
          </div>
        </div>
        <Images utility_object={image_util} error={errors.images} />
        <button
          className="a-text--button self-end bg-black text-white !px-[4rem] !py-[1rem] !text-[1.4rem] mt-[2rem]"
          onClick={createProduct}
        >
          {apiLoading ? (
            <div className="flex items-center gap-2">
              <div>Creating Product</div>
              <Spinner className="w-[2rem] h-[2rem] animate-spin" />
            </div>
          ) : (
            "Create this product"
          )}
        </button>
      </div>
    </section>
  );
};

export default ProductManagement;
