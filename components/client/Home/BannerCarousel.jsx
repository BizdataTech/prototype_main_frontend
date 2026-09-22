"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "phosphor-react";

/**
 * BannerCarousel - A horizontal sliding image carousel driven by dynamic backend data.
 * Props:
 *  - banners: Array of banner objects { image:{url,public_id}, heading, subtitle, button_text, redirection, reference }
 *  - isHero: boolean — hero-sized vs mid-page sized
 */
const BannerCarousel = ({ banners = [], isHero = false }) => {
  const scrollRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [failedImages, setFailedImages] = useState({});
  const autoPlayRef = useRef(null);

  const validBanners = banners;
  const total = validBanners.length;

  const scrollToIndex = useCallback(
    (index) => {
      if (!scrollRef.current || total === 0) return;
      const container = scrollRef.current;
      const slideWidth = container.offsetWidth;
      container.scrollTo({ left: index * slideWidth, behavior: "smooth" });
      setCurrentIndex(index);
    },
    [total]
  );

  const goNext = useCallback(() => {
    scrollToIndex((currentIndex + 1) % total);
  }, [currentIndex, total, scrollToIndex]);

  const goPrev = useCallback(() => {
    scrollToIndex((currentIndex - 1 + total) % total);
  }, [currentIndex, total, scrollToIndex]);

  // Sync dot on native scroll (touch swipe)
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    let timer;
    const onScroll = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        const slideWidth = container.offsetWidth;
        if (slideWidth > 0) {
          const idx = Math.round(container.scrollLeft / slideWidth);
          setCurrentIndex(Math.min(Math.max(idx, 0), total - 1));
        }
      }, 80);
    };
    container.addEventListener("scroll", onScroll, { passive: true });
    return () => { container.removeEventListener("scroll", onScroll); clearTimeout(timer); };
  }, [total]);

  // Auto-play
  useEffect(() => {
    if (total <= 1) return;
    autoPlayRef.current = setInterval(goNext, 5500);
    return () => clearInterval(autoPlayRef.current);
  }, [goNext, total]);

  const pauseAutoPlay = () => clearInterval(autoPlayRef.current);
  const resumeAutoPlay = () => {
    clearInterval(autoPlayRef.current);
    if (total > 1) autoPlayRef.current = setInterval(goNext, 5500);
  };

  // Mouse drag
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, scrollLeft: scrollRef.current?.scrollLeft ?? 0 });
    pauseAutoPlay();
  };
  const handleMouseMove = (e) => {
    if (!isDragging || dragStart === null || !scrollRef.current) return;
    scrollRef.current.scrollLeft = dragStart.scrollLeft + (dragStart.x - e.clientX);
  };
  const handleMouseUp = (e) => {
    if (!isDragging) return;
    const dx = Math.abs((dragStart?.x ?? e.clientX) - e.clientX);
    setIsDragging(false);
    setDragStart(null);
    if (dx > 40 && scrollRef.current) {
      const slideWidth = scrollRef.current.offsetWidth;
      const idx = Math.round(scrollRef.current.scrollLeft / slideWidth);
      scrollToIndex(Math.min(Math.max(idx, 0), total - 1));
    }
    resumeAutoPlay();
  };

  if (total === 0) return null;

  const heightClass = isHero
    ? "h-[320px] sm:h-[440px] md:h-[540px] lg:h-[600px]"
    : "h-[200px] sm:h-[260px] md:h-[360px]";

  const renderSlide = (banner, index) => {
    const imgUrl = failedImages[index] ? null : banner.image.url;
    const hasText = banner.heading || banner.subtitle || banner.button_text;

    const slideContent = (
      <div
        className="relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-md flex flex-col justify-end w-full h-full"
        style={{
          backgroundImage: imgUrl ? `url(${imgUrl})` : "none",
          backgroundSize: "cover",
          backgroundPosition: "center top",
          backgroundColor: imgUrl ? "#1e293b" : "#e2e8f0",
          cursor: isDragging ? "grabbing" : total > 1 ? "grab" : "default",
          userSelect: "none",
        }}
      >
        {!imgUrl && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-neutral-400">
            <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21,15 16,10 5,21" />
            </svg>
            <span className="text-[1.3rem] font-medium">Image unavailable</span>
          </div>
        )}
        {!failedImages[index] && (
          <img
            src={banner.image.url}
            alt=""
            className="hidden"
            onError={() => setFailedImages((prev) => ({ ...prev, [index]: true }))}
          />
        )}
        {hasText && imgUrl && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/82 via-black/28 to-transparent pointer-events-none" />
        )}
        {hasText && (
          <div className="relative z-10 p-5 sm:p-8 md:p-12 space-y-2 max-w-3xl pointer-events-none">
            {banner.subtitle && (
              <span className="inline-block bg-[#b00015] text-white px-4 py-1.5 rounded-full text-[1rem] sm:text-[1.1rem] font-bold tracking-widest uppercase shadow-md">
                {banner.subtitle}
              </span>
            )}
            {banner.heading && (
              <h2 className={`font-extrabold leading-tight text-white drop-shadow-lg tracking-tight ${isHero ? "text-[1.8rem] sm:text-[2.8rem] md:text-[3.8rem] lg:text-[4.4rem]" : "text-[1.5rem] sm:text-[2.2rem] md:text-[2.8rem]"}`}>
                {banner.heading}
              </h2>
            )}
            {banner.button_text && (
              <div className="pt-1 pointer-events-auto">
                <span className="inline-flex items-center gap-2 bg-[#b00015] hover:bg-[#8f0011] text-white font-bold text-[1.2rem] sm:text-[1.4rem] px-5 sm:px-7 py-2.5 rounded-xl shadow-lg transition-all duration-200 hover:-translate-y-0.5 active:scale-95 cursor-pointer">
                  {banner.button_text}
                  <ArrowRight size={16} weight="bold" />
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    );

    if (banner.redirection && banner.reference?.slug) {
      const href = banner.reference.type === "category"
        ? `/category/${banner.reference.slug}`
        : `/products?block=${banner.reference.slug}`;
      return (
        <Link key={index} href={href} className="w-full h-full shrink-0 block snap-center snap-always" style={{ minWidth: "100%" }} draggable={false}>
          {slideContent}
        </Link>
      );
    }

    return (
      <div key={index} className="w-full h-full shrink-0 snap-center snap-always" style={{ minWidth: "100%" }}>
        {slideContent}
      </div>
    );
  };

  return (
    <div
      className="relative w-full group/carousel select-none"
      onMouseEnter={pauseAutoPlay}
      onMouseLeave={() => { handleMouseUp({ clientX: dragStart?.x ?? 0 }); resumeAutoPlay(); }}
    >
      {/* Slide container */}
      <div
        ref={scrollRef}
        className={`flex overflow-x-auto scroll-smooth snap-x snap-mandatory rounded-2xl sm:rounded-3xl ${isHero ? "h-[320px] sm:h-[440px] md:h-[540px] lg:h-[600px]" : "h-[200px] sm:h-[260px] md:h-[360px]"}`}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none", WebkitOverflowScrolling: "touch" }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {validBanners.map((banner, i) => renderSlide(banner, i))}
      </div>

      {/* Left arrow */}
      {total > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); goPrev(); }}
          aria-label="Previous slide"
          className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full shadow-xl bg-white/75 hover:bg-white backdrop-blur-md border border-white/40 hover:border-neutral-200 flex items-center justify-center text-neutral-800 hover:text-black transition-all duration-200 opacity-0 group-hover/carousel:opacity-100 hover:scale-110 active:scale-95"
        >
          <ArrowLeft size={17} weight="bold" />
        </button>
      )}

      {/* Right arrow */}
      {total > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); goNext(); }}
          aria-label="Next slide"
          className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full shadow-xl bg-white/75 hover:bg-white backdrop-blur-md border border-white/40 hover:border-neutral-200 flex items-center justify-center text-neutral-800 hover:text-black transition-all duration-200 opacity-0 group-hover/carousel:opacity-100 hover:scale-110 active:scale-95"
        >
          <ArrowRight size={17} weight="bold" />
        </button>
      )}

      {/* Dot indicators */}
      {total > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
          {validBanners.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`rounded-full transition-all duration-300 ${i === currentIndex ? "w-6 h-2.5 bg-white shadow-md" : "w-2.5 h-2.5 bg-white/50 hover:bg-white/80"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BannerCarousel;
