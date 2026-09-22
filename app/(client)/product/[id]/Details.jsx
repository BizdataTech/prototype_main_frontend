"use client";

import { useContext } from "react";
import { WishlistContext } from "@/context/wishlistContext";
import { CartContext } from "@/context/cartContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const Details = ({
  product,
  addProducttoCart,
  isVariable = false,
  optionGroups = [],
  selectedOptions = {},
  setSelectedOptions = () => {},
  allSelected = true,
  matchingVariant = null,
}) => {
  const { sections } = product?.parent || {};

  // Determine current active item ID (variant ID if variable & selected, else product ID)
  const activeItemId = isVariable
    ? matchingVariant
      ? matchingVariant._id
      : null
    : product?._id;

  const { addToWishlist, isInWishlist } = useContext(WishlistContext);
  const inWishlist =
    isInWishlist(activeItemId || product?._id) ||
    isInWishlist(product?.parent?._id);

  const { items } = useContext(CartContext);
  const router = useRouter();

  const inCart = items.some(
    (item) =>
      (activeItemId &&
        (item.productId?._id === activeItemId ||
          item.productId === activeItemId)) ||
      item.productId?._id === product?._id ||
      item.productId === product?._id
  );

  const handleWishlistToggle = () => {
    if (inWishlist) {
      router.push("/wishlist");
    } else {
      addToWishlist(activeItemId || product?._id);
    }
  };

  // Determine pricing
  let displayPrice = product?.price;
  let displaySalePrice = product?.sale_price;
  let stock = product?.stock;

  if (isVariable) {
    if (matchingVariant) {
      displayPrice = matchingVariant.price;
      displaySalePrice = matchingVariant.sale_price;
      stock = matchingVariant.stock;
    } else {
      // Find min price among variants if available
      const prices = (product?.parent?.variants || [])
        .map((v) => (v.sale_price ? v.sale_price : v.price))
        .filter(Boolean);
      if (prices.length > 0) {
        displayPrice = Math.min(...prices);
      }
    }
  }

  // Check if option value is available in combination
  const isValueAvailable = (groupTitle, val) => {
    const variants = product?.parent?.variants || [];
    return variants.some((v) => {
      if (v.status === "Inactive") return false;
      if (String(v.combination?.[groupTitle]).trim() !== String(val).trim())
        return false;
      return optionGroups.every((otherGroup) => {
        if (otherGroup.title === groupTitle) return true;
        const selectedOtherVal = selectedOptions[otherGroup.title];
        if (!selectedOtherVal) return true;
        return (
          String(v.combination?.[otherGroup.title]).trim() ===
          String(selectedOtherVal).trim()
        );
      });
    });
  };

  const handleAddToCart = () => {
    if (inCart) {
      router.push("/cart");
      return;
    }

    if (isVariable) {
      if (!allSelected) {
        toast.warning("Please select all required options.");
        return;
      }
      if (!matchingVariant) {
        toast.error("Selected variation combination is not available.");
        return;
      }
      if (matchingVariant.stock <= 0) {
        toast.error("Sorry, this variation is out of stock.");
        return;
      }
      addProducttoCart(matchingVariant._id);
    } else {
      if (product?.stock <= 0) {
        toast.error("Sorry, this product is out of stock.");
        return;
      }
      addProducttoCart(product?._id);
    }
  };

  const isAddToCartDisabled =
    !inCart &&
    (isVariable
      ? !allSelected || !matchingVariant || (matchingVariant && matchingVariant.stock <= 0)
      : stock <= 0);

  return (
    <div className="w-full md:w-3/6 space-y-6">
      <section className="bg-white p-6 flex flex-col gap-4">
        <div className="space-y-2">
          <h1 className="text-[2.2rem] font-medium leading-[3rem]">
            {product?.parent?.product_title}
          </h1>
        </div>

        <div className="flex items-baseline gap-4">
          {displaySalePrice && displaySalePrice < displayPrice ? (
            <>
              <p className="text-[3rem] font-medium text-black">
                AED {displaySalePrice}
              </p>
              <p className="text-[2rem] text-neutral-400 line-through">
                AED {displayPrice}
              </p>
            </>
          ) : (
            <p className="text-[3rem] font-medium">AED {displayPrice}</p>
          )}
        </div>

        {/* Dynamic Variation Selectors */}
        {isVariable && optionGroups.length > 0 && (
          <div className="space-y-4 border-t border-b border-neutral-200 py-5 my-2">
            {optionGroups.map((group) => (
              <div key={group.title} className="space-y-2">
                <label className="block text-[1.4rem] font-semibold text-neutral-800">
                  Select {group.title}:{" "}
                  <span className="font-normal text-neutral-500">
                    {selectedOptions[group.title] || "Select an option"}
                  </span>
                </label>
                <div className="flex flex-wrap gap-3">
                  {group.values.map((val) => {
                    const isSelected = selectedOptions[group.title] === val;
                    const available = isValueAvailable(group.title, val);
                    return (
                      <button
                        key={val}
                        type="button"
                        disabled={!available}
                        onClick={() =>
                          setSelectedOptions((prev) => ({
                            ...prev,
                            [group.title]: val,
                          }))
                        }
                        className={`px-4 py-2 text-[1.3rem] font-medium rounded-lg border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-black text-white border-black shadow-sm"
                            : available
                            ? "bg-white text-neutral-800 border-neutral-300 hover:border-black"
                            : "bg-neutral-100 text-neutral-400 border-neutral-200 cursor-not-allowed opacity-50 line-through"
                        }`}
                      >
                        {val}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {!allSelected && (
              <p className="text-[1.3rem] text-amber-600 font-medium italic">
                * Please select all available options to complete your variation choice.
              </p>
            )}

            {allSelected && !matchingVariant && (
              <p className="text-[1.3rem] text-red-600 font-medium">
                * This specific combination is currently unavailable.
              </p>
            )}
          </div>
        )}

        <div className="space-y-[.5rem] mt-4 text-[1.6rem]">
          <div className="font-medium">Product Description</div>
          <div
            className="whitespace-pre-wrap text-neutral-600 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: product?.parent?.description }}
          />
        </div>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 bg-white p-4">
        <button
          className={`button border cursor-pointer transition-colors ${
            inWishlist
              ? "bg-red-50 border-red-400 text-red-600"
              : "border-neutral-900 text-neutral-900 bg-white"
          }`}
          onClick={handleWishlistToggle}
        >
          {inWishlist ? "View Wishlist ♥" : "Add to Wishlist"}
        </button>
        <button
          className={`button bg-black text-white text-center ${
            isAddToCartDisabled
              ? "cursor-not-allowed opacity-40"
              : "cursor-pointer"
          }`}
          onClick={handleAddToCart}
          disabled={isAddToCartDisabled}
        >
          {inCart
            ? "View Cart"
            : isVariable && !allSelected
            ? "Select Options"
            : isVariable && !matchingVariant
            ? "Unavailable"
            : stock <= 0
            ? "Out of Stock"
            : "Add to Cart"}
        </button>
      </div>

      {sections && (
        <section className="bg-white p-6">
          {sections.map((section, index) => (
            <div
              className="text-[1.6rem] border-b border-neutral-300 last:border-b-0 space-y-4"
              key={index}
            >
              <div className="font-medium">{section.title}</div>
              <div>
                {section.details.map((detail, index) => (
                  <div className="flex justify-between gap-8" key={index}>
                    <div>{detail.label}</div>
                    <div>{detail.value}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
};
