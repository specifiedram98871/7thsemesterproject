const { type } = require("express/lib/response");
const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  resultStatus: {
    type: String,
    required: true,
  },

  transactionId: {
    type: String,
    required: true,
  },
  pidx: {
    type: String,
    required: true,
  },
  orderId: {
    type: String,
    required: true,
  },
  txnAmount: {
    type: String,
    required: true,
  },
  txnType: {
    type: String,
    required: true,
  },
  gatewayName: {
    type: String,
    required: true,
  },
  paymentMode: {
    type: String,
    required: true,
  },
  refundAmt: {
    type: String,
    required: true,
  },
  txnDate: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Payment", paymentSchema);
