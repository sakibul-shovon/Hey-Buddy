import React, { useState } from "react";
import axios from "axios";

const Payment = () => {
  const [amount, setAmount] = useState(0); // Payment amount
  const [orderId, setOrderId] = useState(""); // Unique order ID
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(""); // Error message

  // Handle payment initiation
  const handlePayment = async () => {
    if (!amount || !orderId) {
      setError("Please enter a valid amount and order ID.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Call your backend API to create a bKash payment
      const response = await axios.post("/api/create-payment", {
        amount: amount,
        orderId: orderId,
      });

      // Redirect to the bKash payment page
      if (response.data.bkashURL) {
        window.location.href = response.data.bkashURL;
      } else {
        setError("Failed to initiate payment. Please try again.");
      }
    } catch (error) {
      console.error("Payment error:", error);
      setError("An error occurred while processing your payment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        bKash Payment
      </h1>

      {/* Payment Form */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <div className="space-y-4">
          {/* Amount Input */}
          <div>
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Amount (BDT)
            </label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:text-gray-200"
              placeholder="Enter amount"
              required
            />
          </div>

          {/* Order ID Input */}
          <div>
            <label
              htmlFor="orderId"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Order ID
            </label>
            <input
              type="text"
              id="orderId"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:text-gray-200"
              placeholder="Enter order ID"
              required
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-red-500 dark:text-red-400 text-sm">{error}</div>
          )}

          {/* Payment Button */}
          <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full bg-teal-600 dark:bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-700 dark:hover:bg-teal-400 transition-colors duration-200 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            {loading ? "Processing..." : "Pay with bKash"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Payment;