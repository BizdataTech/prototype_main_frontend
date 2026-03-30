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
        setReferences(res.data?.references);
        console.log("reference:", res.data?.references);
      } catch (error) {
        console.log(error.message);
      }
    };
    getReferences();
  }, [banner.type]);

  useEffect(() => {
    setBanner((prev) => ({
      ...prev,
      id: "",
    }));
  }, [banner.type]);

  const handleFileInput = (e) => {
    let file = e.target.files[0];
    let url = URL.createObjectURL(file);
    setBanner((prev) => ({
      ...prev,
      file,
      preview: url,
    }));
    setErrors((prev) => {
      let { preview, ...rest } = prev;
      return rest;
    });
  };

  const handleRadio = (e) => {
    let { name, value } = e.target;
    let newValue = name === "redirection" ? value === "true" : value;

    setBanner((prev) => ({
      ...prev,
      [name]: newValue,
    }));
    if (name === "id")
      setErrors((prev) => {
        let { reference, ...rest } = prev;
        return rest;
      });
  };

  const formSubmit = (e) => {
    const submitErrors = {};
    const data = { ...banner };

    if (!data.redirection) {
      delete data.type;
      delete data.id;
    }
    if (!banner.preview) submitErrors.preview = "Banner image required";
    if (!banner.id) submitErrors.reference = "Select one for banner reference";

    if (Object.keys(submitErrors).length) {
      return setErrors((prev) => {
        let new_error = { ...prev };
        Object.entries(submitErrors).forEach(
          ([key, value]) => (new_error[key] = value),
        );
        return new_error;
      });
    }
    console.log("banner data:", banner);
    submit();
    close();
  };

  return (
    <section className="flex flex-col gap-4 bg-white rounded-[1rem] shadow-md p-8 text-[1.4rem] w-[80%]">
      <div className="flex items-center justify-between mb-8">
        <div className="a-section--title">Handle Banner</div>
        <X
          className="w-[2rem] h-[2rem] text-red-700 cursor-pointer"
          weight="bold"
          onClick={close}
        />
      </div>
      <input
        type="file"
        className="hidden"
        ref={inputRef}
        onChange={handleFileInput}
      />
      <div className="flex flex-col gap-1">
        <InputLabel label={"Banner Image"} error={errors.preview} />
        <div
          className="w-full h-[25rem] cursor-pointer"
          onClick={() => inputRef.current.click()}
        >
          {banner.preview && (
            <img
              src={banner.preview}
              alt="Preview Image"
              className="w-full h-full object-contain border border-neutral-300 rounded-2xl"
            />
          )}
          {!banner.preview && (
            <div className="w-full h-full bg-neutral-200 rounded-[1rem] flex justify-center items-center">
              Click here to add a banner image
            </div>
          )}
        </div>
      </div>
      <div>
        <div>Redirection :</div>
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-4">
            <input
              type="radio"
              name="redirection"
              id="yes"
              value={true}
              checked={banner.redirection}
              onChange={handleRadio}
            />
            <label htmlFor="yes">Yes</label>
          </div>
          <div className="flex items-center gap-4">
            <input
              type="radio"
              name="redirection"
              id="no"
              value={false}
              checked={!banner.redirection}
              onChange={handleRadio}
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
                  id="content-block"
                  name="type"
                  value={"content-block"}
                  checked={banner.type === "content-block"}
                  onChange={handleRadio}
                />
                <label htmlFor="content-block">Content Block</label>
              </div>
              <div className="flex items-center gap-4">
                <input
                  type="radio"
                  id="category"
                  name="type"
                  value={"category"}
                  checked={banner.type === "category"}
                  onChange={handleRadio}
                />
                <label htmlFor="category">Category</label>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <InputLabel label={"Reference"} error={errors.reference} />
            <div className=" grid grid-cols-6 gap-4">
              {references.map((ref) => {
                let value = ref.title.replace(/\s+/g, "_");
                return (
                  <div className="flex items-center gap-4 bg-neutral-200 p-2 rounded-[.5rem]">
                    <input
                      type="radio"
                      name="id"
                      id={value}
                      value={ref._id}
                      onChange={handleRadio}
                      checked={ref._id === banner.id}
                    />
                    <label htmlFor={value}>{ref.title}</label>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
      <button
        className="a-text--button bg-black text-white self-end !py-4 !text-[1.4rem]"
        onClick={formSubmit}
      >
        Submit Banner
      </button>
    </section>
  );
};

export default Banner;
