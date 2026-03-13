"use client";

import SearchSection from "@/components/admin/SearchSections";
import useAttributeCollection from "./useAttributeCollection";
import TableEmptyRow from "@/components/admin/TableEmptyRow";
import TableLoadingRow from "@/components/admin/LoadingRow";
import { useState } from "react";
import { createPortal } from "react-dom";
import Register from "./components/Register";
import TableRow from "./components/TableRow";

const Page = () => {
  const { attributeCollections, refetch } = useAttributeCollection();
  let [box, setBox] = useState(false);

  return (
    <main className="flex flex-col gap-6">
      <section className="flex items-center justify-between">
        <SearchSection placeholder={"Search for Attribute Collections"} />
        <button
          className="a-text--button bg-black text-white"
          onClick={() => setBox(true)}
        >
          Add Attribute Collection
        </button>
      </section>
      <section className="a-section--box !p-0 text-[1.4rem]">
        <div className="grid grid-cols-5">
          {[
            "Sl No",
            "Collection Name",
            "Total Attributes",
            "Created Date",
            "Options",
          ].map((item, i) => (
            <div
              key={i}
              className="font-medium text-center first:text-start last:text-end py-4 px-4"
            >
              {item}
            </div>
          ))}
        </div>
        {attributeCollections === null && <TableLoadingRow />}
        {attributeCollections && attributeCollections.length === 0 && (
          <TableEmptyRow message={"No Result Found"} />
        )}
        {attributeCollections &&
          attributeCollections.length >= 1 &&
          attributeCollections.map((data, i) => (
            <TableRow
              key={data._id}
              data={data}
              slno={i + 1}
              refetch={refetch}
            />
          ))}
      </section>
      {box &&
        createPortal(
          <div className="fixed inset-0 z-100 bg-black/30 flex justify-center items-center">
            <Register close={() => setBox(false)} />
          </div>,
          document.body,
        )}
    </main>
  );
};

export default Page;
