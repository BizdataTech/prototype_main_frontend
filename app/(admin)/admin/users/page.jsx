"use client";

import SearchSection from "@/components/admin/SearchSections";
import useUsers from "./useUsers";
import TableLoadingRow from "@/components/admin/LoadingRow";
import TableEmptyRow from "@/components/admin/TableEmptyRow";

export default function Users() {
  const { users } = useUsers();

  return (
    <section className="flex flex-col gap-6">
      <div>
        <SearchSection placeholder={"Search for Users"} />
      </div>
      <div className="a-section--box text-[1.4rem] !p-0">
        <div className="grid grid-cols-5">
          {["Sl No", "User", "Created At", "Status", "Options"].map(
            (item, i) => (
              <div key={i} className="font-medium last:text-end p-4">
                {item}
              </div>
            ),
          )}
        </div>
        {users === null && <TableLoadingRow />}
        {users && users.length === 0 && (
          <TableEmptyRow message={"No Result Found"} />
        )}
      </div>
    </section>
  );
}
