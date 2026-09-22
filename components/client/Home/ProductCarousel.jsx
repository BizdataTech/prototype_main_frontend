"use client";

import Link from "next/link";
import { ArrowRight } from "phosphor-react";

// Mock products to demonstrate the industrial theme
const mockProducts = [
  {
    product_title: "DeWalt 20V MAX Cordless Drill Combo Kit",
    brand: "DeWalt",
    variant: {
      _id: "mock1",
      images: ["https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=400&q=80"],
      price: "12500",
    }
  },
  {
    product_title: "3M Safety Helmet with Visor",
    brand: "3M",
    variant: {
      _id: "mock2",
      images: ["https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=400&q=80"],
      price: "1850",
    }
  },
  {
    product_title: "Makita Angle Grinder 4.5 Inch",
    brand: "Makita",
    variant: {
      _id: "mock3",
      images: ["https://plus.unsplash.com/premium_photo-1664303490723-5e58ce245b0d?auto=format&fit=crop&w=400&q=80"],
      price: "5600",
    }
  },
  {
    product_title: "Stanley 65-Piece Homeowner's Tool Kit",
    brand: "Stanley",
    variant: {
      _id: "mock4",
      images: ["https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=400&q=80"],
      price: "4200",
    }
  },
  {
    product_title: "Bosch Professional Measuring Laser",
    brand: "Bosch",
    variant: {
      _id: "mock5",
      images: ["https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&w=400&q=80"],
      price: "8900",
    }
  }
];

const ProductCarousel = ({ title, viewAllLink = "/products" }) => {
  return (
    <section className="w-[95%] md:w-[90%] mx-auto my-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-[2.8rem] font-bold text-neutral-800 tracking-tight">
          {title}
        </h2>
        <Link
          href={viewAllLink}
          className="flex items-center gap-2 text-[1.4rem] font-semibold text-orange-600 hover:text-orange-700 transition-colors"
        >
          View All <ArrowRight size={16} weight="bold" />
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {mockProducts.map((product) => (
          <Link key={product.variant._id} href={`/product/${product.variant._id}`}>
            <div className="group border border-neutral-200 hover:border-orange-400 transition-all duration-300 p-6 bg-white rounded-2xl cursor-pointer hover:shadow-lg h-full flex flex-col">
              <div className="image h-[16rem] flex justify-center items-center mb-6 overflow-hidden rounded-xl bg-neutral-50 p-4">
                <img
                  src={product.variant.images[0]}
                  alt={product.product_title}
                  className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="flex flex-col flex-grow">
                <div className="text-[1.3rem] text-orange-600 font-semibold mb-2">
                  {product.brand}
                </div>
                <div className="text-[1.6rem] font-medium text-neutral-800 leading-tight mb-4 flex-grow line-clamp-2">
                  {product.product_title}
                </div>
                <div className="font-bold text-[2rem] text-neutral-900 mt-auto">
                  AED {Number(product.variant.price).toLocaleString('en-AE')}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default ProductCarousel;
