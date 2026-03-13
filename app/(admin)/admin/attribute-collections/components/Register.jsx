import axios from "axios";
import { useRouter } from "next/navigation";
import { Spinner, X } from "phosphor-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const Register = ({ close }) => {
  let {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const submitForm = async (values) => {
    try {
      setLoading(true);
      let res = await axios.post(
        `${BACKEND_URL}/api/attribute-collections`,
        values,
        { withCredentials: true },
      );
      setLoading(false);
      toast.success(res.data.message);
      router.push(`/admin/attribute-collections/collection?id=${res.data.id}`);
    } catch (err) {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white w-2/6 text-[1.6rem] flex flex-col gap-10 p-8">
      <div className="flex justify-between items-start">
        <div>
          <div className="text-[2rem] font-semibold leading-[3rem]">
            Create New Attribute Collection
          </div>
          <div>
            Enter the collection name below before adding attribute to this
            collection.
          </div>
        </div>
        <X
          className="w-[2.5rem] h-[2.5rem] text-red-700 cursor-pointer"
          weight="bold"
          onClick={close}
        />
      </div>

      <form
        className="flex flex-col gap-6 text-[1.4rem]"
        onSubmit={handleSubmit(submitForm)}
      >
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <label className="font-medium">Collection Name</label>
            {errors.collection_name && (
              <p className="text-red-700">{errors.collection_name.message}</p>
            )}
          </div>

          <input
            type="text"
            className="bg-neutral-200 outline-none p-4"
            {...register("collection_name", {
              required: "Name Required",
              minLength: {
                value: 2,
                message: "Min two chars required",
              },
            })}
          />
          <p className="text-[1.1rem] text-neutral-500 self-end italic">
            Required Minimum of Two Characters
          </p>
        </div>
        <button
          type="submit"
          className={`font-medium bg-black text-white ${loading ? "cursor-not-allowed opacity-70" : "cursor-pointer"} py-4`}
          disabled={loading}
        >
          {loading ? (
            <div className="flex justify-center items-center gap-1">
              Creating Collection{" "}
              <Spinner className="w-[2rem] h-[2rem] animate-spin" />
            </div>
          ) : (
            "Create Collection"
          )}
        </button>
      </form>
    </div>
  );
};

export default Register;
