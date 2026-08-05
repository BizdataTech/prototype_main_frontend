"use client";

import { useContext } from "react";
import { CartContext } from "@/context/cartContext";
import { WishlistContext } from "@/context/wishlistContext";
import { X, Trash, ShoppingBag, Plus, Minus } from "phosphor-react";
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
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md transform bg-white shadow-2xl transition-all duration-300 flex flex-col h-full border-l border-neutral-200">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-6 h-6 text-[#b00015]" />
              <h2 className="text-xl font-bold text-neutral-800">Your Cart</h2>
              {cart?.items?.length > 0 && (
                <span className="bg-[#b00015]/10 text-[#b00015] px-2.5 py-0.5 rounded-full text-xs font-bold">
                  {cart.items.length}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-black transition-colors p-1"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Cart items list */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {cart?.items?.length > 0 ? (
              <div className="flex flex-col gap-4">
                {cart.items.map((item, idx) => {
                  const prod = item.productId;
                  if (!prod) return null;
                  return (
                    <div
                      key={idx}
                      className="flex gap-4 p-3 border border-neutral-100 rounded-2xl hover:border-neutral-200 transition-colors"
                    >
                      {prod.images && prod.images.length > 0 && (
                        <img
                          src={prod.images[0].url || prod.images[0]}
                          alt={prod.product_title}
                          className="w-20 h-20 object-cover rounded-xl border border-neutral-100 flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="text-sm font-bold text-neutral-800 line-clamp-1">
                            {prod.product_title}
                          </h4>
                          <span className="text-xs text-neutral-500 font-medium">
                            {prod.brand?.brand_name || prod.brand}
                          </span>
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          {/* Quantity control */}
                          <div className="flex items-center border border-neutral-200 rounded-full bg-neutral-50">
                            <button
                              onClick={() => updateQuantity(prod._id, item.quantity - 1)}
                              className="px-2.5 py-1 text-sm text-neutral-600 hover:text-black font-bold flex items-center justify-center"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2 text-xs font-bold text-neutral-800">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(prod._id, item.quantity + 1)}
                              className="px-2.5 py-1 text-sm text-neutral-600 hover:text-black font-bold flex items-center justify-center"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleMoveToWishlist(prod._id)}
                              className="text-xs text-[#b00015] hover:underline font-bold"
                              title="Move to Wishlist"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => removeFromCart(prod._id)}
                              className="text-neutral-400 hover:text-red-600 transition-colors p-1"
                              title="Remove item"
                            >
                              <Trash className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center gap-3">
                <ShoppingBag className="w-16 h-16 text-neutral-300" />
                <h3 className="text-lg font-bold text-neutral-700">Your cart is empty</h3>
                <p className="text-sm text-neutral-500 max-w-xs">
                  Browse products and add them to your cart to start shopping.
                </p>
                <button
                  onClick={onClose}
                  className="mt-2 bg-black hover:bg-neutral-800 text-white font-bold text-sm px-6 py-2.5 rounded-full transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </div>

          {/* Footer actions */}
          {cart?.items?.length > 0 && (
            <div className="border-t border-neutral-100 px-6 py-6 bg-neutral-50 flex flex-col gap-4">
              <div className="flex justify-between items-center text-neutral-800">
                <span className="text-sm font-semibold text-neutral-500">Subtotal:</span>
                <span className="text-xl font-extrabold text-neutral-900">
                  ${cart.cartTotal}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={clearCart}
                  className="border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-100 py-3 rounded-full font-bold text-sm transition-colors text-center"
                >
                  Clear Cart
                </button>
                <Link
                  href="/checkout"
                  onClick={onClose}
                  className="bg-[#b00015] text-white hover:bg-red-800 py-3 rounded-full font-bold text-sm transition-colors text-center shadow-md shadow-red-700/10"
                >
                  Checkout
                </Link>
              </div>

              <Link
                href="/cart"
                onClick={onClose}
                className="text-center text-xs text-neutral-500 hover:text-black font-semibold mt-1"
              >
                View Full Cart
              </Link>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
