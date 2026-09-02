"use client";

import axios from "axios";
import Link from "next/link";
import { CaretUp, CaretDown, Trash, Eye, EyeSlash, PencilSimple } from "phosphor-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const sectionLabel = (type) => {
  const map = {
    hero_banner: "🏠 Hero Banner",
    mid_page_banner: "🖼️ Promotional Banner",
    product_listing: "📦 Product Listing",
  };
  return map[type] || type;
};

const Sections = () => {
  let [sections, setSections] = useState(null);
  let BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const router = useRouter();

  useEffect(() => { getSections(); }, []);

  const getSections = async () => {
    try {
      let res = await axios.get(`${BACKEND_URL}/api/home-sections`, { withCredentials: true });
      let data = (res.data?.sections || []).sort((a, b) => a.order - b.order);
      setSections(data);
    } catch (err) {
      console.log(err.message);
      toast.error("Something Went Wrong");
    }
  };

  const deleteSection = async (id) => {
    if (!confirm("Are you sure you want to delete this section?")) return;
    try {
      await axios.delete(`${BACKEND_URL}/api/home-sections/${id}`, { withCredentials: true });
      toast.success("Section deleted");
      getSections();
    } catch (err) {
      toast.error("Failed to delete section");
    }
  };

  const toggleActive = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === false ? true : false;
      await axios.put(`${BACKEND_URL}/api/home-sections/${id}`, { active: newStatus }, { withCredentials: true });
      toast.success(newStatus ? "Section enabled" : "Section hidden");
      getSections();
    } catch (err) {
      toast.error("Failed to update section");
    }
  };

  const saveOrder = async (newSections) => {
    try {
      let orderedIds = newSections.map(s => s._id);
      await axios.put(`${BACKEND_URL}/api/home-sections/reorder`, { orderedIds }, { withCredentials: true });
    } catch (err) {
      toast.error("Failed to save order");
    }
  };

  const move = (index, direction) => {
    const newSections = [...sections];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newSections.length) return;
    [newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]];
    setSections(newSections);
    saveOrder(newSections);
  };

  if (sections === null) {
    return (
      <div className="a-animation--container h-[25rem]">
        <div className="a-animation--mask a-animation--effect"></div>
      </div>
    );
  }

  if (sections.length === 0) {
    return (
      <div className="bg-white border border-neutral-300 flex flex-col justify-center items-center p-12 min-h-[25rem] rounded-xl gap-3">
        <span className="text-[4rem]">📐</span>
        <div className="a-section--title">No sections configured</div>
        <p className="a-text--body text-center max-w-md">
          Sections are the building blocks of the homepage.{" "}
          <Link className="text-purple-700 underline cursor-pointer font-medium" href="/admin/home-layout/section-management">
            Add your first section
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="a-section--title">Homepage Sections</div>
        <Link href="/admin/home-layout/section-management" className="a-text--button bg-black text-white">
          + Add New Section
        </Link>
      </div>

      <div className="flex flex-col gap-2">
        {sections.map((obj, i) => (
          <div
            key={obj._id}
            className={`flex items-center justify-between p-4 rounded-xl border transition-all ${obj.active === false ? "bg-neutral-50 border-neutral-200 opacity-60" : "bg-white border-neutral-200 shadow-sm"}`}
          >
            {/* Order Badge + Label */}
            <div className="flex items-center gap-3">
              <span className="bg-neutral-100 text-neutral-600 font-bold text-[1.2rem] w-8 h-8 rounded-full flex items-center justify-center border border-neutral-200">
                {i + 1}
              </span>
              <div className="flex flex-col gap-0.5">
                <div className="font-semibold text-[1.4rem]">{sectionLabel(obj.section_type)}</div>
                {obj.title && <div className="text-[1.2rem] text-neutral-500">"{obj.title}"</div>}
                {obj.banners?.length > 0 && <div className="text-[1.2rem] text-neutral-500">{obj.banners.length} banner(s)</div>}
              </div>
              {obj.active === false && (
                <span className="text-[1rem] bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">Hidden</span>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {/* Up/Down */}
              <button onClick={() => move(i, -1)} disabled={i === 0} title="Move Up" className="p-1.5 rounded-lg hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                <CaretUp size={18} weight="bold" />
              </button>
              <button onClick={() => move(i, 1)} disabled={i === sections.length - 1} title="Move Down" className="p-1.5 rounded-lg hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                <CaretDown size={18} weight="bold" />
              </button>

              {/* Toggle Active */}
              <button onClick={() => toggleActive(obj._id, obj.active)} title={obj.active === false ? "Enable Section" : "Hide Section"} className="p-1.5 rounded-lg hover:bg-neutral-100 transition-colors">
                {obj.active !== false ? <Eye size={18} weight="bold" className="text-green-600" /> : <EyeSlash size={18} weight="bold" className="text-neutral-400" />}
              </button>

              {/* Edit */}
              <button
                onClick={() => router.push(`/admin/home-layout/section-management?edit=${obj._id}&type=${obj.section_type}`)}
                title="Edit Section"
                className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
              >
                <PencilSimple size={18} weight="bold" />
              </button>

              {/* Delete */}
              <button onClick={() => deleteSection(obj._id)} title="Delete Section" className="p-1.5 rounded-lg hover:bg-red-50 text-red-600 transition-colors">
                <Trash size={18} weight="bold" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <p className="text-[1.2rem] text-neutral-500 text-center">
        Use ↑↓ arrows to reorder sections. Changes reflect on the homepage immediately.
      </p>
    </div>
  );
};

export default Sections;
