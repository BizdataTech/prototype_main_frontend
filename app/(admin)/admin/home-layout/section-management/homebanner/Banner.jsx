import axios from "axios";
import { useEffect, useRef, useState } from "react";

const Banner = ({ banner, setBanner, bannerReference }) => {
  const [references, setReferences] = useState([]);

  const inputRef = useRef(null);
  const [preview, setPreview] = useState(null);

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    const getReferences = async () => {
      try {
        let res = await axios.get(
          `${BACKEND_URL}/api/home-sections/references/${bannerReference.type}`,
          { withCredentials: true },
        );
        setReferences(res.data?.references);
      } catch (error) {
        console.log(error.message);
      }
    };
    getReferences();
  }, [bannerReference.type]);

  const handleFileInput = (e) => {
    let file = e.target.files[0];
    let url = URL.createObjectURL(file);
    setPreview(url);
  };

  return (
    <section className="flex flex-col gap-4">
      <input
        type="file"
        className="hidden"
        ref={inputRef}
        onChange={handleFileInput}
      />
      <div
        className="w-full h-[25rem] cursor-pointer"
        onClick={() => inputRef.current.click()}
      >
        {preview && (
          <img
            src={preview}
            alt="Preview Image"
            className="w-full h-full object-contain border border-neutral-300 rounded-2xl"
          />
        )}
        {!preview && (
          <div className="w-full h-full bg-neutral-200 rounded-[1rem] flex justify-center items-center">
            Click here to add a banner image
          </div>
        )}
      </div>
      <div>
        <div>Redirection :</div>
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-4">
            <input
              type="radio"
              name="redirection"
              id="yes"
              checked={banner.redirection}
            />
            <label htmlFor="yes">Yes</label>
          </div>
          <div className="flex items-center gap-4">
            <input
              type="radio"
              name="redirection"
              id="no"
              checked={!banner.redirection}
            />
            <label htmlFor="no">No</label>
          </div>
        </div>
      </div>
      {banner.redirection && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-12">
            <div>Content Type :</div>
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-4">
                <input
                  type="radio"
                  checked={bannerReference.type === "content-block"}
                />
                <label htmlFor="">Content Block</label>
              </div>
              <div className="flex items-center gap-4">
                <input
                  type="radio"
                  checked={bannerReference.type === "category"}
                />
                <label htmlFor="">Category</label>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div>References</div>
            <div className=" grid grid-cols-6 gap-4">
              {references.map((ref) => {
                let value = ref.title.replace(/\s+/g, "_");
                return (
                  <div className="flex items-center gap-4 bg-neutral-300 p-2 rounded-[.5rem]">
                    <input type="radio" name="reference" id={value} />
                    <label htmlFor={value}>{ref.title}</label>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Banner;
