import { InputLabel } from "@/components/admin/InputLabel";

const Attributes = ({ attributes, values, handleInputs }) => {
  const getInputField = (attribute) => {
    let name = attribute.label.toLowerCase().replace(/\s+/g, "_");
    let value = values[attribute.label.toLowerCase().replace(/\s+/g, "_")];
    switch (attribute.input_type) {
      case "text":
        return (
          <input
            type="text"
            className="a-input"
            name={name}
            value={value}
            onChange={handleInputs}
          />
        );
      case "select":
      case "multi-select":
        return (
          <select className="a-input" name={name} onChange={handleInputs}>
            <option value="" disabled selected>
              Select One
            </option>
            {attribute.options.map((opt, i) => (
              <option key={i} value={opt} selected={opt === value}>
                {opt}
              </option>
            ))}
          </select>
        );
      default:
        break;
    }
  };
  if (attributes && attributes.length >= 1)
    return (
      <section className="a-section--box grid grid-cols-3 gap-6">
        {attributes.map((att) => (
          <div className="flex flex-col gap-2">
            <InputLabel label={att.label} />
            {getInputField(att)}
          </div>
        ))}
      </section>
    );
};

export default Attributes;
