import { createContext, useState, useEffect, useContext } from "react";
import { toast } from "sonner";
import { UserContext } from "./userContext";
import axios from "axios";

const CartContext = createContext();
const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const { user } = useContext(UserContext);

  // Fetch cart data whenever the logged-in user state changes
  useEffect(() => {
    const getCart = async () => {
      // Abort cart fetching for guest users to prevent 401 console error logs
      if (!user) {
        setCart(null);
        return;
      }
      try {
        let response = await fetch(`${BACKEND_URL}/api/cart`, {
          method: "GET",
          credentials: "include",
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message);
        console.log("cart response:", result.cart);
        setCart(result.cart);
      } catch (error) {
        console.error("Error in Cart Fetch:", error.message);
      }
    };
    getCart();
  }, [user]);

  const getCart = () => {};

  const addToCart = async (productId) => {
    try {
      let response = await fetch(`${BACKEND_URL}/api/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ productId }),
      });
      let result = await response.json();
      if (response.status === 401) {
        return toast.error("Failed : User is not Signed Up");
      }
      if (!response.ok) throw new Error(result.message);
      setCart(result.cart);
      console.log("product successfully added to cart :", result.cart);
    } catch (error) {
      console.error(error.message);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      let response = await fetch(`${BACKEND_URL}/api/cart/${productId}`, {
        method: "DELETE",
        credentials: "include",
      });
      let result = await response.json();
      if (!response.ok) throw new Error(result.message);
      setCart(result.cart);
      toast.success("Product removed from cart");
    } catch (error) {
      console.error("Remove from cart error:", error.message);
      toast.error("Failed to remove product from cart");
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;
    try {
      let response = await fetch(`${BACKEND_URL}/api/cart`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ productId, quantity }),
      });
      let result = await response.json();
      if (!response.ok) throw new Error(result.message);
      setCart(result.cart);
    } catch (error) {
      console.error("Update quantity error:", error.message);
      toast.error("Failed to update cart quantity");
    }
  };

  const getCartTotal = () => {
    return cart?.cartTotal || 0;
  };

  const clearCart = async () => {
    try {
      let response = await fetch(`${BACKEND_URL}/api/cart`, {
        method: "DELETE",
        credentials: "include",
      });
      let data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setCart(null);
      toast.success("Cart cleared");
      console.log("cart cleared");
      return true;
    } catch (error) {
      console.log("error:", error.message);
      return false;
    }
  };

  const value = {
    items: cart?.items || [],
    cart,
    addToCart,
    getCart,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    clearCart,
  };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export { CartContext, CartProvider };
