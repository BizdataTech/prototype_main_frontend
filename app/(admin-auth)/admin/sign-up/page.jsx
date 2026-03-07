"use client";

import { useForm } from "react-hook-form";
import "../authenticate.css";
import Label from "../components/Label";
import { toast, Toaster } from "sonner";
import { useState } from "react";
import LoadingButton from "@/components/admin/LoadingButton";

const Page = () => {
  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm();

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [loading, setLoading] = useState(false);

  const signUpUser = async (values) => {
    try {
      setLoading(true);
      let response = await fetch(`${BACKEND_URL}/api/admin-users/sign-up`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(values),
      });
      setLoading(false);
      let result = await response.json();
      if (response.status === 400) return toast.error(result.message);
      if (!response.ok) throw new Error(result.message);
      toast.success(result.message);
      reset();
    } catch (error) {
      console.log(error.message);
      toast.error("Account Creation Failed : Something Went Wrong");
    }
  };
  return (
    <>
      <Toaster position="top-center" richColors />
      <main className="w-full h-screen flex justify-center items-center text-[1.6rem]">
        <div className="flex flex-col gap-8 bg-white shadow-sm rounded-[0rem] p-16">
          <div className="flex flex-col gap-1">
            <div className="text-[2rem] font-medium text-center">
              Sign Up Account
            </div>
            <div className="w-5/6 mx-auto text-neutral-500 text-center">
              Enter below details to create a new admin account
            </div>
          </div>
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(signUpUser)}
          >
            <div className="flex flex-col gap-2">
              <Label title="Username" error={errors?.username} />
              <input
                type="text"
                className="bg-neutral-200/80 rounded-[.8rem] outline-0 px-5 py-5"
                {...register("username", { required: "* Required" })}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label title="Email" error={errors?.email} />
              <input
                type="email"
                className="bg-neutral-200/80 rounded-[.8rem] outline-0 px-5 py-5"
                {...register("email", {
                  required: "* Required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "* Email wrong format",
                  },
                })}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label title="Password" error={errors?.password} />
              <input
                type="password"
                className="bg-neutral-200/80 rounded-[.8rem] outline-0 px-5 py-5"
                {...register("password", {
                  required: "* Required",
                  minLength: {
                    value: 4,
                    message: "* Required min 4 characters",
                  },
                })}
              />
            </div>

            <LoadingButton
              buttonText="Sign Up"
              loadingText="Signing Up"
              loadingStat={loading}
            />
          </form>
        </div>
      </main>
    </>
  );
};

export default Page;
