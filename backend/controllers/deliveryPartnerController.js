const DeliveryPartner = require('../models/deliveryPartnerModel');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/asyncErrorHandler');

// Create delivery partner (admin only)
exports.createDeliveryPartner = catchAsyncErrors(async (req, res, next) => {
    const { name, logo, apiKey, apiUrl, email, phoneNo, address, city, state, pincode, description } = req.body;

    const deliveryPartner = await DeliveryPartner.create({
        name,
        logo,
        apiKey: apiKey || "",
        apiUrl: apiUrl || "",
        email: email || "",
        phoneNo: phoneNo || "",
        address: address || "",
        city: city || "",
        state: state || "",
        pincode: pincode || "",
        description: description || "",
    });

    res.status(201).json({
        success: true,
        message: "Delivery partner created successfully",
        deliveryPartner,
    });
});

// Get all delivery partners
exports.getAllDeliveryPartners = catchAsyncErrors(async (req, res, next) => {
    const deliveryPartners = await DeliveryPartner.find({ isActive: true });

    res.status(200).json({
        success: true,
        count: deliveryPartners.length,
        deliveryPartners,
    });
});

// Get single delivery partner
exports.getDeliveryPartner = catchAsyncErrors(async (req, res, next) => {
    const deliveryPartner = await DeliveryPartner.findById(req.params.id);

    if (!deliveryPartner) {
        return next(new ErrorHandler("Delivery partner not found", 404));
    }

    res.status(200).json({
        success: true,
        deliveryPartner,
    });
});

// Update delivery partner (admin only)
exports.updateDeliveryPartner = catchAsyncErrors(async (req, res, next) => {
    let deliveryPartner = await DeliveryPartner.findById(req.params.id);

    if (!deliveryPartner) {
        return next(new ErrorHandler("Delivery partner not found", 404));
    }

    const updateData = { ...req.body };
    
    deliveryPartner = await DeliveryPartner.findByIdAndUpdate(
        req.params.id,
        updateData,
        {
            new: true,
            runValidators: true,
        }
    );

    res.status(200).json({
        success: true,
        message: "Delivery partner updated successfully",
        deliveryPartner,
    });
});

// Toggle delivery partner active status (admin only)
exports.toggleDeliveryPartnerStatus = catchAsyncErrors(async (req, res, next) => {
    let deliveryPartner = await DeliveryPartner.findById(req.params.id);

    if (!deliveryPartner) {
        return next(new ErrorHandler("Delivery partner not found", 404));
    }

    deliveryPartner.isActive = !deliveryPartner.isActive;
    await deliveryPartner.save();

    res.status(200).json({
        success: true,
        message: `Delivery partner ${deliveryPartner.isActive ? "activated" : "deactivated"} successfully`,
        deliveryPartner,
    });
});

// Delete delivery partner (admin only)
exports.deleteDeliveryPartner = catchAsyncErrors(async (req, res, next) => {
    const deliveryPartner = await DeliveryPartner.findByIdAndDelete(req.params.id);

    if (!deliveryPartner) {
        return next(new ErrorHandler("Delivery partner not found", 404));
    }

    res.status(200).json({
        success: true,
        message: "Delivery partner deleted successfully",
    });
});
