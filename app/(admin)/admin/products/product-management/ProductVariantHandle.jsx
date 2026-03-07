import {
  Prohibit,
  TrashSimple,
  GooglePhotosLogo,
  PencilSimpleLine,
  AlignBottom,
} from "phosphor-react";
import ImageModal from "./ImageModal";
import { useEffect, useState } from "react";
const ProductVariantHandle = ({ utils }) => {
  const { categoryDataInputs, variantActions, errors, handleImages } = utils;
  const { handleVariantData, deleteVariant } = variantActions;

  let [variants, setVariants] = useState(categoryDataInputs.variants);
  let [open, setOpen] = useState(false);
  let [SKU, setSKU] = useState(null);

  useEffect(() => {
    setVariants(() => {
      return categoryDataInputs.variants.sort((a, b) => a.block - b.block);
    });
  }, [categoryDataInputs.variants]);

  const handleModal = (sku = null) => {
    console.log("sku:", sku);
    if (sku) setSKU(sku);
    setOpen(!open);
  };

  return (
    variants.length > 0 && (
      <div className="a-section--box">
        <div className="space-y-4">
          <div className="a-section--title">{`Product Variants ( ${variants.length} )`}</div>

          {variants.map((variant) => (
            <div className={`${variant?.block ? "relative" : "mt-[1rem]"}`}>
              <div
                className={`border ${
                  variant?.block
                    ? "border-red-700/30 opacity-30 pointer-events-none cursor-not-allowed"
                    : "border-neutral-300"
                }  p-4 rounded-[.3rem] text-[1.2rem]`}
              >
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-end ">
                    <div
                      className={`font-medium ${
                        variant?.block ? "text-red-600" : ""
                      }`}
                    >{`SKU: ${variant.sku}`}</div>
                    <div className="flex items-center gap-2">
                      <PencilSimpleLine className="w-[1.4rem] h-[1.4rem]" />
                      <TrashSimple
                        className="w-[1.4rem] h-[1.4rem]"
                        onClick={() => deleteVariant(variant.sku)}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between gap-1 mb-4">
                    <div className="border w-1/2 border-neutral-200 p-2 rounded-[.3rem]">
                      <div>
                        {variant.attributes &&
                          variant.attributes.map((attribute) => (
                            <div className="flex items-center gap-2">
                              <span>{`${attribute.label}:`}</span>
                              <span className="font-medium">
                                {attribute.value}
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 w-1/2 border border-neutral-200 p-2 rounded-[.3rem]">
                      <div>
                        <div>Quantity</div>
                        <input
                          type="number"
                          name="stock"
                          data-id={variant.sku}
                          className={`a-input ${
                            errors[`${variant.sku}_stock`]
                              ? "!border-red-600"
                              : ""
                          }`}
                          value={variant.stock}
                          onChange={handleVariantData}
                        />
                      </div>
                      <div>
                        <div>Price</div>
                        <input
                          type="number"
                          name="price"
                          data-id={variant.sku}
                          className={`a-input  outline-none ${
                            errors[`${variant.sku}_price`]
                              ? "!border-red-600"
                              : ""
                          }`}
                          value={variant.price}
                          onChange={handleVariantData}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-neutral-300 py-4 bg-neutral-100 px-2">
                    {variant?.images && !variant?.images.length ? (
                      <div className="flex items-center justify-between">
                        <div>
                          No images added for this variant.{" "}
                          <span
                            className="capitalize font-medium underline hover:text-violet-600 transition-colors cursor-pointer"
                            onClick={() => handleModal(variant.sku)}
                          >
                            add images
                          </span>
                        </div>
                        {errors[`${variant.sku}_images`] && (
                          <div className="a-text--error">
                            {errors[`${variant.sku}_images`]}
                          </div>
                        )}
                      </div>
                    ) : (
                      variant?.images && (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>{`Total Images Added (${variant?.images.length})`}</div>
                            <div
                              className="text-violet-600 hover:text-violet-900 transition-colors capitalize underline cursor-pointer"
                              onClick={() => handleModal(variant.sku)}
                            >
                              handle images
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-4">
                            {variant.images.map((image) => (
                              <img
                                src={image.url}
                                alt=""
                                className="w-[5rem] h-[5rem] object-cover"
                              />
                            ))}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
              {/* {variant?.block && (
                <div className="absolute inset-0 flex justify-center items-center">
                  <div className="text-[1.2rem] text-red-500/75 font-medium">
                    A product with same SKU is already created!
                  </div>
                </div>
              )} */}
            </div>
          ))}
          {open && (
            <ImageModal
              variants={categoryDataInputs.variants}
              sku={SKU}
              func={handleModal}
              handleImages={handleImages}
            />
          )}
        </div>
      </div>
    )
  );
};

export default ProductVariantHandle;
