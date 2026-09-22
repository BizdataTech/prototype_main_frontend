"use client";

import { useContext } from "react";
import { CartContext } from "@/context/cartContext";
import { WishlistContext } from "@/context/wishlistContext";
import { X, Trash, Heart, ArrowRight } from "phosphor-react";
import Link from "next/link";

const CartDrawer = ({ isOpen, onClose }) => {
  const { cart, updateQuantity, removeFromCart, clearCart } = useContext(CartContext);
  const { addToWishlist } = useContext(WishlistContext);

  if (!isOpen) return null;

  const handleMoveToWishlist = async (productId) => {
    await addToWishlist(productId);
    await removeFromCart(productId);
  };

  return (
    <div className="fixed inset-0 z-[200] overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="absolute inset-y-0 right-0 flex max-w-full">
        <div className="w-screen max-w-[45rem] transform bg-white shadow-2xl transition-all duration-300 flex flex-col h-full">
          
          {/* Header */}
          <div className="px-5 sm:px-10 py-6 sm:py-8 border-b border-neutral-200 flex items-center justify-between bg-white">
            <h2 className="text-[1.8rem] font-light text-black uppercase tracking-widest flex items-center gap-4">
              Your Cart
              {cart?.items?.length > 0 && (
                <span className="text-[1.4rem] text-neutral-500 lowercase tracking-normal font-normal">
                  ({cart.items.length})
                </span>
              )}
            </h2>
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-black transition-colors"
            >
              <X size={24} weight="light" />
            </button>
          </div>

          {/* Cart items list */}
          <div className="flex-1 overflow-y-auto px-5 sm:px-10 py-6 bg-white">
            {cart?.items?.length > 0 ? (
              <div className="flex flex-col gap-10">
                {cart.items.map((item, idx) => {
                  const prod = item.productId;
                  if (!prod) return null;
                  const image = (prod.images && prod.images[0]?.url) || (prod.images && prod.images[0]) || (prod.parentId?.images && prod.parentId.images[0]);
                  
                  return (
                    <div
                      key={idx}
                      className="flex gap-8 pb-8 border-b border-neutral-100 last:border-0"
                    >
                      <Link href={`/product/${prod._id}`} onClick={onClose} className="w-[10rem] h-[12rem] bg-neutral-50 flex items-center justify-center shrink-0 p-2">
                        {image ? (
                          <img
                            src={image}
                            alt={prod.product_title}
                            className="max-w-full max-h-full object-contain mix-blend-multiply"
                          />
                        ) : (
                          <span className="text-[1rem] text-neutral-400 uppercase tracking-widest">No Image</span>
                        )}
                      </Link>
                      
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start gap-4">
                            <Link href={`/product/${prod._id}`} onClick={onClose} className="text-[1.6rem] font-light text-black leading-tight hover:underline">
                              {prod.product_title}
                            </Link>
                            <span className="text-[1.6rem] font-light text-black shrink-0">
                              AED {Number(prod.price || 0)}
                            </span>
                          </div>
                          <span className="text-[1.2rem] text-neutral-500 uppercase tracking-widest mt-2 block">
                            {prod.brand?.brand_name || prod.brand}
                          </span>
                        </div>

                        <div className="flex items-end justify-between mt-6">
                          {/* Quantity control */}
                          <div className="flex items-center border border-black">
                            <button
                              onClick={() => updateQuantity(prod._id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className={`w-8 h-8 flex items-center justify-center text-[1.4rem] transition-colors ${item.quantity <= 1 ? 'text-neutral-300' : 'text-black hover:bg-neutral-100'}`}
                            >
                              -
                            </button>
                            <span className="w-8 h-8 flex items-center justify-center text-[1.4rem] font-light">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(prod._id, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center text-[1.4rem] text-black hover:bg-neutral-100 transition-colors"
                            >
                              +
                            </button>
                          </div>

                          <div className="flex items-center gap-4">
                            <button
                              onClick={() => handleMoveToWishlist(prod._id)}
                              className="text-[1.2rem] text-neutral-500 hover:text-black uppercase tracking-widest transition-colors flex items-center gap-1"
                              title="Move to Wishlist"
                            >
                              <Heart size={14} /> Save
                            </button>
                            <button
                              onClick={() => removeFromCart(prod._id)}
                              className="text-[1.2rem] text-neutral-500 hover:text-black uppercase tracking-widest transition-colors flex items-center gap-1"
                              title="Remove item"
                            >
                              <Trash size={14} /> Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center gap-6">
                <h3 className="text-[1.8rem] font-light text-black tracking-widest uppercase">Your cart is empty</h3>
                <p className="text-[1.3rem] text-neutral-500 uppercase tracking-widest leading-relaxed max-w-[25rem]">
                  Browse our collection and add items to your cart.
                </p>
                <button
                  onClick={onClose}
                  className="mt-4 bg-black text-white px-10 py-4 text-[1.2rem] uppercase tracking-widest hover:bg-neutral-800 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </div>

          {/* Footer actions */}
          {cart?.items?.length > 0 && (
            <div className="border-t border-neutral-200 px-5 sm:px-10 py-6 sm:py-8 bg-neutral-50 flex flex-col gap-4 sm:gap-6">
              <div className="flex justify-between items-center text-black">
                <span className="text-[1.4rem] uppercase tracking-widest font-medium">Subtotal</span>
                <span className="text-[2rem] font-light">
                  AED {cart.cartTotal}
                </span>
              </div>

              <div className="flex flex-col gap-4">
                <Link
                  href="/checkout"
                  onClick={onClose}
                  className="w-full bg-black text-white text-center text-[1.3rem] uppercase tracking-widest py-4 sm:py-5 hover:bg-neutral-800 transition-colors flex items-center justify-center gap-3"
                >
                  Checkout <ArrowRight size={18} />
                </Link>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Link
                    href="/cart"
                    onClick={onClose}
                    className="w-full bg-white border border-black text-black text-center text-[1.2rem] uppercase tracking-widest py-4 hover:bg-neutral-100 transition-colors"
                  >
                    View Cart
                  </Link>
                  <button
                    onClick={clearCart}
                    className="w-full bg-white border border-neutral-300 text-neutral-500 text-center text-[1.2rem] uppercase tracking-widest py-4 hover:border-black hover:text-black transition-colors"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>
              
              <div className="text-center text-[1rem] text-neutral-500 uppercase tracking-widest mt-2">
                Shipping & taxes calculated at checkout
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
