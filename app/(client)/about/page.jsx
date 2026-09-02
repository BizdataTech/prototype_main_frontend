"use client";

import Link from "next/link";

const AboutPage = () => {
  return (
    <div className="w-full min-h-screen bg-white pt-[14rem] pb-24">
      <div className="w-[95%] max-w-[900px] mx-auto flex flex-col gap-16">

        {/* Page Header */}
        <div className="border-b border-neutral-200 pb-12">
          <p className="text-[1.2rem] uppercase tracking-widest text-neutral-400 mb-4">Company</p>
          <h1 className="text-[4rem] font-light text-black uppercase tracking-widest leading-tight">
            About Us
          </h1>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="flex flex-col gap-8">
            <div>
              <h2 className="text-[1.6rem] font-medium uppercase tracking-widest text-black mb-6 border-b border-black pb-4">
                Who We Are
              </h2>
              <p className="text-[1.5rem] font-light text-neutral-600 leading-relaxed">
                Fortuneae FBM is a leading provider of premium building materials and construction solutions. We are committed to delivering quality products that meet the highest standards of excellence.
              </p>
            </div>
            <div>
              <h2 className="text-[1.6rem] font-medium uppercase tracking-widest text-black mb-6 border-b border-black pb-4">
                Our Mission
              </h2>
              <p className="text-[1.5rem] font-light text-neutral-600 leading-relaxed">
                To provide industry-leading building materials while fostering sustainable construction practices and delivering outstanding customer service across every project.
              </p>
            </div>
          </div>

          {/* Address */}
          <div className="flex flex-col gap-8">
            <div>
              <h2 className="text-[1.6rem] font-medium uppercase tracking-widest text-black mb-6 border-b border-black pb-4">
                Our Address
              </h2>
              <address className="text-[1.5rem] font-light text-neutral-700 leading-loose not-italic">
                <p className="font-medium text-black text-[1.6rem]">Fortuneae FBM Building Material</p>
                <p>Ashtamudi Towers</p>
                <p>TechnoPark</p>
                <p>Kollam – 691501</p>
                <p>Kerala, India</p>
              </address>
            </div>
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

export default AboutPage;
