"use client";

import { useEffect, useRef, useState } from "react";
import { Spinner, CaretDown, CaretUp, Trash, Plus, Upload, DownloadSimple, X } from "phosphor-react";
import useProducts from "../useProducts";
import CategoryList from "./CategoryList";
import { InputLabel } from "@/components/admin/InputLabel";
import Images from "./Images";
import Attributes from "./Attributes";
import VariableAttributes from "./Variants";
import { useSearchParams } from "next/navigation";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const emptyVariation = () => ({
  sku: "",
  price: "",
  sale_price: "",
  stock: "",
  status: "Active",
  weight: "",
  barcode: "",
  dimensions: "",
  image: null,
  combination: {},
});

const parseCSV = (text) => {
  const lines = text.trim().split("\n");
  if (lines.length < 2) return [];
  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
  return lines.slice(1).map((line) => {
    const cols = line.split(",").map((c) => c.trim());
    const row = {};
    headers.forEach((h, i) => (row[h] = cols[i] || ""));
    // Map CSV columns to variation fields
    return {
      sku: row["sku"] || "",
      price: row["price"] || row["regular price"] || "",
      sale_price: row["sale price"] || row["sale_price"] || "",
      stock: row["stock"] || "",
      status: row["status"] || "Active",
      weight: row["weight"] || "",
      barcode: row["barcode"] || "",
      dimensions: row["dimensions"] || "",
      image: null,
      combination: (() => {
        // Any column not in known fields becomes a combination key
        const known = ["sku","price","regular price","sale price","sale_price","stock","status","weight","barcode","dimensions"];
        const combo = {};
        headers.forEach((h, i) => {
          if (!known.includes(h)) combo[h] = cols[i] || "";
        });
        return combo;
      })(),
    };
  });
};

// ─── Variation Image Cell ────────────────────────────────────────────────────
const VariationImageCell = ({ image, onChange }) => {
  const inputRef = useRef();
  const preview =
    image instanceof File
      ? URL.createObjectURL(image)
      : image?.url || image;

  return (
    <div
      className="relative w-20 h-20 flex-shrink-0 border-2 border-dashed border-neutral-300 rounded-xl overflow-hidden cursor-pointer hover:border-[#176eb1] transition-all group"
      onClick={() => !image && inputRef.current?.click()}
    >
      {preview ? (
        <>
          <img src={preview} alt="" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onChange(null); }}
            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X size={10} weight="bold" />
          </button>
        </>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center gap-1 text-neutral-400">
          <Upload size={18} />
          <span className="text-[1rem]">Image</span>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files[0];
          if (file) onChange(file);
        }}
      />
    </div>
  );
};

