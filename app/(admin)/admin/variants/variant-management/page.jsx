"use client";

import { Plus, Spinner } from "phosphor-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";

const VariantManagement = () => {
  let [title, setTitle] = useState("");
  let [color, setColor] = useState(false);
  let [value, setValue] = useState({ label: "", value: "" });
  let [values, setValues] = useState([]);
  let [updateIndex, setUpdateIndex] = useState(null);
  let [loading, setLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const action = searchParams.get("action");
  const variantId = searchParams.get("id");
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    if (action === "update" && variantId) {
      fetchVariant();
    }
  }, [action, variantId]);

  const fetchVariant = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/variants/${variantId}`, {
        withCredentials: true,
      });
      if (res.data?.variant) {
        setTitle(res.data.variant.title);
        setColor(res.data.variant.color);
        setValues(res.data.variant.values);
      }
    } catch (err) {
      console.log(err.message);
      toast.error("Failed to load variant data");
    }
  };

  useEffect(() => {
    if (updateIndex === null) return;
    setValue(values[updateIndex]);
    console.log("update index:", updateIndex);
  }, [updateIndex]);

  const handleValue = (e) => {
    let { name, value } = e.target;
    setValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitValue = () => {
    if (!value.label || !value.value)
      return toast.warning("Variant label or value cannot be empty!");

    let exists = false;
    if (updateIndex !== null)
      exists = values
        .filter(
          (obj) =>
            obj.label !== values[updateIndex].label ||
            obj.value !== values[updateIndex].value,
        )
        .some((obj) => obj.label === value.label || obj.value === value.value);
    else {
      exists = values.some(
        (obj) => obj.label === value.label || obj.value === value.value,
      );
    }
    if (exists) return toast.warning("Cannot add duplicate label or value");
    if (updateIndex !== null) {
      setValues((prev) => {
        let newValues = prev.map((obj, i) => (i === updateIndex ? value : obj));
        return newValues;
      });
      setUpdateIndex(null);
    } else {
      setValues((prev) => [...prev, value]);
    }
    setValue({ label: "", value: "" });
  };

  const submitVariant = async () => {
    if (!title.trim()) {
      return toast.warning("Variant Title cannot be empty!");
    }
    if (values.length === 0) {
      return toast.warning("Please add at least one value for this variant!");
    }

    try {
      setLoading(true);
      const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
      
      let res;
      if (action === "update" && variantId) {
        res = await axios.put(`${BACKEND_URL}/api/variants/${variantId}`, {
          title: title.trim(),
          color,
          values,
        }, {
          withCredentials: true,
        });
      } else {
        res = await axios.post(`${BACKEND_URL}/api/variants`, {
          title: title.trim(),
          color,
          values,
        }, {
          withCredentials: true,
        });
      }
      
      toast.success(res.data?.message || (action === "update" ? "Variant updated successfully" : "Variant created successfully"));
      router.push("/admin/variants");
    } catch (error) {
      console.error("error submitting variant:", error);
      toast.error(error.response?.data?.message || "Failed to submit variant");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="text-[1.4rem] flex flex-col gap-4 w-5/12">
      <div className="flex flex-col gap-2">
        <label>Variant Title</label>
        <input
          type="text"
          className="a-input"
          placeholder="Add variant title here ..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      {/* Selecting color variant */}
      <div className="flex flex-col gap-2">
        <label>Color Variant</label>
        <div className="flex items-center gap-12">
          <div className="flex items-center gap-2">
            <input
              type="radio"
              name="value"
              id="yes"
              checked={color}
              onChange={() => setColor(true)}
            />
            <label htmlFor="yes">Yes</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="radio"
              name="value"
              id="no"
              checked={!color}
              onChange={() => setColor(false)}
            />
            <label htmlFor="no">No</label>
          </div>
        </div>
      </div>
      {/* Adding Values */}
      <div className="flex items-end gap-8">
        <div className="flex flex-col gap-2">
          <label htmlFor="">Value Label</label>
          <input
            type="text"
            className="a-input"
            value={value.label}
            name="label"
            onChange={handleValue}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="">Value</label>
          <input
            type={color ? "color" : "text"}
            className="a-input"
            value={value.value}
            name="value"
            onChange={handleValue}
          />
        </div>
        <button
          className="bg-white p-4 rounded-full border border-neutral-300 hover:bg-slate-50 transition-colors cursor-pointer"
          onClick={submitValue}
        >
          <Plus className="h-[1.6rem] w-[1.6rem] " weight="bold" />
        </button>
      </div>
      {/* values */}
      <div>
        {values === null && <div>Loading...</div>}{" "}
        {values && values.length === 0 && (
          <div className="bg-slate-200 p-12">
            No values have added for this variant so far. Add a new value.
          </div>
        )}
        {values && values.length > 0 && (
          <div className="bg-white p-4">
            <div className="flex items-center justify-between font-medium p-2">
              <div>Label</div>
              <div>Value</div>
            </div>
            <div>
              {values.map((value, i) => (
                <div
                  className="flex items-center justify-between p-2 odd:bg-slate-100 cursor-pointer"
                  key={i}
                  onClick={() => setUpdateIndex(i)}
                >
                  <div>{value.label}</div>
                  <div>{value.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {/* submit button */}
      <button
        className={`a-text--button hover:underline bg-black text-white self-start mt-8 flex items-center gap-2 ${loading ? "cursor-not-allowed opacity-75" : "cursor-pointer"}`}
        onClick={submitVariant}
        disabled={loading}
      >
        {loading ? (
          <>
            Submitting{" "}
            <Spinner className="animate-spin w-[1.4rem] h-[1.4rem]" weight="bold" />
          </>
        ) : (
          action === "update" ? "Update Variant" : "Submit Variant"
        )}
      </button>
    </main>
  );
};

export default VariantManagement;
