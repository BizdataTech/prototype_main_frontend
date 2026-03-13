import axios from "axios";
import { DotsThree, Spinner } from "phosphor-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const Attribute = ({ attribute, slno, collection_id, refetch, update }) => {
  let [box, setBox] = useState(false);
  let boxRef = useRef(null);

  let BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  let [loading, setLoading] = useState(false);

  useEffect(() => {
    let handleClick = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setBox(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const deleteAttribute = async () => {
    try {
      setLoading(true);
      let res = await axios.delete(
        `${BACKEND_URL}/api/attribute-collections/${collection_id}/${attribute._id}`,
        { withCredentials: true },
      );
      setLoading(false);
      toast.success(res.data?.message);
      refetch();
    } catch (err) {
      console.lof(err.message);
      setLoading(false);
      toast.error("Deletion Failed");
    }
  };

  return (
    <div className="grid grid-cols-5 even:bg-neutral-100">
      <div className="text-start p-4">{slno}</div>
      <div className="text-center p-4">{attribute.label || "-"}</div>
      <div className="text-center p-4 capitalize">
        {attribute.input_type.replace("-", " ")}
      </div>
      <div className="text-center p-4">{attribute.options.length}</div>
      <div className="relative ml-auto mr-6 p-4">
        <DotsThree
          className="w-[1.8rem] h-[1.8rem] cursor-pointer"
          weight="bold"
          onClick={() => setBox(true)}
        />
        {box && (
          <ul
            className="absolute right-6 bg-white flex flex-col z-100 shadow-sm"
            ref={boxRef}
          >
            <li>
              <button
                className="w-full text-center hover:bg-neutral-100 transition-colors cursor-pointer py-2 px-8"
                onClick={() => {
                  update();
                  setBox(false);
                }}
              >
                Update
              </button>
            </li>
            <li>
              <button
                className={`w-full text-center text-red-700 hover:bg-neutral-100 transition-colors ${loading ? "cursor-not-allowed opacity70" : "cursor-pointer"} py-2 px-8`}
                onClick={deleteAttribute}
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-1">
                    Deleting{" "}
                    <Spinner className="w-[1.5rem] h-[1.5rem] animate-spin" />
                  </div>
                ) : (
                  "Delete"
                )}
              </button>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default Attribute;
