"use client";

import Link from "next/link";
import { useSearch } from "./useSearch";
import { Spinner, ShoppingCart, Heart, User, SignOut, CaretDown, MagnifyingGlass } from "phosphor-react";
import { useContext, useState } from "react";
import { UserContext } from "@/context/userContext";
import { CartContext } from "@/context/cartContext";
import { WishlistContext } from "@/context/wishlistContext";
import CartDrawer from "./CartDrawer";

const HeaderMiddle = () => {
  const { user, logoutUser } = useContext(UserContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const {
    containerRef,
    query,
    setQuery,
    open,
    setOpen,
    loading,
    suggessions,
    submitQuery,
  } = useSearch();
  const { items: cartItems } = useContext(CartContext);
  const { items: wishlistItems } = useContext(WishlistContext);

  return (
    <div className="bg-white border-b border-neutral-200 py-4 shadow-sm">
      <div className="w-[95%] mx-auto flex items-center justify-between gap-8">
        
        {/* Logo Section */}
        <div className="flex items-center">
          <Link href="/">
            <div className="leading-tight uppercase text-2xl tracking-wider select-none">
              <span className="text-[#b00015] font-extrabold text-3xl">FORTUNEAE</span>
              <span className="text-black font-light text-lg ml-2 tracking-wider">FBM BUILDING MATERIAL</span>
            </div>
          </Link>
        </div>

        {/* Search Bar Section */}
        <div className="flex-1 max-w-2xl relative">
          <form
            className="w-full relative"
            onSubmit={submitQuery}
            ref={containerRef}
          >
            <div className="flex items-center bg-neutral-100 rounded-full border border-neutral-300 focus-within:border-neutral-500 focus-within:ring-2 focus-within:ring-neutral-200 transition-all overflow-hidden px-4">
              <input
                type="search"
                placeholder="Search for products, brands, and categories..."
                className="w-full py-3 bg-transparent text-[1.4rem] placeholder-neutral-500 text-neutral-800 outline-none border-none focus:outline-none focus:ring-0"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => {
                  if (query.trim().length >= 2) setOpen(true);
                }}
              />
              <button className="p-2 text-neutral-600 hover:text-black transition-colors" type="submit">
                <MagnifyingGlass className="w-[2rem] h-[2rem]" weight="bold" />
              </button>
            </div>

            {/* Suggestions Dropdown */}
            {open && (
              <div className="absolute top-[4.5rem] left-0 right-0 p-4 bg-white border border-neutral-200 shadow-2xl rounded-2xl z-100 max-h-[30rem] overflow-y-auto">
                {loading && (
                  <div className="flex items-center justify-center py-4">
                    <Spinner className="w-[3rem] h-[3rem] animate-spin text-[#b00015]" />
                  </div>
                )}
                {!loading && suggessions.length > 0 ? (
                  suggessions.map((suggestion) => {
                    const imageSrc = suggestion.variant?.images?.[0] || suggestion.thumbnail;
                    return (
                      <Link
                        className="flex items-center justify-between p-3 hover:bg-neutral-100 rounded-xl cursor-pointer text-[1.4rem] transition-colors mb-1 last:mb-0"
                        href={`/product/${suggestion.variant?._id || suggestion._id}`}
                        onClick={() => setOpen(false)}
                        key={suggestion.variant?._id || suggestion._id}
                      >
                        <div className="text-neutral-700 font-medium truncate max-w-[80%]">
                          {suggestion.product_title}
                        </div>
                        {imageSrc && (
                          <img
                            src={imageSrc}
                            alt={suggestion.product_title}
                            className="w-[3.5rem] h-[3.5rem] object-cover rounded-lg border border-neutral-200"
                          />
                        )}
                      </Link>
                    );
                  })
                ) : !loading ? (
                  <div className="text-[1.4rem] text-neutral-500 text-center py-2">No matches found.</div>
                ) : null}
              </div>
            )}
          </form>
        </div>

        {/* User Navigation Options */}
        <nav className="flex items-center gap-8">
          
          {/* Wishlist */}
          <Link href="/wishlist" className="relative flex flex-col items-center gap-1 text-neutral-700 hover:text-[#b00015] transition-colors group">
            <div className="relative">
              <Heart className="w-[2.4rem] h-[2.4rem] group-hover:scale-110 transition-transform duration-200" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-2 text-[0.8rem] font-bold py-[0.1rem] px-[0.5rem] bg-[#b00015] text-white rounded-full scale-90">
                  {wishlistItems.length}
                </span>
              )}
            </div>
            <span className="text-[1.2rem] font-medium hidden sm:inline">Wishlist</span>
          </Link>

          {/* Cart */}
          <div 
            onClick={() => setCartDrawerOpen(true)}
            className="relative flex flex-col items-center gap-1 text-neutral-700 hover:text-[#b00015] transition-colors group cursor-pointer"
          >
            <div className="relative">
              <ShoppingCart className="w-[2.4rem] h-[2.4rem] group-hover:scale-110 transition-transform duration-200" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-2 text-[0.8rem] font-bold py-[0.1rem] px-[0.5rem] bg-[#b00015] text-white rounded-full scale-90">
                  {cartItems.length}
                </span>
              )}
            </div>
            <span className="text-[1.2rem] font-medium hidden sm:inline">Cart</span>
          </div>

          {/* Account Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            {user ? (
              <div className="flex flex-col items-center gap-1 text-neutral-700 hover:text-black cursor-pointer select-none">
                <div className="flex items-center gap-1">
                  <User className="w-[2.4rem] h-[2.4rem]" />
                  <CaretDown className="w-[1.2rem] h-[1.2rem]" />
                </div>
                <span className="text-[1.2rem] font-medium hidden sm:inline max-w-[8rem] truncate">
                  {user.name || "My Account"}
                </span>

                {/* Account Dropdown Panel */}
                {dropdownOpen && (
                  <div className="absolute right-0 top-[3.5rem] w-[20rem] bg-white border border-neutral-200 shadow-2xl rounded-2xl py-3 z-150 animate-fadeIn">
                    <div className="px-4 py-2 border-b border-neutral-100 text-left">
                      <div className="text-[1.2rem] text-neutral-400">Signed in as</div>
                      <div className="text-[1.3rem] font-bold text-neutral-800 truncate">{user.email}</div>
                    </div>
                    <Link href="/profile" className="block text-left px-4 py-3 text-[1.4rem] text-neutral-700 hover:bg-neutral-100 hover:text-black transition-colors font-medium">
                      My Profile
                    </Link>
                    <Link href="/profile?tab=orders" className="block text-left px-4 py-3 text-[1.4rem] text-neutral-700 hover:bg-neutral-100 hover:text-black transition-colors font-medium">
                      Order History
                    </Link>
                    <Link href="/wishlist" className="block text-left px-4 py-3 text-[1.4rem] text-neutral-700 hover:bg-neutral-100 hover:text-black transition-colors font-medium">
                      My Wishlist
                    </Link>
                    <button
                      onClick={logoutUser}
                      className="w-full flex items-center gap-2 text-left px-4 py-3 text-[1.4rem] text-red-600 hover:bg-neutral-100 transition-colors font-medium border-t border-neutral-100"
                    >
                      <SignOut className="w-[1.8rem] h-[1.8rem]" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/register/sign-in" className="text-[1.4rem] font-bold text-neutral-700 hover:text-[#b00015] px-3 py-2 transition-colors">
                  Sign In
                </Link>
                <Link href="/register/sign-in" className="text-[1.4rem] font-bold bg-[#b00015] text-white px-5 py-2.5 rounded-full hover:bg-red-800 transition-all hover:shadow-lg shadow-sm">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

        </nav>
      </div>

      <CartDrawer isOpen={cartDrawerOpen} onClose={() => setCartDrawerOpen(false)} />
    </div>
  );
};

export default HeaderMiddle;
