"use client";

import { useContext } from "react";
import { WishlistContext } from "@/context/wishlistContext";
import { CartContext } from "@/context/cartContext";
import { UserContext } from "@/context/userContext";
import Link from "next/link";
import { Heart, ShoppingBag, Trash, ArrowRight } from "phosphor-react";

const WishlistPage = () => {
  const { user } = useContext(UserContext);
  const { wishlist, items, removeFromWishlist } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);

  if (user === null) {
    return (
      <section className="w-full min-h-[60vh] bg-white pt-[18rem] pb-24 text-center">
        <div className="flex flex-col items-center gap-8 w-[95%] max-w-[60rem] mx-auto">
          <Heart className="w-[8rem] h-[8rem] text-black stroke-[1]" />
          <h2 className="text-[2.4rem] font-light text-black tracking-widest uppercase">YOUR WISHLIST</h2>
          <p className="text-[1.4rem] text-neutral-500 uppercase tracking-widest text-center">
            Please sign in to view your saved items.
          </p>
          <Link href="/register/sign-in" className="mt-4 bg-black text-white text-[1.4rem] tracking-widest uppercase px-16 py-5 transition-all hover:bg-neutral-800">
            Sign In
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
    <section className="w-full min-h-screen bg-white pt-[14rem] pb-24">
      <div className="w-[95%] max-w-[1400px] mx-auto">
        <h1 className="text-[3rem] font-light text-black uppercase tracking-widest mb-16 border-b border-black pb-8">
          My Wishlist
          {items.length > 0 && (
            <span className="text-[1.6rem] text-neutral-500 ml-4 lowercase tracking-normal">({items.length} items)</span>
          )}
        </h1>

        {!wishlist || items.length === 0 ? (
          <div className="py-24 flex flex-col items-center gap-8 text-center">
            <Heart className="w-[8rem] h-[8rem] text-black stroke-[1]" />
            <h3 className="text-[2.4rem] font-light text-black tracking-widest uppercase">Your Wishlist is Empty</h3>
            <p className="text-[1.4rem] text-neutral-500 uppercase tracking-widest leading-relaxed max-w-[40rem]">
              Save items to your wishlist to keep track of products you like and purchase them later.
            </p>
            <Link href="/" className="mt-4 bg-black text-white text-[1.4rem] tracking-widest uppercase px-16 py-5 transition-all hover:bg-neutral-800 flex items-center gap-4">
              Explore Collection <ArrowRight size={20} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-12 gap-y-16">
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
                  className="group flex flex-col relative"
                >
                  {/* Product image */}
                  <div className="relative h-[40rem] w-full bg-neutral-50 mb-6 flex items-center justify-center p-6">
                    {image ? (
                      <Link href={`/product/${product._id}`} className="w-full h-full flex items-center justify-center">
                        <img
                          src={image}
                          alt={title}
                          className="max-w-full max-h-full object-contain mix-blend-multiply"
                        />
                      </Link>
                    ) : (
                      <div className="text-[1.2rem] text-neutral-400 uppercase tracking-widest">No Image</div>
                    )}
                    <button
                      onClick={(e) => { e.preventDefault(); removeFromWishlist(product._id); }}
                      className="absolute top-4 right-4 text-neutral-400 hover:text-black transition-colors"
                      title="Remove from Wishlist"
                    >
                      <Trash size={24} weight="light" />
                    </button>
                  </div>

                  {/* Product info */}
                  <div className="flex flex-col flex-1">
                    <Link href={`/product/${product._id}`} className="text-[1.8rem] font-light text-black hover:underline leading-relaxed line-clamp-1">
                      {title}
                    </Link>
                    <span className="text-[1.3rem] text-neutral-500 uppercase tracking-widest mt-2 block">{brand}</span>
                    <div className="text-[2rem] font-light text-black mt-4">
                      AED {Number(product.price || 0)}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-4 mt-8 pt-6 border-t border-neutral-200">
                    <button
                      disabled={!canAddToCart}
                      className={`flex-1 flex items-center justify-center gap-3 text-[1.3rem] uppercase tracking-widest py-4 transition-colors ${
                        canAddToCart 
                          ? 'bg-black text-white hover:bg-neutral-800' 
                          : 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                      }`}
                      onClick={(e) => { e.preventDefault(); handleMoveToCart(product._id); }}
                    >
                      <ShoppingBag size={18} weight={canAddToCart ? "regular" : "light"} />
                      {isOutOfStock ? "Out of Stock" : isInvalidPrice ? "Price Unavailable" : "Move to Cart"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default WishlistPage;
