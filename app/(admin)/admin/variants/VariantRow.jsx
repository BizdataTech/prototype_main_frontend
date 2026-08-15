import axios from "axios";
import Link from "next/link";
import { DotsThree, Spinner } from "phosphor-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const VariantRow = ({ data, slno, refetch }) => {
  const [optionBox, setOptionBox] = useState(false);
  const optionBoxRef = useRef(null);

  let BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleMouseClick = (e) => {
      if (optionBoxRef.current && !optionBoxRef.current.contains(e.target))
        setOptionBox(false);
    };
    document.addEventListener("mousedown", handleMouseClick);
    return () => document.removeEventListener("mousedown", handleMouseClick);
  }, []);

  const handleDeleteVariant = async () => {
    try {
      setLoading(true);
      let res = await axios.delete(
        `${BACKEND_URL}/api/variants/${data._id}`,
        { withCredentials: true },
      );
      setLoading(false);
      toast.success(res.data?.message || "Variant Deleted Successfully");
      refetch();
    } catch (error) {
      setLoading(false);
      toast.error("Deletion Failed");
      console.log(error.message);
    }
  };

  return (
    <div className="grid grid-cols-5 even:bg-neutral-100 items-center text-center">
      <div className="p-4 text-start">{slno}</div>
      <div className="p-4 text-center font-medium">{data.title}</div>
      <div className="p-4 text-center">{data.color ? "Yes" : "No"}</div>
      <div className="p-4 text-center truncate" title={data.values.map(v => v.label).join(", ")}>
        {data.values.map(v => v.label).join(", ")}
      </div>
      <div className="relative p-4">
        <DotsThree
          className="ml-auto mr-6 w-[2rem] h-[2rem] cursor-pointer"
          onClick={() => setOptionBox(true)}
        />
        {optionBox && (
          <ul
            className="absolute right-4 bg-white shadow-md z-[100] border border-neutral-200 rounded"
            ref={optionBoxRef}
          >
            <li className="hover:bg-neutral-100 transition-colors py-2 px-4 border-b border-neutral-100">
              <Link
                className="w-full block text-left active:underline"
                href={`/admin/variants/variant-management?action=update&id=${data._id}`}
                onClick={(e) => {
                  if (loading) e.preventDefault();
                }}
              >
                Edit Variant
              </Link>
            </li>
            <li className="hover:bg-neutral-100 transition-colors py-2 px-4">
              <button
                className={`w-full active:underline text-red-700 ${loading ? "cursor-not-allowed opacity-70" : "cursor-pointer"}`}
                onClick={handleDeleteVariant}
                disabled={loading}
              >
                {loading ? (
                  <div className="flex justify-center items-center gap-1">
                    Deleting <Spinner className="animate-spin" />
                  </div>
                ) : (
                  "Delete Variant"
                )}
              </button>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default VariantRow;
