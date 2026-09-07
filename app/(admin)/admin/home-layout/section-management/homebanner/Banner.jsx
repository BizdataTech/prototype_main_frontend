import { InputLabel } from "@/components/admin/InputLabel";
import axios from "axios";
import { X } from "phosphor-react";
import { useEffect, useRef, useState } from "react";

const Banner = ({ banner, setBanner, submit, close }) => {
  const [references, setReferences] = useState([]);
  const [errors, setErrors] = useState({});
  const inputRef = useRef(null);

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    const getReferences = async () => {
      try {
        let res = await axios.get(
          `${BACKEND_URL}/api/home-sections/references/${banner.type}`,
          { withCredentials: true },
        );
        setReferences(res.data?.references || []);
      } catch (error) {
        console.log(error.message);
      }
    };
    getReferences();
  }, [banner.type, BACKEND_URL]);


  // Reset id when type changes, but NOT on the initial mount
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setBanner((prev) => ({ ...prev, id: "" }));
  }, [banner.type]);

  const handleFileInput = (e) => {
    let file = e.target.files[0];
    if (!file) return;
    let url = URL.createObjectURL(file);
    setBanner((prev) => ({ ...prev, file, preview: url, existingImageUrl: "" }));
    setErrors((prev) => { let { preview, ...rest } = prev; return rest; });
  };

  const handleChange = (e) => {
    let { name, value } = e.target;
    let newValue = name === "redirection" ? value === "true" : value;
    setBanner((prev) => ({ ...prev, [name]: newValue }));
    if (name === "id")
      setErrors((prev) => { let { reference, ...rest } = prev; return rest; });
  };

  const formSubmit = () => {
    const submitErrors = {};
    if (!banner.preview) submitErrors.preview = "Banner image is required";
    // Only require reference selection if redirection is ON
    if (banner.redirection && !banner.id) submitErrors.reference = "Select a reference for redirection";

    if (Object.keys(submitErrors).length) {
      return setErrors(submitErrors);
    }
    // Pass the full current banner object to the parent so it can add it to the list
    submit(banner);
    close();
  };

  return (
    <section className="flex flex-col gap-4 bg-white rounded-[1rem] shadow-md p-8 text-[1.4rem] w-[80%] max-h-[90vh] overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="a-section--title">Configure Banner</div>
        <X className="w-[2rem] h-[2rem] text-red-700 cursor-pointer" weight="bold" onClick={close} />
      </div>

      <input type="file" accept="image/*" className="hidden" ref={inputRef} onChange={handleFileInput} />

      {/* Image Upload */}
      <div className="flex flex-col gap-1">
        <InputLabel label={"Banner Image"} error={errors.preview} />
        <div className="w-full h-[22rem] cursor-pointer border-2 border-dashed border-neutral-300 rounded-2xl overflow-hidden" onClick={() => inputRef.current.click()}>
          {banner.preview ? (
            <img src={banner.preview} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex flex-col justify-center items-center gap-2 text-neutral-500 bg-neutral-50 hover:bg-neutral-100 transition-colors">
              <span className="text-[3rem]">🖼️</span>
              <span>Click here to upload a banner image</span>
            </div>
          )}
        </div>
      </div>

      {/* Heading */}
      <div className="flex flex-col gap-1">
        <InputLabel label={"Heading / Title"} />
        <input type="text" name="heading" value={banner.heading || ""} onChange={handleChange} className="border border-neutral-300 rounded-[.5rem] p-2 focus:outline-none focus:ring-2 focus:ring-purple-300" placeholder="Main heading (optional)" />
      </div>

      {/* Subtitle */}
      <div className="flex flex-col gap-1">
        <InputLabel label={"Subtitle / Badge Text"} />
        <input type="text" name="subtitle" value={banner.subtitle || ""} onChange={handleChange} className="border border-neutral-300 rounded-[.5rem] p-2 focus:outline-none focus:ring-2 focus:ring-purple-300" placeholder="e.g. Summer Collection 2026 (optional)" />
      </div>

      {/* Button Text */}
      <div className="flex flex-col gap-1">
        <InputLabel label={"Button Text"} />
        <input type="text" name="button_text" value={banner.button_text || ""} onChange={handleChange} className="border border-neutral-300 rounded-[.5rem] p-2 focus:outline-none focus:ring-2 focus:ring-purple-300" placeholder="e.g. Shop Now (optional)" />
      </div>

      {/* Redirection */}
      <div className="flex flex-col gap-1">
        <div className="font-medium">Enable Redirection?</div>
        <div className="flex items-center gap-8">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="redirection" value="true" checked={banner.redirection === true} onChange={handleChange} />
            Yes
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="redirection" value="false" checked={banner.redirection !== true} onChange={handleChange} />
            No
          </label>
        </div>
      </div>

      {/* Redirection Reference (only when redirection=true) */}
      {banner.redirection && (
        <div className="flex flex-col gap-4 border border-neutral-200 rounded-xl p-4 bg-neutral-50">
          <div className="flex items-center gap-8">
            <div className="font-medium">Redirect To:</div>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" id="content-block" name="type" value="content-block" checked={banner.type === "content-block"} onChange={handleChange} />
                Content Block
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" id="category" name="type" value="category" checked={banner.type === "category"} onChange={handleChange} />
                Category
              </label>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <InputLabel label={"Select Reference"} error={errors.reference} />
            {references.length === 0 ? (
              <div className="text-neutral-500 text-[1.2rem] italic">No {banner.type === "content-block" ? "content blocks" : "categories"} found. Create one first.</div>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                {references.map((ref) => (
                  <label key={ref._id} className={`flex items-center gap-2 p-2 rounded-[.5rem] cursor-pointer border transition-colors ${banner.id === ref._id ? "bg-purple-100 border-purple-400" : "bg-neutral-200 border-transparent"}`}>
                    <input type="radio" name="id" value={ref._id} onChange={handleChange} checked={ref._id === banner.id} className="hidden" />
                    {ref.title}
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <button className="a-text--button bg-black text-white self-end !py-4 !text-[1.4rem] mt-2" onClick={formSubmit}>
        Save Banner
      </button>
    </section>
  );
};

export default Banner;
