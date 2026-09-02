"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProductCard from "./category/[category]/ProductCard";
import axios from "axios";
import useSWR from "swr";

const fetcher = (url) => axios.get(url).then((res) => res.data);

const ClientPage = () => {
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  // ── Fetch all home sections (auto-refreshes every 5 s) ──────────────────
  const { data, error, isLoading } = useSWR(
    `${BACKEND_URL}/api/home-sections`,
    fetcher,
    { refreshInterval: 5000 }
  );

  // ── Derive sorted + active sections from SWR data ───────────────────────
  const rawSections = (data?.sections || [])
    .filter((s) => s.active !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  // ── Fetch products for product_listing sections ──────────────────────────
  const [enrichedSections, setEnrichedSections] = useState(null); // null = not yet enriched

  useEffect(() => {
    if (!rawSections.length) {
      setEnrichedSections([]);
      return;
    }

    let cancelled = false;

    const enrich = async () => {
      // Deep-clone so we never mutate SWR's cached object
      const cloned = rawSections.map((s) => ({ ...s }));

      await Promise.all(
        cloned.map(async (section) => {
          if (
            section.section_type === "product_listing" &&
            section.reference?.id
          ) {
            try {
              const refId =
                typeof section.reference.id === "object"
                  ? section.reference.id._id ?? section.reference.id
                  : section.reference.id;
              if (section.reference.type === "category") {
                // Fetch products directly by category ID
                const prodRes = await axios.get(
                  `${BACKEND_URL}/api/products?filter=product-list&category=${refId}`
                );
                section.products = prodRes.data?.products || [];
              } else {
                // Fetch products from a content block
                const prodRes = await axios.get(
                  `${BACKEND_URL}/api/content-blocks/${refId}?filter=client`
                );
                section.products = prodRes.data?.block?.products || [];
              }
            } catch {
              section.products = [];
            }
          }
        })
      );

      if (!cancelled) setEnrichedSections(cloned);
    };

    enrich();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]); // re-run only when SWR data changes

  // Use enrichedSections once ready, otherwise fall back to rawSections
  // so banners display immediately without waiting for product enrichment
  const displaySections = enrichedSections ?? rawSections;

  // ── Loading state ────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <main className="lg:pt-[11rem] w-[90%] mx-auto py-12 space-y-12">
        <div className="a-animation--container h-[35rem] rounded-3xl overflow-hidden my-4">
          <div className="a-animation--mask a-animation--effect"></div>
        </div>
        {[...Array(4)].map((_, i) => (
          <div key={i} className="shimmer h-[25rem] rounded-2xl"></div>
        ))}
      </main>
    );
  }

  // ── Error state ──────────────────────────────────────────────────────────
  if (error) {
    return (
      <main className="lg:pt-[11rem] bg-pattern min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <span className="text-[6rem]">⚠️</span>
          <h1 className="text-[2.4rem] font-bold text-neutral-700">
            Failed to load homepage
          </h1>
          <p className="text-[1.4rem] text-neutral-500">
            Please check your connection and try refreshing.
          </p>
        </div>
      </main>
    );
  }

  // ── Empty state ──────────────────────────────────────────────────────────
  if (displaySections.length === 0) {
    return (
      <main className="lg:pt-[11rem] bg-pattern min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <span className="text-[6rem]">🏗️</span>
          <h1 className="text-[2.4rem] font-bold text-neutral-700">
            Homepage is being configured
          </h1>
          <p className="text-[1.4rem] text-neutral-500">
            Check back soon — we&apos;re setting things up!
          </p>
        </div>
      </main>
    );
  }

  // ── Render sections ──────────────────────────────────────────────────────
  return (
    <main className="lg:pt-[11rem] bg-pattern min-h-screen pb-16">
      {displaySections.map((section) => {

        /* ── HERO BANNER / PROMOTIONAL BANNER ─────────────────────────── */
        if (
          section.section_type === "hero_banner" ||
          section.section_type === "mid_page_banner"
        ) {
          const isHero = section.section_type === "hero_banner";

          return (
            <section
              key={section._id}
              className="w-[95%] md:w-[90%] mx-auto my-8"
            >
              {(section.banners || []).map((banner, bIdx) => (
                <div
                  key={bIdx}
                  className={`relative overflow-hidden rounded-3xl shadow-xl mb-4 flex flex-col justify-end ${
                    isHero ? "min-h-[460px]" : "min-h-[260px]"
                  }`}
                  style={{
                    backgroundImage: banner.image?.url
                      ? `url(${banner.image.url})`
                      : "none",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundColor: banner.image?.url
                      ? "transparent"
                      : "#1e293b",
                  }}
                >
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />

                  {/* Text content — only if at least one field exists */}
                  {(banner.subtitle || banner.heading || banner.button_text) && (
                    <div className="relative z-10 p-8 md:p-14 space-y-3 max-w-3xl">
                      {banner.subtitle && (
                        <span className="inline-block bg-blue-500/30 text-blue-200 backdrop-blur-sm px-4 py-1 rounded-full text-[1.2rem] font-semibold tracking-widest uppercase">
                          {banner.subtitle}
                        </span>
                      )}
                      {banner.heading && (
                        <h2
                          className={`font-bold leading-tight tracking-tight text-white drop-shadow-md ${
                            isHero
                              ? "text-[3rem] md:text-[4.5rem]"
                              : "text-[2.2rem] md:text-[3rem]"
                          }`}
                        >
                          {banner.heading}
                        </h2>
                      )}
                      {banner.button_text && (
                        <div className="pt-2">
                          <Link
                            href={
                              banner.redirection && banner.reference?.slug
                                ? banner.reference.type === "category"
                                  ? `/category/${banner.reference.slug}`
                                  : `/products?block=${banner.reference.slug}`
                                : "/products"
                            }
                            className="inline-block bg-white text-black hover:bg-neutral-100 font-semibold text-[1.4rem] px-7 py-3 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform duration-200 transition-all"
                          >
                            {banner.button_text}
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </section>
          );
        }

        /* ── PRODUCT LISTING ───────────────────────────────────────────── */
        if (section.section_type === "product_listing") {
          return (
            <section
              key={section._id}
              className="w-[95%] md:w-[90%] mx-auto my-12"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-[2.2rem] font-bold text-neutral-800 tracking-tight">
                  {section.title || "Products"}
                </h2>
                <Link
                  href={
                    section.reference?.slug
                      ? `/products?block=${section.reference.slug}`
                      : "/products"
                  }
                  className="text-[1.4rem] font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                >
                  View All →
                </Link>
              </div>

              {section.products && section.products.length > 0 ? (
                <div
                  className={`grid gap-6 ${
                    section.layout === "grid"
                      ? "grid-cols-2 md:grid-cols-4 lg:grid-cols-5"
                      : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                  }`}
                >
                  {section.products
                    .slice(0, section.limit || 8)
                    .map((product) => (
                      <ProductCard key={product._id} product={product} />
                    ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl p-12 text-center border border-neutral-100">
                  <span className="text-[4rem]">🛍️</span>
                  <h3 className="text-[1.8rem] font-semibold text-neutral-700 mt-3">
                    No products in this section
                  </h3>
                  <p className="text-[1.4rem] text-neutral-500">
                    Add products to the linked content block to display them
                    here.
                  </p>
                </div>
              )}
            </section>
          );
        }

        return null;
      })}
    </main>
  );
};

export default ClientPage;
