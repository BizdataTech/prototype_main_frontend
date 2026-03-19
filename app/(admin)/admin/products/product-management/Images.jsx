import { useRef, useState } from "react";
import { ImageSquare, X } from "phosphor-react";
import { InputLabel } from "@/components/admin/InputLabel";

const Images = ({ utility_object, error }) => {
  let [currentImage, setCurrentImage] = useState(null);
  let { images, handleImages, cancelImages } = utility_object;
  let inputRef = useRef(null);

  const addImage = (event) => {
    let file = event.target.files[0];
    let image_object = { file, preview: URL.createObjectURL(file) };
    setCurrentImage(image_object);
    handleImages(image_object);
  };

  return (
    <section className="a-section--box">
      <InputLabel label="Product Images" error={error} />
      <div className="flex gap-4 mt-4">
        <div className="w-1/2 h-[35rem] flex flex-col gap-4 justify-between">
          <div className="flex-1 border border-neutral-300 p-4 grid grid-cols-6 auto-rows-[10rem]  gap-4 overflow-x-hidden">
            <div
              className="border-2 border-dashed rounded-[.5rem] text-neutral-400 flex flex-col justify-center items-center p-4 cursor-pointer"
              onClick={() => inputRef.current.click()}
            >
              <ImageSquare className="w-full h-full" weight="thin" />
              <div className="font-medium">Add Image</div>
            </div>
            {images.length > 0 &&
              images.map((image) => (
                <div
                  className="border-2 border-dashed text-neutral-400 p-4 cursor-pointer relative"
                  onMouseOver={() => setCurrentImage(image)}
                >
                  <img
                    src={image.preview || image.url}
                    alt="image preview"
                    className="w-full h-full object-contain"
                  />
                  <X
                    className="absolute right-1 top-1 w-[1.5rem] h-[1.5rem] text-red-700 cursor-pointer"
                    onClick={() => {
                      setCurrentImage(null);
                      cancelImages(image);
                    }}
                  />
                </div>
              ))}

            <input
              type="file"
              className="hidden"
              ref={inputRef}
              onChange={addImage}
            />
          </div>
          <div className="bg-yellow-50 text-[1.4rem] text-yellow-800 font-medium rounded-[.5rem] p-4">
            Add Images : More product related images give more trust and clarity
            about the product to the customers.
          </div>
        </div>
        <div className="w-1/2 border border-neutral-300 h-[35rem] rounded-sm flex flex-col justify-center items-center">
          {currentImage ? (
            <img
              src={currentImage?.preview || currentImage.url}
              alt="preview image"
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="text-[1.6rem] font-medium">
              No Image added to preview here
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Images;
