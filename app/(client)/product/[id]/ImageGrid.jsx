"use client";

import { useState } from "react";

export const ImageGrid = ({ images }) => {
  const imageUrls = images?.map(img => typeof img === 'string' ? img : img?.url).filter(Boolean) || [];
  let [heroImage, setHeroImage] = useState(imageUrls[0]);
  return (
    <div className="md:w-3/6 bg-white flex p-4 self-start">
      <div className="flex flex-col gap-4 items-center justify-start">
        {imageUrls.map((url, index) => (
          <img
            src={url}
            alt={`product ${index}`}
            key={index}
            className="w-[6rem] h-[6rem] border border-black p-1 cursor-pointer"
            onMouseEnter={() => setHeroImage(url)}
          />
        ))}
      </div>
      <img
        src={heroImage}
        alt="product image"
        className="w-[400px] h-auto object-contain mx-auto "
      />
    </div>
  );
};
