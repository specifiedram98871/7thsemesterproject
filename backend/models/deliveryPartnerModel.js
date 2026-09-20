const mongoose = require('mongoose');

const deliveryPartnerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter delivery partner name"],
        trim: true,
        unique: true,
    },
    logo: {
        type: String,
        required: [true, "Please upload partner logo"],
    },
    apiKey: {
        type: String,
        default: "",
    },
    apiUrl: {
        type: String,
        default: "",
    },
    email: {
        type: String,
    },
    phoneNo: {
        type: String,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    address: {
        type: String,
    },
    city: {
        type: String,
    },
    state: {
        type: String,
    },
    pincode: {
        type: String,
    },
    description: {
        type: String,
        default: "",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("DeliveryPartner", deliveryPartnerSchema);
