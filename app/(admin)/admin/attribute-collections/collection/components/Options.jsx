import { InputLabel } from "@/components/admin/InputLabel";
import { PencilSimpleLine, Plus, Trash } from "phosphor-react";
import { useEffect, useState } from "react";

const Options = ({ options, setData, setUpdateInfo, updateDocOptions }) => {
  let [option, setOption] = useState("");
  let [errors, setErrors] = useState("");
  let [update, setUpdate] = useState(null);

  useEffect(() => {
    if (updateDocOptions) {
      setUpdateInfo((prev) => {
        let new_info = { ...prev };
        if (JSON.stringify(updateDocOptions) === JSON.stringify(options))
          delete new_info.options;
        else new_info.options = options;
        return new_info;
      });
    }
  }, [options]);

  const handleInput = (e) => {
    let { value } = e.target;
    setOption(value);
    setErrors("");
  };

  const handleUpdate = (value) => {
    setUpdate((prev) => (prev === value ? null : value));
    setOption((prev) => (prev === value ? "" : value));
    setErrors("");
  };

  const addOption = (e) => {
    e.preventDefault();
    if (!option.trim()) return setErrors("Required");
    if (
      !update &&
      options.some((_option) => _option.toLowerCase() === option.toLowerCase())
    )
      return setErrors("Duplicate Value");

    if (update) {
      setData((prev) => ({
        ...prev,
        options: prev.options.map((opt) =>
          opt === update ? option.trim() : opt,
        ),
      }));
      setUpdate(null);
    } else {
      setData((prev) => ({
        ...prev,
        options: [...prev.options, option.trim()],
      }));
    }

    setOption("");
  };

  const deleteOption = (option) => {
    setData((prev) => ({
      ...prev,
      options: prev.options.filter((opt) => opt !== option),
    }));
    setOption("");
    setUpdate(null);
    setErrors("");
  };

  return (
    <section className="p-6 border border-neutral-300 shadow-sm rounded-[1rem] flex flex-col gap-10">
      <form className="flex items-end gap-6" onSubmit={addOption}>
        <div className="w-full flex flex-col gap-1">
          <InputLabel label={"Option Value"} error={errors} />
          <input
            type="text"
            className="a-input"
            name="option"
            placeholder="Eg : Button Down Collar Design"
            value={option}
            onChange={handleInput}
          />
        </div>
        <button
          className="p-2 bg-black rounded-full border border-neutral-300 cursor-pointer"
          type="submit"
        >
          <Plus className="w-[1.5rem] h-[1.5rem] text-white" weight="bold" />
        </button>
      </form>
      <hr className=" text-neutral-300" />
      {options.length === 0 && (
        <div className="text-center">Add options for this attribute</div>
      )}
      {options.length >= 1 && (
        <div>
          <div className="grid grid-cols-2">
            <div className="text-start font-medium p-2">Value</div>
            <div className="text-end font-medium p-2">Delete</div>
          </div>
          {options.map((value) => (
            <div
              className="grid grid-cols-2 items-center even:bg-neutral-100 cursor-pointer group"
              onClick={() => handleUpdate(value)}
            >
              <div
                className={`group-hover:underline ${update === value && "underline"} text-start p-2`}
              >
                {value}
              </div>
              <div className="ml-auto mr-8 flex items-center gap-4">
                {update === value && <PencilSimpleLine />}
                <Trash
                  className=""
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    deleteOption(value);
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Options;
