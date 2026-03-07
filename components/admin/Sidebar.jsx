"use client";

import { useContext, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import adminRouteData from "@/data/adminRouteData";
import axios from "axios";
import { toast } from "sonner";
import { AdminContext } from "@/app/(admin)/AdminContext";
import { Spinner } from "phosphor-react";

const Sidebar = () => {
  const pathname = usePathname();
  const slug = pathname.split("/").filter(Boolean)[1];
  const [currentSlug, setCurrentSlug] = useState(slug);

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const router = useRouter();

  const { setAdminUser } = useContext(AdminContext);
  const [loading, setLoading] = useState(false);

  const logoutAdminUser = async () => {
    try {
      setLoading(true);
      let res = await axios.post(
        `${BACKEND_URL}/api/admin-users/logout`,
        {},
        {
          withCredentials: true,
        },
      );
      setLoading(false);
      setAdminUser(null);
      router.replace("/admin/sign-in");
    } catch (err) {
      setLoading(false);
      toast.error("Logout Failed : Something Went Wrong");
      console.log(err.response?.data?.message);
    }
  };

  return (
    <aside className="admin__sidebar fixed top-0 h-screen left-0 w-[25rem] bg-neutral-200 flex flex-col justify-between p-8 z-10">
      <ul className="flex flex-col">
        {adminRouteData.map(
          (data, index) =>
            data.sidebar && (
              <Link
                key={index}
                className={`a-text--sidebar flex items-baseline gap-4 ${
                  data.slug === currentSlug ? "bg-neutral-100" : ""
                }`}
                href={data.path}
                onClick={() => setCurrentSlug(data.slug)}
              >
                <i className={`${data?.icon_class}`}></i>
                {data.sidebar_title}
              </Link>
            ),
        )}
      </ul>
      <button
        className={`text-[1.4rem] text-center font-semibold bg-neutral-300/80 hover:bg-red-50 hover:text-red-800 active:bg-red-100 transition-colors rounded-[.5rem] py-2 ${loading ? "cursor-not-allowed opacity-70" : "cursor-pointer"}`}
        onClick={logoutAdminUser}
        disabled={loading}
      >
        {loading ? (
          <div className="flex items-center justify-center gap-2">
            Logging Out{" "}
            <Spinner
              className="w-[1.5rem] h-[1.5rem] animate-spin"
              weight="bold"
            />
          </div>
        ) : (
          "Logout"
        )}
      </button>
    </aside>
  );
};

export default Sidebar;
