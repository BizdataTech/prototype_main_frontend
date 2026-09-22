"use client";

import { useState, useEffect } from "react";

export const ImageGrid = ({ images }) => {
  const imageUrls =
    images?.map((img) => (typeof img === "string" ? img : img?.url)).filter(Boolean) || [];
  let [heroImage, setHeroImage] = useState(imageUrls[0]);

  useEffect(() => {
    if (imageUrls.length > 0) {
      setHeroImage(imageUrls[0]);
    }
  }, [JSON.stringify(imageUrls)]);

  return (
    <div className="md:w-3/6 bg-white flex p-4 self-start">
      <div className="flex flex-col gap-4 items-center justify-start">
        {imageUrls.map((url, index) => (
          <img
            src={url}
            alt={`product ${index}`}
            key={index}
            className={`w-[6rem] h-[6rem] border p-1 cursor-pointer transition-colors ${
              heroImage === url ? "border-black font-bold" : "border-neutral-200"
            }`}
            onMouseEnter={() => setHeroImage(url)}
            onClick={() => setHeroImage(url)}
          />
        ))}
      </div>
      <img
        src={heroImage || imageUrls[0]}
        alt="product image"
        className="w-[400px] h-auto object-contain mx-auto"
      />
    </div>
  );
};
