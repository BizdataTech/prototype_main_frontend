"use client";

import { UserContext } from "@/context/userContext";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import Link from "next/link";
import "../globals.css";

const RegisterLayout = ({ children }) => {
  const { user } = useContext(UserContext);
  const router = useRouter();
  useEffect(() => {
    if (user) router.push("/");
  }, [user]);

  return (
    <div className="bg-neutral-200 h-screen overflow-hidden">
      <div className="h-full">
        <div className="bg-black py-4 px-8">
          <Link
            className="text-white text-[1.6rem] py-4 hover:underline"
            href="/"
          >
            Home
          </Link>
        </div>
        <div className="flex h-full">
          <div className="w-4/6 h-full">
            <img
              src="https://cityfurnish.com/blog/wp-content/uploads/2023/05/21253197_2106.q703.016.S.m004.c10.household-appliance-realistic-min-scaled.jpg"
              alt="lock screen banner image"
              className="h-full object-cover object-left"
            />
          </div>

          <div className="w-2/6 py-[8rem] px-16">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default RegisterLayout;
