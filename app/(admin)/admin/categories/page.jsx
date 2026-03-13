"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import AdminElseBlock from "@/components/admin/AdminElseBlock";
import { DotsThreeVertical } from "phosphor-react";
import { useState, useRef } from "react";
import useCategories from "./useCategories";
import { CaretRight, CaretLeft } from "phosphor-react";
import ShimmerContainer from "@/components/admin/ShimmerContainer";
import TableLoadingRow from "@/components/admin/LoadingRow";
import TableEmptyRow from "@/components/admin/TableEmptyRow";
import SearchSection from "@/components/admin/SearchSections";

const Categories = () => {
  const {
    deleteCategory,
    deleteAll,
    categories,
    currentPage,
    totalPages,
    handlePage,
  } = useCategories();
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const dropdownRef = useRef(null);
  const router = useRouter();

  const handleEdit = (id) => {
    router.push(
      `categories/category-management?action=update&category_id=${id}`,
    );
  };

  return (
    <main className="w-full max-w-full min-h-[88svh] flex flex-col gap-6">
      <div className="flex flex-row justify-between items-center gap-4">
        <SearchSection placeholder={"Search for Categories"} />
        <Link
          className="a-text--button ml-auto !text-[1.2rem] text-white bg-black/80 hover:bg-black !py-3 transition !rounded-[.3rem]"
          href="categories/category-management?action=create"
        >
          Add new category
        </Link>
      </div>

      {/* Table */}
      <div className="a-section--box !p-0">
        <div className="grid grid-cols-4">
          {["Title", "Category Level", "Parent Category", "Options"].map(
            (item, i) => (
              <div
                key={i}
                className="text-[1.4rem] font-medium  text-center first:text-start last:text-end p-4"
              >
                {item}
              </div>
            ),
          )}
        </div>
        {categories === null && <TableLoadingRow />}
        {categories && categories.length === 0 && (
          <TableEmptyRow message={"No Result Found"} />
        )}
        {categories &&
          categories.length >= 1 &&
          categories.map((c, index) => (
            <div
              key={c._id}
              className="grid grid-cols-4 gap-8 py-4 px-4 border-b-0 border-neutral-200 last:border-b-0 text-[1.3rem] text-neutral-800 items-center even:bg-neutral-100"
            >
              <div className="truncate font-medium">{c.title}</div>
              <div className="text-center">{c.level}</div>
              <div className="text-center font-medium">
                {c?.parent?.title ? c?.parent?.title : "-"}
              </div>

              {/* 3-dot button with dropdown */}
              <div className="ml-auto mr-4 relative" ref={dropdownRef}>
                <button
                  className="mx-auto cursor-pointer block"
                  onClick={() =>
                    setOpenDropdownId(openDropdownId === c._id ? null : c._id)
                  }
                >
                  <DotsThreeVertical size={20} weight="bold" />
                </button>

                {openDropdownId === c._id && (
                  <div className="absolute right-0 mt-2 w-[8rem] bg-white border border-neutral-200 rounded shadow-md z-10">
                    <ul className="flex flex-col text-[1.2rem] text-left">
                      <li
                        onClick={() => handleEdit(c._id)}
                        className="px-4 py-2 hover:bg-neutral-100 cursor-pointer"
                      >
                        Edit
                      </li>
                      <li
                        onClick={() => deleteCategory(c._id)}
                        className="px-4 py-2 hover:bg-neutral-100 cursor-pointer"
                      >
                        Delete
                      </li>
                      <li
                        onClick={() => setOpenDropdownId(null)}
                        className="px-4 py-2 hover:bg-neutral-100 text-blue-600 cursor-pointer"
                      >
                        Back
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
      </div>
      <div className="flex justify-end items-center  gap-8 mt-auto">
        <CaretLeft
          className={`w-[1.5rem] h-[1.5rem] cursor-pointer ${
            currentPage == 1 ? "text-neutral-300" : ""
          }`}
          weight="bold"
          onClick={() => handlePage("down")}
        />
        <div className="text-[1.4rem]">{currentPage}</div>
        <CaretRight
          className={`w-[1.5rem] h-[1.5rem] cursor-pointer ${
            currentPage === totalPages ? "text-neutral-300" : ""
          }`}
          weight="bold"
          onClick={() => handlePage("up")}
        />
      </div>
    </main>
  );
};

export default Categories;
