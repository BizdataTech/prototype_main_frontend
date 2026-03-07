const CategoryVariants = ({ data }) => {
  const {
    errors,
    variant,
    variants,
    parentVariants,
    handleCategoryVariants,
    createCategoryVariant,
    getParentDetails,
  } = data;
  return (
    <div className="a-section--box">
      <div className="space-y-2">
        <div className="a-section--title">Category specific variants</div>

        <p className="a-text--body">
          Products might have{" "}
          <span className="font-semibold">different variants</span> based on
          their{" "}
          <span className="font-semibold">color, size, weight and others.</span>{" "}
          You can specify what all variants the product under this categories
          have.
        </p>
      </div>
      <div className="mt-8 space-y-6">
        <div className="top a-section--box !bg-neutral-100 flex flex-col gap-2">
          <div className="a-section--title">Add category variants</div>
          <div className="">
            <div className="flex items-center justify-between">
              <div className="a-text--label">Label</div>
              {errors.variant_label && (
                <div className="a-text--error !bg-white">
                  {errors.variant_label}
                </div>
              )}
            </div>
            <input
              type="text"
              name="label"
              placeholder="Eg: Storage spaces"
              className="a-input"
              value={variant.label}
              onChange={handleCategoryVariants}
            />
          </div>
          <div className="">
            <div className="flex items-center justify-between">
              <div className="a-text--label">Allowed values</div>
              {errors.variant_values && (
                <div className="a-text--error !bg-white">
                  {errors.variant_values}
                </div>
              )}
            </div>

            <input
              type="text"
              name="values"
              placeholder="Eg: 64GB, 128GB, 256GB, 512GB"
              className="a-input"
              value={variant.values}
              onChange={handleCategoryVariants}
            />
          </div>
          <button
            className="a-text--button !normal-case border border-neutral-200 bg-white hover:bg-neutral-100 text-neutral-800 transition self-end"
            onClick={createCategoryVariant}
          >
            Add category variant
          </button>
        </div>
        {variants.length > 0 && (
          <div className="right a-section--box !bg-neutral-100">
            <div className="a-section--title">
              Category variants demonstration
            </div>
            <div className="bg-white p-4 rounded-[.5rem] space-y-4">
              {variants.map((v) => (
                <div className="flex gap-2 items-center">
                  <div className="a-text--label w-full">{v.label}</div>
                  <select name="" id="" className="a-input">
                    {v.values.map((val) => (
                      <option value={val}>{val}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>
        )}
        {parentVariants.length > 0 && variants.length === 0 && (
          <div className="a-section--box flex flex-col">
            <div className="a-section--title max-w-[80%]">
              No variants are added so far for this category. A product might
              have different variants based on color, size, weight and so on.
            </div>
            <button
              name="variants"
              className="a-text--button self-end !normal-case text-neutral-800 bg-neutral-100 hover:bg-neutral-50 transition border border-neutral-200"
              onClick={getParentDetails}
            >
              Extract variants from parent
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryVariants;
