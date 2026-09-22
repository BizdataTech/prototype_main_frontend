"use client";

import Link from "next/link";

const ResourcesPage = () => {
  return (
    <div className="w-full min-h-screen bg-white pt-[14rem] pb-24">
      <div className="w-[95%] max-w-[900px] mx-auto flex flex-col gap-16">

        {/* Page Header */}
        <div className="border-b border-neutral-200 pb-12">
          <p className="text-[1.2rem] uppercase tracking-widest text-neutral-400 mb-4">Information</p>
          <h1 className="text-[4rem] font-light text-black uppercase tracking-widest leading-tight">
            Resources
          </h1>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-8">
          <div>
            <h2 className="text-[1.6rem] font-medium uppercase tracking-widest text-black mb-6 border-b border-black pb-4">
              Technical Documents
            </h2>
            <p className="text-[1.5rem] font-light text-neutral-600 leading-relaxed">
              Access product manuals, specifications, and safety data sheets for all our sealing equipment and building materials.
            </p>
          </div>
          <div>
            <h2 className="text-[1.6rem] font-medium uppercase tracking-widest text-black mb-6 border-b border-black pb-4">
              Industry Insights
            </h2>
            <p className="text-[1.5rem] font-light text-neutral-600 leading-relaxed">
              Stay up-to-date with the latest trends in the construction industry, new material technologies, and best practices.
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

export default ResourcesPage;
