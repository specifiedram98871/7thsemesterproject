const express = require('express');
const {
    createDeliveryPartner,
    getAllDeliveryPartners,
    getDeliveryPartner,
    updateDeliveryPartner,
    deleteDeliveryPartner,
    toggleDeliveryPartnerStatus
} = require('../controllers/deliveryPartnerController');
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

const router = express.Router();

// Public: Get all active delivery partners (for dropdown)
router.route('/delivery-partners').get(getAllDeliveryPartners);

// Public: Get single delivery partner
router.route('/delivery-partner/:id').get(getDeliveryPartner);

// Admin only: Create delivery partner
router.route('/admin/delivery-partner/new').post(
    isAuthenticatedUser,
    authorizeRoles("admin"),
    createDeliveryPartner
);

// Admin only: Update delivery partner
router.route('/admin/delivery-partner/:id').put(
    isAuthenticatedUser,
    authorizeRoles("admin"),
    updateDeliveryPartner
);

// Admin only: Toggle delivery partner status
router.route('/admin/delivery-partner/:id/toggle').put(
    isAuthenticatedUser,
    authorizeRoles("admin"),
    toggleDeliveryPartnerStatus
);

// Admin only: Delete delivery partner
router.route('/admin/delivery-partner/:id').delete(
    isAuthenticatedUser,
    authorizeRoles("admin"),
    deleteDeliveryPartner
);

module.exports = router;
