import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { useSnackbar } from 'notistack';
import { formatDate } from '../../utils/functions';
import { getCanonicalOrderStatus } from '../../utils/functions';
import MetaData from '../Layouts/MetaData';
import BackdropLoader from '../Layouts/BackdropLoader';
import Actions from './Actions';

const WaiterOrdersTable = () => {
    const { enqueueSnackbar } = useSnackbar();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [waiterFilter, setWaiterFilter] = useState("");
    const [orderTypeFilter, setOrderTypeFilter] = useState("");
    const [orderDateFilter, setOrderDateFilter] = useState("");

    const fetchWaiterOrders = async () => {
        setLoading(true);
        setError(null);
        try {
            const backendUrl = process.env.REACT_APP_BACK_URL || "http://localhost:3000";
            const response = await fetch(`${backendUrl}/api/v1/admin/orders`, {
                credentials: 'include',
            });
            const data = await response.json();

            if (response.ok) {
                // Filter orders that were taken by waiters (have takenBy field)
                const waiterOrders = (data.orders || []).filter(order => order.takenBy);
                setOrders(waiterOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
            } else {
                setError(data.message || 'Failed to fetch orders');
                enqueueSnackbar(data.message || 'Failed to fetch orders', { variant: 'error' });
            }
        } catch (err) {
            const errorMsg = err.message || 'Network error';
            setError(errorMsg);
            enqueueSnackbar(errorMsg, { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWaiterOrders();
        // Fetch only on mount, no polling
    }, [enqueueSnackbar]);

    const deleteOrderHandler = async (id) => {
        try {
            const backendUrl = process.env.REACT_APP_BACK_URL || "http://localhost:3000";
            const response = await fetch(`${backendUrl}/api/v1/admin/order/${id}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (response.ok) {
                setOrders(orders.filter(order => order._id !== id));
                enqueueSnackbar('Order deleted successfully', { variant: 'success' });
            } else {
                const data = await response.json();
                enqueueSnackbar(data.message || 'Failed to delete order', { variant: 'error' });
            }
        } catch (err) {
            enqueueSnackbar(err.message || 'Network error', { variant: 'error' });
        }
    };

    const clearFilters = () => {
        setWaiterFilter("");
        setOrderTypeFilter("");
        setOrderDateFilter("");
    };

    const filteredOrders = orders.filter((order) => {
        if (waiterFilter && (order.takenBy?.name || "Unknown") !== waiterFilter) {
            return false;
        }

        if (orderTypeFilter && order.orderType !== orderTypeFilter) {
            return false;
        }

        if (orderDateFilter && new Date(order.createdAt).toISOString().slice(0, 10) !== orderDateFilter) {
            return false;
        }

        return true;
    });

    const uniqueWaiters = Array.from(new Set(orders.map((order) => order.takenBy?.name || "Unknown"))).sort();

    const waiterSummary = filteredOrders.reduce((accumulator, order) => {
        const waiterName = order.takenBy?.name || "Unknown";

        if (!accumulator[waiterName]) {
            accumulator[waiterName] = { count: 0, amount: 0 };
        }

        accumulator[waiterName].count += 1;
        accumulator[waiterName].amount += Number(order.totalPrice || 0);
        return accumulator;
    }, {});

    const columns = [
        {
            field: "id",
            headerName: "Order ID",
            minWidth: 200,
            flex: 1,
        },
        {
            field: "customerName",
            headerName: "Customer",
            minWidth: 150,
            flex: 0.3,
        },
        {
            field: "waiter",
            headerName: "Waiter",
            minWidth: 150,
            flex: 0.3,
        },
        {
            field: "tableNumber",
            headerName: "Table",
            minWidth: 100,
            flex: 0.15,
            renderCell: (params) => {
                return <span>{params.row.tableNumber || "—"}</span>;
            },
        },
        {
            field: "status",
            headerName: "Status",
            minWidth: 150,
            flex: 0.2,
            renderCell: (params) => {
                const status = getCanonicalOrderStatus(params.row.status, params.row.orderType);
                return (
                    <>
                        {
                            status === "Delivered" ? (
                                <span className="text-sm bg-green-100 p-1 px-2 font-medium rounded-full text-green-800">{status}</span>
                            ) : status === "Completed" ? (
                                <span className="text-sm bg-blue-100 p-1 px-2 font-medium rounded-full text-blue-800">{status}</span>
                            ) : (
                                <span className="text-sm bg-purple-100 p-1 px-2 font-medium rounded-full text-purple-800">{status}</span>
                            )
                        }
                    </>
                )
            },
        },
        {
            field: "itemsQty",
            headerName: "Items",
            type: "number",
            minWidth: 80,
            flex: 0.1,
        },
        {
            field: "amount",
            headerName: "Amount",
            type: "number",
            minWidth: 150,
            flex: 0.2,
            renderCell: (params) => {
                return (
                    <span>Rs.{params.row.amount.toLocaleString()}</span>
                );
            },
        },
        {
            field: "orderOn",
            headerName: "Order On",
            type: "date",
            minWidth: 200,
            flex: 0.5,
        },
        {
            field: "actions",
            headerName: "Actions",
            minWidth: 100,
            flex: 0.3,
            type: "number",
            sortable: false,
            renderCell: (params) => {
                return (
                    <Actions editRoute={"order"} deleteHandler={deleteOrderHandler} id={params.row.id} />
                );
            },
        },
    ];

    const rows = [];

    filteredOrders && filteredOrders.forEach((order) => {
        rows.unshift({
            id: order._id,
            customerName: order.customerName || order.user?.name || "N/A",
            waiter: order.takenBy?.name || "Unknown",
            tableNumber: order.tableNumber,
            itemsQty: order.orderItems.length,
            amount: order.totalPrice,
            orderOn: formatDate(order.createdAt),
            status: order.orderStatus,
            orderType: order.orderType,
        });
    });

    return (
        <>
            <MetaData title="Waiter Orders | ShopEase Admin" />

            {loading && <BackdropLoader />}

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-lg font-medium uppercase">Waiter Orders</h1>
                        <p className="text-sm text-gray-600">Track waiter order count and total amount</p>
                    </div>
                    <button
                        onClick={fetchWaiterOrders}
                        disabled={loading}
                        className="rounded-full border border-indigo-700 bg-indigo-700 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Refreshing..." : "Refresh"}
                    </button>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="bg-white rounded-xl shadow p-4">
                        <p className="mb-2 text-sm font-medium text-gray-700">Waiter</p>
                        <FormControl fullWidth>
                            <InputLabel id="waiter-filter-label">Waiter</InputLabel>
                            <Select
                                labelId="waiter-filter-label"
                                value={waiterFilter}
                                label="Waiter"
                                onChange={(e) => setWaiterFilter(e.target.value)}
                            >
                                <MenuItem value="">All</MenuItem>
                                {uniqueWaiters.map((waiter) => (
                                    <MenuItem key={waiter} value={waiter}>{waiter}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>

                    <div className="bg-white rounded-xl shadow p-4">
                        <p className="mb-2 text-sm font-medium text-gray-700">Order Type</p>
                        <FormControl fullWidth>
                            <InputLabel id="waiter-order-type-label">Type</InputLabel>
                            <Select
                                labelId="waiter-order-type-label"
                                value={orderTypeFilter}
                                label="Type"
                                onChange={(e) => setOrderTypeFilter(e.target.value)}
                            >
                                <MenuItem value="">All</MenuItem>
                                <MenuItem value="in-house">In-House</MenuItem>
                                <MenuItem value="delivery-partner">Delivery Partner</MenuItem>
                                <MenuItem value="store-delivery">Store Delivery</MenuItem>
                            </Select>
                        </FormControl>
                    </div>

                    <div className="bg-white rounded-xl shadow p-4">
                        <p className="mb-2 text-sm font-medium text-gray-700">Order Date</p>
                        <input
                            type="date"
                            value={orderDateFilter}
                            onChange={(e) => setOrderDateFilter(e.target.value)}
                            className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-primary-green"
                        />
                    </div>

                    <div className="bg-white rounded-xl shadow p-4 flex flex-col justify-between gap-2">
                        <div>
                            <p className="text-sm font-medium text-gray-700">Orders Visible</p>
                            <p className="text-2xl font-bold text-gray-900">{filteredOrders.length}</p>
                        </div>
                        <button
                            onClick={clearFilters}
                            className="rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Clear filters
                        </button>
                    </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {Object.entries(waiterSummary).map(([waiterName, stats]) => (
                        <div key={waiterName} className="bg-white rounded-xl shadow p-4 border border-gray-100">
                            <p className="text-sm font-medium text-gray-600">{waiterName}</p>
                            <p className="mt-2 text-2xl font-bold text-gray-900">{stats.count}</p>
                            <p className="text-sm text-gray-600">orders</p>
                            <p className="mt-3 text-sm font-medium text-gray-700">Rs.{stats.amount.toLocaleString()}</p>
                        </div>
                    ))}
                </div>

                <div className="bg-white rounded-xl shadow-lg w-full" style={{ height: 470 }}>
                    {error ? (
                        <div className="flex items-center justify-center h-full text-red-600">
                            {error}
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="flex items-center justify-center h-full text-gray-500">
                            No waiter orders found
                        </div>
                    ) : filteredOrders.length === 0 ? (
                        <div className="flex items-center justify-center h-full text-gray-500">
                            No waiter orders match the selected filters
                        </div>
                    ) : (
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            pageSize={10}
                            disableSelectIconOnClick
                            sx={{
                                boxShadow: 0,
                                border: 0,
                            }}
                        />
                    )}
                </div>
            </div>
        </>
    );
};

export default WaiterOrdersTable;
