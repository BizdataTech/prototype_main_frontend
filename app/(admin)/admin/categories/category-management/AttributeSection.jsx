import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

const AttributeSection = ({ setCollection }) => {
  let [collections, setCollections] = useState([]);
  let BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    getCollections();
  }, []);

  const getCollections = async () => {
    try {
      let res = await axios.get(
        `${BACKEND_URL}/api/attribute-collections/category`,
        { withCredentials: true },
      );
      setCollections(res.data.collections);
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <section className="w-5/12 a-section--box flex flex-col gap-4 self-start">
      <div>
        <div className="a-section--title">Attribute Selection</div>
        <div className="a-text--body">
          Select suitable attribut from the following attribute collection.
          Manage the attribute collection from{" "}
          <Link href="/admin/attribute-collections" className="underline">
            attribute collection
          </Link>
        </div>
      </div>

      <div className="a-text--body bg-yellow-50 !text-yellow-700 p-4">
        Note : “Add attribute collection only to the utmost last category in the
        category parent-child relation.”
      </div>

      <div className="flex flex-col gap-1">
        <div className="a-text--body">Collections (optional)</div>
        <select name="" id="" className="a-input cursor-pointer">
          <option value="" className="cursor-pointer" disabled selected>
            Select One Collection
          </option>
          {collections.map((coll) => (
            <option onClick={() => setCollection(coll._id)}>
              {coll.collection_name}
            </option>
          ))}
        </select>
      </div>
    </section>
  );
};

export default AttributeSection;
