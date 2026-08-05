"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProductCard from "./category/[category]/ProductCard";

const ClientPage = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch categories
        const catRes = await fetch(`${BACKEND_URL}/api/auto-categories?filter=product-category`);
        const catData = await catRes.json();
        if (catRes.ok) {
          setCategories(catData.categories || []);
        }

        // Fetch products
        const prodRes = await fetch(`${BACKEND_URL}/api/products?filter=product-list`);
        const prodData = await prodRes.json();
        if (prodRes.ok) {
          setProducts(prodData.products || []);
        }
      } catch (error) {
        console.error("Error fetching homepage data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [BACKEND_URL]);

  if (loading) {
    return (
      <main className="lg:pt-[11rem] w-[90%] mx-auto py-12 space-y-12">
        <div className="a-animation--container h-[35rem] rounded-3xl overflow-hidden my-4">
          <div className="a-animation--mask a-animation--effect"></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="shimmer h-[12rem] rounded-2xl"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 pt-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="shimmer h-[25rem] rounded-2xl"></div>
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="lg:pt-[11rem] bg-pattern min-h-screen pb-16">
      {/* Hero Section */}
      <section className="w-[95%] md:w-[90%] mx-auto my-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-neutral-900 via-neutral-800 to-blue-950 text-white p-8 md:p-20 shadow-xl flex flex-col justify-center min-h-[380px]">
          <div className="relative z-10 max-w-2xl space-y-4 md:space-y-6">
            <span className="inline-block bg-blue-500/20 text-blue-300 px-4 py-1.5 rounded-full text-[1.2rem] font-semibold tracking-wide uppercase">
              Summer Collection 2026
            </span>
            <h1 className="text-[2.8rem] sm:text-[3.5rem] md:text-[5rem] font-bold leading-tight tracking-tight">
              Elevate Your Everyday Style & Electronics
            </h1>
            <p className="text-[1.4rem] md:text-[1.6rem] text-neutral-300 leading-relaxed">
              Explore our premium range of top-tier brands and collections crafted just for you. Seamless ordering, fast shipping.
            </p>
            <div className="pt-4">
              <Link
                href="/products"
                className="inline-block bg-white text-black hover:bg-neutral-100 transition-all font-semibold text-[1.5rem] px-8 py-3.5 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform duration-200"
              >
                Shop All Products
              </Link>
            </div>
          </div>
          <div className="absolute right-0 bottom-0 top-0 w-1/2 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-400 via-transparent to-transparent pointer-events-none"></div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="w-[95%] md:w-[90%] mx-auto my-12 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-[2.2rem] font-bold text-neutral-800 tracking-tight">
            Featured Products
          </h2>
          <Link
            href="/products"
            className="text-[1.4rem] font-semibold text-blue-600 hover:text-blue-800 transition-colors"
          >
            View All →
          </Link>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.slice(0, 8).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center border border-neutral-100 space-y-3">
            <span className="text-[4rem]">🛍️</span>
            <h3 className="text-[1.8rem] font-semibold text-neutral-700">No products found</h3>
            <p className="text-[1.4rem] text-neutral-500 max-w-md mx-auto">
              We're currently stocking up on new items. Please check back soon or visit the admin panel to add products!
            </p>
          </div>
        )}
      </section>
    </main>
  );
};

export default ClientPage;
