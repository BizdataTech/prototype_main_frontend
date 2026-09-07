"use client";

import { useContext } from "react";
import { WishlistContext } from "@/context/wishlistContext";
import { CartContext } from "@/context/cartContext";
import { useRouter } from "next/navigation";

export const Details = ({ config }) => {
  let { product, addProducttoCart } = config;
  let { sections } = product.parent;

  const { addToWishlist, removeFromWishlist, isInWishlist } =
    useContext(WishlistContext);
  const inWishlist = isInWishlist(product?._id);
  
  const { items } = useContext(CartContext);
  const router = useRouter();
  const inCart = items.some(item => item.productId?._id === product?._id || item.productId === product?._id);

  const handleWishlistToggle = () => {
    if (inWishlist) {
      router.push("/wishlist");
    } else {
      addToWishlist(product?._id);
    }
  };

  return (
    <div className="w-full md:w-3/6 space-y-6">
      <section className="bg-white p-6 flex flex-col gap-4">
        <div className="space-y-2">
          <h1 className="text-[2.2rem] font-medium leading-[3rem]">
            {product?.parent?.product_title}
          </h1>
          </div>

        <div className="flex gap-6">
          <p className="text-[3rem] font-medium">₹{product.price}</p>
        </div>

        <div className="space-y-[.5rem] mt-8 text-[1.6rem]">
          <div className="font-medium">Product Description</div>
          <div 
            className="whitespace-pre-wrap text-neutral-600 leading-relaxed" 
            dangerouslySetInnerHTML={{ __html: product?.parent?.description }} 
          />
        </div>
      </section>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 bg-white p-4">
        <button
          className={`button border cursor-pointer transition-colors ${
            inWishlist
              ? "bg-red-50 border-red-400 text-red-600"
              : "border-neutral-900 text-neutral-900 bg-white"
          }`}
          onClick={handleWishlistToggle}
        >
          {inWishlist ? "View Wishlist ♥" : "Add to Wishlist"}
        </button>
        <button
          className={`button bg-black text-white text-center ${
            (!inCart && product?.stock <= 0)
              ? "cursor-not-allowed opacity-40"
              : "cursor-pointer"
          }  `}
          onClick={() => {
            if (inCart) {
              router.push("/cart");
            } else {
              addProducttoCart(product?._id);
            }
          }}
          disabled={!inCart && product?.stock <= 0}
        >
          {inCart ? "View Cart" : "Add to Cart"}
        </button>
      </div>
      {sections && (
        <section className="bg-white p-6">
          {sections.map((section, index) => (
            <div
              className="text-[1.6rem] border-b border-neutral-300 last:border-b-0 space-y-4"
              key={index}
            >
              <div className="font-medium">{section.title}</div>
              <div>
                {section.details.map((detail, index) => (
                  <div className="flex justify-between gap-8" key={index}>
                    <div>{detail.label}</div>
                    <div>{detail.value}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
};
