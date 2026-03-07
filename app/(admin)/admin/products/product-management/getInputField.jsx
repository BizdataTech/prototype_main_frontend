import { InputLabel } from "@/components/admin/InputLabel";

const getInputField = (attribute, data, func, errors) => {
  let input_value =
    data[attribute.label.toLowerCase().replace(/\s+/g, "_")]?.value;
  let property = attribute.label.toLowerCase().replace(/\s+/g, "_");
  switch (attribute.field_type) {
    case "text":
      return (
        <div className="space-y-1">
          <InputLabel label={attribute.label} error={errors[property]} />
          <input
            type="text"
            className="a-input placeholder:capitalize"
            value={input_value}
            name={property}
            placeholder={`Enter ${attribute.label}...`}
            onChange={func}
          />
        </div>
      );

    case "select":
      return (
        <div className="space-y-1">
          <InputLabel label={attribute.label} error={errors[property]} />
          <select name={property} id="" className="a-input" onChange={func}>
            {attribute.options.map((option) => (
              <option value={option} selected={option === input_value}>
                {option}
              </option>
            ))}
          </select>
        </div>
      );
    case "multi-select":
      return (
        <div className="space-y-1">
          <InputLabel label={attribute.label} error={errors[property]} />
          <select name={property} id="" className="a-input" onChange={func}>
            {attribute.options.map((option) => (
              <option value={option} selected={option === input_value}>
                {option}
              </option>
            ))}
          </select>
        </div>
      );
  }
};

export default getInputField;
