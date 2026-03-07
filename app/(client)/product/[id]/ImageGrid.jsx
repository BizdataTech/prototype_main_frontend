"use client";

import { useState } from "react";

export const ImageGrid = ({ images }) => {
  let [heroImage, setHeroImage] = useState(images[0]);
  return (
    <div className="md:w-3/6 bg-white flex p-4 self-start">
      <div className="flex flex-col gap-4 items-center justify-start">
        {images.map((image, index) => (
          <img
            src={image}
            alt={`product ${index}`}
            key={index}
            className="w-[6rem] h-[6rem] border border-black p-1 cursor-pointer"
            onMouseEnter={() => setHeroImage(image)}
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
