"use client";

import { useState, useEffect, useRef, useContext } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { AdminContext } from "@/app/(admin)/AdminContext";

const POLL_INTERVAL = 30000;
const STORAGE_KEY = "admin_last_seen_order_time";

const OrderNotificationBell = () => {
  const [orders, setOrders] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();
  const { adminUser } = useContext(AdminContext);
  const NEXT_PUBLIC_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

  const getLastSeenTime = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? new Date(stored) : new Date(0);
    } catch {
      return new Date(0);
    }
  };

  const markAllRead = () => {
    localStorage.setItem(STORAGE_KEY, new Date().toISOString());
    setUnreadCount(0);
  };

  const fetchOrders = async () => {
    if (!adminUser) return;
    try {
      setLoading(true);
      const res = await axios.get(`${NEXT_PUBLIC_BACKEND_URL}/api/admin/orders`, {
        withCredentials: true,
      });
      const fetched = res.data?.orders || [];
      const recent = fetched.slice(0, 15);
      setOrders(recent);
      const lastSeen = getLastSeenTime();
      const unseen = recent.filter((o) => new Date(o.createdAt) > lastSeen);
      setUnreadCount(unseen.length);
    } catch (err) {
      console.error(
        "[Bell] Failed to fetch orders:",
        err?.response?.data || err.message,
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [adminUser]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = () => {
    if (!open) fetchOrders();
    setOpen((prev) => !prev);
  };

  const formatTime = (dateStr) => {
    const diffMs = Date.now() - new Date(dateStr);
    const diffMins = Math.floor(diffMs / 60000);
    const diffHrs = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHrs < 24) return `${diffHrs}h ago`;
    return `${diffDays}d ago`;
  };

  const getStatusColor = (status) => {
    const map = {
      "Order Placed": "#f59e0b",
      Confirmed: "#3b82f6",
      Shipped: "#8b5cf6",
      "Out for Delivery": "#06b6d4",
      Delivered: "#10b981",
      Cancelled: "#ef4444",
    };
    return map[status] || "#6b7280";
  };

  return (
    <div ref={dropdownRef} style={{ position: "relative" }}>
      <button
        onClick={handleToggle}
        title="Order Notifications"
        style={{
          position: "relative",
          background: open ? "#1a1a2e" : "transparent",
          border: `1.5px solid ${open ? "#e94560" : "#d1d5db"}`,
          borderRadius: "10px",
          padding: "8px 14px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "7px",
          transition: "all 0.2s ease",
          color: open ? "#fff" : "#374151",
          width: "100%",
        }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        <span style={{ fontSize: "1.3rem", fontWeight: 600 }}>
          Notifications
        </span>
        {unreadCount > 0 && (
          <span
            style={{
              position: "absolute",
              top: "-7px",
              right: "-7px",
              background: "#e94560",
              color: "#fff",
              fontSize: "10px",
              fontWeight: 700,
              borderRadius: "50%",
              width: "19px",
              height: "19px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "2px solid #f2f2f2",
              animation: "bellPulse 1.5s ease-in-out infinite",
            }}
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 10px)",
            left: "0",
            width: "350px",
            background: "#fff",
            borderRadius: "14px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
            border: "1px solid #e5e7eb",
            zIndex: 9999,
            overflow: "hidden",
            animation: "dropIn 0.2s ease",
          }}
        >
          <div
            style={{
              background: "linear-gradient(135deg,#1a1a2e,#0f3460)",
              padding: "14px 18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <h3
                style={{
                  color: "#fff",
                  margin: 0,
                  fontSize: "14px",
                  fontWeight: 700,
                }}
              >
                New Orders
              </h3>
              <p
                style={{
                  color: "#a0aec0",
                  margin: "2px 0 0",
                  fontSize: "11px",
                }}
              >
                Refreshes every 30s
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                style={{
                  background: "rgba(255,255,255,0.12)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  color: "#e2e8f0",
                  fontSize: "11px",
                  padding: "4px 10px",
                  borderRadius: "20px",
                  cursor: "pointer",
                }}
              >
                Mark all read
              </button>
            )}
          </div>

          <div style={{ maxHeight: "380px", overflowY: "auto" }}>
            {loading && orders.length === 0 ? (
              <div
                style={{
                  padding: "30px",
                  textAlign: "center",
                  color: "#9ca3af",
                  fontSize: "13px",
                }}
              >
                Loading...
              </div>
            ) : orders.length === 0 ? (
              <div
                style={{
                  padding: "30px",
                  textAlign: "center",
                  color: "#9ca3af",
                  fontSize: "13px",
                }}
              >
                No recent orders
              </div>
            ) : (
              orders.map((order) => {
                const isNew = new Date(order.createdAt) > getLastSeenTime();
                return (
                  <div
                    key={order._id}
                    onClick={() => {
                      markAllRead();
                      setOpen(false);
                      router.push("/admin/orders");
                    }}
                    style={{
                      padding: "12px 18px",
                      borderBottom: "1px solid #f3f4f6",
                      cursor: "pointer",
                      background: isNew ? "#fef9ec" : "#fff",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "12px",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#f0f4ff")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = isNew
                        ? "#fef9ec"
                        : "#fff")
                    }
                  >
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        background: "#f3f4f6",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        fontSize: "16px",
                      }}
                    >
                      &#128722;
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "12px",
                            fontWeight: 700,
                            color: "#111827",
                          }}
                        >
                          #{String(order._id).slice(-8).toUpperCase()}
                        </span>
                        <span style={{ fontSize: "10px", color: "#9ca3af" }}>
                          {formatTime(order.createdAt)}
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#6b7280",
                          marginTop: "2px",
                        }}
                      >
                        {order.userId?.name || "Customer"}
                        {" · "}
                        <strong style={{ color: "#111827" }}>
                          Rs.{order.totalAmount?.toFixed(2)}
                        </strong>
                      </div>
                      <div
                        style={{
                          marginTop: "5px",
                          display: "flex",
                          gap: "6px",
                          flexWrap: "wrap",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "10px",
                            fontWeight: 600,
                            color: getStatusColor(order.orderStatus),
                            background:
                              getStatusColor(order.orderStatus) + "20",
                            padding: "2px 8px",
                            borderRadius: "20px",
                          }}
                        >
                          {order.orderStatus}
                        </span>
                        {isNew && (
                          <span
                            style={{
                              fontSize: "10px",
                              fontWeight: 700,
                              color: "#e94560",
                              background: "#fde8ec",
                              padding: "2px 8px",
                              borderRadius: "20px",
                            }}
                          >
                            NEW
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div style={{ padding: "12px 18px", borderTop: "1px solid #f3f4f6" }}>
            <button
              onClick={() => {
                setOpen(false);
                router.push("/admin/orders");
              }}
              style={{
                background: "linear-gradient(135deg,#1a1a2e,#0f3460)",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                padding: "9px 24px",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
                width: "100%",
              }}
            >
              View All Orders
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes bellPulse {
          0%,100% { transform: scale(1); }
          50%      { transform: scale(1.25); }
        }
        @keyframes dropIn {
          from { opacity:0; transform:translateY(-8px); }
          to   { opacity:1; transform:translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default OrderNotificationBell;
