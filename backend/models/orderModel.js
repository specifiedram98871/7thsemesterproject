const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    shippingInfo: {
        address: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        },
        pincode: {
            type: Number,
            required: true
        },
        phoneNo: {
            type: Number,
            required: true
        },
    },
    orderItems: [
        {
            name: {
                type: String,
                required: true
            },
            price: {
                type: Number,
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            image: {
                type: String,
                required: true
            },
            product: {
                type: mongoose.Schema.ObjectId,
                ref: "Product",
                required: true
            },
        },
    ],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    customerName: {
        type: String,
    },
    paymentInfo: {
        id: {
            type: String,
            required: true
        },
        status: {
            type: String,
            required: true
        },
    },
    paidAt: {
        type: Date,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0
    },
    orderStatus: {
        type: String,
        required: true,
        default: "Processing",
    },
    // Admin acceptance workflow
    isAccepted: {
        type: Boolean,
        default: false,
    },
    acceptedBy: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
    },
    acceptedAt: Date,
    // waiter who took the order (useful for restaurants)
    takenBy: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
    },
    // optional table number for dine-in
    tableNumber: {
        type: String,
    },
    // Order type: in-house, delivery-partner, or store-delivery
    orderType: {
        type: String,
        enum: ["in-house", "delivery-partner", "store-delivery"],
        default: "in-house",
    },
    // Delivery partner reference (if orderType is "delivery-partner")
    deliveryPartner: {
        type: mongoose.Schema.ObjectId,
        ref: "DeliveryPartner",
    },
    // Tracking ID from delivery partner
    deliveryPartnerOrderId: {
        type: String,
    },
    deliveredAt: Date,
    shippedAt: Date,
    createdAt: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model("Order", orderSchema);