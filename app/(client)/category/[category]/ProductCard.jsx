"use client";

import Link from "next/link";

const ProductCard = ({ product }) => {
  return (
    <Link href={`/product/${product.variant._id}`}>
      <div className="border-1 border-neutral-300 hover:border-neutral-500 transition-all duration-200 p-6 bg-white rounded-[.5rem] cursor-pointer hover:shadow-[0_0_.4rem_rgb(210,210,210)]">
        <div className="image h-[11rem] flex justify-center">
          <img
            src={product.variant.images[0]}
            alt="product image"
            className="w-[12rem] h-full object-contain"
          />
        </div>
        <div className=" flex flex-col items-center mt-8">
          <div className=" text-[1.8rem] font-medium text-neutral-700 text-center leading-[2rem]">
            {product.product_title.split(" ").slice(0, 3).join(" ")}
          </div>
          <div className="text-[1.6rem]">{product.brand}</div>
          <div className=" gap-4 text-[1.3rem]  mt-8">
            <div className="offer font-medium text-[1.7rem] ">
              Rs {Number(product.variant.price)}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
