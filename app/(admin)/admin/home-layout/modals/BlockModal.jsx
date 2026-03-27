import { InputLabel } from "@/components/admin/InputLabel";
import {
  CaretLeft,
  CaretRight,
  CheckCircle,
  MinusCircle,
  Spinner,
  X,
} from "phosphor-react";
import Category from "../components/Category";
import useModal from "./useModal";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";

const BlockModal = ({ close, block, refetch }) => {
  let { products, category, setCategory } = useModal();
  let [title, setTitle] = useState("");
  let slug = title.trim().toLowerCase().replace(/\s+/g, "-");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [errors, setErrors] = useState({});

  const [blockData, setBlockData] = useState(null);
  const [updateData, setUpdateData] = useState({});

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    const getBlockData = async () => {
      try {
        let res = await axios.get(
          `${BACKEND_URL}/api/content-blocks/${block}`,
          { withCredentials: true },
        );
        setBlockData(res.data?.block);
      } catch (err) {
        console.log(err.message);
      }
    };
    if (block) getBlockData();
  }, [block]);

  useEffect(() => {
    if (!blockData) return;
    let { title, products } = blockData;
    setTitle(title);
    setSelectedProducts(products);
  }, [blockData]);

  useEffect(() => {
    if (blockData) {
      let same =
        blockData &&
        blockData.products.length === selectedProducts.length &&
        blockData.products.every((item) =>
          selectedProducts.some((pro) => item._id === pro._id),
        );
      if (same)
        return setUpdateData((prev) => {
          let new_update = { ...prev };
          delete new_update.products;
          return new_update;
        });
      setUpdateData((prev) => ({
        ...prev,
        products: selectedProducts,
      }));
    }
  }, [selectedProducts]);

  const handleInput = (e) => {
    let value = e.target.value;
    setTitle(value);
    if (block)
      setUpdateData((prev) => {
        let new_update = { ...prev };
        if (blockData.title === value.trim()) delete new_update.title;
        else new_update.title = value;
        return new_update;
      });
    setErrors((prev) => {
      let { title, ...rest } = prev;
      return rest;
    });
  };

  const handleProductSelection = (product) => {
    setSelectedProducts((prev) => {
      if (!prev.length)
        setErrors((prev) => {
          let { products, ...res } = prev;
          return res;
        });
      if (!prev.some((pro) => pro._id === product._id))
        return [...prev, product];
      else return [...prev].filter((pro) => pro._id !== product._id);
    });
  };

  const deSelectProduct = (id) => {
    setSelectedProducts((prev) => prev.filter((pro) => pro._id !== id));
  };

  const [loading, setLoading] = useState(false);

  const submitData = async () => {
    const submit_errors = {};
    if (!title.trim()) submit_errors.title = "Title Required";
    if (!selectedProducts.length)
      submit_errors.products = "Atleast one product must be selected";
    if (Object.keys(submit_errors).length) {
      return setErrors((prev) => {
        let new_errors = { ...prev };
        Object.entries(submit_errors).forEach(
          ([key, value]) => (new_errors[key] = value),
        );
        return new_errors;
      });
    }
    try {
      let res;
      setLoading(true);
      if (block) {
        if (updateData.products)
          updateData.products = updateData.products.map((pro) => pro._id);
        if (updateData.title) updateData.slug = slug;
        res = await axios.patch(
          `${BACKEND_URL}/api/content-blocks/${blockData._id}`,
          updateData,
          { withCredentials: true },
        );
      } else {
        res = await axios.post(
          `${BACKEND_URL}/api/content-blocks`,
          {
            title,
            slug,
            products: selectedProducts.map((pro) => pro._id),
          },
          { withCredentials: true },
        );
      }
      setLoading(false);
      toast.success(res.data?.message);
      close();
      refetch();
    } catch (err) {
      setLoading(false);
      toast.error("Something Went Wrong");
      console.log(err.message);
    }
  };

  return (
    <div className="w-[80%] bg-white rounded-[1rem] shadow-xl h-[60rem] flex flex-col gap-4 p-6 overflow-y-scroll">
      <div className="flex justify-between items-center">
        <div className="a-text--title">Handle Content Blocks</div>
        <X
          className="w-[2rem] h-[2rem] text-red-700 cursor-pointer"
          weight="bold"
          onClick={close}
        />
      </div>
      <div className="flex flex-col gap-6 flex-1">
        <div className="w-[50%] flex flex-col gap-6 mx-auto">
          <div className="grid grid-cols-2 gap-8">
            <div className="flex flex-col gap-1">
              <InputLabel label={"Block Title"} error={errors.title} />
              <input
                type="text"
                className="a-input"
                placeholder="Eg : Trending Products"
                value={title}
                onChange={handleInput}
              />
            </div>
            <div className="flex flex-col gap-1">
              <InputLabel label={"Slug*"} />
              <input
                type="text"
                className="a-input cursor-not-allowed opacity-80"
                disabled
                value={slug}
              />
            </div>
          </div>
          <div>
            <Category
              selectedCategory={category}
              setCategory={setCategory}
              error={errors.products}
            />
          </div>
        </div>

        <div>
          {products.length === 0 && (
            <div className="bg-red-50 text-center a-text--label p-6">
              Couldn't find any products to choose. Select a category above,
              that have atleast one active product.
            </div>
          )}
          {products.length >= 1 && (
            <div className="bg-violet-50 border border-neutral-300 flex flex-col gap-4 p-4">
              <div className="a-text--label !flex items-center justify-between">
                <div>Total products under selected category : 0</div>
                <div className="flex items-center gap-6">
                  <CaretLeft className="w-[1.5rem] h-[1.5rem] cursor-pointer" />
                  0
                  <CaretRight className="w-[1.5rem] h-[1.5rem] cursor-pointer" />
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4">
                {products.map((product) => (
                  <div
                    key={product._id}
                    className="bg-white flex items-start gap-4 border border-neutral-300 cursor-pointer hover:border-neutral-400 p-4 relative"
                    onClick={() => handleProductSelection(product)}
                  >
                    <div className="a-text--body">{product.product_title}</div>
                    <div>
                      <img
                        src={product.image}
                        alt={`${product.product_title} Image`}
                        className="w-[7rem] h-[7rem] object-contain"
                      />
                    </div>
                    {selectedProducts.some(
                      (pro) => product._id === pro._id,
                    ) && (
                      <CheckCircle
                        className="absolute -top-2 -right-2 w-[1.7rem] h-[1.7rem] text-green-700"
                        weight="fill"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <hr className="text-neutral-300" />
        <div>
          {selectedProducts.length === 0 && (
            <div className="flex flex-col items-center bg-yellow-50 p-4">
              <div className="a-section--title">No products selected</div>
              <div className="a-text--body">
                You have not selected any products so far to list under this
                content block. Inorder to select products: choose a category -
                select products.
              </div>
            </div>
          )}
          {selectedProducts.length >= 1 && (
            <div className="flex flex-col gap-2">
              <div className="a-text--label">
                Selected Products {`(${selectedProducts.length})`}
              </div>
              <div className="grid grid-cols-4 gap-4">
                {selectedProducts.map((product) => (
                  <div
                    key={product._id}
                    className=" flex items-start gap-4 border border-neutral-300 p-4 relative"
                  >
                    <div className="a-text--label">{product.product_title}</div>
                    <div>
                      <img
                        src={product.image}
                        alt={`${product.product_title} Image`}
                        className="w-[7rem] h-[7rem] object-contain"
                      />
                    </div>
                    <MinusCircle
                      className="absolute -top-2 -right-2 w-[1.5rem] h-[1.5rem] text-red-700 cursor-pointer"
                      weight="fill"
                      onClick={() => deSelectProduct(product._id)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <button
        className={`a-text--button !py-4 mt-8 self-end bg-black text-white ${loading ? "cursor-not-allowed opacity-70" : "cursor-pointer"}`}
        onClick={submitData}
        disabled={loading}
      >
        {loading ? (
          <div className="flex items-center gap-1">
            Creating Content Block{" "}
            <Spinner className="w-[1.8rem] h-[1.8rem] animate-spin" />
          </div>
        ) : (
          "Create Content Block"
        )}
      </button>
    </div>
  );
};

export default BlockModal;
