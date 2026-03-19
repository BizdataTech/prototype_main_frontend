import dayjs from "dayjs";
import { DotsThree } from "phosphor-react";

const Brand = ({ brand, slno }) => {
  let { brand_name, createAt, image } = brand;
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
      <div className="p-4">{dayjs(createAt).format("DD-MM-YYYY")}</div>
      <div className="p-4 ml-auto mr-8">
        <DotsThree className="w-[2rem] h-[2rem]" weight="bold" />
      </div>
    </div>
  );
};

export default Brand;
