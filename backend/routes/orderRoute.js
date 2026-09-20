const express = require('express');
const { newOrder, getSingleOrderDetails, myOrders, getAllOrders, updateOrder, deleteOrder, getOrdersByWaiter, acceptOrder } = require('../controllers/orderController');
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

const router = express.Router();

router.route('/order/new').post(isAuthenticatedUser, newOrder);
router.route('/order/:id').get(isAuthenticatedUser, getSingleOrderDetails);
router.route('/orders/me').get(isAuthenticatedUser, myOrders);

// waiter: view orders they took
router.route('/waiter/orders').get(isAuthenticatedUser, authorizeRoles("waiter"), getOrdersByWaiter);

router.route('/admin/orders').get(isAuthenticatedUser, authorizeRoles("admin"), getAllOrders);

// admin: accept order (must accept before editing)
router.route('/admin/order/:id/accept').put(isAuthenticatedUser, authorizeRoles("admin"), acceptOrder);

// admin: update order status (only after accepting)
router.route('/admin/order/:id')
    .put(isAuthenticatedUser, authorizeRoles("admin"), updateOrder)
    .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteOrder);

module.exports = router;