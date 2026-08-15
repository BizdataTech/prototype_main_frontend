"use client";

import { createContext, useState, useEffect, useContext } from "react";
import { toast } from "sonner";
import { UserContext } from "./userContext";

const WishlistContext = createContext();

const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(null);
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const { user } = useContext(UserContext);

  // Fetch wishlist whenever the logged-in user state changes
  useEffect(() => {
    const getWishlist = async () => {
      // Abort wishlist fetching for guest users to prevent 401 console errors
      if (!user) {
        setWishlist(null);
        return;
      }
      try {
        const response = await fetch(`${BACKEND_URL}/api/wishlist`, {
          method: "GET",
          credentials: "include",
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message);
        console.log("wishlist response:", result.wishlist);
        setWishlist(result.wishlist);
      } catch (error) {
        console.error("Error fetching wishlist:", error.message);
      }
    };
    getWishlist();
  }, [user]);

  /**
   * Adds a product to the wishlist and updates local state immediately.
   * Redirects to sign-in page if the user is not logged in.
   */
  const addToWishlist = async (productId) => {
    if (!user) {
      toast.error("Please sign in to add items to your wishlist");
      return false;
    }
    try {
      const response = await fetch(`${BACKEND_URL}/api/wishlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ productId }),
      });
      const result = await response.json();
      if (response.status === 401) {
        return toast.error("Failed: User is not Signed In");
      }
      if (!response.ok) throw new Error(result.message);
      setWishlist(result.wishlist);
      toast.success("Added to wishlist!");
      console.log("Added to wishlist:", result.wishlist);
      return true;
    } catch (error) {
      console.error("Add to wishlist error:", error.message);
      toast.error("Failed to add to wishlist");
      return false;
    }
  };

  /**
   * Removes a single product from the wishlist and updates local state immediately.
   */
  const removeFromWishlist = async (productId) => {
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/wishlist/${productId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);
      setWishlist(result.wishlist);
      toast.success("Removed from wishlist");
      console.log("Removed from wishlist:", result.wishlist);
    } catch (error) {
      console.error("Remove from wishlist error:", error.message);
      toast.error("Failed to remove from wishlist");
    }
  };

  /**
   * Checks if a product is already in the wishlist.
   */
  const isInWishlist = (productId) => {
    if (!wishlist?.items) return false;
    return wishlist.items.some(
      (item) =>
        item.productId?._id?.toString() === productId?.toString() ||
        item.productId?.toString() === productId?.toString()
    );
  };

  /**
   * Clears all items from the wishlist.
   */
  const clearWishlist = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/wishlist`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setWishlist(null);
      toast.success("Wishlist cleared");
    } catch (error) {
      console.error("Clear wishlist error:", error.message);
    }
  };

  const value = {
    wishlist,
    items: wishlist?.items || [],
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export { WishlistContext, WishlistProvider };
