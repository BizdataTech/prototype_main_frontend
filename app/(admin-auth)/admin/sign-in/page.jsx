"use client";

import { toast, Toaster } from "sonner";
import "../authenticate.css";
import Label from "../components/Label";
import LoadingButton from "@/components/admin/LoadingButton";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Page = () => {
  let {
    register,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm();

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const loginUser = async (values) => {
    try {
      setLoading(true);
      let res = await axios.post(
        `${BACKEND_URL}/api/admin-users/sign-in`,
        values,
        { withCredentials: true },
      );
      setLoading(false);
      reset();
      toast.success(res.data.message);
      router.replace("/admin/products");
    } catch (error) {
      setLoading(false);
      if (error.response?.status === 401)
        toast.error(error.response?.data?.message);
    }
  };
  return (
    <>
      <Toaster position="top-center" richColors />
      <main className="w-full h-screen flex justify-center items-center text-[1.6rem]">
        <div className="flex flex-col gap-8 bg-white shadow-sm rounded-[0rem] p-16">
          <div className="flex flex-col gap-1">
            <div className="text-[2rem] font-medium text-center">
              Sign In Account
            </div>
            <div className="w-5/6 mx-auto text-neutral-500 text-center">
              Enter below admin panel login credentials
            </div>
          </div>
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(loginUser)}
          >
            <div className="flex flex-col gap-2">
              <Label title="Email" error={errors.email} />
              <input
                type="text"
                className="bg-neutral-200/80 rounded-[.8rem] outline-0 px-5 py-5"
                {...register("email", { required: "* Required" })}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label title="Password" error={errors.password} />
              <input
                type="password"
                className="bg-neutral-200/80 rounded-[.8rem] outline-0 px-5 py-5"
                {...register("password", { required: "* Required" })}
              />
            </div>
            <LoadingButton
              buttonText="Sign In"
              loadingText="Signin In"
              loadingStat={loading}
            />
          </form>
        </div>
      </main>
    </>
  );
};

export default Page;
