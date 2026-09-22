"use client";

import Link from "next/link";

const TestimonialsPage = () => {
  return (
    <div className="w-full min-h-screen bg-white pt-[14rem] pb-24">
      <div className="w-[95%] max-w-[900px] mx-auto flex flex-col gap-16">

        {/* Page Header */}
        <div className="border-b border-neutral-200 pb-12">
          <p className="text-[1.2rem] uppercase tracking-widest text-neutral-400 mb-4">Client Feedback</p>
          <h1 className="text-[4rem] font-light text-black uppercase tracking-widest leading-tight">
            Testimonials
          </h1>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-8">
          <div className="bg-neutral-50 p-8 border border-neutral-100 rounded-lg">
            <p className="text-[1.6rem] italic text-neutral-700 leading-relaxed mb-6">
              "Fortune Sealing Equipments Trading LLC provided us with exceptional quality materials for our recent commercial project. Their sealing equipment performed flawlessly and their customer service is top-notch."
            </p>
            <p className="text-[1.4rem] font-medium text-black uppercase tracking-wider">
              - Ahmed R., Lead Contractor
            </p>
          </div>
          <div className="bg-neutral-50 p-8 border border-neutral-100 rounded-lg">
            <p className="text-[1.6rem] italic text-neutral-700 leading-relaxed mb-6">
              "We have been sourcing materials from Fortuneae for over five years. Their reliability and dedication to quality make them our preferred supplier in the UAE."
            </p>
            <p className="text-[1.4rem] font-medium text-black uppercase tracking-wider">
              - Sarah L., Project Manager
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

export default TestimonialsPage;
