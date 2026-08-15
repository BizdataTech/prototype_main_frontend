"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ProductlistBody from "../category/[category]/ProductlistBody";
import ProductlistSidebar from "../category/[category]/ProductlistSidebar";

const ProductsContent = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filter, setFilter] = useState({});
  const [sidebar, setSidebar] = useState([]);
  const [dbCategories, setDbCategories] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products?filter=product-list`;
        const response = await fetch(url, { method: "GET" });
        const data = await response.json();
        if (response.ok) {
          setProducts(data.products || []);
          setFilteredProducts(data.products || []);
        }
      } catch (error) {
        console.log("error:", error.message);
      }
    };
    const fetchCategories = async () => {
      try {
        const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auto-categories?filter=product-category`;
        const response = await fetch(url, { method: "GET" });
        const data = await response.json();
        if (response.ok) {
          setDbCategories(data.categories || []);
        }
      } catch (error) {
        console.log("error:", error.message);
      }
    };
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    const filtered = products.filter((product) => {
      return Object.entries(filter).every(([key, values]) => {
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
        ? [...prevValues, value]
        : prevValues.filter((v) => v !== value);
      const newFilter = { ...prev };
      if (updatedValues.length > 0) newFilter[name] = updatedValues;
      else delete newFilter[name];
      return newFilter;
    });
  };

  useEffect(() => {
    const brands = [...new Set(products.map((product) => product.brand).filter(Boolean))];
    const categories = [...new Set(dbCategories.map((c) => c.title).filter(Boolean))];
    const obj1 = {
      head: "Brands",
      label: "brand",
      data: brands,
    };
    const obj2 = {
      head: "Categories",
      label: "category",
      data: categories,
    };
    setSidebar([obj2, obj1]);
  }, [products, dbCategories]);

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
            categoryObject={{ title: "All Products" }}
          />
        </div>
      </div>
    </main>
  );
};

const Products = () => {
  return (
    <Suspense fallback={<div className="pt-[15rem] text-center text-[1.6rem]">Loading Products...</div>}>
      <ProductsContent />
    </Suspense>
  );
};

export default Products;
