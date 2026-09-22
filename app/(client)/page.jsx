"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import useSWR from "swr";
import { ArrowRight } from "phosphor-react";

import ServiceStrip from "@/components/client/Home/ServiceStrip";
import DynamicCategoryGrid from "@/components/client/Home/DynamicCategoryGrid";
import ProductShelf from "@/components/client/Home/ProductShelf";
import BannerCarousel from "@/components/client/Home/BannerCarousel";

const fetcher = (url) => axios.get(url).then((res) => res.data);

const ClientPage = () => {
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  // ── 1. Fetch all home sections (auto-refreshes every 5s from DB) ────────
  const { data, error, isLoading } = useSWR(
    `${BACKEND_URL}/api/home-sections`,
    fetcher,
    { refreshInterval: 5000 }
  );
  console.log('Fetched home sections', data);

  // ── 2. Derive sorted & active sections ───────────────────────────────────
  const rawSections = (data?.sections || [])
    .filter((s) => s.active !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  // ── 3. Enrich product listings with live database products ───────────────
  const [enrichedSections, setEnrichedSections] = useState(null);

  useEffect(() => {
    if (!rawSections.length) {
      setEnrichedSections([]);
      return;
    }

    let cancelled = false;

    const enrich = async () => {
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
                const prodRes = await axios.get(
                  `${BACKEND_URL}/api/products?filter=product-list&category=${refId}`
                );
                section.products = prodRes.data?.products || [];
              } else {
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
    return () => {
      cancelled = true;
    };
  }, [data]);

  const displaySections = enrichedSections ?? rawSections;

  // ── Loading Skeleton ─────────────────────────────────────────────────────
  if (isLoading && !displaySections.length) {
    return (
      <main className="pt-[10rem] sm:pt-[12rem] lg:pt-[16rem] w-[90%] mx-auto py-12 space-y-10 min-h-screen">
        <div className="h-20 bg-neutral-200 rounded-2xl animate-pulse" />
        <div className="h-[420px] bg-neutral-200 rounded-3xl animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-44 bg-neutral-200 rounded-2xl animate-pulse" />
          ))}
        </div>
        {[...Array(2)].map((_, i) => (
          <div key={i} className="h-[320px] bg-neutral-200 rounded-2xl animate-pulse" />
        ))}
      </main>
    );
  }

  // ── Error State ──────────────────────────────────────────────────────────
  if (error && !displaySections.length) {
    return (
      <main className="pt-[10rem] sm:pt-[12rem] lg:pt-[16rem] min-h-screen flex items-center justify-center p-6">
        <div className="text-center space-y-4 max-w-md bg-white p-10 rounded-3xl border border-neutral-200 shadow-lg">
          <span className="text-[5rem]">⚠️</span>
          <h1 className="text-[2.4rem] font-bold text-neutral-800">
            Unable to connect to server
          </h1>
          <p className="text-[1.4rem] text-neutral-500">
            Please make sure the backend server is running and try refreshing.
          </p>
        </div>
      </main>
    );
  }

  // ── Separate Sections for the exact requested visual hierarchy ───────────
  const heroSections = displaySections.filter(
    (s) => s.section_type === "hero_banner"
  );
  const midBanners = displaySections.filter(
    (s) => s.section_type?.includes("banner") && s.section_type !== "hero_banner"
  );
  const productSections = displaySections.filter(
    (s) => s.section_type === "product_listing"
  );

  // Identify specific product sections based on title or fallback order
  const newArrivals =
    productSections.find((s) => /new arrivals/i.test(s.title)) ||
    productSections[0];

  const trendingProducts =
    productSections.find((s) => /trending/i.test(s.title)) ||
    productSections.find((s) => s !== newArrivals);

  const featuredProducts =
    productSections.find((s) => /featured/i.test(s.title)) ||
    productSections.find((s) => s !== newArrivals && s !== trendingProducts);

  const bestSellersOrTools =
    productSections.find((s) => /tools|best seller|popular/i.test(s.title)) ||
    productSections.find(
      (s) =>
        s !== newArrivals &&
        s !== trendingProducts &&
        s !== featuredProducts
    );

  const promoBanner1 = midBanners[0];
  const promoBanner2 = midBanners[1] || midBanners[0];

  // Any other product sections configured by admin
  const remainingSections = productSections.filter(
    (s) =>
      s !== newArrivals &&
      s !== trendingProducts &&
      s !== featuredProducts &&
      s !== bestSellersOrTools
  );

  // Helper to render banner cards
  const renderBannerItem = (banner, isHero = false) => {
    if (!banner?.image?.url) return null;

    const bannerContent = (
      <div
        className={`relative overflow-hidden rounded-3xl shadow-md transition-all duration-300 hover:shadow-xl group flex flex-col justify-end ${
          isHero
            ? "min-h-[380px] sm:min-h-[460px] md:min-h-[520px]"
            : "min-h-[220px] sm:min-h-[280px] md:min-h-[340px]"
        }`}
        style={{
          backgroundImage: `url(${banner.image.url})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundColor: "#1e293b",
        }}
      >
        {/* Subtle gradient overlay if text exists */}
        {(banner.heading || banner.subtitle || banner.button_text) && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent" />
        )}

        {(banner.heading || banner.subtitle || banner.button_text) && (
          <div className="relative z-10 p-6 sm:p-10 md:p-14 space-y-4 max-w-2xl">
            {banner.subtitle && (
              <span className="inline-block bg-[#b00015] text-white px-4 py-1.5 rounded-full text-[1.2rem] font-bold tracking-widest uppercase shadow-md">
                {banner.subtitle}
              </span>
            )}
            {banner.heading && (
              <h2
                className={`font-extrabold leading-tight text-white drop-shadow-md tracking-tight ${
                  isHero
                    ? "text-[2.8rem] sm:text-[4rem] md:text-[4.8rem]"
                    : "text-[2.2rem] sm:text-[3rem]"
                }`}
              >
                {banner.heading}
              </h2>
            )}
            {banner.button_text && (
              <div className="pt-2">
                <span className="inline-flex items-center gap-2 bg-[#b00015] hover:bg-[#8f0011] text-white font-bold text-[1.4rem] px-7 py-3 rounded-xl shadow-lg transition-transform hover:-translate-y-0.5">
                  {banner.button_text} <ArrowRight size={16} weight="bold" />
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    );

    if (banner.redirection && banner.reference?.slug) {
      const href =
        banner.reference.type === "category"
          ? `/category/${banner.reference.slug}`
          : `/products?block=${banner.reference.slug}`;
      return (
        <Link key={banner.image.public_id || banner.image.url} href={href} className="block">
          {bannerContent}
        </Link>
      );
    }

    return (
      <div key={banner.image.public_id || banner.image.url}>
        {bannerContent}
      </div>
    );
  };

  // Helper for dynamic section View All links to backend categories
  const getViewAllLink = (section) => {
    if (!section?.reference) return "/products";
    if (section.reference.id) {
      return `/category/${section.reference.id}`;
    }
    if (section.reference.slug) {
      return `/category/${section.reference.slug.replace(/_/g, "-")}`;
    }
    return "/products";
  };

  return (
    <main className="pt-[10rem] sm:pt-[12rem] lg:pt-[16rem] bg-[#f8f9fa] min-h-screen pb-20">
      
      {/* ── 1. TOP PROMOTIONAL / SERVICE STRIP ──────────────────────────── */}
      <ServiceStrip />

      {/* ── 2. HERO SECTION (Dynamic from Backend) ────────────────────── */}
      {heroSections.map((section) => (
        <section key={section._id} className="w-[95%] md:w-[90%] mx-auto my-6">
          <BannerCarousel banners={section.banners || []} isHero={true} />
        </section>
      ))}

      {/* ── 3. NEW ARRIVALS (Live Products from DB) ────────────────────── */}
      {newArrivals && (
        <ProductShelf
          title={newArrivals.title || "New Arrivals"}
          subtitle="Latest building materials & architectural panels in stock"
          badge="JUST ARRIVED"
          products={newArrivals.products || []}
          layout={newArrivals.layout || "horizontal"}
          limit={newArrivals.limit || 10}
          viewAllLink={getViewAllLink(newArrivals)}
        />
      )}

      {/* ── 4. PROMOTIONAL / BANNER SECTION (Mid-Page Banner 1) ────────── */}
      {promoBanner1 && (
        <section className="w-[95%] md:w-[90%] mx-auto my-12">
          <BannerCarousel banners={promoBanner1.banners || []} isHero={false} />
        </section>
      )}

      {/* ── 5. FEATURED PRODUCTS & CATEGORIES ─────────────────────────── */}
      <DynamicCategoryGrid />

      {featuredProducts && (
        <ProductShelf
          title={featuredProducts.title || "Featured Products"}
          subtitle="Top rated acrylic sheets and premium hardware supplies"
          badge="HANDPICKED"
          products={featuredProducts.products || []}
          layout={featuredProducts.layout || "horizontal"}
          limit={featuredProducts.limit || 10}
          viewAllLink={getViewAllLink(featuredProducts)}
        />
      )}

      {/* ── 6. TRENDING SECTION (Live ACP Sheets / Trending Materials) ─── */}
      {trendingProducts && (
        <ProductShelf
          title={trendingProducts.title || "Trending Products"}
          subtitle="Most viewed building and construction materials this month"
          badge="HIGH DEMAND"
          products={trendingProducts.products || []}
          layout={trendingProducts.layout || "horizontal"}
          limit={trendingProducts.limit || 10}
          viewAllLink={getViewAllLink(trendingProducts)}
        />
      )}

      {/* ── 7. BEST SELLERS / POPULAR PRODUCTS (Tools & Hardware) ───────── */}
      {bestSellersOrTools && (
        <ProductShelf
          title={bestSellersOrTools.title || "Best Sellers & Pro Tools"}
          subtitle="Contractor grade power tools and essential equipment"
          badge="BESTSELLER"
          products={bestSellersOrTools.products || []}
          layout={bestSellersOrTools.layout || "horizontal"}
          limit={bestSellersOrTools.limit || 10}
          viewAllLink={getViewAllLink(bestSellersOrTools)}
        />
      )}

      {/* ── 8. PROMOTIONAL OFFER BANNER (Mid-Page Banner 2) ────────────── */}
      {promoBanner2 && promoBanner2 !== promoBanner1 && (
        <section className="w-[95%] md:w-[90%] mx-auto my-12">
          <BannerCarousel banners={promoBanner2.banners || []} isHero={false} />
        </section>
      )}

      {/* ── 9. ADDITIONAL PRODUCT SECTIONS CONFIGURED IN ADMIN ──────────── */}
      {remainingSections.map((section) => (
        <ProductShelf
          key={section._id}
          title={section.title || "Special Collection"}
          products={section.products || []}
          layout={section.layout || "horizontal"}
          limit={section.limit || 10}
          viewAllLink={getViewAllLink(section)}
        />
      ))}
    </main>
  );
};

export default ClientPage;

