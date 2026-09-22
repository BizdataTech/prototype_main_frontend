"use client";

import { useState, useEffect, useMemo } from "react";
import { Details } from "./Details";
import { ImageGrid } from "./ImageGrid";
import { ProductNavSidebar } from "./ProductNavSidebar";
import { useProduct } from "./useProduct";

const Productpage = () => {
  const { product, addProducttoCart } = useProduct();

  // Selected options state for variable products
  const [selectedOptions, setSelectedOptions] = useState({});

  // Extract normalized option groups
  const optionGroups = useMemo(() => {
    const isVar = product?.parent?.product_type === 'Variable' || (product?.parent?.variants?.length > 0);
    if (!isVar) return [];

    if (product?.parent?.variantOptions && product.parent.variantOptions.length > 0) {
      return product.parent.variantOptions
        .map((opt) => {
          const title = opt.variantId?.title || opt.title || 'Option';
          const values = Array.isArray(opt.values) ? opt.values : [];
          return { title, values };
        })
        .filter((group) => group.title && group.values.length > 0);
    }

    // Fallback: derive from variants combinations
    const groups = {};
    (product?.parent?.variants || []).forEach(v => {
      if (v.combination) {
        Object.entries(v.combination).forEach(([key, val]) => {
          if (!groups[key]) groups[key] = new Set();
          groups[key].add(val);
        });
      }
    });

    return Object.entries(groups).map(([title, valuesSet]) => ({
      title,
      values: Array.from(valuesSet)
    })).filter((group) => group.title && group.values.length > 0);
  }, [product]);

  const isVariable = Boolean(optionGroups.length > 0 && product?.parent?.variants?.length > 0);

  // Synchronize initial selected options with default representative variant
  useEffect(() => {
    if (!isVariable || optionGroups.length === 0) return;
    const variants = product?.parent?.variants || [];
    if (variants.length === 0) return;

    // Find initial variant: either matching product._id or first variant
    const initialVariant =
      variants.find((v) => String(v._id) === String(product._id)) || variants[0];

    if (initialVariant?.combination) {
      setSelectedOptions((prev) => {
        if (Object.keys(prev).length > 0) return prev;
        const initial = {};
        optionGroups.forEach((g) => {
          if (initialVariant.combination[g.title]) {
            initial[g.title] = initialVariant.combination[g.title];
          }
        });
        return initial;
      });
    }
  }, [product, isVariable, optionGroups]);

  // Check if all option groups are selected
  const allSelected = useMemo(() => {
    if (!isVariable) return true;
    if (optionGroups.length === 0) return true;
    return optionGroups.every((g) => Boolean(selectedOptions[g.title]));
  }, [isVariable, optionGroups, selectedOptions]);

  // Match selected options to a variant (order-independent)
  const matchingVariant = useMemo(() => {
    if (!isVariable || !allSelected) return null;
    const variants = product?.parent?.variants || [];
    return (
      variants.find((v) => {
        if (v.status === "Inactive") return false;
        return optionGroups.every((g) => {
          const selectedVal = selectedOptions[g.title];
          const variantVal = v.combination?.[g.title];
          return String(variantVal).trim() === String(selectedVal).trim();
        });
      }) || null
    );
  }, [isVariable, allSelected, product, optionGroups, selectedOptions]);

  // Effective images calculation
  const effectiveImages = useMemo(() => {
    const parentImgs = product?.images || [];
    if (isVariable && matchingVariant?.image?.url) {
      const variantUrl = matchingVariant.image.url;
      const otherUrls = parentImgs
        .map((img) => (typeof img === "string" ? img : img?.url))
        .filter((url) => url && url !== variantUrl);
      return [variantUrl, ...otherUrls];
    }
    return parentImgs;
  }, [product, isVariable, matchingVariant]);

  if (!product) {
    return null;
  }

  return (
    <div className="w-[95%] mx-auto pt-[15rem] pb-12">
      <div className="flex flex-col md:flex-row items-start gap-6">
        {/* Left Side Navbar Menu */}
        <ProductNavSidebar />

        {/* Product Details Container */}
        <div className="flex-1 w-full flex flex-col md:flex-row gap-6 bg-transparent p-6 rounded-2xl border border-neutral-200/80 shadow-sm">
          <ImageGrid images={effectiveImages} />
          <Details
            product={product}
            addProducttoCart={addProducttoCart}
            isVariable={isVariable}
            optionGroups={optionGroups}
            selectedOptions={selectedOptions}
            setSelectedOptions={setSelectedOptions}
            allSelected={allSelected}
            matchingVariant={matchingVariant}
          />
        </div>
      </div>
    </div>
  );
};

export default Productpage;
