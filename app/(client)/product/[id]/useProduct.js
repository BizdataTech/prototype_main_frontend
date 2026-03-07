import { useState, useEffect, useContext } from "react";
import { UserContext } from "@/context/userContext";
import { useRouter, useParams } from "next/navigation";
import { CartContext } from "@/context/cartContext";
export const useProduct = () => {
  let [product, setProduct] = useState(null);
  let router = useRouter();
  const { id } = useParams();

  const { user } = useContext(UserContext);
  const { addToCart } = useContext(CartContext);
  let BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    const getProductData = async () => {
      try {
        let response = await fetch(`${BACKEND_URL}/api/products/${id}`, {
          method: "GET",
        });
        let data = await response.json();
        if (!response.ok) throw new Error(data.message);
        else {
          console.log("product:", data.products);
          setProduct(data.products[0]);
        }
      } catch (error) {
        console.log("error:", error.message);
      }
    };
    getProductData();
  }, []);

  const addProducttoCart = async (productId) => {
    if (!user) router.push("/register/sign-in");
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/products/${productId}?filter=stock`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);
      let fetchProduct = result.products[0];
      if (fetchProduct.stock <= 0)
        return toast.error("Sorry, This product is now out of stock.");
      //   add product to cart
      const result2 = await addToCart(productId);
      return;
    } catch (error) {
      console.log("stock fetch error:", error.message);
    }
  };

  return { product, addProducttoCart };
};
