import axios from "axios";
import dayjs from "dayjs";
import Link from "next/link";
import { DotsThree, Spinner } from "phosphor-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const TableRow = ({ data, slno, refetch }) => {
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

  const deleteAttributeCollection = async () => {
    try {
      setLoading(true);
      let res = await axios.delete(
        `${BACKEND_URL}/api/attribute-collections/${data._id}`,
        { withCredentials: true },
      );
      setLoading(false);
      toast.success(res.data?.message);
      refetch();
    } catch (error) {
      setLoading(false);
      toast.error("Deletion Failed");
      console.log(error.message);
    }
  };
  return (
    <div className="grid grid-cols-5 even:bg-neutral-100">
      <div className="p-4">{slno}</div>
      <div className="p-4 text-center">{data.collection_name}</div>
      <div className="p-4 text-center">{data.count}</div>
      <div className="p-4 text-center">
        {dayjs(data.createdAt).format("DD-MM-YYYY")}
      </div>
      <div className="relative p-4">
        <DotsThree
          className="ml-auto mr-6 w-[2rem] h-[2rem] cursor-pointer"
          onClick={() => setOptionBox(true)}
        />
        {optionBox && (
          <ul
            className="absolute right-4 bg-white shadow-md z-100"
            ref={optionBoxRef}
          >
            <li className="hover:bg-neutral-100 transition-colors cursor-pointer py-2 px-4">
              <Link
                className="active:underline "
                href={`/admin/attribute-collections/collection?id=${data._id}`}
                onClick={(e) => {
                  if (loading) e.preventDefault();
                }}
              >
                Update Collection
              </Link>
            </li>
            <li className={`hover:bg-neutral-100 transition-colors py-2 px-4`}>
              <button
                className={`w-full active:underline  text-red-700  ${loading ? "cursor-not-allowed opacity-70" : "cursor-pointer"}`}
                onClick={deleteAttributeCollection}
                disabled={loading}
              >
                {loading ? (
                  <div className="flex justify-center items-center gap-1">
                    Deleting <Spinner className="animate-spin" />
                  </div>
                ) : (
                  "Delete Collection"
                )}
              </button>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default TableRow;
