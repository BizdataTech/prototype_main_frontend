"use client";

import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const Sections = () => {
  let [sections, setSections] = useState(null);
  let BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    getSections();
  });

  const getSections = async () => {
    try {
      let res = await axios.get(`${BACKEND_URL}/api/home-sections`, {
        withCredentials: true,
      });
      setSections(res.data?.sections);
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
    </section>
  );
};

export default Sections;
