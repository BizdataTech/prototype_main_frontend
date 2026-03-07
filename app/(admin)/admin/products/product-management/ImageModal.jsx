import { createPortal } from "react-dom";
import { X, Plus } from "phosphor-react";
import { useEffect, useRef, useState } from "react";

const ImageModal = ({ variants, sku, func, handleImages }) => {
  let inputRef = useRef(null);
  let [images, setImages] = useState([]);
  const handleInputClick = () => {
    inputRef.current.click();
  };

  useEffect(() => {
    let result = variants.find((variant) => variant.sku === sku);
    if (result.images.length) setImages(result.images);
  }, []);

  const handleFileChange = (event) => {
    console.log("events:", event.target.files);
    let files = Array.from(event.target.files);
    let previews = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...previews]);
  };

  const changeImage = (index) => {
    setImages((prevImages) => {
      let newImages = prevImages.filter((_, i) => i !== index);
      URL.revokeObjectURL(prevImages[index].url);
      return newImages;
    });
  };

  const submitImagesButton = () => {
    let imagesResult = handleImages(sku, images);
    if (imagesResult) func();
  };

  return createPortal(
    <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-110">
      <div className="bg-white p-6 rounded-[.5rem] w-[70%] min-h-[60rem] max-h-[60rem]  flex flex-col gap-6">
        <div className="flex justify-between items-start">
          <div className="text-[1.4rem] font-medium capitalize">
            Handle Product Images
          </div>
          <X
            className="text-red-700 w-[1.5rem] h-[1.5rem] cursor-pointer"
            weight="bold"
            onClick={() => func()}
          />
        </div>

        <input
          type="file"
          multiple
          className="hidden"
          accept="image/*"
          ref={inputRef}
          onChange={handleFileChange}
        />
        {!images.length ? (
          <div className="flex-1 flex flex-col justify-center items-center gap-4 border-3 border-dashed border-gray-400 rounded-[1rem]">
            <div className="text-[1.7rem] font-medium">
              No images are added for this product variant so far.
            </div>
            <button
              className="a-text--button bg-green-800 !px-[3rem] text-white self-center cursor-pointer"
              onClick={handleInputClick}
            >
              Add images
            </button>
          </div>
        ) : (
          <div className="grid flex-1 grid-cols-5 auto-rows-[16rem] gap-4 overflow-y-scroll border-3 border-dashed border-gray-400 p-4 rounded-[1rem]">
            {images.map((image, index) => (
              <div key={index} className="relative border border-neutral-500">
                <img
                  src={image.url}
                  alt={image.file.name}
                  className="w-full h-full object-contain"
                />
                <X
                  className="absolute top-2 right-2 w-[1.5rem] h-[1.5rem] text-red-700 bg-white cursor-pointer"
                  weight="bold"
                  onClick={() => changeImage(index)}
                />
              </div>
            ))}
            <Plus
              className="border-3 border-dashed border-gray-400 w-full h-full text-gray-400 cursor-pointer"
              onClick={handleInputClick}
              weight="thin"
            />
          </div>
        )}
        <div className="self-end mt-auto !cursor-pointer a-text--button text-white bg-red-800/90">
          <button onClick={submitImagesButton}>Submit Images</button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ImageModal;
