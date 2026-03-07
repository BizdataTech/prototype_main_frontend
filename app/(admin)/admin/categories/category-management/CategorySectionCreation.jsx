const CategorySectionCreation = ({ data }) => {
  const {
    errors,
    sectionTitle,
    handleSectionTitle,
    attribute,
    handleAttribute,
    submitAttribute,
    sectionAttributes,
    createCategorySection,
  } = data;
  return (
    <div className="a-section--box flex flex-col gap-2">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="a-section--title">Product Section Title</div>
          {(errors.section_title || errors.section_attribute) && (
            <div className="a-text--error">
              {errors.section_title || errors.section_attribute}
            </div>
          )}
        </div>

        <input
          type="text"
          className="a-input"
          placeholder="Eg: General"
          value={sectionTitle}
          onChange={handleSectionTitle}
        />
      </div>
      <div className="space-y-2">
        <div className="a-section--title">New Attribute</div>
        <div className="border border-neutral-200 p-4 rounded-[.5rem] bg-neutral-100">
          <div className="flex flex-col gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="a-text--body font-medium">Form Label</div>
                {errors.label && (
                  <div className="a-text--error">{errors.label}</div>
                )}
              </div>

              <input
                type="text"
                name="label"
                className="a-input"
                placeholder="Eg: Color"
                value={attribute.label}
                onChange={handleAttribute}
              />
            </div>
            <div className="space-y-2">
              <div className="a-text--body font-medium">Form Input Type</div>
              <select
                name="field_type"
                id=""
                className="a-input"
                value={attribute.field_type}
                onChange={handleAttribute}
              >
                {[
                  { label: "Text", value: "text" },
                  { label: "Select", value: "select" },
                  { label: "Multi Select", value: "multi-select" },
                ].map((obj) => (
                  <option value={obj.value}>{obj.label}</option>
                ))}
              </select>
            </div>
            {attribute.field_type !== "text" && (
              <div className="flex flex-col gap-2">
                <div className="a-text--body font-medium">
                  Form Options for Select or Multi Select Field
                </div>
                <div>
                  <input
                    type="text"
                    name="options"
                    className="a-input"
                    placeholder="Black, White, Gold, Silver"
                    value={attribute.options}
                    onChange={handleAttribute}
                  />
                  <div className="a-text--sub !text-[1.3rem] italic">
                    *Add comma in between values (a,b,c)
                  </div>
                </div>

                {errors.options && (
                  <div className="a-text--error self-end">{errors.options}</div>
                )}
              </div>
            )}

            <button
              className="a-text--button mt-4 bg-white text-red-800 border border-red-800"
              onClick={submitAttribute}
            >
              Add Attribute
            </button>
          </div>
          <div></div>
        </div>
      </div>
      {sectionAttributes.length > 0 && (
        <div className="space-y-4 p-4 border border-neutral-300">
          <div className="a-section--title">
            {`Section Attributes (${sectionAttributes.length})`}
          </div>
          <div className="">
            <ol className="grid grid-cols-4 pb-3 border-b border-neutral-300">
              {["Count", "Label", "Field Type", "Options"].map((item, i) => (
                <li key={i} className="a-text--table-head">
                  {item}
                </li>
              ))}
            </ol>
            {sectionAttributes.map((attribute, i) => (
              <ol
                key={i}
                className="grid grid-cols-4 py-4 border-b border-neutral-300 last:border-0"
              >
                <li className="a-text--table-data pl-2">{i + 1}</li>
                {Object.entries(attribute).map(([key, value], i) => (
                  <li key={i} className="a-text--table-data">
                    {key === "options" ? value.join(", ") : value}
                  </li>
                ))}
              </ol>
            ))}
          </div>
        </div>
      )}
      <button
        className="a-text--button self-end mt-6 border border-neutral-500 text-neutral-700 hover:border-green-800 hover:text-green-800  transition"
        onClick={createCategorySection}
      >
        Create Section
      </button>
    </div>
  );
};

export default CategorySectionCreation;
