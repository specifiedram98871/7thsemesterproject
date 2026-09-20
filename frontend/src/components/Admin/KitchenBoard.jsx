import React, { useEffect, useState } from "react";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useSnackbar } from 'notistack';
import { getCanonicalOrderStatus, getFinalOrderStatus } from '../../utils/functions';

const OrderCard = ({
  order,
  stage,
  manualPrice,
  onAccept,
  onPriceChange,
  onFinalize,
}) => {
  const finalStatus = getFinalOrderStatus(order.orderType);
  const statusLabel = getCanonicalOrderStatus(order.orderStatus, order.orderType);
  const isPending = stage === "pending";
  const isInProgress = stage === "in-progress";
  const isCompleted = stage === "completed";

  return (
    <div className={`rounded-lg border-2 p-4 ${
      isCompleted ? 'border-emerald-200 bg-emerald-50' : isInProgress ? 'border-indigo-200 bg-indigo-50' : 'border-red-200 bg-red-50'
    }`}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="font-semibold text-sm text-gray-800">{order.customerName}</p>
          <p className="text-xs text-gray-600">Table: {order.tableNumber || 'N/A'}</p>
          <p className="text-xs text-gray-600">Waiter: {order.takenBy?.name || 'Unknown'}</p>

          <div className="mt-2">
            <span className={`inline-block text-xs font-semibold px-2 py-1 rounded-full ${
              order.orderType === 'delivery-partner' ? 'bg-purple-100 text-purple-800' :
              order.orderType === 'store-delivery' ? 'bg-orange-100 text-orange-800' :
              'bg-blue-100 text-blue-800'
            }`}>
              {order.orderType === 'delivery-partner' ? '🚗 Delivery Partner' :
               order.orderType === 'store-delivery' ? '🏪 Store Delivery' :
               '🏠 In-House'}
            </span>
          </div>

          {order.orderType === 'delivery-partner' && order.deliveryPartner && (
            <div className="mt-2 flex items-center gap-2">
              {order.deliveryPartner.logo && (
                <img
                  src={order.deliveryPartner.logo}
                  alt={order.deliveryPartner.name}
                  className="h-6 w-6 rounded object-cover"
                />
              )}
              <p className="text-xs text-gray-700 font-medium">{order.deliveryPartner.name}</p>
              {order.deliveryPartnerOrderId && (
                <p className="text-xs text-gray-600">({order.deliveryPartnerOrderId})</p>
              )}
            </div>
          )}
        </div>
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${
          isCompleted ? 'bg-emerald-100 text-emerald-800' : isInProgress ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {isCompleted ? '✓ COMPLETED' : isInProgress ? 'IN PROGRESS' : 'PENDING'}
        </span>
      </div>

      <div className="bg-white rounded p-2 mb-3 max-h-32 overflow-y-auto">
        {order.orderItems?.map((item, idx) => (
          <p key={idx} className="text-xs text-gray-700">
            {item.quantity}x {item.name} - Rs.{item.price * item.quantity}
          </p>
        ))}
        <p className="font-semibold text-sm text-gray-900 mt-2 border-t pt-2">
          Total: Rs.{order.totalPrice}
        </p>
      </div>

      <div className="space-y-2">
        {isPending ? (
          <button
            onClick={() => onAccept(order._id)}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg flex items-center justify-center gap-2 transition"
          >
            <CheckCircleIcon sx={{ fontSize: '18px' }} />
            Accept Order
          </button>
        ) : isCompleted ? (
          <div className="text-xs text-gray-600 bg-white rounded p-2 space-y-1">
            <div>Accepted by: {order.acceptedBy?.name || 'Unknown'}</div>
            <div>Completed on: {order.deliveredAt ? new Date(order.deliveredAt).toLocaleString() : 'N/A'}</div>
          </div>
        ) : (
          <>
            <div className="text-xs text-gray-600 bg-white rounded p-2">
              Accepted by: {order.acceptedBy?.name || 'Unknown'}
            </div>
            <div className="bg-white rounded p-2">
              <label className="mb-1 block text-xs font-medium text-gray-600">Final price</label>
              <input
                type="text"
                inputMode="decimal"
                pattern="[0-9]*[.]?[0-9]*"
                value={manualPrice}
                onChange={(e) => onPriceChange(order._id, e.target.value)}
                className="w-full rounded border border-gray-200 px-3 py-2 text-sm outline-none focus:border-indigo-500"
                placeholder="Enter final price"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onFinalize(order._id, finalStatus)}
                disabled={statusLabel === finalStatus}
                className={`py-1.5 rounded text-white text-xs font-medium transition ${
                  statusLabel === finalStatus
                    ? 'bg-gray-300 cursor-not-allowed'
                    : finalStatus === 'Delivered'
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {finalStatus}
              </button>
              <span className={`text-xs font-bold px-2 py-1.5 rounded text-center ${
                statusLabel === 'Delivered' ? 'bg-green-100 text-green-800' :
                statusLabel === 'Completed' ? 'bg-blue-100 text-blue-800' :
                'bg-purple-100 text-purple-800'
              }`}>
                {statusLabel}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const KitchenBoard = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [manualPrices, setManualPrices] = useState({});
  const backendUrl = process.env.REACT_APP_BACK_URL || "http://localhost:3000";

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${backendUrl}/api/v1/admin/orders`, {
        credentials: 'include',
      });
      const data = await response.json();

      if (response.ok) {
        setOrders((data.orders || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        setError(null);
      } else {
        setError(data.message || 'Failed to fetch orders');
        enqueueSnackbar(data.message || 'Failed to fetch orders', { variant: 'error' });
      }
    } catch (err) {
      setError(err.message || 'Network error');
      enqueueSnackbar(err.message || 'Network error', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const acceptOrderHandler = async (orderId) => {
    try {
      const response = await fetch(`${backendUrl}/api/v1/admin/order/${orderId}/accept`, {
        method: 'PUT',
        credentials: 'include',
      });

      const data = await response.json();
      if (response.ok) {
        enqueueSnackbar('Order accepted successfully', { variant: 'success' });
        fetchOrders();
      } else {
        enqueueSnackbar(data.message || 'Failed to accept order', { variant: 'error' });
      }
    } catch (err) {
      enqueueSnackbar(err.message || 'Network error', { variant: 'error' });
    }
  };

  const updateStatusHandler = async (orderId, newStatus) => {
    const finalPrice = manualPrices[orderId];

    if (!String(finalPrice ?? "").trim()) {
      enqueueSnackbar('Please enter the final price before completing the order', { variant: 'warning' });
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/api/v1/admin/order/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus, totalPrice: Number(finalPrice) }),
      });

      const data = await response.json();
      if (response.ok) {
        enqueueSnackbar(`Order marked as ${newStatus}`, { variant: 'success' });
        fetchOrders();
      } else {
        enqueueSnackbar(data.message || 'Failed to update order', { variant: 'error' });
      }
    } catch (err) {
      enqueueSnackbar(err.message || 'Network error', { variant: 'error' });
    }
  };

  const handlePriceChange = (orderId, value) => {
    setManualPrices((current) => ({
      ...current,
      [orderId]: value,
    }));
  };

  const getBoardStage = (order) => {
    const finalStatus = getFinalOrderStatus(order.orderType);
 const isValidFinalPriceInput = (value) => {
   if (value === "") {
     return true;
   }

   if (!/^(?:\d+\.?\d*|\.\d+)$/.test(value)) {
     return false;
   }

   const numericValue = Number(value);
   return Number.isFinite(numericValue) && numericValue < 50000;
 };
    const statusLabel = getCanonicalOrderStatus(order.orderStatus, order.orderType);

    if (!order.isAccepted) {
      return "pending";
    }

    return statusLabel === finalStatus ? "completed" : "in-progress";
  };

  const pendingOrders = orders.filter((order) => getBoardStage(order) === "pending");
  const inProgressOrders = orders.filter((order) => getBoardStage(order) === "in-progress");
  const completedOrders = orders.filter((order) => getBoardStage(order) === "completed");

  return (
    <div className="min-h-[calc(100vh-72px)] bg-gray-50 px-6 pb-6 pt-24 sm:pt-28">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Kitchen Dashboard</h1>
          <p className="text-gray-600">Manage orders: Accept → Finalize</p>
          <button
            onClick={fetchOrders}
            className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition"
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Kanban Board */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Pending Orders */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <CancelIcon className="text-red-600" />
              <h2 className="text-xl font-bold text-gray-900">
                Pending Acceptance
              </h2>
              <span className="ml-auto bg-red-100 text-red-800 text-sm font-bold px-3 py-1 rounded-full">
                {pendingOrders.length}
              </span>
            </div>

            {pendingOrders.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No pending orders
              </div>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {pendingOrders.map(order => (
                  <OrderCard
                    key={order._id}
                    order={order}
                    stage="pending"
                    manualPrice={manualPrices[order._id] ?? order.totalPrice ?? ""}
                    onAccept={acceptOrderHandler}
                    onPriceChange={handlePriceChange}
                    onFinalize={updateStatusHandler}
                  />
                ))}
              </div>
            )}
          </div>

          {/* In Progress Orders */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircleIcon className="text-green-600" />
              <h2 className="text-xl font-bold text-gray-900">
                In Progress
              </h2>
              <span className="ml-auto bg-green-100 text-green-800 text-sm font-bold px-3 py-1 rounded-full">
                {inProgressOrders.length}
              </span>
            </div>

            {inProgressOrders.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No in-progress orders
              </div>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {inProgressOrders.map(order => (
                  <OrderCard
                    key={order._id}
                    order={order}
                    stage="in-progress"
                    manualPrice={manualPrices[order._id] ?? order.totalPrice ?? ""}
                    onAccept={acceptOrderHandler}
                    onPriceChange={handlePriceChange}
                    onFinalize={updateStatusHandler}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Completed Orders */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircleIcon className="text-emerald-600" />
              <h2 className="text-xl font-bold text-gray-900">
                Completed
              </h2>
              <span className="ml-auto bg-emerald-100 text-emerald-800 text-sm font-bold px-3 py-1 rounded-full">
                {completedOrders.length}
              </span>
            </div>

            {completedOrders.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No completed orders
              </div>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {completedOrders.map(order => (
                  <OrderCard
                    key={order._id}
                    order={order}
                    stage="completed"
                    manualPrice={manualPrices[order._id] ?? order.totalPrice ?? ""}
                    onAccept={acceptOrderHandler}
                    onPriceChange={handlePriceChange}
                    onFinalize={updateStatusHandler}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KitchenBoard;
