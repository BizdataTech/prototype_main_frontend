import { createContext, useState, useEffect, useContext } from "react";
import { toast } from "sonner";
import { UserContext } from "./userContext";
import axios from "axios";

const CartContext = createContext();
const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const { user } = useContext(UserContext);

  useEffect(() => {
    const getCart = async () => {
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

  const removeFromCart = (id) => {};

  const updateQuantity = () => {};

  const getCartTotal = () => {};

  const clearCart = async () => {
    try {
      let response = await fetch(`${BACKEND_URL}api/cart`, {
        method: "DELETE",
        credentials: "include",
      });
      let data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setCart(null);
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
