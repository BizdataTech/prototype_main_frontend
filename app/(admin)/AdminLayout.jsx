"use client";

import Sidebar from "@/components/admin/Sidebar";
import AdminSectionTitle from "@/components/admin/AdminSectionTitle";
import AdminBreadCrumbs from "@/components/admin/AdminBreadCrumbs";
import useRoute from "./admin/useRoute";
import "./admin.css";
import { useContext, useEffect } from "react";
import { AdminContext } from "./AdminContext";
import { useRouter } from "next/navigation";

const AdminLayout = ({ children }) => {
  const { page_title, icon_class, breadcrumbs, routes_length } = useRoute();
  const { adminUser } = useContext(AdminContext);
  const router = useRouter();

  useEffect(() => {
    if (adminUser === false) router.replace("/admin/sign-in");
  }, [adminUser]);

  if (adminUser === null) return;
  if (adminUser) {
    return (
      <main className="relative flex min-h-screen bg-[#f2f2f2]">
        <Sidebar />
        <div className="ml-[28rem] mt-8 flex-1 mr-10 a-section--container">
          <AdminSectionTitle title={page_title} icon={icon_class} />
          <AdminBreadCrumbs data={breadcrumbs} length={routes_length} />
          {children}
        </div>
      </main>
    );
  }
};

export default AdminLayout;
