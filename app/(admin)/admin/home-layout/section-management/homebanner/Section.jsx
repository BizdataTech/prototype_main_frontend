import { useEffect, useState } from "react";
import Banner from "./Banner";

const HomeBannerSection = () => {
  let [bannerType, setBannerType] = useState("carousel");
  let [multiple, setMultiple] = useState(true);

  const bannerSchema = {
    file: "",
    redirection: true,
  };

  let [banners, setBanners] = useState([]);
  let [currentBanner, setCurrentBanner] = useState(bannerSchema);
  let [currentBannerReference, setCurrentBannerReference] = useState({
    type: "content-block",
    id: "",
  });

  useEffect(() => {
    setMultiple(bannerType === "carousel" ? true : false);
  }, [bannerType]);

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
      <section></section>
      <Banner
        banner={currentBanner}
        setBanner={setCurrentBanner}
        bannerReference={currentBannerReference}
      />
    </section>
  );
};

export default HomeBannerSection;
