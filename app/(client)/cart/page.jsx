"use client";

import { CartContext } from "@/context/cartContext";
import { WishlistContext } from "@/context/wishlistContext";
import { UserContext } from "@/context/userContext";
import { useContext } from "react";
import Link from "next/link";
import { Trash, ShoppingBag, Heart } from "phosphor-react";

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, clearCart } = useContext(CartContext);
  const { addToWishlist } = useContext(WishlistContext);
  const { user } = useContext(UserContext);

  if (user === null) {
    return (
      <section className="w-[95%] max-w-4xl mx-auto pt-[18rem] pb-24 text-center">
        <div className="bg-white p-12 rounded-3xl border border-neutral-200 shadow-xl flex flex-col items-center gap-6">
          <ShoppingBag className="w-[6rem] h-[6rem] text-neutral-300" />
          <h2 className="text-3xl font-extrabold text-neutral-800">Please Sign In</h2>
          <p className="text-[1.6rem] text-neutral-600">Please sign in to view your shopping cart.</p>
          <Link href="/register/sign-in" className="mt-4 bg-[#b00015] hover:bg-red-800 text-white text-[1.5rem] font-bold px-8 py-3 rounded-full transition-all shadow-md">
            Go to Login
          </Link>
        </div>
      </section>
    );
  }

  const handleMoveToWishlist = async (productId) => {
    await addToWishlist(productId);
    await removeFromCart(productId);
  };

  return (
    <section className="w-[95%] max-w-7xl mx-auto pt-[18rem] pb-16">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Cart items list */}
        <div className="w-full lg:w-2/3 bg-white border border-neutral-200 rounded-3xl p-8 shadow-sm flex flex-col gap-6">
          <div className="flex justify-between items-center border-b border-neutral-100 pb-4">
            <h1 className="text-3xl font-extrabold text-neutral-800">Shopping Cart</h1>
            {cart?.items?.length > 0 && (
              <button onClick={clearCart} className="text-[1.4rem] font-bold text-red-600 hover:underline">
                Clear Cart
              </button>
            )}
          </div>

          {cart && cart.items.length > 0 ? (
            <div className="flex flex-col gap-6">
              {cart.items.map((item, index) => {
                const prod = item.productId;
                if (!prod) return null;
                const title = prod.product_title || prod.parentId?.product_title;
                const brand = prod.brand?.brand_name || prod.brand || prod.parentId?.brand;
                const image = (prod.images && prod.images[0]?.url) || (prod.images && prod.images[0]) || (prod.parentId?.images && prod.parentId.images[0]);
                
                return (
                  <div key={index} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-neutral-100 last:border-0 last:pb-0">
                    <div className="flex gap-4">
                      {image && (
                        <img
                          src={image}
                          alt={title}
                          className="w-[10rem] h-[10rem] object-cover rounded-2xl border border-neutral-100"
                        />
                      )}
                      <div>
                        <h4 className="text-[1.6rem] font-bold text-neutral-800 max-w-sm line-clamp-2">{title}</h4>
                        <span className="text-[1.3rem] text-neutral-500 font-medium">{brand}</span>
                        <div className="text-[1.6rem] font-extrabold text-neutral-900 mt-2">${prod.price}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 self-end sm:self-center">
                      <div className="flex items-center border border-neutral-300 rounded-full bg-neutral-50">
                        <button
                          onClick={() => updateQuantity(prod._id, item.quantity - 1)}
                          className="px-3.5 py-1 text-[1.6rem] font-bold text-neutral-600 hover:text-black"
                        >
                          -
                        </button>
                        <span className="px-3 text-[1.4rem] font-bold text-neutral-800">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(prod._id, item.quantity + 1)}
                          className="px-3.5 py-1 text-[1.6rem] font-bold text-neutral-600 hover:text-black"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => handleMoveToWishlist(prod._id)}
                        className="flex items-center gap-1.5 text-[1.3rem] font-bold text-[#b00015] hover:underline"
                        title="Move to Wishlist"
                      >
                        <Heart className="w-[1.8rem] h-[1.8rem]" weight="fill" />
                        Save
                      </button>

                      <button
                        onClick={() => removeFromCart(prod._id)}
                        className="text-neutral-400 hover:text-red-600 transition-colors p-1"
                        title="Remove from Cart"
                      >
                        <Trash className="w-[2rem] h-[2rem]" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="border border-neutral-200 p-12 rounded-2xl bg-neutral-50 text-center flex flex-col items-center gap-4">
              <ShoppingBag className="w-[5rem] h-[5rem] text-neutral-400" />
              <h3 className="text-xl font-bold text-neutral-700">Your Cart is Empty</h3>
              <p className="text-[1.4rem] text-neutral-500 max-w-sm">
                Explore our catalog to find awesome equipment and add items to your cart.
              </p>
              <Link href="/" className="mt-2 bg-black hover:bg-neutral-800 text-white font-bold text-[1.4rem] px-8 py-3 rounded-full transition-colors">
                Continue Shopping
              </Link>
            </div>
          )}
        </div>

        {/* Order Summary sidebar */}
        {cart && cart.items.length > 0 && (
          <div className="w-full lg:w-1/3 bg-white border border-neutral-200 rounded-3xl p-8 shadow-sm flex flex-col gap-6">
            <h3 className="text-xl font-bold text-neutral-800">Order Summary</h3>
            
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center text-[1.45rem] text-neutral-600">
                <span>Items Subtotal</span>
                <span>${cart.cartTotal}</span>
              </div>
              <div className="flex justify-between items-center text-[1.45rem] text-neutral-600 border-b border-neutral-100 pb-4">
                <span>Shipping</span>
                <span className="text-green-600 font-bold">FREE</span>
              </div>
              <div className="flex justify-between items-center text-[1.8rem] font-bold text-neutral-800 pt-2">
                <span>Total</span>
                <span className="text-[2.2rem] font-extrabold text-neutral-900">${cart.cartTotal}</span>
              </div>
            </div>

            <Link
              className="w-full bg-[#b00015] hover:bg-red-800 text-white font-bold text-center text-[1.5rem] py-3.5 rounded-full transition-all shadow-md shadow-red-700/10"
              href="/checkout"
            >
              Proceed to Checkout
            </Link>
          </div>
        )}

      </div>
    </section>
  );
};

export default Cart;
