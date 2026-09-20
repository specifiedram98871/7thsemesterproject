import React, { useEffect, useState } from "react";
import TakeOrder from "./TakeOrder";
import { getCanonicalOrderStatus } from '../../../utils/functions';

const WaiterDashboard = ({ forAdmin = false }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const backendUrl = process.env.REACT_APP_BACK_URL || "http://localhost:3000";
      const endpoint = forAdmin ? "/api/v1/admin/orders" : "/api/v1/waiter/orders";
      const res = await fetch(`${backendUrl}${endpoint}`, { credentials: "include" });
      const data = await res.json();
      if (res.ok) {
        setOrders(
          (data.orders || [])
            .slice()
            .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        );
        setLastUpdated(new Date());
      } else {
        setError(data.message || "Failed to fetch orders");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // Removed automatic polling - fetch only on demand
  }, []);

  const stats = {
    total: orders.length,
    processing: orders.filter((o) => o.orderStatus === "Processing").length,
    completed: orders.filter((o) => getCanonicalOrderStatus(o.orderStatus, o.orderType) === "Completed").length,
    delivered: orders.filter((o) => getCanonicalOrderStatus(o.orderStatus, o.orderType) === "Delivered").length,
  };

  const formatTime = lastUpdated
    ? lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "--";

  return (
    <div className="min-h-[calc(100vh-72px)] bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.18),_transparent_30%),linear-gradient(180deg,_#eef2ff_0%,_#f8fafc_46%,_#eff6ff_100%)] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-6 pt-24 sm:pt-28">

        {/* HEADER */}
        <div className="overflow-hidden rounded-[2rem] border border-indigo-100/70 bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900 text-white shadow-[0_24px_80px_rgba(15,23,42,0.18)]">
          <div className="flex flex-col gap-4 p-6 sm:p-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-indigo-100">Kitchen console</p>
              <h2 className="mt-2 text-3xl font-semibold sm:text-4xl">
                Order ticket and kitchen queue
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-indigo-100">
                Create a dine-in ticket and track all kitchen orders in one place.
              </p>
            </div>
            <div className="rounded-2xl border border-indigo-200/20 bg-indigo-700/20 px-4 py-3 text-sm backdrop-blur">
              Last refresh: <span className="font-semibold">{formatTime}</span>
            </div>
          </div>

          {/* STATS */}
          <div className="grid gap-3 border-t border-white/10 p-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Queue", stats.total],
              ["Processing", stats.processing],
                ["Completed", stats.completed],
              ["Delivered", stats.delivered],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl bg-indigo-800/10 px-4 py-4 shadow-inner shadow-indigo-950/20">
                <p className="text-xs uppercase tracking-[0.25em] text-indigo-200">{label}</p>
                <p className="mt-2 text-3xl font-semibold">{value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <TakeOrder onOrderPlaced={fetchOrders} />

          {/* ORDER LIST */}
          <div className="rounded-3xl border border-indigo-100 bg-white/95 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.12)] backdrop-blur sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-indigo-600">Kitchen feed</p>
                <h3 className="mt-1 text-2xl font-semibold text-slate-900">
                  Orders in queue
                </h3>
              </div>
              <button
                onClick={fetchOrders}
                className="rounded-full border border-indigo-700 bg-indigo-700 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-600"
              >
                Refresh
              </button>
            </div>

            {loading && <p className="text-sm text-slate-500">Loading...</p>}
            {error && <p className="text-red-600">{error}</p>}

            {!loading && orders.length === 0 && (
              <div className="rounded-3xl border border-dashed border-indigo-200 bg-indigo-50 px-5 py-10 text-center text-sm text-indigo-700">
                No orders yet.
              </div>
            )}

            <div className="space-y-4">
              {orders.map((order) => {
                const item = order.orderItems?.[0];
                const customer = order.customerName || order.user?.name || "Guest";

                return (
                  <article key={order._id} className="rounded-3xl border border-indigo-100 bg-gradient-to-br from-white to-indigo-50 p-4 shadow-sm hover:shadow-md">
                    <div className="flex justify-between">
                      <div>
                        <p className="text-xs text-slate-500">
                          Order #{order._id.slice(-6)}
                        </p>
                        <h4 className="font-semibold">{customer}</h4>
                      </div>

                      <span className={`px-3 py-1 text-xs rounded-full font-semibold ${
                        getCanonicalOrderStatus(order.orderStatus, order.orderType) === "Delivered"
                          ? "bg-green-100 text-green-700"
                          : getCanonicalOrderStatus(order.orderStatus, order.orderType) === "Completed"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {getCanonicalOrderStatus(order.orderStatus, order.orderType) || order.orderStatus}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="bg-white p-3 rounded-xl ring-1 ring-indigo-100">
                        <p className="text-xs text-indigo-500">Table</p>
                        <p className="font-semibold">{order.tableNumber || "-"}</p>
                      </div>
                      <div className="bg-white p-3 rounded-xl ring-1 ring-indigo-100">
                        <p className="text-xs text-indigo-500">Total</p>
                        <p className="font-semibold">
                          Rs. {Number(order.totalPrice || 0).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 bg-white p-3 rounded-xl ring-1 ring-indigo-100">
                      <p className="text-xs text-indigo-500">Product</p>
                      <p className="font-medium">
                        {item ? `${item.name} x ${item.quantity}` : "No items"}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaiterDashboard;