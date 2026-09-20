const asyncErrorHandler = require('../middlewares/asyncErrorHandler');
const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const ErrorHandler = require('../utils/errorHandler');
const sendEmail = require('../utils/sendEmail');

// Create New Order
exports.newOrder = asyncErrorHandler(async (req, res, next) => {

    const {
        shippingInfo,
        orderItems,
        paymentInfo,
        totalPrice,
        customerName,
        orderType,
        deliveryPartner,
        deliveryPartnerOrderId,
    } = req.body;

    const orderExist = await Order.findOne({ paymentInfo });

    if (orderExist) {
        return next(new ErrorHandler("Order Already Placed", 400));
    }
    // support waiter creating order on behalf of a customer
    let orderUser = req.user._id;
    const metadata = {};
    if (req.user.role === 'waiter') {
        // waiter can set a customer id in body (customerId) or default to anonymous
        if (req.body.customerId) {
            orderUser = req.body.customerId;
        }
        metadata.takenBy = req.user._id;
        if (req.body.tableNumber) metadata.tableNumber = req.body.tableNumber;
    }

    const orderPayload = Object.assign({
        shippingInfo,
        orderItems,
        paymentInfo,
        totalPrice,
        paidAt: Date.now(),
        user: orderUser,
        customerName: customerName || req.user.name,
        orderType: orderType || "in-house",
    }, metadata);

    // Add delivery partner info if order is from delivery partner
    if (orderType === "delivery-partner" && deliveryPartner) {
        orderPayload.deliveryPartner = deliveryPartner;
        if (deliveryPartnerOrderId) {
            orderPayload.deliveryPartnerOrderId = deliveryPartnerOrderId;
        }
    }

    const order = await Order.create(orderPayload);

    // notify: if waiter created the order, notify all admins (kitchen) - send asynchronously
    if (req.user.role === 'waiter') {
        const User = require('../models/userModel');
        // Send notifications in background (don't await)
        User.find({ role: 'admin' }).select('email name').then((admins) => {
            const templateId = process.env.SENDGRID_ORDER_TEMPLATEID;
            if (templateId && admins.length > 0) {
                admins.forEach((admin) => {
                    sendEmail({
                        email: admin.email,
                        templateId,
                        data: {
                            name: admin.name || 'Chef',
                            waiterName: req.user.name,
                            shippingInfo,
                            orderItems,
                            totalPrice,
                            customerName: orderPayload.customerName,
                            oid: order._id,
                        }
                    }).catch((emailErr) => {
                        console.error('SendGrid Error (non-blocking):', emailErr.message);
                    });
                });
            }
        }).catch((err) => {
            console.error('Error fetching admins:', err.message);
        });
    } else {
        // Send customer confirmation email - send asynchronously
        const templateId = process.env.SENDGRID_ORDER_TEMPLATEID;
        if (templateId) {
            sendEmail({
                email: req.user.email,
                templateId,
                data: {
                    name: req.user.name,
                    shippingInfo,
                    orderItems,
                    totalPrice,
                    customerName: orderPayload.customerName,
                    oid: order._id,
                }
            }).catch((emailErr) => {
                console.error('SendGrid Error (non-blocking):', emailErr.message);
            });
        }
    }

    res.status(201).json({
        success: true,
        order,
    });
});

// Get Orders taken by waiter
exports.getOrdersByWaiter = asyncErrorHandler(async (req, res, next) => {
    // only waiter should call this (route will enforce)
    const orders = await Order.find({ takenBy: req.user._id })
        .sort({ createdAt: -1 })
        .populate('user', 'name email')
        .populate('takenBy', 'name email')
        .populate('deliveryPartner', 'name logo');

    res.status(200).json({
        success: true,
        orders,
    });
});

// Get Single Order Details
exports.getSingleOrderDetails = asyncErrorHandler(async (req, res, next) => {

    const order = await Order.findById(req.params.id)
        .populate("user", "name email")
        .populate('deliveryPartner', 'name logo');

    if (!order) {
        return next(new ErrorHandler("Order Not Found", 404));
    }

    res.status(200).json({
        success: true,
        order,
    });
});


// Get Logged In User Orders
exports.myOrders = asyncErrorHandler(async (req, res, next) => {

    const orders = await Order.find({ user: req.user._id })
        .populate('deliveryPartner', 'name logo');

    if (!orders) {
        return next(new ErrorHandler("Order Not Found", 404));
    }

    res.status(200).json({
        success: true,
        orders,
    });
});


// Get All Orders ---ADMIN
exports.getAllOrders = asyncErrorHandler(async (req, res, next) => {

    const orders = await Order.find()
        .populate('user', 'name email')
        .populate('takenBy', 'name email')
        .populate('deliveryPartner', 'name logo')
        .sort({ createdAt: -1 });

    if (!orders) {
        return next(new ErrorHandler("Order Not Found", 404));
    }

    let totalAmount = 0;
    orders.forEach((order) => {
        totalAmount += order.totalPrice;
    });

    res.status(200).json({
        success: true,
        orders,
        totalAmount,
    });
});

// Accept Order ---ADMIN (first step before editing)
exports.acceptOrder = asyncErrorHandler(async (req, res, next) => {

    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new ErrorHandler("Order Not Found", 404));
    }

    if (order.isAccepted) {
        return next(new ErrorHandler("Order already accepted", 400));
    }

    order.isAccepted = true;
    order.acceptedBy = req.user._id;
    order.acceptedAt = Date.now();

    await order.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
        message: "Order accepted successfully",
        order,
    });
});

// Update Order Status ---ADMIN (only after acceptance)
exports.updateOrder = asyncErrorHandler(async (req, res, next) => {

    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new ErrorHandler("Order Not Found", 404));
    }

    // Check if order is accepted before allowing status updates
    if (!order.isAccepted) {
        return next(new ErrorHandler("Please accept the order first", 400));
    }

    if (order.orderStatus === "Completed" || order.orderStatus === "Delivered") {
        return next(new ErrorHandler("Order already completed", 400));
    }

    const manualTotalPrice = req.body.totalPrice !== undefined ? Number(req.body.totalPrice) : undefined;

    if (manualTotalPrice !== undefined && Number.isNaN(manualTotalPrice)) {
        return next(new ErrorHandler("Please provide a valid total price", 400));
    }

    if (manualTotalPrice !== undefined && manualTotalPrice >= 50000) {
        return next(new ErrorHandler("Final price must be less than 50000", 400));
    }

    const requestedStatus = req.body.status === "Shipped"
        ? (order.orderType === "delivery-partner" ? "Delivered" : "Completed")
        : req.body.status;

    if (requestedStatus === "Completed" || requestedStatus === "Delivered") {
        if (manualTotalPrice !== undefined) {
            order.totalPrice = manualTotalPrice;
        }

        order.deliveredAt = Date.now();
        order.orderItems.forEach(async (i) => {
            await updateStock(i.product, i.quantity)
        });
    }

    order.orderStatus = requestedStatus;

    await order.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
        message: "Order status updated",
        order,
    });
});

async function updateStock(id, quantity) {
    const product = await Product.findById(id);
    product.stock -= quantity;
    await product.save({ validateBeforeSave: false });
}

// Delete Order ---ADMIN
exports.deleteOrder = asyncErrorHandler(async (req, res, next) => {

    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new ErrorHandler("Order Not Found", 404));
    }

    await order.remove();

    res.status(200).json({
        success: true,
    });
});