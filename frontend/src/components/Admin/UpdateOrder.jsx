import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { clearErrors, getOrderDetails, updateOrder } from '../../actions/orderAction';
import { UPDATE_ORDER_RESET } from '../../constants/orderConstants';
import { formatDate, getCanonicalOrderStatus, getFinalOrderStatus } from '../../utils/functions';
import TrackStepper from '../Order/TrackStepper';
import Loading from './Loading';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import MetaData from '../Layouts/MetaData';

const UpdateOrder = () => {

    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const params = useParams();

    const [status, setStatus] = useState("");
    const [totalPrice, setTotalPrice] = useState("");

    const { order, error, loading } = useSelector((state) => state.orderDetails);
    const { isUpdated, error: updateError } = useSelector((state) => state.order);
    const finalStatus = order ? getFinalOrderStatus(order.orderType) : "Completed";
    const currentStatus = order ? getCanonicalOrderStatus(order.orderStatus, order.orderType) : "";

    useEffect(() => {
        if (currentStatus) {
            setStatus(finalStatus);
        }
        if (order?.totalPrice !== undefined && order?.totalPrice !== null) {
            setTotalPrice(String(order.totalPrice));
        }
    }, [currentStatus, finalStatus]);

    useEffect(() => {
        if (error) {
            enqueueSnackbar(error, { variant: "error" });
            dispatch(clearErrors());
        }
        if (updateError) {
            enqueueSnackbar(updateError, { variant: "error" });
            dispatch(clearErrors());
        }
        if (isUpdated) {
            enqueueSnackbar("Order Updates Successfully", { variant: "success" });
            dispatch({ type: UPDATE_ORDER_RESET });
        }
        dispatch(getOrderDetails(params.id));
    }, [dispatch, error, params.id, isUpdated, updateError, enqueueSnackbar]);

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

    const updateOrderSubmitHandler = (e) => {
        e.preventDefault();

        if (!totalPrice.trim()) {
            enqueueSnackbar("Please enter the final price", { variant: "warning" });
            return;
        }

        if (!isValidFinalPriceInput(totalPrice)) {
            enqueueSnackbar("Final price must be less than 50000", { variant: "warning" });
            return;
        }

        dispatch(updateOrder(params.id, {
            status,
            totalPrice: Number(totalPrice),
        }));
    }

    return (
        <>
            <MetaData title="Admin: Update Order | ShopEase" />

            {loading ? <Loading /> : (
                <>
                    {order && order.user && order.shippingInfo && (
                        <div className="flex flex-col gap-4">
                            <button
                                type="button"
                                onClick={() => navigate('/admin/dashboard')}
                                className="ml-1 flex items-center gap-0 font-medium text-primary-green uppercase"
                            >
                                <ArrowBackIosIcon sx={{ fontSize: "18px" }} />
                                Go Back to Dashboard
                            </button>

                            <div className="flex flex-col sm:flex-row bg-white shadow-lg rounded-lg min-w-full">
                                <div className="sm:w-1/2 border-r">
                                    <div className="flex flex-col gap-3 my-8 mx-10">
                                        <h3 className="font-medium text-lg">Delivery Address</h3>
                                        <h4 className="font-medium">{order.user.name}</h4>
                                        <p className="text-sm">{`${order.shippingInfo.address}, ${order.shippingInfo.city}, ${order.shippingInfo.state} - ${order.shippingInfo.pincode}`}</p>
                                        <div className="flex gap-2 text-sm">
                                            <p className="font-medium">Email</p>
                                            <p>{order.user.email}</p>
                                        </div>
                                        <div className="flex gap-2 text-sm">
                                            <p className="font-medium">Phone Number</p>
                                            <p>{order.shippingInfo.phoneNo}</p>
                                        </div>
                                    </div>
                                </div>

                                <form onSubmit={updateOrderSubmitHandler} className="flex flex-col gap-3 p-8">
                                    <h3 className="font-medium text-lg">Update Status</h3>
                                    <div className="flex gap-2">
                                        <p className="text-sm font-medium">Current Status:</p>
                                        <p className="text-sm">
                                            {currentStatus === "Processing" && (`Ordered on ${formatDate(order.createdAt)}`)}
                                            {currentStatus === finalStatus && (`${finalStatus} on ${formatDate(order.deliveredAt)}`)}
                                        </p>
                                    </div>
                                    <FormControl fullWidth sx={{ marginTop: 1 }}>
                                        <InputLabel id="order-status-select-label">Status</InputLabel>
                                        <Select
                                            labelId="order-status-select-label"
                                            id="order-status-select"
                                            value={status}
                                            label="Status"
                                            onChange={(e) => setStatus(e.target.value)}
                                        >
                                            {currentStatus === "Processing" && (<MenuItem value={finalStatus}>{finalStatus}</MenuItem>)}
                                            {currentStatus === finalStatus && (<MenuItem value={finalStatus}>{finalStatus}</MenuItem>)}
                                        </Select>
                                    </FormControl>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-medium text-gray-700">Final Price</label>
                                        <input
                                            type="text"
                                            inputMode="decimal"
                                            pattern="[0-9]*[.]?[0-9]*"
                                            maxLength={8}
                                            value={totalPrice}
                                            onChange={(e) => {
                                                const nextValue = e.target.value;
                                                if (isValidFinalPriceInput(nextValue)) {
                                                    setTotalPrice(nextValue);
                                                }
                                            }}
                                            className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-primary-green"
                                            placeholder="Enter final amount"
                                        />
                                    </div>
                                    <button type="submit" className="bg-primary-buttonGreen p-2.5 text-white font-medium rounded shadow hover:shadow-lg">
                                        Update
                                    </button>
                                </form>
                            </div>

                            {order.orderItems && order.orderItems.map((item) => {

                                const { _id, image, name, price, quantity } = item;

                                return (
                                    <div className="flex flex-col sm:flex-row min-w-full shadow-lg rounded-lg bg-white px-2 py-5" key={_id}>

                                        <div className="flex flex-col sm:flex-row sm:w-1/2 gap-1">
                                            <div className="w-full sm:w-32 h-24">
                                                <img draggable="false" className="h-full w-full object-contain" src={image} alt={name} />
                                            </div>
                                            <div className="flex flex-col gap-1 overflow-hidden">
                                                <p className="text-sm">{name.length > 45 ? `${name.substring(0, 45)}...` : name}</p>
                                                <p className="text-xs text-gray-600 mt-2">Quantity: {quantity}</p>
                                                <p className="text-xs text-gray-600">Price: Rs.{price.toLocaleString()}</p>
                                                <span className="font-medium">Total: Rs.{(quantity * price).toLocaleString()}</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col w-full sm:w-1/2">
                                            <h3 className="font-medium sm:text-center">Order Status</h3>
                                            <TrackStepper
                                                orderStatus={order.orderStatus}
                                                orderType={order.orderType}
                                                orderOn={order.createdAt}
                                                deliveredAt={order.deliveredAt}
                                            />
                                        </div>

                                    </div>
                                )
                            })
                            }
                        </div>
                    )}
                </>
            )}
        </>
    );
};

export default UpdateOrder;
