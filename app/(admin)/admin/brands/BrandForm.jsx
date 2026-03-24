import LoadingButton from "@/components/admin/LoadingButton";
import axios from "axios";
import { Upload, X } from "phosphor-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const BrandForm = ({ refetch, close, id }) => {
  let fileInputRef = useRef(null);

  let [file, setFile] = useState(null);
  let [previewURL, setPreviewURL] = useState(null);
  let [brandName, setBrandName] = useState("");
  let [errors, setErrors] = useState({});
  let [loading, setLoading] = useState(false);

  let [brand, setBrand] = useState(null);
  let [updateData, setUpdateData] = useState({});

  let BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    if (!id) return;
    const getData = async () => {
      try {
        let res = await axios.get(`${BACKEND_URL}/api/brands/${id}`, {
          withCredentials: true,
        });
        setBrand(res.data?.brand);
      } catch (err) {
        console.log(err.message);
      }
    };
    getData();
  }, [id]);

  useEffect(() => {
    if (!brand) return;
    setPreviewURL(brand.image.url);
    setBrandName(brand.brand_name);
  }, [brand]);

  const openSystemFiles = () => {
    fileInputRef.current.click();
  };

  const handleBrandName = (e) => {
    let value = e.target.value;
    setBrandName(value);
    if (brand)
      setUpdateData((prev) => {
        let new_update = { ...prev };
        if (value.trim() === brand.brand_name) delete new_update.brand_name;
        else new_update.brand_name = value;
        return new_update;
      });

    setErrors((prev) => {
      let { brand_name, ...rest } = prev;
      return rest;
    });
  };

  const handleFileChange = (event) => {
    let file = event.target.files[0];
    if (!file) {
      return null;
    }

    if (brand)
      setUpdateData((prev) => ({
        ...prev,
        image: file,
      }));
    else setFile(file);

    const url = URL.createObjectURL(file);
    setPreviewURL(url);
    setErrors((prev) => {
      let { brand_image, ...rest } = prev;
      return rest;
    });
  };

  const submitBrand = async (e) => {
    e.preventDefault();
    try {
      let error_object = {};
      if (!brandName.trim()) error_object.brand_name = "Brand Name Required";

      if (!previewURL) error_object.brand_image = "Image Required";
      if (Object.keys(error_object).length) {
        return setErrors((prev) => {
          let newError = { ...prev };
          Object.entries(error_object).forEach(([key, value]) => {
            newError[key] = value;
          });
          return newError;
        });
      }

      let formData = new FormData();
      let res;

      setLoading(true);
      if (brand) {
        Object.entries(updateData).forEach(([key, value]) =>
          formData.append(key, value),
        );
        res = await axios.patch(
          `${BACKEND_URL}/api/brands/${brand._id}`,
          formData,
          { withCredentials: true },
        );
      } else {
        formData.append("image", file);
        formData.append("brand_name", brandName);

        res = await axios.post(`${BACKEND_URL}/api/brands`, formData, {
          withCredentials: true,
        });
      }
      setLoading(false);

      toast.success(res.data?.message);
      setPreviewURL(null);
      setBrandName("");

      if (update) {
        setBrand(null);
        setUpdateData({});
      }
      close();
      refetch();
    } catch (err) {
      setLoading(false);
      console.log("error", err.message);
    }
  };
  return (
    <form
      className="w-2/4 flex flex-col gap-4  a-section--box"
      onSubmit={submitBrand}
    >
      <div className="flex items-center justify-between">
        <div className="text-[1.6rem] font-medium">Register a new brand</div>
        <X
          className="w-[1.8rem] h-[1.8rem] text-red-700 cursor-pointer"
          weight="bold"
          onClick={close}
        />
      </div>
      <div className="">
        <div className="flex items-end justify-between">
          <label htmlFor="" className="a-text--label">
            Brand Name
          </label>
          {errors.brand_name && (
            <div className="a-text--error">{errors.brand_name}</div>
          )}
        </div>

        <input
          type="text"
          className="a-input"
          value={brandName}
          onChange={handleBrandName}
        />
      </div>
      <div className="space-y-1">
        <div className="flex items-end justify-between">
          <div className="a-text--label">Brand Image</div>
          {errors.brand_image && (
            <div className="a-text--error">{errors.brand_image}</div>
          )}
        </div>
        <div
          className="border border-neutral-200 h-[20rem] bg-white flex items-center justify-center cursor-pointer relative"
          onClick={openSystemFiles}
        >
          <input
            type="file"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          {previewURL ? (
            <div className="absolute inset-0">
              <img
                src={previewURL}
                alt="brand preview image"
                className="w-full h-full object-contain"
              />
              <div className="bg-black/40 absolute inset-0"></div>
              <div className="absolute top-[50%] left-[50%] -translate-y-[50%] -translate-x-[50%] z-10 text-white text-[1.8rem] font-medium w-full text-center">
                Click here to change the preview image
              </div>
            </div>
          ) : (
            <div className="a-text--label !text-[1.6rem] !flex items-center gap-0">
              Upload image from your device{" "}
              <Upload className="w-[4rem] h-[2rem]" />
            </div>
          )}
        </div>
      </div>
      <LoadingButton
        buttonText={"Register Brand"}
        loadingText={"Registering"}
        loading={loading}
      />
    </form>
  );
};

export default BrandForm;
