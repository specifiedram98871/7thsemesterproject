const axios = require("axios");
const asyncErrorHandler = require("../middlewares/asyncErrorHandler");
const Payment = require("../models/paymentModel"); // Assuming you have a Payment model defined

// const ErrorHandler = require("../utils/errorHandler");
const { v4: uuidv4 } = require("uuid");

//initate payment
const processPayment = asyncErrorHandler(async (req, res, next) => {
  try {
    const { itemId, totalPrice, name } = req.body;
    const formData = {
      return_url:`${req.protocol}://${req.get("host")}/api/v1/payment/complete`,
      website_url: `${process.env.WEBSITE_URL}`,
      amount: totalPrice * 100, //paisa
      purchase_order_id: "oid" + uuidv4(),
      order_id: itemId + uuidv4(),
      purchase_order_name: name,
    };

    const khaltiApiKey = process.env.KHALTI_KEY;
    // console.log(khaltiApiKey);
    // Configure request headers
    const config = {
      headers: {
        Authorization: `Key ${khaltiApiKey}`,
        "Content-Type": "application/json",
      },
    };
    const khaltiapi = process.env.KHALTI_GATEWAY_URL;
    // Send payment initiation request to Khalti
    const response = await axios.post(
      `${process.env.KHALTI_GATEWAY_URL}/api/v2/epayment/initiate/`,
      formData,
      config
    );

    // Handle the response from the payment provider
    res.status(200).json({
      ...formData,
      paymentMethod: "Khalti",
      response: response.data,
    });
  } catch (error) {
    console.error("Error processing payment:", error);
    res.status(500).json({ error: "Failed to process payment" });
  }
});

//verify payment
const KhaltiResponse = async (req, res) => {
  const { pidx, amount, purchase_order_id, transaction_id } = req.query;

  try {
    const paymentInfo = await verifyKhaltiPayment(pidx);

    if (
      paymentInfo.status !== "Completed" ||
      paymentInfo.transaction_id !== transaction_id ||
      Number(paymentInfo.total_amount) !== Number(amount)
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
        paymentInfo,
      });
    }

    const paymentData = {
      resultStatus: paymentInfo.status,
      transactionId: transaction_id,
      pidx: pidx || uuidv4(),
      orderId: purchase_order_id,
      txnAmount: (amount / 100).toString(),
      txnType: "Wallet_payment",
      gatewayName: "Khalti",
      paymentMode: "Online",
      refundAmt: (paymentInfo.refund_amount || 0).toString(),
      txnDate: new Date().toISOString(), // Correct date format
    };

    await addPayment(paymentData); // Save to database
    // res.json({
    //   success: true,
    //   paymentData: paymentInfo,
    //  })
    res.redirect(`${process.env.WEBSITE_URL}/order/${purchase_order_id}`); //redirect to order page
  } catch (error) {
    console.error("Error processing Khalti response:", error);
    res
      .status(500)
      .json({ success: false, message: "Error processing payment" });
  }
};

const verifyKhaltiPayment = async (pidx) => {
  try {
    const headersList = {
      Accept: "application/json",
      Authorization: `Key ${process.env.KHALTI_KEY}`,
      "Content-Type": "application/json",
    };

    const bodyContent = JSON.stringify({ pidx });
    const reqOptions = {
      url: `${process.env.KHALTI_GATEWAY_URL}/api/v2/epayment/lookup/`,
      method: "POST",
      headers: headersList,
      data: bodyContent,
    };

    const response = await axios.request(reqOptions);
    return response.data;
    // console.log('response', response.data);
  } catch (error) {
    console.error("Error verifying Khalti payment:", error);
    throw error;
  }
};
const addPayment = async (data) => {
  // console.log("data", data);
  try {
    //check if payment already exists
    if (await Payment.findOne({ transactionId: data.transactionId })) {
      return console.log("Payment already exists");
    }
    await Payment.create(data);
    console.log("Payment added successfully");
  } catch (error) {
    console.log("Payment failed");
    console.log(error.message);
  }
};

const getPaymentStatus = async (req, res) => {
  const orderId = req.params.id;

  const payment = await Payment.findOne({ orderId: orderId });

  if (!payment) {
    return res.status(404).json({ error: "Payment not found" });
  }

  const txn = {
    id: payment.transactionId,
    status: payment.resultStatus,
  };

  res.status(200).json({
    success: true,
    txn,
  });
};

module.exports = {
  processPayment,
  KhaltiResponse,
  verifyKhaltiPayment,
  getPaymentStatus,
};
