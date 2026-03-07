import { useState, useEffect } from "react";

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [categoryId, setCategoryId] = useState(null);
  let BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    if (!categoryId) return;
    let fetchProducts = async () => {
      try {
        let response = await fetch(
          `${BACKEND_URL}/api/products?filter=home&category=${categoryId}&product_limit=5`,
          { method: "GET" }
        );
        let data = await response.json();
        if (!response.ok) throw new Error(data.message);
        else {
          console.log("products:", data.products);
          setProducts(data.products);
        }
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchProducts();
  }, [categoryId]);

  const getProducts = (id) => {
    setCategoryId(id);
  };

  return { products, getProducts };
};
