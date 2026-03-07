"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import loginSchema from "./schema.js";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/context/userContext";
import { toast } from "sonner";
import { Spinner } from "phosphor-react";

const SignInForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({ resolver: zodResolver(loginSchema) });
  const { user, loginUser } = useContext(UserContext);
  const [status, setStatus] = useState("idle");
  const router = useRouter();

  const submitForm = async (formData) => {
    setStatus("loading");
    const response = await loginUser(formData);
    if (response?.wrongCredentials) {
      setError("password", {
        type: "manual",
        message: "Invalid Email or Password",
      });
      setStatus("idle");
      return;
    }
    if (response) console.log("hailo");
    else {
      console.log(response.error);
    }
    setStatus("idle");
  };

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, []);

  return (
    <form
      action=""
      className="flex flex-col gap-8 mt-6 h-full w-full"
      onSubmit={handleSubmit(submitForm)}
      noValidate
    >
      <div className="email">
        <input
          type="email"
          placeholder="E-mail"
          className="input--form"
          {...register("email")}
        />
        {errors.email && <p className="error--input">{errors.email.message}</p>}
      </div>
      <div className="password">
        <input
          type="password"
          placeholder="Password"
          className="input--form"
          {...register("password")}
        />
        {errors.password && (
          <p className="error--input">{errors.password.message}</p>
        )}
      </div>

      <div className="flex justify-between items-start mt-6">
        <button className="px-8 py-2 text-[1.55rem] rounded-[.2rem] transition font-semibold text-white bg-[#b00015] uppercase text-center hover:bg-sky-700 active:bg-sky-600 cursor-pointer self-start">
          {status === "loading" ? (
            <Spinner className="animate-spin w-[5rem] h-[2.5rem]" />
          ) : (
            "Log In"
          )}
        </button>
        <p className="text-[1.4rem] text-gray-400 flex flex-col items-end">
          let's create an account ?{" "}
          <Link
            className="cursor-pointer text-blue-800 capitalize"
            href="/register/sign-up"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </form>
  );
};

export default SignInForm;
