import { useRef, useState } from "react";
import { ImageSquare, Crop, ArrowsClockwise, X } from "phosphor-react";
import { InputLabel } from "@/components/admin/InputLabel";
import ImageCropper from "@/components/admin/ImageCropper";

const Images = ({ utility_object, error }) => {
  let [currentImage, setCurrentImage] = useState(null);
  let { images, handleImages, cancelImages } = utility_object;
  let inputRef = useRef(null);
  let editInputRef = useRef(null);
  let [editingIndex, setEditingIndex] = useState(null);

  // Cropper state
  const [cropSrc, setCropSrc] = useState(null);
  const [cropFilename, setCropFilename] = useState("image.jpg");
  // null = new image, number = replacing at that index
  const pendingEditIndex = useRef(null);

  // "Add Image" tile clicked -- pick a new file then crop
  const addImage = (event) => {
    let file = event.target.files[0];
    if (!file) return;
    pendingEditIndex.current = null;
    setCropFilename(file.name);
    setCropSrc(URL.createObjectURL(file));
    event.target.value = "";
  };

  // "Change" button -- pick a new file to replace at index, then crop
  const handleEditFileChange = (event) => {
    let file = event.target.files[0];
    if (!file || editingIndex === null) return;
    pendingEditIndex.current = editingIndex;
    setCropFilename(file.name);
    setCropSrc(URL.createObjectURL(file));
    setEditingIndex(null);
    event.target.value = "";
  };

  // "Crop" button -- re-crop the EXISTING image at index (no file picker)
  const openCropExisting = (index) => {
    const img = images[index];
    if (!img) return;
    pendingEditIndex.current = index;
    setCropFilename(img.file?.name || `image_${index}.jpg`);
    setCropSrc(img.preview || img.url);
  };

    // After crop: replace or add
  const handleCropped = (croppedFile) => {
    const preview = URL.createObjectURL(croppedFile);
    const newImage = { file: croppedFile, preview };

    if (pendingEditIndex.current !== null) {
      const idx = pendingEditIndex.current;
      const oldImg = images[idx];
      if (oldImg?.preview) URL.revokeObjectURL(oldImg.preview);
      else if (oldImg?.url) URL.revokeObjectURL(oldImg.url);
      cancelImages(oldImg);
      handleImages(newImage);
      setCurrentImage(newImage);
      pendingEditIndex.current = null;
    } else {
      handleImages(newImage);
      setCurrentImage(newImage);
    }
    setCropSrc(null);
  };


  return (
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

      <section className="a-section--box">
        <InputLabel label="Product Images" error={error} />
        <div className="flex gap-4 mt-4">
          <div className="w-1/2 h-[35rem] flex flex-col gap-4 justify-between">
            <div className="flex-1 border border-neutral-300 p-4 grid grid-cols-6 auto-rows-[10rem] gap-4 overflow-x-hidden">

              {/* Add new image tile */}
              <div
                className="border-2 border-dashed rounded-[.5rem] text-neutral-400 flex flex-col justify-center items-center p-4 cursor-pointer"
                onClick={() => inputRef.current.click()}
              >
                <ImageSquare className="w-full h-full" weight="thin" />
                <div className="font-medium">Add Image</div>
              </div>

              {images.length > 0 &&
                images.map((image, index) => (
                  <div
                    key={image.public_id || image.preview || image.url || index}
                    className="border-2 border-dashed text-neutral-400 p-0 cursor-pointer relative group overflow-hidden rounded-[.3rem]"
                    onMouseOver={() => setCurrentImage(image)}
                  >
                    <img
                      src={image.preview || image.url}
                      alt="image preview"
                      className="w-full h-full object-contain"
                    />

                    {/* Hover overlay with Crop + Change buttons */}
                    <div className="absolute inset-0 bg-black/55 flex flex-col items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      {/* Crop existing image */}
                      <button
                        type="button"
                        title="Crop this image"
                        onClick={(e) => {
                          e.stopPropagation();
                          openCropExisting(index);
                        }}
                        className="flex items-center gap-1 bg-violet-600 hover:bg-violet-700 text-white rounded-lg px-2.5 py-1 text-[.95rem] font-semibold transition-colors w-[80%] justify-center"
                      >
                        <Crop size={13} weight="bold" />
                        Crop
                      </button>
                      {/* Change to a new image */}
                      <button
                        type="button"
                        title="Replace with a new image"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingIndex(index);
                          editInputRef.current.click();
                        }}
                        className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-2.5 py-1 text-[.95rem] font-semibold transition-colors w-[80%] justify-center"
                      >
                        <ArrowsClockwise size={13} weight="bold" />
                        Change
                      </button>
                    </div>

                    {/* Delete button (top-right, always accessible) */}
                    <X
                      className="absolute right-1 top-1 w-[1.4rem] h-[1.4rem] text-red-500 bg-white/80 rounded cursor-pointer z-20 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentImage(null);
                        cancelImages(image);
                      }}
                    />
                  </div>
                ))}

              {/* Hidden inputs */}
              <input type="file" className="hidden" ref={inputRef} onChange={addImage} />
              <input type="file" className="hidden" ref={editInputRef} onChange={handleEditFileChange} />
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
    </>
  );
};

export default Images;

