"use client";

import axios from "axios";
import Link from "next/link";
import { DotsThree } from "phosphor-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const Sections = () => {
  let [sections, setSections] = useState(null);
  let BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    getSections();
  }, []);

  const getSections = async () => {
    try {
      let res = await axios.get(`${BACKEND_URL}/api/home-sections`, {
        withCredentials: true,
      });
      setSections(res.data?.sections);
      console.log("sections:", res.data?.sections);
    } catch (err) {
      console.log(err.message);
      toast.error("Something Went Wrong");
    }
  };

  return (
    <section>
      {sections === null && (
        <div className="a-animation--container h-[25rem]">
          <div className="a-animation--mask a-animation--effect"></div>
        </div>
      )}
      {sections && sections.length === 0 && (
        <div className="bg-white border border-neutral-300 flex flex-col justify-center items-center p-8 min-h-[25rem]">
          <div className="a-section--title">Couldn't find any sections</div>
          <p className="a-text--body">
            Section are the building blocks of the home page. They needed to be
            added inorder to build the home page layout.{" "}
            <Link
              className="text-purple-700 underline cursor-pointer"
              href="/admin/home-layout/section-management"
            >
              Add new section
            </Link>
          </p>
        </div>
      )}
      {sections && sections.length >= 1 && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="a-section--title">Sections</div>
            <Link
              href={"/admin/home-layout/section-management"}
              className="text-purple-700 underline text-[1.4rem]"
            >
              Add new section
            </Link>
          </div>

          <section className="a-section--box a-section--title !p-2">
            <div className="flex items-center justify-between">
              <div className="p-2">Section Type</div>
              <div className="p-2">Options</div>
            </div>
            <div>
              {sections.map((obj) => (
                <div className="flex items-center justify-between odd:bg-neutral-100 p-2">
                  <div className="capitalize">
                    {obj.section_type.replace("_", " ")}
                  </div>
                  <div className="mr-6">
                    <DotsThree className="w-[2rem] h-[2rem]" weight="bold" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </section>
  );
};

export default Sections;
