"use client";

import Link from "next/link";

const SolutionsPage = () => {
  return (
    <div className="w-full min-h-screen bg-white pt-[14rem] pb-24">
      <div className="w-[95%] max-w-[900px] mx-auto flex flex-col gap-16">

        {/* Page Header */}
        <div className="border-b border-neutral-200 pb-12">
          <p className="text-[1.2rem] uppercase tracking-widest text-neutral-400 mb-4">Services</p>
          <h1 className="text-[4rem] font-light text-black uppercase tracking-widest leading-tight">
            Our Solutions
          </h1>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-8">
          <div>
            <h2 className="text-[1.6rem] font-medium uppercase tracking-widest text-black mb-6 border-b border-black pb-4">
              Sealing Equipment
            </h2>
            <p className="text-[1.5rem] font-light text-neutral-600 leading-relaxed">
              We provide state-of-the-art sealing equipment designed for durability and efficiency in demanding construction environments. Our tools are engineered to deliver reliable performance across all your projects.
            </p>
          </div>
          <div>
            <h2 className="text-[1.6rem] font-medium uppercase tracking-widest text-black mb-6 border-b border-black pb-4">
              Building Materials
            </h2>
            <p className="text-[1.5rem] font-light text-neutral-600 leading-relaxed">
              Explore our comprehensive range of high-quality building materials. Sourced from top manufacturers globally, we guarantee materials that meet strict safety and quality standards.
            </p>
          </div>
        </div>

        {/* Back Link */}
        <div className="pt-8 border-t border-neutral-200">
          <Link href="/" className="text-[1.3rem] uppercase tracking-widest text-neutral-500 hover:text-black transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SolutionsPage;
