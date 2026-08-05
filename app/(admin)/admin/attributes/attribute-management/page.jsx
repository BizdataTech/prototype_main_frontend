"use client";

import { Plus, Spinner, Trash } from "phosphor-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import useAttributes from "../useAttributes";

const AttributeManagement = () => {
  const {
    loading,
    action,
    name, setName,
    type, setType,
    values, setValues,
    description, setDescription,
    status, setStatus,
    submitAttribute,
    deleteAttribute,
    attributeId
  } = useAttributes();

  const [newValue, setNewValue] = useState("");

  const handleAddValue = () => {
    if (!newValue.trim()) {
      return toast.warning("Value cannot be empty!");
    }
    if (values.includes(newValue.trim())) {
      return toast.warning("Value already exists!");
    }
    setValues([...values, newValue.trim()]);
    setNewValue("");
  };

  const handleRemoveValue = (indexToRemove) => {
    setValues(values.filter((_, i) => i !== indexToRemove));
  };

  return (
    <main className="w-full max-w-full flex flex-col gap-6 pb-12">
      <section className="w-full lg:w-7/12 flex flex-col gap-6">
        {/* Name section */}
        <div className="section--attribute__name a-section--box">
          <div className="a-section--title mb-2">Attribute Name</div>
          <input
            type="text"
            className="a-input"
            placeholder="Eg: Material"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Description section */}
        <div className="a-section--box">
          <div className="a-section--title mb-2">Description (Optional)</div>
          <textarea
            className="a-input min-h-[100px]"
            placeholder="A short description of this attribute..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Type & Status */}
        <div className="a-section--box flex flex-col md:flex-row gap-6">
          <div className="w-full">
            <div className="a-section--title mb-2">Attribute Type</div>
            <select
              className="a-input cursor-pointer"
              value={type}
              onChange={(e) => {
                setType(e.target.value);
                if (e.target.value !== "Select") {
                  setValues([]);
                }
              }}
            >
              <option value="Text">Text</option>
              <option value="Number">Number</option>
              <option value="Boolean">Boolean</option>
              <option value="Select">Select (Dropdown)</option>
            </select>
          </div>
          <div className="w-full">
            <div className="a-section--title mb-2">Status</div>
            <select
              className="a-input cursor-pointer"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Values Section (Only for 'Select' type) */}
        {type === "Select" && (
          <div className="a-section--box flex flex-col gap-4">
            <div className="a-section--title">Attribute Values</div>
            
            <div className="flex gap-4">
              <input
                type="text"
                className="a-input w-full"
                placeholder="Eg: Cotton"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddValue();
                }}
              />
              <button
                className="a-text--button bg-[#176eb1] text-white hover:bg-black transition px-6 flex items-center justify-center"
                onClick={handleAddValue}
              >
                <Plus size={24} />
              </button>
            </div>

            <div className="flex flex-wrap gap-3 mt-4">
              {values.map((val, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-neutral-100 border border-neutral-300 px-4 py-2 rounded">
                  <span className="font-medium text-[1.3rem]">{val}</span>
                  <button
                    onClick={() => handleRemoveValue(idx)}
                    className="text-red-500 hover:text-red-800 transition"
                  >
                    <Trash size={16} />
                  </button>
                </div>
              ))}
              {values.length === 0 && (
                <div className="text-neutral-500 text-[1.3rem] py-2">
                  No values added yet.
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Action Buttons */}
      <section className="w-full lg:w-7/12 flex justify-end gap-4">
        {action === "update" && (
          <button
            className="a-text--button bg-red-800 hover:bg-black text-white !normal-case transition"
            onClick={async () => {
              if(window.confirm("Are you sure you want to delete this attribute?")) {
                await deleteAttribute(attributeId);
                window.location.href = "/admin/attributes";
              }
            }}
            disabled={loading}
          >
            Delete Attribute
          </button>
        )}
        <button
          className="submit_button a-text--button text-white bg-[#176eb1] hover:bg-black !py-3 px-8 transition !normal-case flex items-center gap-2"
          onClick={submitAttribute}
          disabled={loading}
        >
          {loading ? (
            <>
              Saving{" "}
              <Spinner className="animate-spin w-[1.4rem] h-[1.4rem]" weight="bold" />
            </>
          ) : action === "update" ? (
            "Update Attribute"
          ) : (
            "Create Attribute"
          )}
        </button>
      </section>
    </main>
  );
};

export default AttributeManagement;
