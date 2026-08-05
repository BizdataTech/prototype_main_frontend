"use client";

import { useState } from "react";
import { Plus, X, Checks, ArrowsClockwise } from "phosphor-react";

/**
 * WooCommerce-style Attributes Panel for Variable Products.
 *
 * Props:
 *  - allAvailableVariants: all variant definitions fetched from /api/variants
 *  - activeAttributes: the currently added attribute rows
 *  - onAddAttribute(variantId): adds an attribute to the product
 *  - onRemoveAttribute(variantId): removes it
 *  - onToggleValue(variantId, value): toggles a single value on/off
 *  - onToggleUsedForVariations(variantId): toggles the "Used for Variations" checkbox
 *  - onGenerate(): fires the combination generator
 */
const VariableAttributes = ({
  allAvailableVariants,
  activeAttributes,
  onAddAttribute,
  onRemoveAttribute,
  onToggleValue,
  onToggleUsedForVariations,
  onGenerate,
}) => {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Attributes not yet added
  const availableToAdd = allAvailableVariants.filter(
    (v) => !activeAttributes.find((a) => a.variantId === v._id)
  );
  const filtered = availableToAdd.filter((v) =>
    v.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="a-section--box flex flex-col gap-4">
      {/* ── Header ── */}
      <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
        <div>
          <div className="a-section--title font-bold text-lg">Attributes</div>
          <p className="text-[1.2rem] text-neutral-400 mt-0.5">
            Add attributes like Color, Size, Storage — then select values and
            generate variations.
          </p>
        </div>

        {/* + Add Attribute button */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setPickerOpen((p) => !p);
              setSearchTerm("");
            }}
            className="flex items-center gap-2 bg-[#176eb1] hover:bg-blue-700 text-white text-[1.2rem] font-semibold px-5 py-2.5 rounded-xl transition-all shadow-sm"
          >
            <Plus weight="bold" size={15} />
            Add Attribute
          </button>

          {/* Dropdown picker */}
          {pickerOpen && (
            <div className="absolute right-0 top-[110%] z-50 bg-white border border-neutral-200 rounded-xl shadow-xl w-[22rem] py-2">
              <div className="px-3 pb-2">
                <input
                  type="text"
                  placeholder="Search attributes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-[1.2rem] outline-none focus:border-blue-400"
                  autoFocus
                />
              </div>
              <div className="max-h-[20rem] overflow-y-auto">
                {filtered.length === 0 ? (
                  <div className="text-[1.2rem] text-neutral-400 px-4 py-3">
                    {availableToAdd.length === 0
                      ? "All attributes already added."
                      : "No attributes match."}
                  </div>
                ) : (
                  filtered.map((v) => (
                    <button
                      key={v._id}
                      type="button"
                      onClick={() => {
                        onAddAttribute(v._id);
                        setPickerOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-[1.3rem] hover:bg-blue-50 hover:text-blue-700 transition-colors flex items-center gap-2"
                    >
                      {v.color && (
                        <span className="w-3 h-3 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex-shrink-0" />
                      )}
                      {v.title}
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Attribute Rows ── */}
      {activeAttributes.length === 0 ? (
        <div className="text-center py-10 text-neutral-400 text-[1.3rem]">
          <div className="text-[3rem] mb-2">🎛️</div>
          <div>Click <strong>+ Add Attribute</strong> to start (e.g. Color, Size)</div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {activeAttributes.map((attr) => (
            <div
              key={attr.variantId}
              className="border border-neutral-200 rounded-xl bg-neutral-50 p-4 flex flex-col gap-3"
            >
              {/* Row header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {attr.color && (
                    <span className="w-3 h-3 rounded-full bg-gradient-to-br from-pink-400 to-purple-500" />
                  )}
                  <span className="font-bold text-[1.4rem] text-neutral-800">
                    {attr.title}
                  </span>
                  <span className="text-[1.1rem] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">
                    {attr.selectedValues.length} selected
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveAttribute(attr.variantId)}
                  className="text-red-400 hover:text-red-600 transition"
                  title="Remove attribute"
                >
                  <X weight="bold" size={16} />
                </button>
              </div>

              {/* Value pills (multi-select) */}
              <div className="flex flex-wrap gap-2">
                {attr.values.map((v) => {
                  const active = attr.selectedValues.includes(v.value);
                  return (
                    <button
                      key={v.value}
                      type="button"
                      onClick={() => onToggleValue(attr.variantId, v.value)}
                      className={`px-3 py-1.5 rounded-full text-[1.15rem] font-medium border transition-all select-none ${
                        active
                          ? "bg-[#176eb1] text-white border-[#176eb1] shadow-sm"
                          : "bg-white text-neutral-600 border-neutral-300 hover:border-[#176eb1] hover:text-[#176eb1]"
                      }`}
                    >
                      {v.label || v.value}
                    </button>
                  );
                })}
              </div>

              {/* Used for Variations checkbox */}
              <label className="flex items-center gap-2 cursor-pointer select-none w-fit">
                <input
                  type="checkbox"
                  checked={attr.usedForVariations}
                  onChange={() => onToggleUsedForVariations(attr.variantId)}
                  className="w-4 h-4 accent-[#176eb1]"
                />
                <span className="text-[1.2rem] font-medium text-neutral-700">
                  Used for variations
                </span>
                {attr.usedForVariations && (
                  <Checks
                    weight="bold"
                    size={14}
                    className="text-green-500"
                  />
                )}
              </label>
            </div>
          ))}
        </div>
      )}

      {/* ── Generate Variations Button ── */}
      {activeAttributes.length > 0 && (
        <div className="flex justify-end pt-2 border-t border-neutral-100">
          <button
            type="button"
            onClick={onGenerate}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-[1.3rem] font-semibold px-6 py-3 rounded-xl transition-all shadow-md"
          >
            <ArrowsClockwise weight="bold" size={16} />
            Generate Variations
          </button>
        </div>
      )}
    </section>
  );
};

export default VariableAttributes;
