"use client";

import Link from "next/link";
import { DotsThree } from "phosphor-react";
import AdminElseBlock from "@/components/admin/AdminElseBlock";
import useProducts from "./useProducts";
import ShimmerContainer from "@/components/admin/ShimmerContainer";
import { CaretLeft, CaretRight } from "phosphor-react";
import TableEmptyRow from "@/components/admin/TableEmptyRow";
import TableLoadingRow from "@/components/admin/LoadingRow";
import SearchSection from "@/components/admin/SearchSections";

const Products = () => {
  let { products, deleteAllProducts, controlPage, totalPages, currentPage } =
    useProducts();
  return (
    <main className="w-full max-w-full min-h-[88svh] flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <SearchSection placeholder={"Search for Products"} />
        <Link
          className="a-text--button ml-auto !text-[1.2rem] text-white bg-black/80 hover:bg-black !py-3 transition !rounded-[.3rem]"
          href="/admin/products/product-management"
        >
          Add new product
        </Link>
      </div>
      <div className="a-section--box !p-0 text-[1.4rem]">
        <div className="grid grid-cols-4">
          {["Title", "Category", "Brand", "Options"].map((item, i) => (
            <div key={i} className="font-medium last:text-end p-4">
              {item}
            </div>
          ))}
        </div>
        {products === null && <TableLoadingRow />}
        {products && products.length === 0 && (
          <TableEmptyRow message={"No Result Found"} />
        )}
        {products &&
          products.length >= 0 &&
          products.map((product, index) => (
            <div
              key={index}
              className="flex justify-between py-4 px-4 border-b-0 border-neutral-200 last:border-b-0 text-[1.3rem] text-neutral-800 items-center even:bg-neutral-100"
            >
              <div className="grid grid-cols-4 w-[80%] gap-[2rem]">
                <div>{product?.product_title}</div>
                <div>{product?.category?.title}</div>
                <div>{product?.brand?.brand_name}</div>
                <div>{product?.total_variants}</div>
              </div>
              <div className="">
                <div>
                  <DotsThree weight="bold" className="w-[5rem] h-8" />
                </div>
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
          onClick={() => controlPage("down")}
        />
        <div className="text-[1.4rem]">{"1"}</div>
        <CaretRight
          className={`w-[1.5rem] h-[1.5rem] cursor-pointer ${
            currentPage === totalPages ? "text-neutral-300" : ""
          }`}
          weight="bold"
          onClick={() => controlPage("up")}
        />
      </div>
    </main>
  );
};

export default Products;
