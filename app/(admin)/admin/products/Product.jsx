import dayjs from "dayjs";
import { DotsThree } from "phosphor-react";
import { useEffect, useRef, useState } from "react";
import useMouseClick from "../../hooks/useMouseClick";
import axios from "axios";
import { toast } from "sonner";
import ModalDeleteButton from "@/components/admin/ModalDeleteButton";
import Link from "next/link";

const Product = ({ product, refetch }) => {
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
    <div className="grid grid-cols-5 items-center even:bg-neutral-100">
      <div className="p-4">{product_title}</div>
      <div className="p-4">{category?.title}</div>
      <div className="p-4">{brand?.brand_name}</div>
      <div className="p-4">{dayjs(createdAt).format("DD-MM-YYYY")}</div>
      <div className="relative p-4 ml-auto">
        <DotsThree
          weight="bold"
          className="w-[5rem] h-8 cursor-pointer"
          onClick={() => setBox(true)}
        />
        {box && (
          <ul
            className="absolute bg-white flex flex-col items-center shadow-sm right-[50%]"
            ref={boxRef}
          >
            <li
              className={`w-full  text-center hover:bg-neutral-100 ${loading ? "cursor-not-allowed opacity-70" : "cursor-pointer"} py-2 px-8`}
            >
              <Link
                href={`/admin/products/product-management?id=${product._id}`}
              >
                Update
              </Link>
            </li>
            <li>
              <ModalDeleteButton loading={loading} dlt={deleteProduct} />
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default Product;
