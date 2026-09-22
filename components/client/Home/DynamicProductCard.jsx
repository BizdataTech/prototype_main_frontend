"use client";

import Link from "next/link";
import { useState, useContext } from "react";
import { Heart, ShoppingCart, Star, Check } from "phosphor-react";
import { WishlistContext } from "@/context/wishlistContext";
import { CartContext } from "@/context/cartContext";
import { toast } from "sonner";

export default function DynamicProductCard({ product }) {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);
  const [addingCart, setAddingCart] = useState(false);
  const [imgError, setImgError] = useState(false);

  if (!product) return null;

  const targetId = product.variant?._id || product._id;
  const inWishlist = isInWishlist(targetId) || isInWishlist(product._id);

  const regularPrice = Number(product.variant?.price ?? product.price ?? 0);
  const salePrice = Number(product.variant?.sale_price ?? product.sale_price ?? 0);
  const currentPrice = salePrice > 0 && salePrice < regularPrice ? salePrice : regularPrice;
  const hasDiscount = salePrice > 0 && regularPrice > salePrice;
  const discountPercent = hasDiscount ? Math.round(((regularPrice - salePrice) / regularPrice) * 100) : 0;

  const rawImage =
    product.variant?.images?.[0] ||
    (Array.isArray(product.images) && product.images[0]?.url) ||
    (Array.isArray(product.images) && typeof product.images[0] === "string" && product.images[0]) ||
    product.image ||
    "";

  const imageSrc = imgError || !rawImage
    ? "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=600&q=80"
    : rawImage;

  const brandName = typeof product.brand === "object"
    ? product.brand?.brand_name || product.brand?.name || ""
    : product.brand || "";

  const categoryName = typeof product.category === "object"
    ? product.category?.title || product.category?.name || ""
    : product.category || "";

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (inWishlist) {
      await removeFromWishlist(targetId);
    } else {
      await addToWishlist(targetId);
    }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      setAddingCart(true);
      await addToCart(targetId);
      toast.success("Added to cart!");
    } catch {
      toast.error("Failed to add to cart");
    } finally {
      setAddingCart(false);
    }
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-neutral-200/80 hover:border-neutral-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 flex flex-col h-full overflow-hidden">
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        <div className="flex flex-col gap-1.5 pointer-events-auto">
          {hasDiscount && (
            <span className="bg-[#b00015] text-white text-[1.1rem] font-bold px-2.5 py-1 rounded-md tracking-wider uppercase shadow-sm">
              -{discountPercent}%
            </span>
          )}
          {product.stock !== undefined && product.stock <= 5 && product.stock > 0 && (
            <span className="bg-amber-600 text-white text-[1rem] font-semibold px-2 py-0.5 rounded-md">
              Only {product.stock} Left
            </span>
          )}
        </div>
        <button
          onClick={handleWishlistToggle}
          type="button"
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          className={`pointer-events-auto w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm ${
            inWishlist ? "bg-[#b00015] text-white" : "bg-white/90 text-neutral-600 hover:text-[#b00015] hover:bg-white hover:scale-110"
          }`}
        >
          <Heart size={18} weight={inWishlist ? "fill" : "bold"} />
        </button>
      </div>

      <Link href={`/product/${targetId}`} className="block relative pt-4 px-4">
        <div className="w-full h-56 md:h-64 rounded-xl overflow-hidden bg-neutral-50 flex items-center justify-center p-3 relative group-hover:bg-neutral-100/60 transition-colors">
          <img
            src={imageSrc}
            alt={product.product_title || "Building Material"}
            onError={() => setImgError(true)}
            className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </div>
      </Link>

      <div className="p-5 flex flex-col flex-grow justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            {brandName ? (
              <span className="text-[1.15rem] font-bold text-[#b00015] uppercase tracking-wider line-clamp-1">
                {brandName}
              </span>
            ) : (
              <span className="text-[1.15rem] font-semibold text-neutral-400 uppercase tracking-wider line-clamp-1">
                {categoryName || "PRO MATERIAL"}
              </span>
            )}
            <div className="flex items-center gap-1 text-amber-500 text-[1.2rem] font-semibold ml-auto shrink-0">
              <Star size={13} weight="fill" />
              <span>4.8</span>
            </div>
          </div>
          <Link href={`/product/${targetId}`} className="block group-hover:text-[#b00015] transition-colors">
            <h3 className="text-[1.45rem] font-semibold text-neutral-800 leading-snug line-clamp-2 min-h-[3.6rem]" title={product.product_title}>
              {product.product_title}
            </h3>
          </Link>
        </div>
        <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <span className="text-[1.8rem] font-extrabold text-neutral-900 leading-none">
                AED {currentPrice.toLocaleString("en-AE")}
              </span>
              {hasDiscount && (
                <span className="text-[1.25rem] text-neutral-400 line-through font-medium leading-none">
                  AED {regularPrice.toLocaleString("en-AE")}
                </span>
              )}
            </div>
            <span className="text-[1.05rem] text-emerald-600 font-medium mt-1">
              ✓ In Stock • Direct Wholesale
            </span>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={addingCart}
            aria-label="Add to cart"
            className="w-11 h-11 rounded-xl bg-neutral-900 hover:bg-[#b00015] text-white flex items-center justify-center transition-all duration-200 shadow-sm hover:shadow-md hover:scale-105 active:scale-95 shrink-0"
          >
            {addingCart ? <Check size={18} weight="bold" /> : <ShoppingCart size={18} weight="bold" />}
          </button>
        </div>
      </div>
    </div>
  );
}
