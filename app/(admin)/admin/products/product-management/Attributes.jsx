import { useState } from "react";
import { Plus, X } from "phosphor-react";
import { InputLabel } from "@/components/admin/InputLabel";

/**
 * Multi-value attribute field (select / multi-select type).
 * Renders a dropdown + "+ Add" button just like the category page VariantSection.
 * Selected values show as removable tag pills below.
 */
const MultiSelectAttribute = ({ attribute, value, onChange }) => {
  const [currentSelection, setCurrentSelection] = useState("");

  // value is stored as an array for multi-select attributes
  const selectedValues = Array.isArray(value) ? value : value ? [value] : [];
  const allOptions = attribute.options || attribute.values || [];

  // Only show options that haven't been selected yet
  const unselectedOptions = allOptions.filter(
    (opt) => !selectedValues.includes(opt)
  );

  const handleAdd = () => {
    if (currentSelection && !selectedValues.includes(currentSelection)) {
      const next = [...selectedValues, currentSelection];
      // Fire synthetic event so handleAttributeInputFields works unchanged
      onChange({ target: { name: attribute._id, value: next } });
      setCurrentSelection("");
    }
  };

  const handleRemove = (opt) => {
    const next = selectedValues.filter((v) => v !== opt);
    onChange({ target: { name: attribute._id, value: next } });
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Dropdown + Add button — same pattern as category VariantSection */}
      <div className="flex gap-2">
        <select
          className="a-input flex-1"
          value={currentSelection}
          onChange={(e) => setCurrentSelection(e.target.value)}
        >
          <option value="" disabled>
            Select {attribute.label || attribute.name}
          </option>
          {unselectedOptions.map((opt, i) => (
            <option key={i} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <button
          type="button"
          disabled={!currentSelection}
          onClick={handleAdd}
          className="a-text--button bg-[#176eb1] text-white hover:bg-black transition px-6 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Plus weight="bold" />
          Add
        </button>
      </div>

      {/* Selected value pills */}
      {selectedValues.length > 0 && (
        <div className="flex flex-col gap-1.5 mt-1">
          {selectedValues.map((val, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-2 bg-neutral-50 border border-neutral-200 rounded"
            >
              <span className="text-[1.3rem] font-medium">{val}</span>
              <button
                type="button"
                onClick={() => handleRemove(val)}
                className="text-red-500 hover:text-red-700 transition"
              >
                <X weight="bold" size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * Attributes section rendered for a product based on its category's attribute collection.
 * - text / number → simple input (unchanged)
 * - select / multi-select → dropdown + "+ Add" button with removable tags (new)
 */
const Attributes = ({ attributes, values, handleInputs }) => {
  if (!attributes || attributes.length < 1) return null;

  const getInputField = (attribute) => {
    const name = attribute._id;
    const value = values[attribute._id] ?? "";

    switch (attribute.input_type) {
      case "text":
      case "Text":
        return (
          <input
            type="text"
            className="a-input"
            name={name}
            value={value}
            onChange={handleInputs}
          />
        );

      case "number":
      case "Number":
        return (
          <input
            type="number"
            className="a-input"
            name={name}
            value={value}
            onChange={handleInputs}
          />
        );

      case "select":
      case "multi-select":
      case "Select":
        return (
          <MultiSelectAttribute
            attribute={attribute}
            value={value}
            onChange={handleInputs}
          />
        );

      default:
        return (
          <input
            type="text"
            className="a-input"
            name={name}
            value={value}
            onChange={handleInputs}
          />
        );
    }
  };

  return (
    <section className="a-section--box">
      <div className="a-section--title font-bold text-lg mb-4">Attributes</div>
      <div className="grid grid-cols-3 gap-6 mt-4">
        {attributes.map((att) => (
          <div key={att._id} className="flex flex-col gap-2">
            <InputLabel label={att.label || att.name} />
            {getInputField(att)}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Attributes;
