import React, { useEffect, useState } from "react";

const dineInShippingInfo = {
  address: "Dine-in order",
  city: "Restaurant floor",
  state: "Kitchen queue",
  country: "In-house",
  pincode: 0,
  phoneNo: 0,
};

const TakeOrder = ({ onOrderPlaced }) => {
  const [customerName, setCustomerName] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [orderType, setOrderType] = useState("in-house");
  const [deliveryPartner, setDeliveryPartner] = useState("");
  const [deliveryPartnerOrderId, setDeliveryPartnerOrderId] = useState("");
  const [productQuery, setProductQuery] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [products, setProducts] = useState([]);
  const [deliveryPartners, setDeliveryPartners] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingPartners, setLoadingPartners] = useState(false);
  const [productError, setProductError] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let isActive = true;

    const fetchProducts = async () => {
      setLoadingProducts(true);
      try {
        const backendUrl = process.env.REACT_APP_BACK_URL || "http://localhost:3000";
        const res = await fetch(`${backendUrl}/api/v1/products`);
        const data = await res.json();

        if (!isActive) return;

        if (res.ok) {
          setProducts(data.products || []);
          setProductError("");
        } else {
          setProductError(data.message || "Unable to load menu items");
        }
      } catch (err) {
        if (isActive) {
          setProductError(err.message || "Unable to load menu items");
        }
      } finally {
        if (isActive) setLoadingProducts(false);
      }
    };

    fetchProducts();
    return () => (isActive = false);
  }, []);

  // Fetch delivery partners when order type is set to delivery-partner
  useEffect(() => {
    if (orderType !== "delivery-partner") return;

    let isActive = true;

    const fetchPartners = async () => {
      setLoadingPartners(true);
      try {
        const backendUrl = process.env.REACT_APP_BACK_URL || "http://localhost:3000";
        const res = await fetch(`${backendUrl}/api/v1/delivery-partners`);
        const data = await res.json();

        if (!isActive) return;

        if (res.ok) {
          setDeliveryPartners(data.deliveryPartners || []);
        }
      } catch (err) {
        console.error("Error loading delivery partners:", err.message);
      } finally {
        if (isActive) setLoadingPartners(false);
      }
    };

    fetchPartners();
    return () => (isActive = false);
  }, [orderType]);

  const normalizeText = (value) => value.trim().toLowerCase();

  const resolveProductFromQuery = (productsList, query) => {
    const normalizedQuery = normalizeText(query);

    if (!normalizedQuery) {
      return null;
    }

    const exactMatch = productsList.find((product) => normalizeText(product.name) === normalizedQuery);
    if (exactMatch) {
      return exactMatch;
    }

    const partialMatches = productsList.filter((product) => normalizeText(product.name).includes(normalizedQuery));
    if (partialMatches.length === 1) {
      return partialMatches[0];
    }

    return null;
  };

  const selectedProduct = resolveProductFromQuery(products, productQuery);
  const resolvedProductId = selectedProduct?._id || "";
  const totalPrice = Number(selectedProduct?.price || 0) * Number(quantity || 0);
  const selectedPartner = deliveryPartners.find((partner) => partner._id === deliveryPartner);

  const submitOrder = async (e) => {
    e.preventDefault();

    // For in-house orders: customer name and table number are required
    if (orderType === "in-house") {
      if (!customerName.trim() || !tableNumber.trim() || !resolvedProductId) {
        setMessage("Customer name, table number, and product are required for in-house orders.");
        return;
      }
    } else {
      // For delivery partner and store delivery: only product is required
      if (!resolvedProductId) {
        setMessage("Please type or select a valid product.");
        return;
      }
      
      if (orderType === "delivery-partner" && !deliveryPartner) {
        setMessage("Please select a delivery partner.");
        return;
      }
    }

    if (!selectedProduct) {
      setMessage("Pick a valid product.");
      return;
    }

    const normalizedQuantity = Number(quantity || 0);
    if (!normalizedQuantity || normalizedQuantity < 1) {
      setMessage("Quantity must be at least 1.");
      return;
    }

    setSubmitting(true);
    setMessage("");

    const payload = {
      shippingInfo: dineInShippingInfo,
      orderItems: [
        {
          product: resolvedProductId,
          quantity: normalizedQuantity,
          name: selectedProduct.name,
          price: Number(selectedProduct.price || 0),
          image: selectedProduct.images?.[0]?.url || "",
        },
      ],
      paymentInfo: {
        id: `cash-${Date.now()}`,
        status: "Cash",
      },
      totalPrice,
      orderType,
    };

    // Add customer name and table number only for in-house orders
    if (orderType === "in-house") {
      payload.customerName = customerName.trim();
      payload.tableNumber = tableNumber.trim();
    } else {
      payload.customerName = `${orderType} Order - ${Date.now()}`;
      payload.tableNumber = "";
    }

    // Add delivery partner info if applicable
    if (orderType === "delivery-partner") {
      payload.deliveryPartner = deliveryPartner;
      if (deliveryPartnerOrderId.trim()) {
        payload.deliveryPartnerOrderId = deliveryPartnerOrderId.trim();
      }
    }

    try {
      const backendUrl = process.env.REACT_APP_BACK_URL || "http://localhost:3000";
      const res = await fetch(`${backendUrl}/api/v1/order/new`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Order placed.");
        setCustomerName("");
        setTableNumber("");
        setOrderType("in-house");
        setDeliveryPartner("");
        setDeliveryPartnerOrderId("");
        setProductQuery("");
        setQuantity(1);
        onOrderPlaced && onOrderPlaced();
      } else {
        setMessage(data.message || "Failed to place order");
      }
    } catch (err) {
      setMessage(err.message || "Network error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-3xl border border-white/60 bg-white/90 shadow-[0_20px_60px_rgba(15,23,42,0.12)] backdrop-blur p-5 sm:p-6">

      <div className="mb-5">
        <p className="text-xs uppercase tracking-[0.35em] text-indigo-700">
          Kitchen ticket
        </p>
        <h3 className="mt-1 text-2xl font-semibold text-slate-900">
          Take order
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          Capture customer, table, order type, and item in one flow.
        </p>
      </div>

      {message && (
        <div className="mb-4 rounded-2xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-indigo-800">
          {message}
        </div>
      )}

      <form onSubmit={submitOrder} className="space-y-4">

        <div className="grid gap-4 sm:grid-cols-2">
          <input
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder={orderType === "in-house" ? "Customer name *" : "Customer name (not required)"}
            disabled={orderType !== "in-house"}
            className={`rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-indigo-500 focus:bg-white outline-none ${
              orderType !== "in-house" ? "opacity-50 cursor-not-allowed" : ""
            }`}
          />

          <input
            value={tableNumber}
            onChange={(e) => setTableNumber(e.target.value)}
            placeholder={orderType === "in-house" ? "Table number *" : "Table number (not required)"}
            disabled={orderType !== "in-house"}
            className={`rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-indigo-500 focus:bg-white outline-none ${
              orderType !== "in-house" ? "opacity-50 cursor-not-allowed" : ""
            }`}
          />
        </div>

        {/* Order Type Selection */}
        <select
          value={orderType}
          onChange={(e) => {
            setOrderType(e.target.value);
            setDeliveryPartner("");
            setDeliveryPartnerOrderId("");
          }}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-indigo-500 focus:bg-white outline-none"
        >
          <option value="in-house">In-House Order</option>
          <option value="delivery-partner">Delivery Partner Order</option>
          <option value="store-delivery">Store Delivery</option>
        </select>

        {/* Delivery Partner Selection (shown only for delivery-partner orders) */}
        {orderType === "delivery-partner" && (
          <>
            <select
              value={deliveryPartner}
              onChange={(e) => setDeliveryPartner(e.target.value)}
              disabled={loadingPartners}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-indigo-500 focus:bg-white outline-none disabled:opacity-60"
            >
              <option value="">
                {loadingPartners ? "Loading partners..." : "Select delivery partner"}
              </option>
              {deliveryPartners.map((partner) => (
                <option key={partner._id} value={partner._id}>
                  {partner.name}
                </option>
              ))}
            </select>

            {selectedPartner && (
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                {selectedPartner.logo && (
                  <img
                    src={selectedPartner.logo}
                    alt={selectedPartner.name}
                    className="h-12 w-12 rounded-lg object-cover"
                  />
                )}
                <div className="flex-1">
                  <p className="font-semibold text-sm">{selectedPartner.name}</p>
                  {selectedPartner.description && (
                    <p className="text-xs text-slate-500">{selectedPartner.description}</p>
                  )}
                </div>
              </div>
            )}

            <input
              type="text"
              value={deliveryPartnerOrderId}
              onChange={(e) => setDeliveryPartnerOrderId(e.target.value)}
              placeholder="Delivery partner order ID (optional)"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-indigo-500 focus:bg-white outline-none"
            />
          </>
        )}

        <input
          type="text"
          value={productQuery}
          onChange={(e) => setProductQuery(e.target.value)}
          placeholder={loadingProducts ? "Loading products..." : "Type product name"}
          disabled={loadingProducts}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-indigo-500 focus:bg-white outline-none disabled:opacity-60"
        />

        <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div>
            <p className="text-sm font-semibold text-slate-900">
              {selectedProduct ? selectedProduct.name : "Type a valid product name"}
            </p>
            <p className="text-xs text-slate-500">
              {selectedProduct ? `Rs. ${selectedProduct.price}` : "The name must match a product in the menu"}
            </p>
          </div>

          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-20 rounded-xl border border-slate-200 px-2 py-1 text-sm focus:border-indigo-500 outline-none"
          />
        </div>

        <div className="flex justify-between bg-slate-900 text-white px-4 py-3 rounded-xl">
          <span>Total</span>
          <strong>Rs. {totalPrice}</strong>
        </div>

        <button
          disabled={submitting}
          className="w-full rounded-2xl bg-indigo-600 py-3 text-white font-semibold hover:bg-indigo-700 disabled:opacity-60"
        >
          {submitting ? "Sending..." : "Send to kitchen"}
        </button>
      </form>
    </div>
  );
};

export default TakeOrder;