import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import ProtectedRoute from "../../components/user/ProtectedRoute";
import paymentApi from "../../api/paymentApi";
import useToast from "../../hooks/useToast";
import { formatCurrency } from "../../utils/formatCurrency";

function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();

  const transaction = location.state?.transaction || null;

  const [paymentMethod, setPaymentMethod] = useState(3);
  const [couponCode, setCouponCode] = useState("");
  const [couponPreview, setCouponPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [validating, setValidating] = useState(false);

  const totalAmount = Number(transaction?.totalAmount || 0);

  const finalAmount = useMemo(() => {
    if (!couponPreview?.isValid) return totalAmount;
    return couponPreview.finalAmount ?? totalAmount;
  }, [couponPreview, totalAmount]);

  const handleValidateCoupon = async () => {
    if (!couponCode.trim()) return;

    try {
      setValidating(true);
      const response = await paymentApi.validateCoupon({
        transactionId: transaction?.id,
        couponCode: couponCode.trim(),
      });
      setCouponPreview(response.data);
    } catch (error) {
      toast.error(
        "Validation failed",
        error.response?.data?.message || "Could not validate coupon.",
      );
    } finally {
      setValidating(false);
    }
  };

  const handleConfirm = async () => {
    if (!transaction?.id) return;

    try {
      setSubmitting(true);

      const response = await paymentApi.create({
        transactionId: transaction.id,
        paymentMethod,
        couponCode: couponPreview?.isValid ? couponCode.trim() : null,
      });

      toast.success("Payment created", "Payment flow completed successfully.");
      navigate("/payments/history", {
        replace: true,
        state: { payment: response.data },
      });
    } catch (error) {
      toast.error(
        "Payment failed",
        error.response?.data?.message || "Could not process payment.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <section className="page-shell">
          <div className="container payment-layout">
            <div className="card payment-box">
              <h1 className="page-title">Payment</h1>
              <p className="page-subtitle">
                Confirm and complete your payment for this transaction.
              </p>

              {!transaction ? (
                <p className="muted">No transaction selected.</p>
              ) : (
                <>
                  <div className="form-group">
                    <label>Payment Method</label>
                    <select
                      className="input"
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(Number(e.target.value))}
                    >
                      <option value={1}>Cash On Delivery</option>
                      <option value={2}>Bank Transfer</option>
                      <option value={3}>Online Demo</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Coupon Code</label>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <input
                        className="input"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Enter coupon code"
                      />
                      <button
                        className="btn btn-outline"
                        onClick={handleValidateCoupon}
                        disabled={validating}
                      >
                        {validating ? "Checking..." : "Validate"}
                      </button>
                    </div>
                  </div>

                  {couponPreview && (
                    <div className="card coupon-preview-card">
                      <p>
                        <strong>Valid:</strong>{" "}
                        {couponPreview.isValid ? "Yes" : "No"}
                      </p>
                      <p>
                        <strong>Discount:</strong>{" "}
                        {couponPreview.discountAmount
                          ? formatCurrency(couponPreview.discountAmount)
                          : "0 PLN"}
                      </p>
                      <p>
                        <strong>Final:</strong> {formatCurrency(finalAmount)}
                      </p>
                    </div>
                  )}

                  <div className="checkout-summary card">
                    <h3>Checkout Summary</h3>
                    <p>
                      Product: <strong>{transaction.productTitle}</strong>
                    </p>
                    <p>
                      Original Total:{" "}
                      <strong>{formatCurrency(totalAmount)}</strong>
                    </p>
                    <p>
                      Final Total:{" "}
                      <strong>{formatCurrency(finalAmount)}</strong>
                    </p>
                  </div>

                  <button
                    className="btn btn-primary"
                    onClick={handleConfirm}
                    disabled={submitting}
                  >
                    {submitting ? "Processing..." : "Confirm Payment"}
                  </button>
                </>
              )}
            </div>
          </div>
        </section>
      </MainLayout>
    </ProtectedRoute>
  );
}

export default PaymentPage;
