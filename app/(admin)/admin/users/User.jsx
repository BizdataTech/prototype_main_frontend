import dayjs from "dayjs";
import { DotsThree, Spinner } from "phosphor-react";
import { useRef, useState } from "react";
import useMouseClick from "../../hooks/useMouseClick";
import axios from "axios";
import { toast } from "sonner";

const User = ({ user, refetch }) => {
  const [box, setBox] = useState(false);
  const boxRef = useRef(null);

  useMouseClick(boxRef, () => setBox(false));

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const updateStatus = async () => {
    if (loading) return;
    try {
      setUpdateLoading(true);
      setLoading(true);
      let res = await axios.patch(
        `${BACKEND_URL}/api/admin-users/clients/${user._id}/status`,
        {},
        { withCredentials: true },
      );
      setUpdateLoading(false);
      setLoading(false);
      toast.success(res.data?.message);
      refetch();
      setBox(false);
    } catch (err) {
      setUpdateLoading(false);
      setLoading(false);
      toast.error("Something Went Wrong");
      console.log(err.message);
    }
  };

  const deleteUser = async () => {
    if (loading) return;
    try {
      setDeleteLoading(true);
      setLoading(true);
      let res = await axios.delete(
        `${BACKEND_URL}/api/admin-users/clients/${user._id}`,
        { withCredentials: true },
      );
      setDeleteLoading(false);
      setLoading(false);
      toast.success(res.data?.message);
      refetch();
      setBox(false);
    } catch (err) {
      setDeleteLoading(false);
      setLoading(false);
      toast.error("Something Went Wrong");
      console.log(err.message);
    }
  };

  return (
    <div className="grid grid-cols-5 even:bg-neutral-100">
      <div className="p-4">{user.username}</div>
      <div className="p-4">{user.email}</div>
      <div className="p-4">{dayjs(user.createdAt).format("DD-MM-YYYY")}</div>
      <div
        className={`${user.blocked ? "text-red-700" : "text-green-700"} font-medium p-4`}
      >
        {user.blocked ? "Blocked" : "Active"}
      </div>
      <div className="cursor-pointer ml-auto mr-6 p-4 relative">
        <DotsThree
          className="w-[2rem] h-[2rem]"
          weight="bold"
          onClick={() => setBox(true)}
        />
        {box && (
          <ul
            className="absolute bg-white shadow-sm right-[50%] w-[15rem] z-100"
            ref={boxRef}
          >
            <li>
              <button
                className={`w-full text-center hover:bg-neutral-100 transition-colors py-2 px-8 ${loading ? "cursor-not-allowed opacity-70" : "cursor-pointer"}`}
                onClick={updateStatus}
                disabled={loading}
              >
                {updateLoading ? (
                  <div className="flex justify-center items-center gap-1">
                    Updating <Spinner className="animate-spin" />
                  </div>
                ) : user.blocked ? (
                  "Unblock User"
                ) : (
                  "Block User"
                )}
              </button>
            </li>
            <li>
              <button
                className={`w-full text-center text-red-700 hover:bg-neutral-100 transition-colors py-2 px-8 ${loading ? "cursor-not-allowed opacity-70" : "cursor-pointer"}`}
                onClick={deleteUser}
                disabled={loading}
              >
                {deleteLoading ? (
                  <div className="flex justify-center items-center gap-1">
                    Deleting <Spinner className="animate-spin" />
                  </div>
                ) : (
                  "Delete User"
                )}
              </button>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default User;
