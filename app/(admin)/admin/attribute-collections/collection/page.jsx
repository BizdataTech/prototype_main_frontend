"use client";

import { useSearchParams } from "next/navigation";
import useCollection from "./useCollection";
import Form from "./components/Form";
import AttributeList from "./components/AttributeList";
import { useEffect, useState } from "react";

const Page = () => {
  let queryParams = useSearchParams();
  let id = queryParams.get("id");

  let { data, refetch } = useCollection(id);
  let [updateData, setUpdateData] = useState(null);

  useEffect(() => {
    setUpdateData(null);
  }, [data]);

  return (
    <main className="flex flex-col gap-6 text-[1.4rem]">
      {data === null && (
        <div className="flex flex-col gap-6">
          <div className="a-animation--container w-[30rem] h-[15rem]">
            <div className="a-animation--mask a-animation--effect"></div>
          </div>
          <div className="a-animation--container w-1/2 h-[25rem]">
            <div className="a-animation--mask a-animation--effect"></div>
          </div>
        </div>
      )}
      {data && (
        <>
          <div className="text-[2rem] font-medium">{data.collection_name}</div>
          <div className="flex gap-6">
            <AttributeList
              attributes={data.attributes}
              collection_id={data._id}
              refetch={refetch}
              setUpdate={setUpdateData}
            />
            <Form id={id} refetch={refetch} updateData={updateData} />
          </div>
        </>
      )}
    </main>
  );
};

export default Page;
