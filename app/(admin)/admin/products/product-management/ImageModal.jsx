import { createPortal } from "react-dom";
import { X, Plus, Crop, ArrowsClockwise } from "phosphor-react";
import { useEffect, useRef, useState } from "react";
import ImageCropper from "@/components/admin/ImageCropper";

const ImageModal = ({ variants, sku, func, handleImages }) => {
  let inputRef = useRef(null);
  let editInputRef = useRef(null);
  let [images, setImages] = useState([]);

  // Cropper state
  const [cropSrc, setCropSrc] = useState(null);
  const [cropFilename, setCropFilename] = useState("variant.jpg");
  // null = new image, number = replacing at index
  const pendingEditIndex = useRef(null);

  const handleInputClick = () => {
    pendingEditIndex.current = null;
    inputRef.current.click();
  };

  useEffect(() => {
    let result = variants.find((variant) => variant.sku === sku);
    if (result.images.length) setImages(result.images);
  }, []);

  // Add new file -- open cropper
  const handleFileChange = (event) => {
    let files = Array.from(event.target.files);
    if (!files.length) return;
    const file = files[0];
    pendingEditIndex.current = null;
    setCropFilename(file.name);
    setCropSrc(URL.createObjectURL(file));
    event.target.value = "";
  };

  // Change file at index -- open cropper
  const handleEditFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setCropFilename(file.name);
    setCropSrc(URL.createObjectURL(file));
    event.target.value = "";
  };

  // Crop existing image at index (no file picker)
  const openCropExisting = (index) => {
    const img = images[index];
    if (!img) return;
    pendingEditIndex.current = index;
    setCropFilename(img.file?.name || `variant_${index}.jpg`);
    setCropSrc(img.url || img.preview);
  };

  // After crop applied
  const handleCropped = (croppedFile) => {
    const url = URL.createObjectURL(croppedFile);
    if (pendingEditIndex.current !== null) {
      // Replace at index
      setImages((prev) => {
        const updated = [...prev];
        updated[pendingEditIndex.current] = { file: croppedFile, url };
        return updated;
      });
      pendingEditIndex.current = null;
    } else {
      setImages((prev) => [...prev, { file: croppedFile, url }]);
    }
    setCropSrc(null);
  };

  const changeImage = (index) => {
    setImages((prevImages) => {
      let newImages = prevImages.filter((_, i) => i !== index);
      if (prevImages[index]?.url) URL.revokeObjectURL(prevImages[index].url);
      return newImages;
    });
  };

  const submitImagesButton = () => {
    let imagesResult = handleImages(sku, images);
    if (imagesResult) func();
  };

  return createPortal(
    <>
      {/* Crop modal */}
      {cropSrc && (
        <ImageCropper
          src={cropSrc}
          filename={cropFilename}
          onCrop={handleCropped}
          onCancel={() => { setCropSrc(null); pendingEditIndex.current = null; }}
        />
      )}

      <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-110">
        <div className="bg-white p-6 rounded-[.5rem] w-[70%] min-h-[60rem] max-h-[60rem] flex flex-col gap-6">
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

          {/* Hidden inputs */}
          <input type="file" multiple className="hidden" accept="image/*" ref={inputRef} onChange={handleFileChange} />
          <input type="file" className="hidden" accept="image/*" ref={editInputRef} onChange={handleEditFileChange} />

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
                <div key={index} className="relative border border-neutral-500 group overflow-hidden">
                  <img
                    src={image.url}
                    alt={image.file?.name || "variant image"}
                    className="w-full h-full object-contain"
                  />
                  {/* Hover overlay: Crop + Change + Delete */}
                  <div className="absolute inset-0 bg-black/55 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    {/* Crop existing */}
                    <button
                      type="button"
                      title="Crop this image"
                      onClick={() => openCropExisting(index)}
                      className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg px-4 py-1.5 text-[1.1rem] font-semibold transition-colors w-[70%] justify-center"
                    >
                      <Crop size={15} weight="bold" />
                      Crop
                    </button>
                    {/* Change to new file */}
                    <button
                      type="button"
                      title="Replace with a new image"
                      onClick={() => {
                        pendingEditIndex.current = index;
                        editInputRef.current.click();
                      }}
                      className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-1.5 text-[1.1rem] font-semibold transition-colors w-[70%] justify-center"
                    >
                      <ArrowsClockwise size={15} weight="bold" />
                      Change
                    </button>
                    {/* Delete */}
                    <button
                      type="button"
                      title="Remove image"
                      onClick={() => changeImage(index)}
                      className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg px-4 py-1.5 text-[1.1rem] font-semibold transition-colors w-[70%] justify-center"
                    >
                      <X size={15} weight="bold" />
                      Remove
                    </button>
                  </div>
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
      </div>
    </>,
    document.body
  );
};

export default ImageModal;
