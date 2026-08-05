import dayjs from "dayjs";
import { DotsThree } from "phosphor-react";
import { useEffect, useRef, useState } from "react";
import useMouseClick from "../../hooks/useMouseClick";
import axios from "axios";
import { toast } from "sonner";
import ModalDeleteButton from "@/components/admin/ModalDeleteButton";
import Link from "next/link";

const Product = ({ product, refetch, selected, onSelect }) => {
  let { product_title, category, brand, createdAt } = product;
  let [box, setBox] = useState(false);
  let boxRef = useRef(null);

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  let [loading, setLoading] = useState(false);

  useMouseClick(boxRef, () => setBox(false));

  const deleteProduct = async () => {
    try {
      setLoading(true);
      let res = await axios.delete(
        `${BACKEND_URL}/api/products/${product._id}`,
        { withCredentials: true },
      );
      setLoading(false);
      toast.message(res.data.message);
      refetch();
    } catch (err) {
      setLoading(false);
      console.log(err.message);
    }
  };

  return (
    <div className="grid grid-cols-[40px_1fr_1fr_1fr_1fr_1fr] items-center border-b border-neutral-100 last:border-none hover:bg-neutral-50 transition-colors bg-white text-[1.3rem]">
      <div className="p-4 flex items-center justify-center">
        <input 
          type="checkbox" 
          className="w-5 h-5 cursor-pointer"
          checked={!!selected}
          onChange={(e) => onSelect(e.target.checked)}
        />
      </div>
      <div className="p-4 font-medium text-neutral-800 truncate">{product_title}</div>
      <div className="p-4 text-neutral-600 truncate">{category?.title || "-"}</div>
      <div className="p-4 text-neutral-600 truncate">{brand?.brand_name || "-"}</div>
      <div className="p-4 text-neutral-600">{dayjs(createdAt).format("DD-MM-YYYY")}</div>
      <div className="relative p-4 flex justify-end">
        <DotsThree
          weight="bold"
          className="w-[2.4rem] h-[2.4rem] cursor-pointer text-neutral-500 hover:text-black transition-colors"
          onClick={() => setBox(true)}
        />
        {box && (
          <ul
            className="absolute bg-white flex flex-col items-center shadow-md right-8 top-10 border border-neutral-200 rounded-[.4rem] overflow-hidden z-10 w-[120px]"
            ref={boxRef}
          >
            <li
              className={`w-full text-center hover:bg-neutral-100 transition-colors ${loading ? "cursor-not-allowed opacity-70" : "cursor-pointer"} py-2 px-4 border-b border-neutral-100`}
            >
              <Link
                href={`/admin/products/product-management?id=${product._id}`}
                className="block w-full"
              >
                Edit
              </Link>
            </li>
            <li className="w-full">
              <div className="w-full flex justify-center py-2 px-4 hover:bg-neutral-100 transition-colors">
                 <ModalDeleteButton loading={loading} dlt={deleteProduct} />
              </div>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default Product;
