"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import AdminElseBlock from "@/components/admin/AdminElseBlock";
import { DotsThreeVertical } from "phosphor-react";
import { useState, useRef } from "react";
import useCategories from "./useCategories";
import { CaretRight, CaretLeft } from "phosphor-react";
import ShimmerContainer from "@/components/admin/ShimmerContainer";

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
    <section className="a-section--container pb-8">
      <div>
        {categories === null ? (
          <ShimmerContainer />
        ) : categories.length ? (
          <div className="a-section--box w-full max-w-full min-h-[88svh] flex flex-col gap-2">
            <div className="flex flex-row justify-between items-center gap-4">
              <div className="flex gap-4 w-full max-w-[50rem]">
                <div className="bg-white w-full">
                  <input
                    type="search"
                    className="bg-neutral-100 w-full py-[.8rem] px-4 text-[1.3rem] font-medium rounded-[.3rem]"
                    placeholder="Search category here ..."
                  />
                </div>
                <button className="search a-text--button text-black bg-neutral-200">
                  Search
                </button>
              </div>
              <Link
                className="a-text--button !text-[1.2rem] text-white bg-black/80 hover:bg-black !py-3 transition !rounded-[.3rem]"
                href="categories/category-management?action=create"
              >
                Add new category
              </Link>
            </div>

            {/* Table */}
            <div className="w-full border-0 border-neutral-300 bg-white">
              <div className="grid grid-cols-4 gap-8 py-4 px-4 border-0 border-neutral-200 text-[1.3rem] font-semibold text-neutral-700">
                <div>Category Title</div>
                <div className="text-center">Level</div>
                <div className="text-center">Parent</div>
                <div className="text-end">Actions</div>
              </div>

              {categories.map((c, index) => (
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
                        setOpenDropdownId(
                          openDropdownId === c._id ? null : c._id,
                        )
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
          </div>
        ) : (
          <AdminElseBlock
            title="Add the first category"
            section_note="Start adding categories to group your products."
            path="/admin/categories/category-management?action=create"
            button_text="add category"
          />
        )}
      </div>
    </section>
  );
};

export default Categories;
