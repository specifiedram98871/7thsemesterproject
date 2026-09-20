const express = require('express');
const router = express.Router();
const { ask } = require('../controllers/ragController');
const { isAuthenticatedUser } = require('../middlewares/auth');

// POST /api/v1/rag
router.post('/rag', isAuthenticatedUser, ask);

module.exports = router;
