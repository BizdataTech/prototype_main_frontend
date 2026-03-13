import axios from "axios";
import Attribute from "./Attribute";
import TableEmptyRow from "@/components/admin/TableEmptyRow";

const AttributeList = ({ attributes, collection_id, refetch, setUpdate }) => {
  return (
    <section className="w-4/6 a-section--box !p-0 self-start">
      <div className="grid grid-cols-5">
        {[
          "Sl No",
          "Attribute Label",
          "Field Type",
          "Options Count",
          "Actions",
        ].map((item, i) => (
          <div
            key={i}
            className="first:text-start text-center last:text-end font-medium p-4"
          >
            {item}
          </div>
        ))}
      </div>
      {attributes.length === 0 && (
        <TableEmptyRow message={"Result Not Found"} />
      )}
      {attributes.length >= 1 &&
        attributes.map((attribute, i) => (
          <Attribute
            attribute={attribute}
            slno={i + 1}
            key={attribute._id}
            collection_id={collection_id}
            refetch={refetch}
            update={() => setUpdate(attribute)}
          />
        ))}
    </section>
  );
};

export default AttributeList;
