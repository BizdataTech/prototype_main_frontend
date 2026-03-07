"use client";

import Link from "next/link";
import { useHeader } from "./useHeader";
import { Spinner } from "phosphor-react";

export const HeaderBottom = () => {
  const { rootCategories } = useHeader();
  console.log("rootCategories:", rootCategories);
  return (
    <nav style={{ backgroundColor: "#121212", color: "white" }}>
      <div className="w-[95%] mx-auto">
        {rootCategories ? (
          <div className="flex items-center relative text-[1.6rem]">
            {rootCategories.map((root) => (
              <Link
                className="group"
                href={`/category/${root._id}`}
                key={root._id}
              >
                <div className="px-4 py-2 cursor-pointer hover:bg-white hover:text-black transition-colors">
                  {root.title}
                </div>
                <div className="hidden w-full h-[50rem] bg-white absolute left-0 top-[3.5rem]"></div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex items-center">
            <div className="mr-2">Categories Loading</div>
            <Spinner className="w-[3rem] h-[3rem] animate-spin py" />
          </div>
        )}
      </div>
    </nav>
  );
};
