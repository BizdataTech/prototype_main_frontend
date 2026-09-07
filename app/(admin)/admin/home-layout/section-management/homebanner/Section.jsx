import { useEffect, useState } from "react";
import Banner from "./Banner";
import { createPortal } from "react-dom";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { PencilSimple, Spinner, Trash } from "phosphor-react";

const HomeBannerSection = ({ sectionTypeParam = "hero_banner", editId = null }) => {
  const [bannerType, setBannerType] = useState("single");
  const [banners, setBanners] = useState([]);
  const [currentBanner, setCurrentBanner] = useState(null);
  const [bannerBox, setBannerBox] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingExisting, setLoadingExisting] = useState(!!editId);

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const router = useRouter();

  const bannerSchema = {
    file: null,
    preview: "",
    existingImageUrl: "",
    existingPublicId: "",
    redirection: false,
    type: "content-block",
    id: "",
    heading: "",
    subtitle: "",
    button_text: "",
  };

  // Load existing section data when editing
  useEffect(() => {
    if (!editId) return;
    const loadExisting = async () => {
      try {
        setLoadingExisting(true);
        const res = await axios.get(`${BACKEND_URL}/api/home-sections/${editId}`, { withCredentials: true });
        const section = res.data?.section;
        if (section) {
          setBannerType(section.banner_type || "single");
          // Map existing banners to our local schema
          const mapped = (section.banners || []).map(b => ({
            file: null,
            preview: b.image?.url || "",
            existingImageUrl: b.image?.url || "",
            existingPublicId: b.image?.public_id || "",
            redirection: b.redirection || false,
            type: b.reference?.type || "content-block",
            id: b.reference?.id?.toString() || "",
            heading: b.heading || "",
            subtitle: b.subtitle || "",
            button_text: b.button_text || "",
          }));
          setBanners(mapped);
        }
      } catch (err) {
        toast.error("Failed to load section data");
      } finally {
        setLoadingExisting(false);
      }
    };
    loadExisting();
  }, [editId, BACKEND_URL]);

  const openBannerForm = () => {
    setEditingIndex(null);
    setCurrentBanner({ ...bannerSchema });
    setBannerBox(true);
  };

  const editBanner = (index) => {
    setEditingIndex(index);
    setCurrentBanner({ ...banners[index] });
    setBannerBox(true);
  };

  const submitBanner = (bannerData) => {
    if (!bannerData) return;
    if (editingIndex !== null) {
      setBanners((prev) => {
        let updated = [...prev];
        updated[editingIndex] = bannerData;
        return updated;
      });
    } else {
      setBanners((prev) => {
        const next = [...prev, bannerData];
        if (next.length > 1) setBannerType("carousel");
        return next;
      });
    }
    setBannerBox(false);
    setCurrentBanner(null);
    setEditingIndex(null);
  };

  const removeBanner = async (index) => {
    const target = banners[index];
    if (!target) return;

    const isLocalOnly = !!target.file || (!target.existingImageUrl && !target.existingPublicId);

    if (editId && !isLocalOnly) {
      if (!confirm("Are you sure you want to delete this banner image? It will be permanently deleted from Cloud Storage.")) return;
      try {
        let dbIndex = 0;
        for (let i = 0; i < index; i++) {
          if (!banners[i].file && (banners[i].existingImageUrl || banners[i].existingPublicId)) {
            dbIndex++;
          }
        }
        const res = await axios.delete(`${BACKEND_URL}/api/home-sections/${editId}/banners/${dbIndex}`, { withCredentials: true });
        toast.success("Banner image deleted from cloud & database");
        if (res.data?.banners) {
          const mappedFromDb = res.data.banners.map(b => ({
            file: null,
            preview: b.image?.url || "",
            existingImageUrl: b.image?.url || "",
            existingPublicId: b.image?.public_id || "",
            redirection: b.redirection || false,
            type: b.reference?.type || "content-block",
            id: b.reference?.id?.toString() || "",
            heading: b.heading || "",
            subtitle: b.subtitle || "",
            button_text: b.button_text || "",
          }));
          const unsavedLocalBanners = banners.filter((b, i) => i !== index && (b.file || (!b.existingImageUrl && !b.existingPublicId)));
          setBanners([...mappedFromDb, ...unsavedLocalBanners]);
          return;
        }
      } catch (err) {
        console.log("Delete banner error:", err);
        toast.error("Failed to delete banner from cloud");
        return;
      }
    }
    setBanners((prev) => prev.filter((_, i) => i !== index));
  };

  const submitBannerSection = async () => {
    if (banners.length === 0) {
      toast.error("Please add at least one banner first.");
      return;
    }
    try {
      let formData = new FormData();
      formData.append("section_type", sectionTypeParam);
      formData.append("banner_type", bannerType);

      banners.forEach((item, index) => {
        if (item.file) {
          formData.append(`banners[${index}][image]`, item.file);
        } else if (item.existingImageUrl) {
          formData.append(`banners[${index}][existing_image_url]`, item.existingImageUrl);
          if (item.existingPublicId) formData.append(`banners[${index}][existing_public_id]`, item.existingPublicId);
        }
        formData.append(`banners[${index}][redirection]`, item.redirection ? "true" : "false");
        formData.append(`banners[${index}][heading]`, item.heading || "");
        formData.append(`banners[${index}][subtitle]`, item.subtitle || "");
        formData.append(`banners[${index}][button_text]`, item.button_text || "");
        if (item.redirection && item.type) formData.append(`banners[${index}][type]`, item.type);
        if (item.redirection && item.id) formData.append(`banners[${index}][id]`, item.id);
      });

      setLoading(true);

      let res;
      if (editId) {
        res = await axios.put(
          `${BACKEND_URL}/api/home-sections/${editId}/banners`,
          formData,
          { withCredentials: true }
        );
      } else {
        res = await axios.post(`${BACKEND_URL}/api/home-sections`, formData, { withCredentials: true });
      }

      setLoading(false);
      toast.success(res.data?.message || "Section saved!");
      router.replace("/admin/home-layout");
    } catch (error) {
      setLoading(false);
      console.log("Error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Something Went Wrong!");
    }
  };

  if (loadingExisting) {
    return (
      <div className="animate-pulse flex flex-col gap-4">
        <div className="h-[20rem] bg-neutral-200 rounded-xl"></div>
        <div className="h-12 bg-neutral-200 rounded-lg w-48 self-end"></div>
      </div>
    );
  }

  return (
    <section className="flex flex-col gap-6">
      {/* Banner Type Radio */}
      <div className="flex flex-col gap-2">
        <div className="font-medium text-neutral-700">Banner Display Type</div>
        <div className="flex items-center gap-8">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="banner_type" checked={bannerType === "single"} onChange={() => setBannerType("single")} />
            Single
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="banner_type" checked={bannerType === "carousel"} onChange={() => setBannerType("carousel")} />
            Carousel (Multiple)
          </label>
        </div>
      </div>

      {/* Banner List */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="font-medium">
            Banners {banners.length > 0 && <span className="text-neutral-500 text-[1.2rem]">({banners.length} added)</span>}
          </div>
          <button className="a-text--button bg-black text-white cursor-pointer" onClick={openBannerForm}>
            + Add Banner
          </button>
        </div>

        {banners.length === 0 ? (
          <div
            className="flex flex-col justify-center items-center bg-neutral-100 rounded-xl p-16 gap-3 border-2 border-dashed border-neutral-300 cursor-pointer hover:bg-neutral-200 transition-colors"
            onClick={openBannerForm}
          >
            <span className="text-[3rem]">🖼️</span>
            <div className="text-neutral-600">No banners yet — click to add one</div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {banners.filter(Boolean).map((banner, i) => (
              <div key={i} className="relative rounded-xl overflow-hidden border border-neutral-200 group">
                {banner.preview ? (
                  <img src={banner.preview} alt="banner preview" className="w-full h-[22rem] object-cover" />
                ) : (
                  <div className="w-full h-[22rem] bg-neutral-200 flex items-center justify-center text-neutral-500">No image</div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4 gap-1">
                  {banner.subtitle && <div className="text-blue-300 text-[1.1rem] font-semibold uppercase tracking-wider">{banner.subtitle}</div>}
                  {banner.heading && <div className="text-white text-[1.8rem] font-bold">{banner.heading}</div>}
                  {banner.button_text && <span className="bg-white text-black text-[1.1rem] font-semibold px-4 py-1 rounded-lg w-fit mt-1">{banner.button_text}</span>}
                  {banner.redirection && banner.id && <div className="text-green-300 text-[1.1rem]">↪ Redirects to: {banner.type === "content-block" ? "Content Block" : "Category"}</div>}
                </div>
                <div className="absolute top-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => editBanner(i)}
                    className="bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors cursor-pointer"
                    title="Edit banner"
                  >
                    <PencilSimple size={16} weight="bold" />
                  </button>
                  <button
                    onClick={() => removeBanner(i)}
                    className="bg-red-600 text-white p-2 rounded-full shadow-lg hover:bg-red-700 transition-colors cursor-pointer"
                    title="Remove banner"
                  >
                    <Trash size={16} weight="bold" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submit */}
      <button
        className={`a-text--button bg-black text-white !py-4 mt-4 self-end ${loading ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}`}
        onClick={submitBannerSection}
        disabled={loading}
      >
        {loading ? (
          <div className="flex items-center gap-2">
            Saving <Spinner className="w-[1.7rem] h-[1.7rem] animate-spin" />
          </div>
        ) : editId ? "Update Section" : (
          sectionTypeParam === "hero_banner" ? "Submit Hero Banner" : "Submit Promotional Banner"
        )}
      </button>

      {/* Banner Modal */}
      {bannerBox && currentBanner && createPortal(
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
          <Banner
            banner={currentBanner}
            setBanner={setCurrentBanner}
            submit={submitBanner}
            close={() => { setBannerBox(false); setCurrentBanner(null); setEditingIndex(null); }}
          />
        </div>,
        document.body,
      )}
    </section>
  );
};

export default HomeBannerSection;