// ─── Single Variation Card (accordion) ───────────────────────────────────────
const VariationCard = ({ variation, index, onChange, onRemove }) => {
  const [open, setOpen] = useState(true);

  const label =
    Object.entries(variation.combination || {})
      .map(([k, v]) => `${k}: ${v}`)
      .join(" / ") || "Custom Variation";

  const field = (f, placeholder = "", type = "text") => (
    <input
      type={type}
      value={variation[f] ?? ""}
      placeholder={placeholder}
      className="a-input !py-2"
      onChange={(e) => onChange(index, f, e.target.value)}
    />
  );

  return (
    <div className="border border-neutral-200 rounded-2xl bg-white overflow-hidden">
      {/* Title bar */}
      <div
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-between px-5 py-3 bg-neutral-50 cursor-pointer hover:bg-neutral-100 transition-all border-b border-neutral-100 select-none"
      >
        <div className="flex items-center gap-3">
          {open ? <CaretUp size={16} /> : <CaretDown size={16} />}
          <span className="font-bold text-[1.35rem] text-neutral-800">
            #{index + 1} &mdash; {label}
          </span>
          <span
            className={`text-[1.1rem] px-2 py-0.5 rounded-full font-medium ${
              variation.status === "Active"
                ? "bg-green-50 text-green-600"
                : "bg-red-50 text-red-500"
            }`}
          >
            {variation.status}
          </span>
        </div>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onRemove(index); }}
          className="text-red-400 hover:text-red-600 transition font-bold text-[1.2rem] px-3 py-1 bg-red-50 hover:bg-red-100 rounded-lg"
        >
          Remove
        </button>
      </div>

      {/* Body */}
      {open && (
        <div className="p-5 flex gap-5 items-start">
          {/* Image */}
          <VariationImageCell
            image={variation.image}
            onChange={(file) => onChange(index, "image", file)}
          />

          {/* Fields grid */}
          <div className="flex-1 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[1.15rem] font-semibold text-neutral-500">SKU</label>
              {field("sku", "e.g. SKU-RED-M")}
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[1.15rem] font-semibold text-neutral-500">Regular Price (AED)</label>
              {field("price", "0", "number")}
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[1.15rem] font-semibold text-neutral-500">Sale Price (AED)</label>
              {field("sale_price", "0", "number")}
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[1.15rem] font-semibold text-neutral-500">Stock Qty</label>
              {field("stock", "0", "number")}
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[1.15rem] font-semibold text-neutral-500">Status</label>
              <select
                value={variation.status}
                className="a-input !py-2"
                onChange={(e) => onChange(index, "status", e.target.value)}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[1.15rem] font-semibold text-neutral-500">Weight (optional)</label>
              {field("weight", "e.g. 0.5kg")}
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[1.15rem] font-semibold text-neutral-500">Barcode (optional)</label>
              {field("barcode", "e.g. 8901234567890")}
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[1.15rem] font-semibold text-neutral-500">Dimensions (optional)</label>
              {field("dimensions", "L × W × H")}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Bulk Spreadsheet Table ───────────────────────────────────────────────────
const BulkSpreadsheet = ({ variations, setVariations, cancelImages }) => {
  const csvRef = useRef();

  const handleCSVUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const parsed = parseCSV(ev.target.result);
      if (parsed.length === 0) {
        alert("CSV is empty or invalid.");
        return;
      }
      setVariations((prev) => {
        // Merge: update existing matched SKUs, append new ones
        const updated = [...prev];
        parsed.forEach((row) => {
          const idx = updated.findIndex(
            (v) => v.sku && v.sku === row.sku
          );
          if (idx > -1) updated[idx] = { ...updated[idx], ...row };
          else updated.push(row);
        });
        return updated;
      });
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const downloadTemplate = () => {
    const header = "Attribute Values,SKU,Price,Sale Price,Stock,Status,Weight,Barcode,Dimensions\n";
    const example = `"Color:Red | Size:M",SKU-RED-M,999,799,50,Active,0.5kg,,\n`;
    const blob = new Blob([header + example], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "variations_template.csv";
    a.click();
  };

  const handleCellChange = (rowIdx, field, value) => {
    setVariations((prev) => {
      const copy = [...prev];
      copy[rowIdx] = { ...copy[rowIdx], [field]: value };
      return copy;
    });
  };

  const COLS = [
    { key: "combination_label", label: "Combination", readOnly: true },
    { key: "sku", label: "SKU" },
    { key: "price", label: "Price (AED)", type: "number" },
    { key: "sale_price", label: "Sale Price (AED)", type: "number" },
    { key: "stock", label: "Stock", type: "number" },
    { key: "status", label: "Status", select: true },
    { key: "weight", label: "Weight" },
    { key: "barcode", label: "Barcode" },
  ];

  return (
    <div className="flex flex-col gap-3">
      {/* Toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        <button
          type="button"
          onClick={downloadTemplate}
          className="flex items-center gap-2 text-[1.2rem] border border-neutral-300 rounded-xl px-4 py-2.5 hover:bg-neutral-50 transition-all font-medium text-neutral-700"
        >
          <DownloadSimple size={16} />
          Download CSV Template
        </button>
        <button
          type="button"
          onClick={() => csvRef.current?.click()}
          className="flex items-center gap-2 text-[1.2rem] bg-[#176eb1] text-white rounded-xl px-4 py-2.5 hover:bg-blue-700 transition-all font-medium shadow-sm"
        >
          <Upload size={16} />
          Import CSV / Excel
        </button>
        <input
          ref={csvRef}
          type="file"
          accept=".csv,.xlsx,.xls"
          className="hidden"
          onChange={handleCSVUpload}
        />
        <span className="text-[1.15rem] text-neutral-400">
          Or edit the table below directly.
        </span>
      </div>

      {/* Spreadsheet Table */}
      <div className="overflow-x-auto rounded-xl border border-neutral-200">
        <table className="min-w-full text-[1.2rem]">
          <thead>
            <tr className="bg-neutral-50 border-b border-neutral-200">
              <th className="px-3 py-2.5 text-left font-semibold text-neutral-600 w-10">#</th>
              {COLS.map((c) => (
                <th key={c.key} className="px-3 py-2.5 text-left font-semibold text-neutral-600 whitespace-nowrap">
                  {c.label}
                </th>
              ))}
              <th className="px-3 py-2.5 text-left font-semibold text-neutral-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {variations.length === 0 ? (
              <tr>
                <td colSpan={COLS.length + 2} className="text-center py-8 text-neutral-400">
                  No variations yet. Generate or import them above.
                </td>
              </tr>
            ) : (
              variations.map((v, i) => {
                const comboLabel =
                  Object.entries(v.combination || {})
                    .map(([k, val]) => `${k}: ${val}`)
                    .join(" | ") || "Custom";
                return (
                  <tr key={i} className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
                    <td className="px-3 py-2 text-neutral-400 font-medium">{i + 1}</td>
                    {COLS.map((c) => (
                      <td key={c.key} className="px-2 py-1.5">
                        {c.readOnly ? (
                          <span className="text-neutral-700 font-medium">{comboLabel}</span>
                        ) : c.select ? (
                          <select
                            value={v[c.key] || "Active"}
                            onChange={(e) => handleCellChange(i, c.key, e.target.value)}
                            className="border border-neutral-200 rounded-lg px-2 py-1.5 text-[1.15rem] outline-none focus:border-blue-400 bg-white min-w-[8rem]"
                          >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                          </select>
                        ) : (
                          <input
                            type={c.type || "text"}
                            value={v[c.key] ?? ""}
                            onChange={(e) => handleCellChange(i, c.key, e.target.value)}
                            className="border border-neutral-200 rounded-lg px-2 py-1.5 text-[1.15rem] outline-none focus:border-blue-400 w-full min-w-[7rem]"
                          />
                        )}
                      </td>
                    ))}
                    <td className="px-3 py-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          if (v.image && v.image.public_id && cancelImages) {
                            cancelImages(v.image);
                          }
                          setVariations((prev) => prev.filter((_, idx) => idx !== i));
                        }}
                        className="text-red-400 hover:text-red-600 transition"
                      >
                        <Trash size={16} weight="bold" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const ProductManagement = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const {
    data,
    attributes,
    attributeValues,
    handleAttributeInputFields,
    categories,
    brands,
    selectedCategory,
    selectedBrand,
    handleBrand,
    handleCategory,
    images,
    handleImages,
    cancelImages,
    handleSubmit,
    loading,
    errors,
    variations,
    setVariations,
    // WooCommerce-style
    allAvailableVariants,
    activeAttributes,
    handleAddAttribute,
    handleRemoveAttribute,
    handleToggleAttributeValue,
    handleToggleUsedForVariations,
    handleGenerateVariations,
  } = useProducts(id);

  const { generalData, handleInput } = data;
  const levelCategories = categories.filter((c) => c.level === 1);
  const [isOpen, setIsOpen] = useState(false);
  const [brandOpen, setBrandOpen] = useState(false);
  const [bulkTab, setBulkTab] = useState("accordion");

  const isVariable = generalData?.product_type === "Variable";

  const handleVariationChange = (index, field, value) => {
    if (field === "image") {
      const oldImage = variations[index].image;
      if (oldImage && oldImage.public_id && value !== oldImage) {
        cancelImages(oldImage);
      }
    }
    setVariations((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleBulkAction = (action) => {
    if (!action) return;
    if (action === "delete_all") {
      if (confirm("Delete all variations?")) {
        variations.forEach((v) => {
          if (v.image && v.image.public_id) {
            cancelImages(v.image);
          }
        });
        setVariations([]);
      }
      return;
    }
    let val = "";
    if (["set_price", "set_sale_price", "set_stock"].includes(action)) {
      val = prompt("Enter value:");
      if (val === null) return;
    }
    setVariations((prev) =>
      prev.map((v) => {
        const copy = { ...v };
        if (action === "set_price") copy.price = val;
        if (action === "set_sale_price") copy.sale_price = val;
        if (action === "set_stock") copy.stock = val;
        if (action === "set_active") copy.status = "Active";
        if (action === "set_inactive") copy.status = "Inactive";
        return copy;
      })
    );
  };

  const handleIsOpen = () => setIsOpen((o) => !o);

  const utilObject = {
    categories: levelCategories,
    handleCategory,
    handleIsOpen,
  };

  const image_util = { images, handleImages, cancelImages };

  return (
    <section className="flex gap-6 mb-8 pb-[7rem]">
      <div className="w-full flex flex-col gap-6">

        {/* ── 1. Product Information ─────────────────────────────────────── */}
        <div className="a-section--box flex flex-col gap-4">
          <div className="a-section--title font-bold text-lg border-b border-neutral-100 pb-3">
            Product Information
          </div>

          {/* Product Title */}
          <div className="flex flex-col gap-2">
            <InputLabel label="Product Title" error={errors.product_title} />
            <input
              type="text"
              name="product_title"
              placeholder="e.g. Samsung Galaxy S24 Ultra"
              className="a-input"
              value={generalData?.product_title || ""}
              onChange={handleInput}
            />
          </div>

          {/* Brand + Category */}
          <div className="flex gap-2">
            <div className="w-full flex flex-col gap-2">
              <InputLabel label="Brand" error={errors.brand} />
              <div className="relative z-20">
                <div
                  className="a-input cursor-pointer"
                  onClick={() => setBrandOpen(!brandOpen)}
                >
                  {selectedBrand ? selectedBrand.brand_name : "Select Brand"}
                </div>
                {brandOpen && (
                  <div className="absolute w-full shadow-sm bg-white p-4">
                    {brands.map((brand) => (
                      <div
                        key={brand._id}
                        className="p-2 text-[1.4rem] hover:bg-neutral-100 rounded-[.2rem] cursor-pointer"
                        onClick={() => {
                          handleBrand(brand);
                          setBrandOpen(false);
                        }}
                      >
                        {brand.brand_name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="w-full flex flex-col gap-2">
              <InputLabel label="Category" error={errors.category} />
              <div className="relative z-10">
                <div className="a-input cursor-pointer" onClick={handleIsOpen}>
                  {selectedCategory ? selectedCategory.title : "Select Category"}
                </div>
                {isOpen && <CategoryList utils={utilObject} />}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <InputLabel label="Description" error={errors.description} />
            <textarea
              name="description"
              placeholder="Describe your product..."
              rows={5}
              className="a-input"
              value={generalData?.description || ""}
              onChange={handleInput}
            />
          </div>
        </div>

        {/* ── 2. Category Attributes ─────────────────────────────────────── */}
        {attributes && attributes.length >= 1 && (
          <Attributes
            attributes={attributes}
            values={attributeValues}
            handleInputs={handleAttributeInputFields}
          />
        )}

        {/* ── 3. Product Type ────────────────────────────────────────────── */}
        <div className="a-section--box flex flex-col gap-4">
          <div className="a-section--title font-bold text-lg border-b border-neutral-100 pb-3">
            Product Data
          </div>

          <div className="flex gap-4">
            <div className="w-full flex flex-col gap-2">
              <InputLabel label="Product Type" />
              <select
                name="product_type"
                className="a-input"
                value={generalData?.product_type || "Simple"}
                onChange={handleInput}
              >
                <option value="Simple">Simple Product</option>
                <option value="Variable">Variable Product</option>
              </select>
            </div>
            <div className="w-full flex flex-col gap-2">
              <InputLabel label="Status" />
              <select
                name="status"
                className="a-input"
                value={generalData?.status || "Active"}
                onChange={handleInput}
              >
                <option value="Active">Active</option>
                <option value="Draft">Draft</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* ─── Simple Product Fields ─────────────────────────────────── */}
          {!isVariable && (
            <div className="flex flex-col gap-4 border-t border-neutral-100 pt-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex flex-col gap-2">
                  <InputLabel label="SKU" error={errors.sku} />
                  <input
                    type="text"
                    name="sku"
                    placeholder="e.g. PROD-12345"
                    className="a-input"
                    value={generalData?.sku || ""}
                    onChange={handleInput}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <InputLabel label="Regular Price" error={errors.price} />
                  <div className="relative z-0">
                    <input
                      type="number"
                      name="price"
                      className="a-input !pl-10"
                      value={generalData?.price ?? ""}
                      onChange={handleInput}
                    />
                    <div className="absolute text-[1.5rem] left-4 top-[50%] -translate-y-[50%]">
                      &#8377;
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <InputLabel label="Sale Price" error={errors.sale_price} />
                  <div className="relative z-0">
                    <input
                      type="number"
                      name="sale_price"
                      className="a-input !pl-10"
                      value={generalData?.sale_price ?? ""}
                      onChange={handleInput}
                    />
                    <div className="absolute text-[1.5rem] left-4 top-[50%] -translate-y-[50%]">
                      &#8377;
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <InputLabel label="Stock" error={errors.stock} />
                  <input
                    type="number"
                    name="stock"
                    className="a-input"
                    placeholder="0"
                    value={generalData?.stock ?? ""}
                    onChange={handleInput}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ─── Variable Product: info banner ────────────────────────── */}
          {isVariable && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-[1.25rem] text-blue-700 font-medium">
              💡 Variable Product — SKU, Price, Stock, and Image are set <strong>per variation</strong> below.
            </div>
          )}
        </div>

        {/* ── 4. Variable: Attributes Panel ──────────────────────────────── */}
        {isVariable && (
          <VariableAttributes
            allAvailableVariants={allAvailableVariants}
            activeAttributes={activeAttributes}
            onAddAttribute={handleAddAttribute}
            onRemoveAttribute={handleRemoveAttribute}
            onToggleValue={handleToggleAttributeValue}
            onToggleUsedForVariations={handleToggleUsedForVariations}
            onGenerate={handleGenerateVariations}
          />
        )}

        {/* ── 5. Variable: Variations ────────────────────────────────────── */}
        {isVariable && (
          <section className="a-section--box flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3 flex-wrap gap-3">
              <div>
                <div className="a-section--title font-bold text-lg">
                  Product Variations
                  <span className="ml-2 text-[1.15rem] bg-neutral-100 text-neutral-500 px-2 py-0.5 rounded-full font-normal">
                    {variations.length}
                  </span>
                </div>
                <p className="text-[1.2rem] text-neutral-400 mt-0.5">
                  Each variation has its own SKU, Price, Stock, and Image.
                </p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {/* View toggle */}
                <div className="flex border border-neutral-200 rounded-xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setBulkTab("accordion")}
                    className={`px-4 py-2 text-[1.2rem] font-medium transition-all ${
                      bulkTab === "accordion"
                        ? "bg-[#176eb1] text-white"
                        : "bg-white text-neutral-600 hover:bg-neutral-50"
                    }`}
                  >
                    Card View
                  </button>
                  <button
                    type="button"
                    onClick={() => setBulkTab("spreadsheet")}
                    className={`px-4 py-2 text-[1.2rem] font-medium transition-all border-l border-neutral-200 ${
                      bulkTab === "spreadsheet"
                        ? "bg-[#176eb1] text-white"
                        : "bg-white text-neutral-600 hover:bg-neutral-50"
                    }`}
                  >
                    Spreadsheet / Import
                  </button>
                </div>
                {/* Bulk actions */}
                {variations.length > 0 && (
                  <select
                    defaultValue=""
                    onChange={(e) => {
                      handleBulkAction(e.target.value);
                      e.target.value = "";
                    }}
                    className="a-input !py-1.5 px-3 text-[1.2rem] border border-neutral-200 bg-white cursor-pointer"
                  >
                    <option value="" disabled>Bulk Actions</option>
                    <option value="set_price">Set Regular Price (all)</option>
                    <option value="set_sale_price">Set Sale Price (all)</option>
                    <option value="set_stock">Set Stock (all)</option>
                    <option value="set_active">Set Active (all)</option>
                    <option value="set_inactive">Set Inactive (all)</option>
                    <option value="delete_all">Delete all variations</option>
                  </select>
                )}
              </div>
            </div>

            {/* Card View */}
            {bulkTab === "accordion" && (
              <div className="flex flex-col gap-3">
                {variations.length === 0 ? (
                  <div className="text-center py-12 text-neutral-400 text-[1.3rem]">
                    <div className="text-[3.5rem] mb-2">📦</div>
                    No variations yet. Add attributes above and click <strong>Generate Variations</strong>.
                  </div>
                ) : (
                  variations.map((v, i) => (
                    <VariationCard
                      key={i}
                      variation={v}
                      index={i}
                      onChange={handleVariationChange}
                      onRemove={(idx) => {
                        const v = variations[idx];
                        if (v.image && v.image.public_id) cancelImages(v.image);
                        setVariations((prev) => prev.filter((_, j) => j !== idx));
                      }}
                    />
                  ))
                )}
                <button
                  type="button"
                  onClick={() =>
                    setVariations((prev) => [...prev, emptyVariation()])
                  }
                  className="flex items-center gap-2 self-start text-[1.25rem] font-medium text-neutral-700 border border-dashed border-neutral-300 hover:border-[#176eb1] hover:text-[#176eb1] px-5 py-3 rounded-xl transition-all mt-1"
                >
                  <Plus size={16} weight="bold" />
                  Add Custom Variation
                </button>
              </div>
            )}

            {/* Spreadsheet / Import */}
            {bulkTab === "spreadsheet" && (
              <BulkSpreadsheet
                variations={variations}
                setVariations={setVariations}
                cancelImages={cancelImages}
              />
            )}
          </section>
        )}

        {/* ── 6. Gallery Images ──────────────────────────────────────────── */}
        <Images utility_object={image_util} error={errors.images} />


      </div>

      {/* ── Sticky Submit Bar ────────────────────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-neutral-200 shadow-[0_-2px_16px_rgba(0,0,0,0.07)] px-8 py-4 flex items-center justify-between gap-4">
        <div className="text-[1.25rem] text-neutral-500">
          {id ? (
            <span>Editing product — <span className="font-semibold text-neutral-700">unsaved changes will be lost if you leave</span></span>
          ) : (
            <span>New product — fill in the details and click <span className="font-semibold text-neutral-700">Create Product</span></span>
          )}
        </div>
        <button
          className={`a-text--button bg-black text-white !px-[4rem] !py-[1rem] !text-[1.4rem] shrink-0 ${
            loading ? "!cursor-not-allowed opacity-70" : "cursor-pointer hover:bg-neutral-800"
          } transition-colors`}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <div className="flex justify-center items-center gap-2">
              Processing{" "}
              <Spinner className="w-[1.8rem] h-[1.8rem] animate-spin" weight="bold" />
            </div>
          ) : id ? (
            "Update Product"
          ) : (
            "Create Product"
          )}
        </button>
      </div>

    </section>
  );
};

export default ProductManagement;
