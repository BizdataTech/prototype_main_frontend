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
      <section className="w-full min-h-[60vh] bg-neutral-100 pt-[15rem] pb-24 flex items-center justify-center">
        <div className="bg-white p-12 rounded-[.5rem] shadow-sm flex flex-col items-center gap-6 w-[95%] max-w-[60rem]">
          <img src="/empty-cart.png" alt="Empty Cart" className="w-[15rem] opacity-70" onError={(e) => { e.target.style.display = 'none'; }} />
          <ShoppingBag className="w-[6rem] h-[6rem] text-neutral-300" />
          <h2 className="text-[2rem] font-medium text-neutral-800">Missing Cart Items?</h2>
          <p className="text-[1.5rem] text-neutral-500">Login to see the items you added previously</p>
          <Link href="/register/sign-in" className="mt-4 bg-[#fb641b] hover:bg-[#f05a11] text-white text-[1.5rem] font-medium px-16 py-4 rounded-[.2rem] shadow-sm transition-colors">
            Login
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
    <section className="w-full min-h-screen bg-neutral-100 pt-[14rem] pb-16">
      <div className="w-[95%] max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          
          {/* Cart items list */}
          <div className="w-full lg:w-8/12 flex flex-col gap-4">
            <div className="bg-white rounded-[.4rem] shadow-sm">
              <div className="flex justify-between items-center border-b border-neutral-200 px-8 py-6">
                <h1 className="text-[2rem] font-medium text-black">Shopping Cart</h1>
                {cart?.items?.length > 0 && (
                  <button onClick={clearCart} className="text-[1.4rem] font-medium text-neutral-500 hover:text-red-500 transition-colors">
                    Clear All
                  </button>
                )}
              </div>

              {cart && cart.items.length > 0 ? (
                <div className="flex flex-col">
                  {cart.items.map((item, index) => {
                    const prod = item.productId;
                    if (!prod) return null;
                    const title = prod.product_title || prod.parentId?.product_title;
                    const brand = prod.brand?.brand_name || prod.brand || prod.parentId?.brand;
                    const image = (prod.images && prod.images[0]?.url) || (prod.images && prod.images[0]) || (prod.parentId?.images && prod.parentId.images[0]);
                    
                    return (
                      <div key={index} className="flex flex-col sm:flex-row p-8 border-b border-neutral-200 last:border-0 hover:bg-neutral-50/50 transition-colors gap-8 group">
                        
                        {/* Image & Qty */}
                        <div className="flex flex-col items-center gap-6 w-[12rem] shrink-0">
                          <Link href={`/product/${prod._id}`} className="w-full h-[12rem] flex items-center justify-center p-2 bg-white">
                            {image ? (
                              <img src={image} alt={title} className="max-w-full max-h-full object-contain" />
                            ) : (
                              <div className="w-full h-full bg-neutral-100 flex items-center justify-center text-[1.2rem] text-neutral-400">No Image</div>
                            )}
                          </Link>
                          
                          <div className="flex items-center gap-4">
                            <button
                              onClick={() => updateQuantity(prod._id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className={`w-[2.8rem] h-[2.8rem] flex items-center justify-center rounded-full border ${item.quantity <= 1 ? 'border-neutral-200 text-neutral-300' : 'border-neutral-300 text-black hover:border-black'} transition-colors text-[1.8rem] leading-none`}
                            >
                              -
                            </button>
                            <span className="w-[3.5rem] h-[2.8rem] flex items-center justify-center border border-neutral-300 text-[1.4rem] font-medium bg-white">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(prod._id, item.quantity + 1)}
                              className="w-[2.8rem] h-[2.8rem] flex items-center justify-center rounded-full border border-neutral-300 text-black hover:border-black transition-colors text-[1.6rem] leading-none"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* Product Info */}
                        <div className="flex flex-col flex-1 py-1">
                          <Link href={`/product/${prod._id}`} className="text-[1.8rem] text-black font-medium hover:text-[#2874f0] line-clamp-2 leading-[2.4rem]">
                            {title}
                          </Link>
                          <span className="text-[1.4rem] text-neutral-500 mt-2">{brand}</span>
                          
                          <div className="flex items-baseline gap-4 mt-6">
                            <span className="text-[2.2rem] font-medium text-black">Rs {Number(prod.price || 0)}</span>
                            {prod.sale_price && (
                              <span className="text-[1.4rem] text-neutral-500 line-through">Rs {Number(prod.sale_price)}</span>
                            )}
                          </div>
                          
                          <div className="flex gap-8 mt-auto pt-6">
                            <button
                              onClick={() => handleMoveToWishlist(prod._id)}
                              className="text-[1.5rem] font-medium text-neutral-800 hover:text-[#2874f0] uppercase tracking-wide flex items-center gap-2"
                            >
                              Save for later
                            </button>
                            <button
                              onClick={() => removeFromCart(prod._id)}
                              className="text-[1.5rem] font-medium text-neutral-800 hover:text-red-500 uppercase tracking-wide flex items-center gap-2"
                            >
                              Remove
                            </button>
                          </div>
                        </div>

                        {/* Delivery Est (Mock) */}
                        <div className="hidden lg:block w-[20rem] text-[1.3rem] text-neutral-800 py-1">
                          Delivery by <span className="font-medium">Tomorrow</span> | <span className="text-green-600">Free</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-24 text-center flex flex-col items-center gap-6">
                  <h3 className="text-[2rem] font-medium text-neutral-800">Your cart is empty!</h3>
                  <p className="text-[1.4rem] text-neutral-500">Explore our wide selection and find something you like</p>
                  <Link href="/" className="mt-4 bg-[#2874f0] hover:bg-[#1f5cbf] text-white font-medium text-[1.5rem] px-12 py-4 rounded-[.2rem] shadow-sm transition-colors">
                    Shop Now
                  </Link>
                </div>
              )}
            </div>
            
            {/* Safe/Secure banner like Flipkart */}
            <div className="flex items-center gap-4 text-[1.4rem] text-neutral-500 px-4 py-2">
              <svg className="w-8 h-8 text-neutral-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
              Safe and Secure Payments. Easy returns. 100% Authentic products.
            </div>
          </div>

          {/* Order Summary sidebar */}
          {cart && cart.items.length > 0 && (
            <div className="w-full lg:w-4/12 flex flex-col gap-4 sticky top-[10rem]">
              <div className="bg-white rounded-[.4rem] shadow-sm">
                <div className="border-b border-neutral-200 px-8 py-6">
                  <h3 className="text-[1.6rem] font-medium text-neutral-500 uppercase tracking-wide">Price Details</h3>
                </div>
                
                <div className="p-8 flex flex-col gap-6">
                  <div className="flex justify-between items-center text-[1.6rem] text-neutral-800">
                    <span>Price ({cart.items.length} {cart.items.length === 1 ? 'item' : 'items'})</span>
                    <span>Rs {cart.cartTotal}</span>
                  </div>
                  <div className="flex justify-between items-center text-[1.6rem] text-neutral-800">
                    <span>Delivery Charges</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between items-center text-[2rem] font-medium text-black pt-6 border-t border-neutral-200 border-dashed">
                    <span>Total Amount</span>
                    <span>Rs {cart.cartTotal}</span>
                  </div>
                  <div className="text-[1.5rem] text-green-600 font-medium pt-2">
                    You will save delivery charges on this order
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-[.4rem] shadow-sm p-6">
                <Link
                  className="w-full block bg-[#fb641b] hover:bg-[#f05a11] text-white font-medium text-center text-[1.8rem] py-5 rounded-[.2rem] transition-colors shadow-sm"
                  href="/checkout"
                >
                  PLACE ORDER
                </Link>
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
};

export default Cart;

