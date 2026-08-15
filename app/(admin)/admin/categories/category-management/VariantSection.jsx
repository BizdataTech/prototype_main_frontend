import Link from "next/link";
import { useState } from "react";
import { Plus, X } from "phosphor-react";

const VariantSection = ({ globalVariants, selectedVariants, setSelectedVariants }) => {
  const [currentSelection, setCurrentSelection] = useState("");

  const handleAdd = () => {
    if (currentSelection && !selectedVariants.includes(currentSelection)) {
      setSelectedVariants([...selectedVariants, currentSelection]);
      setCurrentSelection("");
    }
  };

  const handleRemove = (idToRemove) => {
    setSelectedVariants(selectedVariants.filter((v) => (typeof v === "object" ? v._id !== idToRemove : v !== idToRemove)));
  };

  const unselectedVariants = globalVariants.filter(
    (gv) => !selectedVariants.some((sv) => (typeof sv === "object" ? sv._id === gv._id : sv === gv._id))
  );

  const getVariantTitle = (id) => {
    const v = globalVariants.find((gv) => gv._id === id);
    return v ? v.title : id;
  };

  return (
    <section className="w-full a-section--box flex flex-col gap-4 self-start">
      <div>
        <div className="a-section--title">Variant Selection</div>
        <div className="a-text--body">
          Select the variants that should be available for products in this category. Manage variants from{" "}
          <Link href="/admin/variants" className="underline">
            variant collection
          </Link>
        </div>
      </div>

      <div className="a-text--body bg-yellow-50 !text-yellow-700 p-4">
        Note : "Link variants to this category to make them available for variable products."
      </div>

      <div className="flex flex-col gap-2 mt-2">
        <div className="a-text--body">Add Variant</div>
        <div className="flex gap-2">
          <select
            className="a-input flex-1"
            value={currentSelection}
            onChange={(e) => setCurrentSelection(e.target.value)}
          >
            <option value="" disabled>
              Select a variant
            </option>
            {unselectedVariants.map((variant) => (
              <option key={variant._id} value={variant._id}>
                {variant.title}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="a-text--button bg-[#176eb1] text-white hover:bg-black transition px-6 flex items-center justify-center gap-2"
            onClick={handleAdd}
            disabled={!currentSelection}
          >
            <Plus weight="bold" /> Add
          </button>
        </div>
      </div>

      {selectedVariants.length > 0 && (
        <div className="flex flex-col gap-2 mt-4">
          <div className="a-text--body font-medium">Selected Variants</div>
          <div className="flex flex-col gap-2">
            {selectedVariants.map((variantId, index) => {
              const id = typeof variantId === "object" ? variantId._id : variantId;
              return (
                <div
                  key={id || index}
                  className="flex items-center justify-between p-3 bg-neutral-50 border border-neutral-200 rounded"
                >
                  <span className="text-[1.4rem] font-medium">{getVariantTitle(id)}</span>
                  <button
                    type="button"
                    onClick={() => handleRemove(id)}
                    className="text-red-500 hover:text-red-700 transition"
                  >
                    <X weight="bold" size={18} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};

export default VariantSection;
