"use client";

import { ShieldCheck, Truck, Coins, Headphones } from "phosphor-react";

const FeatureHighlights = () => {
  const features = [
    {
      id: 1,
      icon: <ShieldCheck size={40} weight="duotone" className="text-orange-500" />,
      title: "Quality Assured",
      description: "Top grade building materials",
    },
    {
      id: 2,
      icon: <Truck size={40} weight="duotone" className="text-orange-500" />,
      title: "Site Delivery",
      description: "Fast & reliable logistics",
    },
    {
      id: 3,
      icon: <Coins size={40} weight="duotone" className="text-orange-500" />,
      title: "Bulk Pricing",
      description: "Discounts for contractors",
    },
    {
      id: 4,
      icon: <Headphones size={40} weight="duotone" className="text-orange-500" />,
      title: "Expert Support",
      description: "24/7 technical assistance",
    },
  ];

  return (
    <section className="w-[95%] md:w-[90%] mx-auto my-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature) => (
          <div
            key={feature.id}
            className="flex items-center gap-6 p-8 bg-white border border-neutral-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            <div className="bg-orange-50 p-4 rounded-xl">{feature.icon}</div>
            <div>
              <h3 className="text-[1.6rem] font-semibold text-neutral-800">
                {feature.title}
              </h3>
              <p className="text-[1.3rem] text-neutral-500 mt-1">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeatureHighlights;
