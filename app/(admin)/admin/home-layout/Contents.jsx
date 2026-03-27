"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import BlockModal from "./modals/BlockModal";

const Contents = () => {
  const [blocks, setBlocks] = useState(null);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [modal, setModal] = useState(false);

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    getBlocks();
  }, []);

  useEffect(() => {
    if (selectedBlock) setModal(true);
  }, [selectedBlock]);

  useEffect(() => {
    if (!modal && selectedBlock) setSelectedBlock(null);
  }, [modal]);

  const getBlocks = async () => {
    try {
      let res = await axios.get(`${BACKEND_URL}/api/content-blocks`, {
        withCredentials: true,
      });
      setBlocks(res.data?.blocks);
      console.log("blocks:", res.data?.blocks);
    } catch (err) {
      console.log(err.message);
      toast.error("Something Went Wrong");
    }
  };
  return (
    <section>
      {blocks === null && (
        <div className="a-animation--container h-[15rem]">
          <div className="a-animation--mask a-animation--effect"></div>
        </div>
      )}
      {blocks && blocks.length === 0 && (
        <div className="bg-yellow-50 text-center border border-neutral-300 p-8">
          <div className="a-section--title">
            Couldn't find any content blocks
          </div>
          <p className="a-text--body">
            Content blocks are simply a set of product batches that can either
            be labelled as trending products, new arrivals, featured products or
            any.{" "}
            <span
              className="text-purple-700 underline cursor-pointer"
              onClick={() => setModal(true)}
            >
              Add new content block
            </span>
          </p>
        </div>
      )}
      {blocks && blocks.length >= 1 && (
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-end">
            <div className="a-text--label">Block Contents</div>
            <div
              className="a-text--button bg-black text-white"
              onClick={() => setModal(true)}
            >
              Add new block content
            </div>
          </div>

          <div className="grid grid-cols-5 gap-4">
            {blocks.map((block) => (
              <div
                key={block._id}
                className="bg-white flex flex-col gap-8 p-4 cursor-pointer border border-neutral-300 hover:border-neutral-400"
                onClick={() => setSelectedBlock(block._id)}
              >
                <div className="text-[1.4rem] font-medium">{block.title}</div>
                <div className="text-[1.2rem] text-red-700 ml-auto">
                  Total Products : {block.products}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {modal && (
        <div className="fixed inset-0 z-100 bg-black/30 flex justify-center items-center">
          <BlockModal
            close={() => setModal(false)}
            block={selectedBlock}
            refetch={getBlocks}
          />
        </div>
      )}
    </section>
  );
};

export default Contents;
