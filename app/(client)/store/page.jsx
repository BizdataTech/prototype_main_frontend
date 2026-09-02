"use client";

import Link from "next/link";

const StorePage = () => {
  return (
    <div className="w-full min-h-screen bg-white pt-[14rem] pb-24">
      <div className="w-[95%] max-w-[900px] mx-auto flex flex-col gap-16">

        {/* Page Header */}
        <div className="border-b border-neutral-200 pb-12">
          <p className="text-[1.2rem] uppercase tracking-widest text-neutral-400 mb-4">Find Us</p>
          <h1 className="text-[4rem] font-light text-black uppercase tracking-widest leading-tight">
            Our Store
          </h1>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Address Block */}
          <div className="flex flex-col gap-10">
            <div>
              <h2 className="text-[1.6rem] font-medium uppercase tracking-widest text-black mb-6 border-b border-black pb-4">
                Store Address
              </h2>
              <address className="text-[1.5rem] font-light text-neutral-700 leading-loose not-italic">
                <p className="font-medium text-black text-[1.6rem]">Fortuneae FBM Building Material</p>
                <p>Ashtamudi Towers</p>
                <p>TechnoPark</p>
                <p>Kollam – 691501</p>
                <p>Kerala, India</p>
              </address>
            </div>

            <div>
              <h2 className="text-[1.6rem] font-medium uppercase tracking-widest text-black mb-6 border-b border-black pb-4">
                Store Hours
              </h2>
              <div className="text-[1.5rem] font-light text-neutral-600 leading-loose">
                <p>Monday – Friday: 9:00 AM – 6:00 PM</p>
                <p>Saturday: 10:00 AM – 4:00 PM</p>
                <p>Sunday: Closed</p>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="flex flex-col gap-10">
            <div>
              <h2 className="text-[1.6rem] font-medium uppercase tracking-widest text-black mb-6 border-b border-black pb-4">
                Getting Here
              </h2>
              <div className="text-[1.5rem] font-light text-neutral-600 leading-relaxed">
                <p className="mb-4">We are located inside the prestigious TechnoPark campus, Ashtamudi Towers, in Kollam, Kerala.</p>
                <p>Easily accessible by road and public transport. Ample parking is available on-site for visitors.</p>
              </div>
            </div>

            <div>
              <h2 className="text-[1.6rem] font-medium uppercase tracking-widest text-black mb-6 border-b border-black pb-4">
                Contact Store
              </h2>
              <div className="text-[1.5rem] font-light text-neutral-600 flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[1.1rem] uppercase tracking-widest text-neutral-400">Phone</span>
                  <a href="tel:+91-0000000000" className="hover:underline text-black">+91 00000 00000</a>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[1.1rem] uppercase tracking-widest text-neutral-400">Email</span>
                  <a href="mailto:store@fortuneaefbm.com" className="hover:underline text-black">store@fortuneaefbm.com</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="flex gap-6 pt-8 border-t border-neutral-200 items-center justify-between">
          <Link href="/" className="text-[1.3rem] uppercase tracking-widest text-neutral-500 hover:text-black transition-colors">
            ← Back to Home
          </Link>
          <Link href="/products" className="bg-black hover:bg-neutral-800 text-white text-[1.2rem] uppercase tracking-widest px-10 py-4 transition-colors">
            Shop Online
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StorePage;
