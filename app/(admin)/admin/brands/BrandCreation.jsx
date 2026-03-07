import { Upload, Spinner } from "phosphor-react";

const BrandCreation = ({ utils }) => {
  const {
    status,
    brandName,
    handleBrandName,
    fileInputRef,
    openSystemFiles,
    handleFileChange,
    previewURL,
    submitBrand,
    errors,
  } = utils;
  return (
    <section className="w-2/4 flex flex-col gap-4  a-section--box">
      <div className="">
        <div className="flex items-end justify-between">
          <label htmlFor="" className="a-text--label">
            Brand Name
          </label>
          {errors.brand_name && (
            <div className="a-text--error">{errors.brand_name}</div>
          )}
        </div>

        <input
          type="text"
          className="a-input"
          placeholder="Eg: Skoda"
          value={brandName}
          onChange={handleBrandName}
        />
      </div>
      <div className="space-y-1">
        <div className="flex items-end justify-between">
          <div className="a-text--label">Brand Image</div>
          {errors.brand_image && (
            <div className="a-text--error">{errors.brand_image}</div>
          )}
        </div>
        <div
          className="border border-neutral-200 h-[20rem] bg-white flex items-center justify-center cursor-pointer relative"
          onClick={openSystemFiles}
        >
          <input
            type="file"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          {previewURL ? (
            <div className="absolute inset-0">
              <img
                src={previewURL}
                alt="brand preview image"
                className="w-full h-full object-contain"
              />
              <div className="bg-black/40 absolute inset-0"></div>
              <div className="absolute top-[50%] left-[50%] -translate-y-[50%] -translate-x-[50%] z-10 text-white text-[1.8rem] font-medium w-full text-center">
                Click here to change the preview image
              </div>
            </div>
          ) : (
            <div className="a-text--label !text-[1.6rem] !flex items-center gap-0">
              Upload image from your device{" "}
              <Upload className="w-[4rem] h-[2rem]" />
            </div>
          )}
        </div>
      </div>
      <button
        className="text-[1.4rem] font-medium text-white bg-black py-4 mt-4"
        onClick={submitBrand}
      >
        {status !== "idle" ? (
          <div className="flex items-center gap-4">
            Creating Brand
            <Spinner className="w-[2rem] h-[2rem] animate-spin" />
          </div>
        ) : (
          "Create Brand"
        )}
      </button>
    </section>
  );
};

export default BrandCreation;
