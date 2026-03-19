import { InputLabel } from "@/components/admin/InputLabel";
import { useEffect, useState } from "react";
import Options from "./Options";
import { toast } from "sonner";
import axios from "axios";

const Form = ({ id, refetch, updateData }) => {
  const [updateInfo, setUpdateInfo] = useState({});
  const [optionControl, setOptionControl] = useState(false);
  const [errors, setErrors] = useState({});
  const schema = {
    label: "",
    input_type: "text",
    options: [],
  };

  const [attributeData, setAttributeData] = useState(schema);

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (updateData) {
      let { label, input_type, options } = updateData;
      setAttributeData({
        label,
        input_type,
        options,
      });
      if (input_type !== "text") setOptionControl(true);
      else setOptionControl(false);
      setUpdateInfo({});
    }
  }, [updateData]);

  useEffect(() => {
    setErrors((prev) => {
      let { input_type, ...rest } = prev;
      return rest;
    });
  }, [attributeData.options]);

  const handleInput = (e) => {
    let { name, value } = e.target;
    setAttributeData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // update record
    if (updateData) {
      setUpdateInfo((prev) => {
        let new_info = { ...prev };
        if (
          !value.trim() ||
          value.toLowerCase() === updateData[name].toLowerCase()
        )
          delete new_info[name];
        else new_info[name] = value;
        return new_info;
      });
    }

    if (name === "input_type") {
      setOptionControl(value !== "text" ? true : false);
      if (value === "text")
        setAttributeData((prev) => ({
          ...prev,
          options: [],
        }));
      // update record
      setUpdateInfo((prev) => ({
        ...prev,
        options: [],
      }));
    }
    if (errors[name]) {
      setErrors((prev) => {
        let { [name]: _, rest } = prev;
        return rest;
      });
    }
  };

  const submitAttribute = async (e) => {
    e.preventDefault();
    let submitErrors = {};
    if (!attributeData.label.trim()) submitErrors.label = "Required";
    if (
      attributeData.input_type !== "text" &&
      attributeData.options.length === 0
    )
      submitErrors.input_type = "Option Required";

    if (Object.keys(submitErrors).length) {
      return setErrors((prev) => {
        let new_errors = { ...prev };
        Object.entries(submitErrors).forEach(
          ([key, value]) => (new_errors[key] = value),
        );
        return new_errors;
      });
    }

    try {
      setLoading(true);
      let res;

      if (updateData) {
        if (!Object.keys(updateInfo).length) {
          toast.warning("No Changes found");
          setLoading(false);
          return;
        }

        res = await axios.patch(
          `${BACKEND_URL}/api/attribute-collections/${id}/${updateData._id}`,
          updateInfo,
          { withCredentials: true },
        );
      } else {
        res = await axios.post(
          `${BACKEND_URL}/api/attribute-collections/${id}`,
          { attribute: attributeData },
          { withCredentials: true },
        );
      }
      setLoading(false);
      setOptionControl(false);
      setAttributeData(schema);
      setUpdateInfo({});
      toast.success(res.data.message);
      refetch();
    } catch (err) {
      console.log(err.message);
      setLoading(false);
      toast.error("Attribute Creation Failed");
    }
  };
  return (
    <section className="a-section--box !p-4 flex flex-col self-start gap-6 w-2/6">
      <div className="flex items-center gap-6">
        <div className="w-full">
          <InputLabel label={"Attribute Label"} error={errors?.label} />
          <input
            type="text"
            className="a-input"
            name="label"
            placeholder="Eg : Collar"
            value={attributeData.label}
            onChange={handleInput}
          />
        </div>
        <div className="w-full">
          <InputLabel label={"Input Type"} error={errors?.input_type} />
          <select className="a-input" name="input_type" onChange={handleInput}>
            {["text", "select", "multi-select"].map((item) => (
              <option
                value={item}
                className="capitalize"
                selected={attributeData.input_type === item}
              >
                {item.replace("-", " ")}
              </option>
            ))}
          </select>
        </div>
      </div>
      {optionControl && (
        <Options
          options={attributeData.options}
          setData={setAttributeData}
          setUpdateInfo={setUpdateInfo}
          updateDocOptions={updateData?.options}
        />
      )}

      <button
        className={`bg-black text-white text-[1.3rem] ${loading ? "cursor-not-allowed opacity-70" : "cursor-pointer"} font-medium rounded-[.3rem] self-end p-3`}
        onClick={submitAttribute}
      >
        Add Attribute
      </button>
    </section>
  );
};

export default Form;
