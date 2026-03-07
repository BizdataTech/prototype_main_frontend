"use client";

import Link from "next/link";
import { DotsThree } from "phosphor-react";
import AdminElseBlock from "@/components/admin/AdminElseBlock";
import useProducts from "./useProducts";
import ShimmerContainer from "@/components/admin/ShimmerContainer";
import { CaretLeft, CaretRight } from "phosphor-react";

const Products = () => {
  let { products, deleteAllProducts, controlPage, totalPages, currentPage } =
    useProducts();
  return (
    <section className="a-section--container pb-[4rem]">
      <div>
        {products === null ? (
          <ShimmerContainer />
        ) : products.length ? (
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
                <button
                  className="a-text--button bg-neutral-100 hover:bg-red-100 hover:text-red-700"
                  onClick={deleteAllProducts}
                  disabled
                >
                  delete all products
                </button>
              </div>
              <Link
                className="a-text--button !text-[1.2rem] text-white bg-black/80 hover:bg-black !py-3 transition !rounded-[.3rem]"
                href="/admin/products/product-management"
              >
                Add new product
              </Link>
            </div>
            <div className="w-full border-0 border-neutral-300 bg-white">
              <div className="flex justify-between py-4 px-4 border-0 border-neutral-200 text-[1.3rem] font-semibold text-neutral-700">
                <div className="grid grid-cols-4 w-[80%] gap-[2rem]">
                  <div>Product Title</div>
                  <div>Category</div>
                  <div>Brand</div>
                  <div className="">Variants</div>
                </div>
                <div className="">
                  <div className="">Options</div>
                </div>
              </div>
              {products.map((product, index) => (
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
          </div>
        ) : (
          <AdminElseBlock
            title={"Add the first product"}
            section_note={
              "Start adding your products in the application for you customers to access."
            }
            path={"/admin/products/product-management"}
            button_text={"add product"}
          />
        )}{" "}
      </div>
    </section>
  );
};

export default Products;
