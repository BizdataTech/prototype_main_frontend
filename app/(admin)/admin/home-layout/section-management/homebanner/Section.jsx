import { useEffect, useState } from "react";
import Banner from "./Banner";
import { createPortal } from "react-dom";
import axios from "axios";
import { toast } from "sonner";

const HomeBannerSection = () => {
  let [bannerType, setBannerType] = useState("carousel");
  let [multiple, setMultiple] = useState(true);

  const bannerSchema = {
    file: "",
    preview: "",
    redirection: true,
    type: "content-block",
    id: "",
  };

  let [banners, setBanners] = useState([]);
  let [currentBanner, setCurrentBanner] = useState(bannerSchema);
  let [bannerBox, setBannerBox] = useState(false);

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    setMultiple(bannerType === "carousel" ? true : false);
  }, [bannerType]);

  const submitBanner = () => {
    setBanners((prev) => [...prev, currentBanner]);
    setCurrentBanner(bannerSchema);
  };

  const submitBannerSection = async () => {
    try {
      let formData = new FormData();
      formData.append("section_type", "hero_banner");
      formData.append("banner_type", bannerType);

      banners.forEach((item, index) => {
        formData.append(`banners[${index}][image]`, item.file);
        formData.append(`banners[${index}][redirection]`, item.redirection);
        if (item.redirection) {
          formData.append(`banners[${index}][type]`, item.type);
          formData.append(`banners[${index}][id]`, item.id);
        }
      });

      let res = await axios.post(`${BACKEND_URL}/api/home-sections`, formData, {
        withCredentials: true,
      });
      toast.message(res.data?.message);
    } catch (error) {
      console.log(error.message);
      toast.error("Something Went Wrong!");
    }
  };

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <div>Banner Type</div>
        <div className="flex items-center gap-12">
          <div className="flex items-center gap-4">
            <input
              type="radio"
              name="banner_type"
              id="single"
              checked={bannerType === "single"}
            />
            <label htmlFor="single">Single</label>
          </div>
          <div className="flex items-center gap-4">
            <input
              type="radio"
              name="banner_type"
              id="carousel"
              checked={bannerType === "carousel"}
            />
            <label htmlFor="carousel">Carousel</label>
          </div>
        </div>
      </div>
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>Banner Previews</div>
          {bannerType === "carousel" && banners.length >= 1 && (
            <button
              className="a-text--button bg-black text-white"
              onClick={() => setBannerBox(true)}
            >
              Add new banner
            </button>
          )}
        </div>
        {banners.length === 0 && (
          <div className="flex justify-center items-center bg-neutral-200 rounded-[1rem] p-16">
            Couldn't find any banner.{" "}
            <span
              className="text-purple-700 underline cursor-pointer"
              onClick={() => setBannerBox(true)}
            >
              Add new banner
            </span>
          </div>
        )}
        {banners.length >= 1 && (
          <div className="flex flex-col gap-4">
            {banners.map((banner, i) => (
              <div className="h-[20rem] relative rounded-[1rem] overflow-hidden group">
                <img
                  src={banner.preview}
                  alt="banner image"
                  className="w-full h-full object-contain rounded-[1rem] group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/30 z-100 rounded-2xl flex items-center justify-center group cursor-pointer">
                  <div className="hidden group-hover:block text-white font-medium">
                    Click to update this banner
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <button
          className="a-text--button bg-black text-white !py-4 mt-4 self-end"
          onClick={submitBannerSection}
        >
          Submit Home Banner Section
        </button>
      </section>
      {bannerBox &&
        createPortal(
          <div className="fixed inset-0 bg-black/30 z-100 flex items-center justify-center">
            <Banner
              banner={currentBanner}
              setBanner={setCurrentBanner}
              submit={submitBanner}
              close={() => {
                setBannerBox(false);
                setCurrentBanner(bannerSchema);
              }}
            />
          </div>,
          document.body,
        )}
    </section>
  );
};

export default HomeBannerSection;
