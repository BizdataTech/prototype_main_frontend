"use client"

import Link from "next/link";

const AdminElseBlock = ({ title, section_note, button_text, path }) => {
  return (
    <div className="a-section--box flex gap-8">
      <div className="left w-3/6 p-4 space-y-12">
        <div className="space-y-1">
          <h2 className="a-text--title">{title}</h2>
          <p className="a-text--sub">{section_note}</p>
        </div>
        <div>
          <Link
            className="text-[1.3rem] text-white font-medium bg-neutral-700 py-2 px-4 rounded-[.5rem] capitalize cursor-pointer"
            href={path}
          >
            <i class="fa-solid fa-plus"></i> {button_text}
          </Link>
        </div>
      </div>
      <div className="right w-3/6"></div>
    </div>
  );
};

export default AdminElseBlock;
