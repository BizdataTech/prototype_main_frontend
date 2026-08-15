"use client";

import SearchSection from "@/components/admin/SearchSections";
import Link from "next/link";
import { useState } from "react";
import useVariants from "./useVariants";
import TableEmptyRow from "@/components/admin/TableEmptyRow";
import TableLoadingRow from "@/components/admin/LoadingRow";
import VariantRow from "./VariantRow";

const Page = () => {
  const { variants, refetch } = useVariants();

  return (
    <main className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <SearchSection placeholder={"Search for Variants"} />
        <Link
          className="a-text--button bg-black text-white"
          href="/admin/variants/variant-management"
        >
          Create New Variant
        </Link>
      </div>

      <section className="a-section--box !p-0 text-[1.4rem]">
        <div className="grid grid-cols-5">
          {[
            "Sl No",
            "Variant Title",
            "Color Variant",
            "Values",
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
        {variants === null && <TableLoadingRow />}
        {variants && variants.length === 0 && (
          <TableEmptyRow message={"No Result Found"} />
        )}
        {variants &&
          variants.length >= 1 &&
          variants.map((data, i) => (
            <VariantRow
              key={data._id}
              data={data}
              slno={i + 1}
              refetch={refetch}
            />
          ))}
      </section>
    </main>
  );
};

export default Page;
