"use client";

import Link from "next/link";
import { LinkedinLogo, InstagramLogo, FacebookLogo } from "phosphor-react";

const Footer = () => {
  return (
    <footer className="bg-[#0a0a0a] text-white pt-20 pb-10 px-6 sm:px-12 lg:px-24">
      <div className="max-w-[1400px] mx-auto">
        {/* Top Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 mb-12">
          {/* Left Side */}
          <div className="flex flex-col gap-6 w-full lg:w-2/3">
            {/* Logo */}
            <Link href="/" className="inline-block">
              <div className="leading-tight uppercase tracking-wider select-none">
                <span className="text-white font-extrabold text-3xl sm:text-4xl tracking-tight">
                  FORTUNEAE
                </span>
                <span className="text-gray-300 font-semibold text-sm sm:text-lg ml-2 tracking-widest block sm:inline mt-1 sm:mt-0">
                  FBM BUILDING MATERIAL
                </span>
              </div>
            </Link>

            {/* Description */}
            <div className="text-gray-400 text-[1.4rem] sm:text-[1.5rem] font-medium max-w-2xl leading-relaxed mt-2">
              <p>
                Leading provider of high-quality building materials and sealing equipment. 
                Delivering excellence and reliability to construction projects across the U.A.E.
              </p>
            </div>

            {/* Navigation Links */}
            <nav className="flex flex-wrap items-center gap-x-8 gap-y-4 mt-4">
              <Link href="/" className="text-gray-300 hover:text-white transition-colors text-[1.5rem] font-semibold">Home</Link>
              <Link href="/about" className="text-gray-300 hover:text-white transition-colors text-[1.5rem] font-semibold">About Us</Link>
              <Link href="/solutions" className="text-gray-300 hover:text-white transition-colors text-[1.5rem] font-semibold">Solutions</Link>
              <Link href="/resources" className="text-gray-300 hover:text-white transition-colors text-[1.5rem] font-semibold">Resources</Link>
              <Link href="/testimonials" className="text-gray-300 hover:text-white transition-colors text-[1.5rem] font-semibold">Testimonials</Link>
            </nav>
          </div>

          {/* Right Side - Address & Social Icons */}
          <div className="flex flex-col gap-8 w-full lg:w-1/3 lg:items-end text-left lg:text-right mt-6 lg:mt-0">
            {/* Address */}
            <div className="text-gray-300 text-[1.4rem] sm:text-[1.5rem] leading-relaxed">
              <p className="font-bold text-white text-[1.6rem] sm:text-[1.7rem] mb-3">Fortune Sealing Equipments Trading LLC,</p>
              <p className="font-medium text-gray-400">AM Facility, Office No.31,M4</p>
              <p className="font-medium text-gray-400">Musaffah Abu Dhabi U.A.E</p>
              <div className="flex flex-col lg:items-end gap-2 mt-4 font-semibold text-[1.5rem]">
                <a href="tel:+97126261225" className="hover:text-white transition-colors">Tel: +971 2 6261225</a>
                <a href="tel:+971504255636" className="hover:text-white transition-colors">Mobile No. +971 50 4255636</a>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-5">
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors p-2.5 rounded-full hover:bg-white/10" aria-label="LinkedIn">
                <LinkedinLogo size={28} weight="fill" />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors p-2.5 rounded-full hover:bg-white/10" aria-label="Instagram">
                <InstagramLogo size={28} weight="fill" />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors p-2.5 rounded-full hover:bg-white/10" aria-label="Facebook">
                <FacebookLogo size={28} weight="fill" />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-neutral-800 mb-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-4 text-[1.3rem] text-gray-400">
          <div className="text-center md:text-left">
            &copy; {new Date().getFullYear()} Fortuneae FBM Building Material. All rights reserved.
          </div>
          <div className="flex flex-wrap justify-center items-center gap-4">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <span className="text-gray-600 hidden md:inline-block">&bull;</span>
            <span className="text-gray-600 md:hidden block w-full text-center h-0 overflow-hidden leading-none border-b border-gray-800 my-2"></span>
            <Link href="/cookies-policy" className="hover:text-white transition-colors">
              Cookies Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
