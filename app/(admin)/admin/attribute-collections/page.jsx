"use client";

import SearchSection from "@/components/admin/SearchSections";
import useAttributeCollection from "./useAttributeCollection";
import TableEmptyRow from "@/components/admin/TableEmptyRow";
import TableLoadingRow from "@/components/admin/LoadingRow";
import Link from "next/link";

const Page = () => {
  const { attributeCollections } = useAttributeCollection();

  return (
    <main className="flex flex-col gap-6">
      <section className="flex items-center justify-between">
        <SearchSection placeholder={"Search for attribute collections"} />
        <Link
          href="/admin/attribute-collections/collection"
          className="a-text--button bg-black text-white"
        >
          Add Attribute Collection
        </Link>
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
            <div key={i} className="font-medium last:text-end py-4 px-4">
              {item}
            </div>
          ))}
        </div>
        {attributeCollections === null && <TableLoadingRow />}
        {attributeCollections && attributeCollections.length === 0 && (
          <TableEmptyRow message={"No Result Found"} />
        )}
      </section>
    </main>
  );
};

export default Page;
