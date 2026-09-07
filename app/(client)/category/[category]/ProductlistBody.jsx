"use client";

import DynamicProductCard from "@/components/client/Home/DynamicProductCard";

const ProductlistBody = ({ query, products = [], categoryObject }) => {
  return (
    <div className="flex-1 w-full">
      {/* Category Header Card */}
      <div className="bg-white p-6 md:p-8 rounded-2xl border border-neutral-200/80 shadow-sm mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[2.4rem] md:text-[3rem] font-extrabold text-neutral-900 tracking-tight">
            {categoryObject?.title || (query ? `Search Results for: "${query}"` : "Category Products")}
          </h1>
          {categoryObject?.description ? (
            <p className="text-[1.35rem] text-neutral-500 mt-1 max-w-2xl leading-relaxed">
              {categoryObject.description}
            </p>
          ) : (
            <p className="text-[1.3rem] text-neutral-400 mt-1">
              High-quality building materials & supplies directly from our catalog
            </p>
          )}
        </div>
        <div className="bg-red-50 text-[#b00015] px-4 py-2 rounded-xl text-[1.3rem] font-bold self-start sm:self-auto shrink-0 border border-red-100/60 shadow-sm">
          {products.length} {products.length === 1 ? "Product" : "Products"} Found
        </div>
      </div>

      {/* Products Grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <DynamicProductCard
              key={product.variant?._id || product._id || index}
              product={product}
            />
          ))}
        </div>
      ) : (
        <div className="my-8 text-center bg-white p-12 rounded-3xl border border-neutral-200 shadow-sm">
          <span className="text-[4.5rem] block mb-3">📦</span>
          <h3 className="text-[2.2rem] font-bold text-neutral-800">
            No products found
          </h3>
          <p className="text-[1.4rem] text-neutral-500 mt-2 max-w-md mx-auto">
            There are currently no products available for this selection. Check back soon or explore other categories.
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductlistBody;
