"use client";

import { useContext } from "react";
import { WishlistContext } from "@/context/wishlistContext";
import { CartContext } from "@/context/cartContext";
import { UserContext } from "@/context/userContext";
import Link from "next/link";
import { Heart, ShoppingCart, Trash, ArrowRight } from "phosphor-react";

const WishlistPage = () => {
  const { user } = useContext(UserContext);
  const { wishlist, items, removeFromWishlist } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);

  if (user === null) {
    return (
      <section className="w-[95%] max-w-4xl mx-auto pt-[18rem] pb-24 text-center">
        <div className="bg-white p-12 rounded-3xl border border-neutral-200 shadow-xl flex flex-col items-center gap-6">
          <Heart className="w-[6rem] h-[6rem] text-neutral-300" />
          <h2 className="text-3xl font-extrabold text-neutral-800">Please Sign In</h2>
          <p className="text-[1.6rem] text-neutral-600">Please sign in to view your wishlist.</p>
          <Link href="/register/sign-in" className="mt-4 bg-[#b00015] hover:bg-red-800 text-white text-[1.5rem] font-bold px-8 py-3 rounded-full transition-all shadow-md">
            Go to Login
          </Link>
        </div>
      </section>
    );
  }

  const handleMoveToCart = async (productId) => {
    await addToCart(productId);
    await removeFromWishlist(productId);
  };

  return (
    <section className="w-[95%] max-w-7xl mx-auto pt-[18rem] pb-16">
      <div className="flex justify-between items-center border-b border-neutral-100 pb-4 mb-6">
        <h1 className="text-3xl font-extrabold text-neutral-800">My Wishlist</h1>
        {items.length > 0 && (
          <span className="bg-[#b00015]/10 text-[#b00015] px-3 py-1 rounded-full text-sm font-bold">
            {items.length} {items.length === 1 ? "Item" : "Items"}
          </span>
        )}
      </div>

      {!wishlist || items.length === 0 ? (
        <div className="border border-neutral-200 p-12 rounded-2xl bg-neutral-50 text-center flex flex-col items-center gap-4">
          <Heart className="w-[5rem] h-[5rem] text-neutral-400" />
          <h3 className="text-xl font-bold text-neutral-700">Your Wishlist is Empty</h3>
          <p className="text-[1.4rem] text-neutral-500 max-w-sm">
            Save items to your wishlist to keep track of products you like and purchase them later.
          </p>
          <Link href="/" className="mt-2 bg-black hover:bg-neutral-800 text-white font-bold text-[1.4rem] px-8 py-3 rounded-full transition-colors">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, index) => {
            const product = item?.productId;
            if (!product) return null;
            
            const title = product.product_title || product.parentId?.product_title;
            const brand = product.brand?.brand_name || product.brand || product.parentId?.brand;
            const image = (product.images && product.images[0]?.url) || (product.images && product.images[0]) || (product.parentId?.images && product.parentId.images[0]);
            
            const isOutOfStock = product.stock <= 0;
            const isInvalidPrice = !product.price || Number(product.price) <= 0;
            const canAddToCart = !isOutOfStock && !isInvalidPrice;

            return (
              <div
                key={item?._id || index}
                className="border-1 border-neutral-300 hover:border-neutral-500 rounded-[.5rem] p-6 bg-white flex flex-col justify-between hover:shadow-[0_0_.4rem_rgb(210,210,210)] transition-all group relative cursor-pointer"
              >
                <div>
                  {/* Product image */}
                  <div className="relative h-[15rem] w-full mb-4 overflow-hidden flex items-center justify-center">
                    {image ? (
                      <img
                        src={image}
                        alt={title}
                        className="w-[15rem] h-full object-contain transition-transform duration-300"
                      />
                    ) : (
                      <div className="text-[1.2rem] text-neutral-400">No Image Available</div>
                    )}
                    <button
                      onClick={(e) => { e.preventDefault(); removeFromWishlist(product._id); }}
                      className="absolute top-2 right-2 bg-white/80 hover:bg-white text-neutral-400 hover:text-[#b00015] p-2 rounded-full border border-neutral-200 transition-colors shadow-sm"
                      title="Remove from Wishlist"
                    >
                      <Trash className="w-[1.8rem] h-[1.8rem]" />
                    </button>
                  </div>

                  {/* Product info */}
                  <div className="flex flex-col items-center mt-6 text-center">
                    <h4 className="font-medium text-[1.8rem] text-neutral-700 leading-[2rem] line-clamp-2 min-h-[4rem]">
                      {title?.split(" ").slice(0, 5).join(" ")}
                    </h4>
                    <span className="text-[1.4rem] text-neutral-500 mt-2">{brand}</span>
                    <div className="text-[1.7rem] font-medium mt-4 text-black">
                      Rs {Number(product.price || 0)}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 mt-6">
                  <button
                    disabled={!canAddToCart}
                    className={`w-full flex items-center justify-center gap-2 font-medium py-3 rounded-[.4rem] text-[1.4rem] transition-colors shadow-sm ${
                      canAddToCart 
                        ? 'bg-[#b00015] hover:bg-red-800 text-white' 
                        : 'bg-neutral-200 text-neutral-500 cursor-not-allowed'
                    }`}
                    onClick={(e) => { e.preventDefault(); handleMoveToCart(product._id); }}
                  >
                    <ShoppingCart className="w-[1.8rem] h-[1.8rem]" />
                    {isOutOfStock ? "Out of Stock" : isInvalidPrice ? "Price Unavailable" : "Move to Cart"}
                  </button>
                  <Link
                    href={`/product/${product._id}`}
                    className="w-full flex items-center justify-center gap-1.5 border border-neutral-300 hover:border-black text-neutral-700 hover:text-black py-3 rounded-[.4rem] text-[1.3rem] font-medium transition-all text-center"
                  >
                    View Details
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default WishlistPage;
