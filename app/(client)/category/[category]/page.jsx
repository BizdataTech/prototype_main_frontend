"use client";

import { useParams } from "next/navigation";
import ProductlistSidebar from "./ProductlistSidebar";
import ProductlistBody from "./ProductlistBody";
import { useEffect, useState } from "react";

const ProductList = () => {
  const { category } = useParams();
  const [categoryObject, setCategoryObject] = useState(null);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filter, setFilter] = useState({});
  const [sidebar, setSidebar] = useState([]);
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    // better to filter in backend
    const getProducts = async () => {
      try {
        const response = await fetch(
          `${BACKEND_URL}/api/products?filter=product-list&category=${category}`,
          {
            method: "GET",
          }
        );
        let data = await response.json();
        if (!response.ok) throw new Error(error.message);
        else {
          console.log("product list from backend:", data.products);
          setProducts(data.products);
          setFilteredProducts(data.products);
        }
      } catch (error) {
        console.log("error:", error.message);
      }
    };
    getProducts();
  }, [category]);

  useEffect(() => {
    const filtered = products.filter((product) => {
      return Object.entries(filter).every(([key, values]) => {
        // values is an array (e.g., ["Nike", "Adidas"])
        return values.includes(product[key]);
      });
    });

    setFilteredProducts(filtered);
  }, [filter, products]);

  const filterProducts = (e) => {
    const { name, value, checked } = e.target;

    setFilter((prev) => {
      const prevValues = prev[name] || [];

      let updatedValues = checked
        ? [...prevValues, value] // add if checked
        : prevValues.filter((v) => v !== value); // remove if unchecked

      // if array empty, remove the key
      const newFilter = { ...prev };
      if (updatedValues.length > 0) newFilter[name] = updatedValues;
      else delete newFilter[name];

      return newFilter;
    });
  };

  useEffect(() => {
    const getCategory = async () => {
      try {
        let response = await fetch(
          `${BACKEND_URL}/api/categories/${category}?filter=product-list`,
          { method: "GET" }
        );
        let data = await response.json();
        if (!response.ok) throw new Error(data.message);
        else {
          setCategoryObject(data.category);
        }
      } catch (error) {
        console.error(error.message);
      }
    };
    getCategory();
  }, [category]);

  useEffect(() => {
    let brands = [...new Set(products.map((product) => product.brand))];
    let obj1 = {
      head: "Brands",
      label: "brand",
      data: brands,
    };
    setSidebar([obj1]);
  }, [products]);

  return (
    <main className="bg-pattern">
      <div className="product-list w-[90%] mx-auto pt-[15rem] pb-4">
        <div className="flex gap-6 my-2">
          <ProductlistSidebar
            sidebar={sidebar}
            filterProducts={filterProducts}
          />
          <ProductlistBody
            products={filteredProducts}
            categoryObject={categoryObject}
          />
        </div>
      </div>
    </main>
  );
};

export default ProductList;
