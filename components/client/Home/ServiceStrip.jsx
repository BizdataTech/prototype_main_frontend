"use client";

import { Truck, Coins, ShieldCheck, Wrench } from "phosphor-react";

const perks = [
  {
    icon: <Truck size={28} weight="duotone" className="text-[#b00015]" />,
    title: "Direct Site Delivery",
    desc: "Reliable logistics to site & warehouse",
  },
  {
    icon: <Coins size={28} weight="duotone" className="text-[#b00015]" />,
    title: "Contractor Wholesale Pricing",
    desc: "Volume tier discounts on every quote",
  },
  {
    icon: <ShieldCheck size={28} weight="duotone" className="text-[#b00015]" />,
    title: "Certified Industrial Grade",
    desc: "100% verified materials & warranty",
  },
  {
    icon: <Wrench size={28} weight="duotone" className="text-[#b00015]" />,
    title: "Technical Engineering Support",
    desc: "Product specs & project consultation",
  },
];

export default function ServiceStrip() {
  return (
    <section className="w-[95%] md:w-[90%] mx-auto my-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-white p-6 rounded-2xl border border-neutral-200/90 shadow-sm">
        {perks.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-4 p-3 rounded-xl hover:bg-neutral-50/80 transition-colors"
          >
            <div className="w-14 h-14 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
              {item.icon}
            </div>
            <div>
              <h4 className="text-[1.4rem] font-bold text-neutral-800 tracking-tight">
                {item.title}
              </h4>
              <p className="text-[1.2rem] text-neutral-500 mt-0.5 leading-snug">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
