"use client";

import { Details } from "./Details";
import { ImageGrid } from "./ImageGrid";
import { ProductNavSidebar } from "./ProductNavSidebar";
import { useProduct } from "./useProduct";

const Productpage = () => {
  const { product, addProducttoCart } = useProduct();
  const productConfig = { product, addProducttoCart };

  return product ? (
    <div className="w-[95%] mx-auto pt-[15rem] pb-12">
      <div className="flex flex-col md:flex-row items-start gap-6">
        {/* Left Side Navbar Menu */}
        <ProductNavSidebar />

        {/* Product Details Container */}
        <div className="flex-1 w-full flex flex-col md:flex-row gap-6 bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-sm">
          <ImageGrid images={product?.images} />
          <Details config={productConfig} />
        </div>
      </div>
    </div>
  ) : (
    <div className="w-[95%] mx-auto flex flex-col md:flex-row gap-6 pt-[15rem] pb-12">
      <div className="w-full md:w-[270px] shrink-0">
        <div className="shimmer h-[40rem] rounded-2xl"></div>
      </div>
      <div className="flex-1 flex flex-col md:flex-row gap-6">
        <div className="shimmer w-full md:w-1/2 h-[30rem] md:h-[50rem] rounded-2xl"></div>
        <div className="w-full md:w-1/2 space-y-3">
          <div className="shimmer w-full h-[5rem] rounded-xl"></div>
          <div className="shimmer w-[60%] md:w-[30%] h-[2rem] rounded-lg"></div>
          <div className="shimmer w-[40%] my-[3rem] h-[3rem] rounded-xl"></div>
          <div className="shimmer h-[20rem] rounded-2xl"></div>
        </div>
      </div>
    </div>
  );
};

export default Productpage;
