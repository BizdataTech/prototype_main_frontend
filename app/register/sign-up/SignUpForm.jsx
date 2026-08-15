"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import signupSchema from "./schema.js";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useState } from "react";
import { UserContext } from "@/context/userContext";
import { Spinner } from "phosphor-react";
import { toast } from "sonner";

const SignUpForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(signupSchema),
  });
  const { registerUser } = useContext(UserContext);
  let [status, setStatus] = useState("idle");
  const router = useRouter();

  // form submission
  const submitForm = async (userData) => {
    setStatus("loading");
    const response = await registerUser(userData);
    if (response?.existingUser) {
      setError("email", {
        type: "manual",
        message: "Email already in use",
      });
      setStatus("idle");
      return;
    }
    if (response) {
      toast.success("user registration successfull");
      router.push("/");
    } else console.log(response);
    setStatus("idle");
  };

  return (
    <form
      action=""
      className="flex flex-col gap-6 mt-6"
      onSubmit={handleSubmit(submitForm)}
    >
      <div className="user__name w-full">
        <input
          type="text"
          className="input--form"
          placeholder="Username"
          {...register("username")}
        />
        {errors.username && (
          <p className="error--input">{errors.username?.message}</p>
        )}
      </div>
      <div className="email">
        <input
          type="email"
          placeholder="E-mail"
          className="input--form"
          {...register("email")}
        />
        {errors.email && (
          <p className="error--input">{errors.email?.message}</p>
        )}
      </div>

      {/* Address Details */}
      <h3 className="text-[1.6rem] font-medium text-neutral-700 mt-2 border-b pb-2">Address Details</h3>
      <div className="flex gap-4">
        <div className="w-full">
          <input type="text" placeholder="Phone Number" className="input--form" {...register("phone")} />
          {errors.phone && <p className="error--input">{errors.phone?.message}</p>}
        </div>
        <div className="w-full">
          <input type="text" placeholder="Pincode" className="input--form" {...register("pincode")} />
          {errors.pincode && <p className="error--input">{errors.pincode?.message}</p>}
        </div>
      </div>
      <div className="w-full">
        <textarea placeholder="Address (Area and Street)" className="input--form min-h-[8rem] resize-none" {...register("address")} />
        {errors.address && <p className="error--input">{errors.address?.message}</p>}
      </div>
      <div className="w-full">
        <input type="text" placeholder="Locality (Optional)" className="input--form" {...register("locality")} />
        {errors.locality && <p className="error--input">{errors.locality?.message}</p>}
      </div>
      <div className="flex gap-4 mb-2">
        <div className="w-full">
          <input type="text" placeholder="City/District/Town" className="input--form" {...register("city")} />
          {errors.city && <p className="error--input">{errors.city?.message}</p>}
        </div>
        <div className="w-full">
          <input type="text" placeholder="State" className="input--form" {...register("state")} />
          {errors.state && <p className="error--input">{errors.state?.message}</p>}
        </div>
      </div>

      <h3 className="text-[1.6rem] font-medium text-neutral-700 mt-2 border-b pb-2">Security</h3>
      <div className="passwords flex gap-4">
        <div className="password w-full">
          <input
            type="password"
            placeholder="Password"
            className="input--form"
            {...register("password")}
          />
          {errors.password && (
            <p className="error--input">{errors.password?.message}</p>
          )}
        </div>
        <div className="confirm__password w-full">
          <input
            type="password"
            placeholder="Confirm Password"
            className="input--form"
            {...register("confirm_password")}
          />
          {errors.confirm_password && (
            <p className="error--input">{errors.confirm_password?.message}</p>
          )}
        </div>
      </div>
      <div className="flex justify-between items-start mt-6">
        <button className="px-8 py-2 text-[1.55rem] rounded-[.2rem] transition font-semibold text-white bg-[#b00015] uppercase text-center hover:bg-sky-700 active:bg-sky-600 cursor-pointer self-start">
          {status === "loading" ? (
            <Spinner className="animate-spin w-[5rem] h-[2.5rem]" />
          ) : (
            "Sign Up"
          )}
        </button>
        <p className="text-[1.4rem] text-gray-400 flex flex-col items-end">
          Already have an account ?{" "}
          <Link
            className="cursor-pointer text-blue-800 capitalize"
            href="/register/sign-in"
          >
            log in
          </Link>
        </p>
      </div>
    </form>
  );
};

export default SignUpForm;
