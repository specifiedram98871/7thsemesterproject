import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CircleIcon from '@mui/icons-material/Circle';
import { Link } from 'react-router-dom';
import { formatDate, getCanonicalOrderStatus, getFinalOrderStatus } from '../../utils/functions';

const OrderItem = (props) => {

    const { orderId, name, image, price, quantity, createdAt, deliveredAt, orderStatus, orderType } = props;
    const normalizedStatus = getCanonicalOrderStatus(orderStatus, orderType);
    const finalStatus = getFinalOrderStatus(orderType);

    return (
        <Link to={`/order_details/${orderId}`} className="flex p-4 items-start bg-white border rounded gap-2 sm:gap-0 hover:shadow-lg">
            {/* <!-- image container --> */}
            <div className="w-full sm:w-32 h-20">
                <img draggable="false" className="h-full w-full object-contain" src={image} alt={name} />
            </div>
            {/* <!-- image container --> */}

            {/* <!-- order desc container --> */}
            <div className="flex flex-col sm:flex-row justify-between w-full">

                <div className="flex flex-col gap-1 overflow-hidden">
                    <p className="text-sm">{name.length > 40 ? `${name.substring(0, 40)}...` : name}</p>
                    <p className="text-xs text-gray-500 mt-2">Quantity: {quantity}</p>
                    <p className="text-xs text-gray-500">Total: Rs.{(quantity * price).toLocaleString()}</p>
                </div>

                <div className="flex flex-col sm:flex-row mt-1 sm:mt-0 gap-2 sm:gap-20 sm:w-1/2">
                    <p className="text-sm">Rs.{price.toLocaleString()}</p>

                    <div className="flex flex-col gap-1.5">
                        <p className="text-sm font-medium flex items-center gap-1">
                            {normalizedStatus === "Processing" ? (
                                <>
                                    <span className="text-primary-buttonGreen pb-0.5">
                                        <CircleIcon sx={{ fontSize: "14px" }} />
                                    </span>
                                    Processing
                                </>
                            ) : normalizedStatus === finalStatus ? (
                                <>
                                    <span className="text-primary-green pb-0.5">
                                        <CircleIcon sx={{ fontSize: "14px" }} />
                                    </span>
                                    {finalStatus} on {formatDate(deliveredAt)}
                                </>
                            ) : (
                                <>
                                    <span className="text-primary-green pb-0.5">
                                        <RadioButtonUncheckedIcon sx={{ fontSize: "14px" }} />
                                    </span>
                                    Ordered on {formatDate(createdAt)}
                                </>
                            )}
                        </p>
                        {normalizedStatus === finalStatus ?
                            <p className="text-xs ml-1">Your item has been {finalStatus}</p>
                            : normalizedStatus === "Processing" ?
                                <p className="text-xs ml-1">Your item is being prepared</p> :
                                <p className="text-xs ml-1">Seller has processed your order</p>
                        }
                    </div>
                </div>

            </div>
            {/* <!-- order desc container --> */}

        </Link>
    );
};

export default OrderItem;
