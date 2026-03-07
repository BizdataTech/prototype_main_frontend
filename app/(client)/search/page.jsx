"use client";

import { useEffect, useState } from "react";
import ProductlistBody from "../category/[category]/ProductlistBody";
import ProductlistSidebar from "../category/[category]/ProductlistSidebar";
import { useSearchParams } from "next/navigation";

const SearchResult = () => {
  let [products, setProducts] = useState([]);
  let sidebar = [];
  let categoryObject = {};

  const searchParams = useSearchParams();
  const query = searchParams.get("query");
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    let url = `${BACKEND_URL}/api/products?filter=search&query=${encodeURIComponent(
      query
    )}`;
    let fetchProducts = async () => {
      try {
        let response = await fetch(url, {
          method: "GET",
          credentials: "include",
        });
        if (!response.ok)
          throw new Error("Failed to get products based on search");
        let data = await response.json();
        console.log("search results:", data.products);
        setProducts(data.products);
      } catch (error) {
        console.log("error:", error.message);
      }
    };
    fetchProducts();
  }, [query]);

  return (
    <main className="bg-pattern">
      <div className="product-list w-[90%] mx-auto pt-[15rem] pb-4 ">
        <div className="flex gap-6 my-2">
          <ProductlistSidebar sidebar={sidebar} />
          <ProductlistBody
            query={query}
            products={products}
            categoryObject={categoryObject}
          />
        </div>
      </div>
    </main>
  );
};

export default SearchResult;
