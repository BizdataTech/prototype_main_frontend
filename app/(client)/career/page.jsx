"use client";

import Link from "next/link";

const CareerPage = () => {
  return (
    <div className="w-full min-h-screen bg-white pt-[14rem] pb-24">
      <div className="w-[95%] max-w-[900px] mx-auto flex flex-col gap-16">

        {/* Page Header */}
        <div className="border-b border-neutral-200 pb-12">
          <p className="text-[1.2rem] uppercase tracking-widest text-neutral-400 mb-4">Join Our Team</p>
          <h1 className="text-[4rem] font-light text-black uppercase tracking-widest leading-tight">
            Careers
          </h1>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="flex flex-col gap-8">
            <div>
              <h2 className="text-[1.6rem] font-medium uppercase tracking-widest text-black mb-6 border-b border-black pb-4">
                Work With Us
              </h2>
              <p className="text-[1.5rem] font-light text-neutral-600 leading-relaxed">
                We are always looking for passionate and talented individuals to join our growing team. At Fortuneae FBM, we believe in fostering an environment of innovation, collaboration, and continuous growth.
              </p>
            </div>

            <div>
              <h2 className="text-[1.6rem] font-medium uppercase tracking-widest text-black mb-6 border-b border-black pb-4">
                Apply
              </h2>
              <p className="text-[1.5rem] font-light text-neutral-600 leading-relaxed mb-6">
                To apply for open positions, please reach out to us directly at our office address below or via email.
              </p>
              <a
                href="mailto:careers@fortuneaefbm.com"
                className="inline-block bg-black hover:bg-neutral-800 text-white text-[1.2rem] uppercase tracking-widest px-10 py-4 transition-colors"
              >
                Send Your Resume
              </a>
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

export default CareerPage;
