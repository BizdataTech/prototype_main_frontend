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
  const [loading, setLoading] = useState(true);
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${BACKEND_URL}/api/products?filter=product-list&category=${category}`,
          {
            method: "GET",
          }
        );
        let data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to fetch products");
        else {
          setProducts(data.products || []);
          setFilteredProducts(data.products || []);
        }
      } catch (error) {
        console.log("error:", error.message);
      } finally {
        setLoading(false);
      }
    };
    if (category) getProducts();
  }, [category, BACKEND_URL]);

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
    const getCategory = async () => {
      try {
        let response = await fetch(
          `${BACKEND_URL}/api/auto-categories/${category}?filter=product-list`,
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
    if (category) getCategory();
  }, [category, BACKEND_URL]);

  useEffect(() => {
    let brands = [...new Set(products.map((product) => product.brand).filter(Boolean))];
    let obj1 = {
      head: "Brands",
      label: "brand",
      data: brands,
    };
    setSidebar([obj1]);
  }, [products]);

  return (
    <main className="lg:pt-[11rem] bg-[#f8f9fa] min-h-screen pb-20">
      <div className="product-list w-[95%] md:w-[90%] mx-auto py-8">
        <div className="flex flex-col md:flex-row gap-6 my-2">
          <ProductlistSidebar
            sidebar={sidebar}
            filterProducts={filterProducts}
          />
          {loading ? (
            <div className="flex-1 space-y-6">
              <div className="h-28 bg-white rounded-2xl animate-pulse border border-neutral-200" />
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-80 bg-white rounded-2xl animate-pulse border border-neutral-200" />
                ))}
              </div>
            </div>
          ) : (
            <ProductlistBody
              products={filteredProducts}
              categoryObject={categoryObject}
            />
          )}
        </div>
      </div>
    </main>
  );
};

export default ProductList;
