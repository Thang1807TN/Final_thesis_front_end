import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import MainLayout from "../../layouts/MainLayout";
import ProtectedRoute from "../../components/user/ProtectedRoute";
import paymentApi from "../../api/paymentApi";
import useToast from "../../hooks/useToast";
import { formatCurrency } from "../../utils/formatCurrency";

function PaymentPage() {
  const { t } = useTranslation();
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
        t("payment.validationFailed", "Validation failed"),
        error.response?.data?.message ||
          t("payment.couldNotValidateCoupon", "Could not validate coupon."),
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

      toast.success(
        t("payment.paymentCreated", "Payment created"),
        t("payment.paymentCompleted", "Payment flow completed successfully."),
      );

      navigate("/payments/history", {
        replace: true,
        state: { payment: response.data },
      });
    } catch (error) {
      toast.error(
        t("payment.paymentFailed", "Payment failed"),
        error.response?.data?.message ||
          t("payment.couldNotProcessPayment", "Could not process payment."),
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <section className="page-shell payment-page">
          <div className="container payment-layout">
            <div className="payment-box">
              <div className="payment-header">
                <span className="payment-badge">
                  {t("payment.secureCheckout", "Secure checkout")}
                </span>

                <h1 className="page-title">{t("payment.title", "Payment")}</h1>

                <p className="page-subtitle">
                  {t(
                    "payment.subtitle",
                    "Confirm and complete your payment for this transaction.",
                  )}
                </p>
              </div>

              {!transaction ? (
                <div className="payment-empty">
                  <h3>
                    {t("payment.noTransaction", "No transaction selected")}
                  </h3>
                  <p>
                    {t(
                      "payment.noTransactionDescription",
                      "Please choose a transaction before making a payment.",
                    )}
                  </p>
                </div>
              ) : (
                <div className="payment-content">
                  <div className="payment-form">
                    <div className="form-group">
                      <label className="input-label">
                        {t("payment.paymentMethod", "Payment Method")}
                      </label>

                      <select
                        className="input payment-input"
                        value={paymentMethod}
                        onChange={(e) =>
                          setPaymentMethod(Number(e.target.value))
                        }
                      >
                        <option value={1}>
                          {t(
                            "paymentMethod.cashOnDelivery",
                            "Cash On Delivery",
                          )}
                        </option>
                        <option value={2}>
                          {t("paymentMethod.bankTransfer", "Bank Transfer")}
                        </option>
                        <option value={3}>
                          {t("paymentMethod.onlineDemo", "Online Demo")}
                        </option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="input-label">
                        {t("payment.couponCode", "Coupon Code")}
                      </label>

                      <div className="coupon-row">
                        <input
                          className="input payment-input"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          placeholder={t(
                            "payment.enterCouponCode",
                            "Enter coupon code",
                          )}
                        />

                        <button
                          type="button"
                          className="btn btn-outline coupon-btn"
                          onClick={handleValidateCoupon}
                          disabled={validating}
                        >
                          {validating
                            ? t("payment.checking", "Checking...")
                            : t("payment.validate", "Validate")}
                        </button>
                      </div>
                    </div>

                    {couponPreview && (
                      <div
                        className={`coupon-preview-card ${
                          couponPreview.isValid ? "valid" : "invalid"
                        }`}
                      >
                        <p>
                          <span>{t("payment.valid", "Valid")}</span>
                          <strong>
                            {couponPreview.isValid
                              ? t("common.yes", "Yes")
                              : t("common.no", "No")}
                          </strong>
                        </p>

                        <p>
                          <span>{t("payment.discount", "Discount")}</span>
                          <strong>
                            {couponPreview.discountAmount
                              ? formatCurrency(couponPreview.discountAmount)
                              : "0 PLN"}
                          </strong>
                        </p>

                        <p>
                          <span>{t("payment.final", "Final")}</span>
                          <strong>{formatCurrency(finalAmount)}</strong>
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="checkout-summary">
                    <h3>{t("payment.checkoutSummary", "Checkout Summary")}</h3>

                    <div className="summary-row">
                      <span>{t("payment.product", "Product")}</span>
                      <strong>{transaction.productTitle}</strong>
                    </div>

                    <div className="summary-row">
                      <span>
                        {t("payment.originalTotal", "Original Total")}
                      </span>
                      <strong>{formatCurrency(totalAmount)}</strong>
                    </div>

                    <div className="summary-row total">
                      <span>{t("payment.finalTotal", "Final Total")}</span>
                      <strong>{formatCurrency(finalAmount)}</strong>
                    </div>

                    <button
                      type="button"
                      className="btn btn-primary confirm-payment-btn"
                      onClick={handleConfirm}
                      disabled={submitting}
                    >
                      {submitting
                        ? t("payment.processing", "Processing...")
                        : t("payment.confirmPayment", "Confirm Payment")}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </MainLayout>
    </ProtectedRoute>
  );
}

export default PaymentPage;
