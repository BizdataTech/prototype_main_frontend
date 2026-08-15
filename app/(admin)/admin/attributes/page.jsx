"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { DotsThreeVertical } from "phosphor-react";
import { useState, useRef, useEffect } from "react";
import useAttributes from "./useAttributes";
import TableLoadingRow from "@/components/admin/LoadingRow";
import TableEmptyRow from "@/components/admin/TableEmptyRow";
import SearchSection from "@/components/admin/SearchSections";

const AttributesList = () => {
  const { attributes, fetchAttributes, deleteAttribute, loading } = useAttributes();
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const dropdownRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    fetchAttributes();
  }, []);

  const handleEdit = (id) => {
    router.push(`/admin/attributes/attribute-management?action=update&id=${id}`);
  };

  const handleDelete = async (id) => {
    await deleteAttribute(id);
    setOpenDropdownId(null);
  };

  return (
    <main className="w-full max-w-full min-h-[88svh] flex flex-col gap-6">
      <div className="flex flex-row justify-between items-center gap-4">
        <SearchSection placeholder={"Search for Attributes"} />
        <Link
          className="a-text--button ml-auto !text-[1.2rem] text-white bg-black/80 hover:bg-black !py-3 transition !rounded-[.3rem]"
          href="/admin/attributes/attribute-management?action=create"
        >
          Add new attribute
        </Link>
      </div>

      {/* Table */}
      <div className="a-section--box !p-0">
        <div className="grid grid-cols-4">
          {["Attribute Name", "Type", "Status", "Options"].map((item, i) => (
            <div
              key={i}
              className="text-[1.4rem] font-medium text-center first:text-start last:text-end p-4"
            >
              {item}
            </div>
          ))}
        </div>
        
        {attributes === null && <TableLoadingRow />}
        
        {attributes && attributes.length === 0 && (
          <TableEmptyRow message={"No Attributes Found"} />
        )}
        
        {attributes && attributes.length > 0 &&
          attributes.map((attr) => (
            <div
              key={attr._id}
              className="grid grid-cols-4 gap-8 py-4 px-4 border-b-0 border-neutral-200 last:border-b-0 text-[1.3rem] text-neutral-800 items-center even:bg-neutral-100"
            >
              <div className="truncate font-medium">{attr.name}</div>
              <div className="text-center">{attr.type}</div>
              
              {/* Status Pill */}
              <div className="text-center">
                <span className={`px-2 py-1 rounded-full text-xs ${attr.status === 'Inactive' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                  {attr.status || "Active"}
                </span>
              </div>

              {/* 3-dot Options */}
              <div className="ml-auto mr-4 relative" ref={dropdownRef}>
                <button
                  className="mx-auto cursor-pointer block"
                  onClick={() =>
                    setOpenDropdownId(openDropdownId === attr._id ? null : attr._id)
                  }
                  disabled={loading}
                >
                  <DotsThreeVertical size={20} weight="bold" />
                </button>

                {openDropdownId === attr._id && (
                  <div className="absolute right-0 mt-2 w-[8rem] bg-white border border-neutral-200 rounded shadow-md z-10">
                    <ul className="flex flex-col text-[1.2rem] text-left">
                      <li
                        onClick={() => handleEdit(attr._id)}
                        className="px-4 py-2 hover:bg-neutral-100 cursor-pointer"
                      >
                        Edit
                      </li>
                      <li
                        onClick={() => handleDelete(attr._id)}
                        className="px-4 py-2 hover:bg-neutral-100 cursor-pointer text-red-700"
                      >
                        Delete
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
      </div>
    </main>
  );
};

export default AttributesList;
