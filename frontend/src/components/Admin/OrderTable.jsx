import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { clearErrors, deleteOrder, getAllOrders } from '../../actions/orderAction';
import { DELETE_ORDER_RESET } from '../../constants/orderConstants';
import Actions from './Actions';
import { formatDate } from '../../utils/functions';
import { getCanonicalOrderStatus } from '../../utils/functions';
import MetaData from '../Layouts/MetaData';
import BackdropLoader from '../Layouts/BackdropLoader';

const OrderTable = () => {

    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const [orderDate, setOrderDate] = useState("");
    const [orderType, setOrderType] = useState("");

    const { orders, error } = useSelector((state) => state.allOrders);
    const { loading, isDeleted, error: deleteError } = useSelector((state) => state.order);

    useEffect(() => {
        if (error) {
            enqueueSnackbar(error, { variant: "error" });
            dispatch(clearErrors());
        }
        if (deleteError) {
            enqueueSnackbar(deleteError, { variant: "error" });
            dispatch(clearErrors());
        }
        if (isDeleted) {
            enqueueSnackbar("Deleted Successfully", { variant: "success" });
            dispatch({ type: DELETE_ORDER_RESET });
        }
        dispatch(getAllOrders());
    }, [dispatch, error, deleteError, isDeleted, enqueueSnackbar]);

    const deleteOrderHandler = (id) => {
        dispatch(deleteOrder(id));
    }

    const filteredOrders = (orders || []).filter((order) => {
        if (orderDate && new Date(order.createdAt).toISOString().slice(0, 10) !== orderDate) {
            return false;
        }

        if (orderType && order.orderType !== orderType) {
            return false;
        }

        return true;
    });

    const clearFilters = () => {
        setOrderDate("");
        setOrderType("");
    };

    const columns = [
        {
            field: "id",
            headerName: "Order ID",
            minWidth: 200,
            flex: 1,
        },
        {
            field: "waiter",
            headerName: "Taken By (Waiter)",
            minWidth: 150,
            flex: 0.3,
            renderCell: (params) => {
                return (
                    <span className="text-sm text-gray-700">{params.row.waiter || "—"}</span>
                );
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
            headerName: "Items Qty",
            type: "number",
            minWidth: 100,
            flex: 0.1,
        },
        {
            field: "amount",
            headerName: "Amount",
            type: "number",
            minWidth: 200,
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
            itemsQty: order.orderItems.length,
            amount: order.totalPrice,
            orderOn: formatDate(order.createdAt),
            status: order.orderStatus,
            orderType: order.orderType,
            waiter: order.takenBy?.name || "—",
        });
    });

    return (
        <>
            <MetaData title="Admin Orders | ShopEase" />

            {loading && <BackdropLoader />}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-4">
                <div>
                    <h1 className="text-lg font-medium uppercase">orders</h1>
                    <p className="text-sm text-gray-600">Filter orders by date and order type</p>
                </div>
                <button
                    onClick={clearFilters}
                    className="self-start sm:self-auto rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                    Clear filters
                </button>
            </div>

            <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <div className="bg-white rounded-xl shadow p-4">
                    <p className="mb-2 text-sm font-medium text-gray-700">Order Date</p>
                    <input
                        type="date"
                        value={orderDate}
                        onChange={(e) => setOrderDate(e.target.value)}
                        className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-primary-green"
                    />
                </div>
                <div className="bg-white rounded-xl shadow p-4">
                    <p className="mb-2 text-sm font-medium text-gray-700">Order Type</p>
                    <FormControl fullWidth>
                        <InputLabel id="order-type-filter-label">Type</InputLabel>
                        <Select
                            labelId="order-type-filter-label"
                            value={orderType}
                            label="Type"
                            onChange={(e) => setOrderType(e.target.value)}
                        >
                            <MenuItem value="">All</MenuItem>
                            <MenuItem value="in-house">In-House</MenuItem>
                            <MenuItem value="delivery-partner">Delivery Partner</MenuItem>
                            <MenuItem value="store-delivery">Store Delivery</MenuItem>
                        </Select>
                    </FormControl>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg w-full" style={{ height: 470 }}>

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
            </div>
        </>
    );
};

export default OrderTable;
