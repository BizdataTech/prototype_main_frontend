"use client";

import Link from "next/link";
import { CaretRight } from "phosphor-react";

const AdminBreadCrumbs = ({ data, length }) => {
  return (
    length > 1 && (
      <div className="flex items-center gap-4 text-[1.4rem] text-neutral-500 ">
        {data.map((d, i) => (
          <div key={i}>
            <Link href={d.path}>{d.title}</Link>
            <div className="last:hidden">
              <CaretRight />
            </div>
          </div>
        ))}
      </div>
    )
  );
};

export default AdminBreadCrumbs;
