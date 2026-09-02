"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { DotsThreeVertical, Trash } from "phosphor-react";
import { useState, useRef, useEffect } from "react";
import useOrders from "./useOrders";
import { CaretRight, CaretLeft } from "phosphor-react";
import TableLoadingRow from "@/components/admin/LoadingRow";
import TableEmptyRow from "@/components/admin/TableEmptyRow";
import SearchSection from "@/components/admin/SearchSections";

const Orders = () => {
  const {
    orders,
    currentPage,
    totalPages,
    handlePage,
    getAllOrders,
    updateOrder,
    deleteOrder
  } = useOrders();
  
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const dropdownRef = useRef(null);
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("All");
  const [searchValue, setSearchValue] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const TABS = ["All", "Processing", "Shipped", "Delivered", "Cancelled"];

  useEffect(() => {
    getAllOrders({
      status: activeTab,
      search: searchValue,
      startDate,
      endDate
    });
  }, [activeTab, startDate, endDate]);

  const handleSearch = (val) => {
    setSearchValue(val);
    getAllOrders({
      status: activeTab,
      search: val,
      startDate,
      endDate
    });
  };

  const handleStatusChange = async (id, type, val) => {
    // Optimistic or just wait
    if (type === 'paymentStatus') {
      await updateOrder(id, undefined, val);
    } else {
      await updateOrder(id, val, undefined);
    }
    // Refresh
    getAllOrders({
      status: activeTab,
      search: searchValue,
      startDate,
      endDate
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      const success = await deleteOrder(id);
      if (success) {
        getAllOrders({
          status: activeTab,
          search: searchValue,
          startDate,
          endDate
        });
      }
    }
    setOpenDropdownId(null);
  };

  const handleEdit = (id) => {
    router.push(`orders/order-management?order_id=${id}`);
  };

  return (
    <main className="w-full max-w-full min-h-[88svh] flex flex-col gap-6">
      
      {/* Top Header */}
      <div className="flex justify-between items-center bg-white p-6 rounded shadow-sm border border-neutral-200">
        <div className="flex gap-4 items-center">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-full text-[1.4rem] font-medium transition ${activeTab === tab ? "bg-black text-white" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex justify-between items-center gap-4 bg-white p-6 rounded shadow-sm border border-neutral-200">
        <div className="flex-1 max-w-[400px]">
           <input
             type="text"
             placeholder="Search by Order ID or Customer Name"
             className="w-full a-input p-3 border rounded text-[1.4rem]"
             value={searchValue}
             onChange={(e) => setSearchValue(e.target.value)}
             onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchValue)}
           />
        </div>
        <div className="flex gap-4 items-center">
          <div className="flex flex-col">
            <label className="text-[1.2rem] font-medium text-neutral-500">Start Date</label>
            <input type="date" className="a-input p-2 border rounded text-[1.4rem]" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div className="flex flex-col">
            <label className="text-[1.2rem] font-medium text-neutral-500">End Date</label>
            <input type="date" className="a-input p-2 border rounded text-[1.4rem]" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="a-section--box !p-0">
        <div className="grid grid-cols-[1fr_1fr_1fr_1.5fr_1.5fr_80px]">
          {["Order ID", "Customer", "Total Amount", "Payment Status", "Order Status", "Options"].map(
            (item, i) => (
              <div
                key={i}
                className="text-[1.4rem] font-medium text-center first:text-start last:text-end p-4"
              >
                {item}
              </div>
            ),
          )}
        </div>
        {orders === null && <TableLoadingRow />}
        {orders && orders.length === 0 && (
          <TableEmptyRow message={"No Orders Found"} />
        )}
        {orders &&
          orders.length >= 1 &&
          orders.map((o) => (
            <div
              key={o._id}
              className="grid grid-cols-[1fr_1fr_1fr_1.5fr_1.5fr_80px] gap-8 py-4 px-4 border-b-0 border-neutral-200 last:border-b-0 text-[1.3rem] text-neutral-800 items-center even:bg-neutral-100"
            >
              <div className="truncate font-medium">{o._id}</div>
              <div className="text-center truncate">{o?.userId?.name || "User"}</div>
              <div className="text-center font-medium">
                ₹{o.totalAmount}
              </div>
              
              <div className="text-center">
                <select 
                  value={o.paymentStatus}
                  onChange={(e) => handleStatusChange(o._id, 'paymentStatus', e.target.value)}
                  className={`p-2 border rounded text-[1.3rem] font-medium outline-none cursor-pointer ${o.paymentStatus === 'Paid' ? 'bg-green-50 text-green-800 border-green-200' : 'bg-yellow-50 text-yellow-800 border-yellow-200'}`}
                >
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                  <option value="Failed">Failed</option>
                </select>
              </div>

              <div className="text-center">
                <select 
                  value={o.orderStatus}
                  onChange={(e) => handleStatusChange(o._id, 'orderStatus', e.target.value)}
                  className={`p-2 border rounded text-[1.3rem] font-medium outline-none cursor-pointer ${o.orderStatus === 'Delivered' ? 'bg-green-50 text-green-800 border-green-200' : o.orderStatus === 'Cancelled' ? 'bg-red-50 text-red-800 border-red-200' : 'bg-blue-50 text-blue-800 border-blue-200'}`}
                >
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              {/* 3-dot button with dropdown */}
              <div className="ml-auto mr-4 relative" ref={dropdownRef}>
                <button
                  className="mx-auto cursor-pointer block"
                  onClick={() =>
                    setOpenDropdownId(openDropdownId === o._id ? null : o._id)
                  }
                >
                  <DotsThreeVertical size={20} weight="bold" />
                </button>

                {openDropdownId === o._id && (
                  <div className="absolute right-0 mt-2 w-[12rem] bg-white border border-neutral-200 rounded shadow-md z-10 py-2">
                    <ul className="flex flex-col text-[1.3rem] text-left">
                      <li
                        onClick={() => handleEdit(o._id)}
                        className="px-4 py-2 hover:bg-neutral-100 cursor-pointer"
                      >
                        Manage
                      </li>
                      <li
                        onClick={() => handleDelete(o._id)}
                        className="px-4 py-2 hover:bg-red-50 text-red-600 cursor-pointer flex items-center gap-2"
                      >
                        <Trash size={16} /> Delete
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
      </div>
      
      <div className="flex justify-end items-center gap-8 mt-auto pt-6">
        <CaretLeft
          className={`w-[1.5rem] h-[1.5rem] cursor-pointer ${
            currentPage == 1 ? "text-neutral-300" : ""
          }`}
          weight="bold"
          onClick={() => handlePage("down")}
        />
        <div className="text-[1.4rem]">{currentPage}</div>
        <CaretRight
          className={`w-[1.5rem] h-[1.5rem] cursor-pointer ${
            currentPage === totalPages ? "text-neutral-300" : ""
          }`}
          weight="bold"
          onClick={() => handlePage("up")}
        />
      </div>
    </main>
  );
};

export default Orders;
