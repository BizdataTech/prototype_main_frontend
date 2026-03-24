import dayjs from "dayjs";
import { DotsThree } from "phosphor-react";
import { useRef, useState } from "react";
import useMouseClick from "../../hooks/useMouseClick";
import axios from "axios";
import { toast } from "sonner";
import ModalDeleteButton from "@/components/admin/ModalDeleteButton";

const Brand = ({ brand, slno, refetch, open }) => {
  let { brand_name, createdAt, image } = brand;
  let [box, setBox] = useState(false);
  const boxRef = useRef(null);

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [loading, setLoading] = useState(false);

  useMouseClick(boxRef, () => setBox(false));

  const deleteBrand = async () => {
    try {
      setLoading(true);
      let res = await axios.delete(`${BACKEND_URL}/api/brands/${brand._id}`, {
        withCredentials: true,
      });
      setLoading(false);
      toast.success(res.data?.message);
      refetch();
    } catch (err) {
      setLoading(false);
      toast.error("Something Went Wrong");
      console.log(err.message);
    }
  };

  return (
    <div className="grid grid-cols-5 items-center even:bg-neutral-100">
      <div className="p-4">{slno}</div>
      <div className="p-4">{brand_name}</div>
      <div className="p-4">
        <img
          src={image.url}
          alt={`${brand_name} logo`}
          className="w-[2.5rem] h-[2.5rem] object-contain"
        />
      </div>
      <div className="p-4">{dayjs(createdAt).format("DD-MM-YYYY")}</div>
      <div className="p-4 ml-auto mr-8 relative">
        <DotsThree
          className="w-[2rem] h-[2rem] cursor-pointer"
          weight="bold"
          onClick={() => setBox(true)}
        />
        {box && (
          <ul
            className="absolute bg-white shadow-sm right-[50%] z-100"
            ref={boxRef}
          >
            <li>
              <button
                className="hover:bg-neutral-100 cursor-pointer transition-colors py-2 px-8"
                onClick={open}
              >
                Update
              </button>
            </li>
            <ModalDeleteButton loading={loading} dlt={deleteBrand} />
          </ul>
        )}
      </div>
    </div>
  );
};

export default Brand;
