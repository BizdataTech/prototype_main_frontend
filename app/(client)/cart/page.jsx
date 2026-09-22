"use client";

import { CartContext } from "@/context/cartContext";
import { WishlistContext } from "@/context/wishlistContext";
import { UserContext } from "@/context/userContext";
import { useContext, useState } from "react";
import Link from "next/link";
import { Trash, ShoppingBag, Heart, ArrowRight } from "phosphor-react";

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, clearCart } = useContext(CartContext);
  const { addToWishlist } = useContext(WishlistContext);
  const { user } = useContext(UserContext);
  const [promoCode, setPromoCode] = useState("");

  if (user === null) {
    return (
      <section className="w-full min-h-[60vh] bg-white pt-[15rem] pb-24 flex items-center justify-center">
        <div className="flex flex-col items-center gap-8 w-[95%] max-w-[60rem]">
          <ShoppingBag className="w-[8rem] h-[8rem] text-black stroke-[1]" />
          <h2 className="text-[2.4rem] font-light text-black tracking-wide">YOUR CART IS EMPTY</h2>
          <p className="text-[1.4rem] text-neutral-500 uppercase tracking-widest text-center">Sign in to view your saved items</p>
          <Link href="/register/sign-in" className="mt-4 bg-black text-white text-[1.4rem] tracking-widest uppercase px-16 py-5 transition-all hover:bg-neutral-800">
            Sign In
          </Link>
        </div>
      </section>
    );
  }

  const handleMoveToWishlist = async (productId) => {
    await addToWishlist(productId);
    await removeFromCart(productId);
  };

  const tax = cart?.cartTotal ? Math.round(cart.cartTotal * 0.05) : 0;
  const shipping = cart?.cartTotal ? (cart.cartTotal > 1000 ? 0 : 50) : 0;
  const estimatedTotal = cart?.cartTotal ? cart.cartTotal + tax + shipping : 0;

  return (
    <section className="w-full min-h-screen bg-white pt-[14rem] pb-24">
      <div className="w-[95%] max-w-[1400px] mx-auto">
        <h1 className="text-[3rem] font-light text-black uppercase tracking-widest mb-16 border-b border-black pb-8">
          Shopping Cart
          {cart?.items?.length > 0 && (
            <span className="text-[1.6rem] text-neutral-500 ml-4 lowercase tracking-normal">({cart.items.length} items)</span>
          )}
        </h1>

        <div className="flex flex-col lg:flex-row gap-16 items-start">
          
          {/* Cart items list */}
          <div className="w-full lg:w-7/12 xl:w-8/12 flex flex-col">
            {cart && cart.items.length > 0 ? (
              <div className="flex flex-col gap-12">
                {cart.items.map((item, index) => {
                  const prod = item.productId;
                  if (!prod) return null;
                  const title = prod.product_title || prod.parentId?.product_title;
                  const brand = prod.brand?.brand_name || prod.brand || prod.parentId?.brand;
                  const image = (prod.images && prod.images[0]?.url) || (prod.images && prod.images[0]) || (prod.parentId?.images && prod.parentId.images[0]);
                  
                  return (
                    <div key={index} className="flex flex-col sm:flex-row gap-8 pb-12 border-b border-neutral-200 last:border-0 group">
                      
                      {/* Image */}
                      <Link href={`/product/${prod._id}`} className="w-[18rem] h-[22rem] shrink-0 bg-neutral-50 flex items-center justify-center p-4">
                        {image ? (
                          <img src={image} alt={title} className="max-w-full max-h-full object-contain mix-blend-multiply" />
                        ) : (
                          <div className="text-[1.2rem] text-neutral-400 uppercase tracking-widest">No Image</div>
                        )}
                      </Link>

                      {/* Product Info */}
                      <div className="flex flex-col flex-1 justify-between">
                        <div>
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <Link href={`/product/${prod._id}`} className="text-[2rem] text-black font-light leading-tight hover:underline">
                                {title}
                              </Link>
                              <div className="text-[1.4rem] text-neutral-500 uppercase tracking-widest mt-3">{brand}</div>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="text-[2rem] font-light text-black">AED {Number(prod.price || 0)}</span>
                              {prod.sale_price && (
                                <div className="text-[1.4rem] text-neutral-400 line-through mt-1">AED {Number(prod.sale_price)}</div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-end justify-between mt-8">
                          <div className="flex flex-col gap-3">
                            <span className="text-[1.2rem] text-neutral-500 uppercase tracking-widest">Quantity</span>
                            <div className="flex items-center border border-black">
                              <button
                                onClick={() => updateQuantity(prod._id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                                className={`w-12 h-12 flex items-center justify-center text-[2rem] transition-colors ${item.quantity <= 1 ? 'text-neutral-300' : 'text-black hover:bg-neutral-100'}`}
                              >
                                -
                              </button>
                              <span className="w-12 h-12 flex items-center justify-center text-[1.6rem] font-light">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(prod._id, item.quantity + 1)}
                                className="w-12 h-12 flex items-center justify-center text-[2rem] text-black hover:bg-neutral-100 transition-colors"
                              >
                                +
                              </button>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-6">
                            <button
                              onClick={() => handleMoveToWishlist(prod._id)}
                              className="text-[1.3rem] text-neutral-500 hover:text-black uppercase tracking-widest flex items-center gap-2 transition-colors border-b border-transparent hover:border-black pb-1"
                            >
                              <Heart size={16} /> Save
                            </button>
                            <button
                              onClick={() => removeFromCart(prod._id)}
                              className="text-[1.3rem] text-neutral-500 hover:text-black uppercase tracking-widest flex items-center gap-2 transition-colors border-b border-transparent hover:border-black pb-1"
                            >
                              <Trash size={16} /> Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-24 flex flex-col items-start gap-8">
                <p className="text-[1.8rem] font-light text-neutral-500">Your cart is currently empty.</p>
                <Link href="/" className="bg-black text-white text-[1.4rem] tracking-widest uppercase px-12 py-5 transition-all hover:bg-neutral-800 flex items-center gap-4">
                  Continue Shopping <ArrowRight size={20} />
                </Link>
              </div>
            )}
            
            {cart && cart.items.length > 0 && (
              <div className="mt-12 pt-8 border-t border-neutral-200">
                <button onClick={clearCart} className="text-[1.3rem] text-neutral-500 hover:text-black uppercase tracking-widest transition-colors border-b border-transparent hover:border-black pb-1">
                  Clear Cart
                </button>
              </div>
            )}
          </div>

          {/* Order Summary sidebar */}
          {cart && cart.items.length > 0 && (
            <div className="w-full lg:w-5/12 xl:w-4/12 flex flex-col">
              <div className="bg-neutral-50 p-10 flex flex-col">
                <h3 className="text-[2rem] font-light text-black uppercase tracking-widest mb-10 border-b border-neutral-200 pb-6">Order Summary</h3>
                
                {/* Promo Code */}
                <div className="mb-10">
                  <span className="text-[1.2rem] text-neutral-500 uppercase tracking-widest block mb-4">Promo Code</span>
                  <div className="flex">
                    <input 
                      type="text" 
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="ENTER CODE" 
                      className="w-full bg-white border border-neutral-300 px-4 py-4 text-[1.4rem] uppercase tracking-widest focus:outline-none focus:border-black"
                    />
                    <button className="bg-black text-white px-8 text-[1.2rem] uppercase tracking-widest hover:bg-neutral-800 transition-colors">
                      Apply
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-6 text-[1.6rem] font-light text-black mb-8">
                  <div className="flex justify-between items-center">
                    <span>Subtotal</span>
                    <span>AED {cart.cartTotal}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? "Complimentary" : `AED ${shipping}`}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Tax (Estimated)</span>
                    <span>AED {tax}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-[2.4rem] font-light text-black pt-8 border-t border-neutral-200 mb-10">
                  <span className="uppercase tracking-widest text-[1.6rem] font-medium">Estimated Total</span>
                  <span>AED {estimatedTotal}</span>
                </div>

                <Link
                  className="w-full block bg-black text-white text-center text-[1.4rem] tracking-widest uppercase py-6 transition-all hover:bg-neutral-800 flex items-center justify-center gap-4"
                  href="/checkout"
                >
                  Proceed to Checkout <ArrowRight size={20} />
                </Link>
                
                <div className="mt-8 text-center text-[1.2rem] text-neutral-500 uppercase tracking-widest leading-relaxed">
                  Secure checkout. Complimentary shipping and returns on all eligible orders.
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
};

export default Cart;
