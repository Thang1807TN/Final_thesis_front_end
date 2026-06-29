import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import MainLayout from "../../layouts/MainLayout";
import ProtectedRoute from "../../components/user/ProtectedRoute";
import paymentApi from "../../api/paymentApi";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import useToast from "../../hooks/useToast";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";

function PaymentHistoryPage() {
  const { t } = useTranslation();
  const toast = useToast();

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const getPaymentStatusText = (status) => {
    const map = {
      1: t("status.pending", "Pending"),
      2: t("status.paid", "Paid"),
      3: t("status.failed", "Failed"),
      4: t("status.refunded", "Refunded"),
      Pending: t("status.pending", "Pending"),
      Paid: t("status.paid", "Paid"),
      Failed: t("status.failed", "Failed"),
      Refunded: t("status.refunded", "Refunded"),
    };

    return map[status] || t("status.pending", "Pending");
  };

  const getPaymentStatusClass = (status) => {
    const map = {
      1: "pending",
      2: "paid",
      3: "failed",
      4: "refunded",
      Pending: "pending",
      Paid: "paid",
      Failed: "failed",
      Refunded: "refunded",
    };

    return map[status] || "pending";
  };

  const getPaymentMethodText = (method) => {
    const map = {
      1: t("paymentMethod.cashOnDelivery", "Cash On Delivery"),
      2: t("paymentMethod.bankTransfer", "Bank Transfer"),
      3: t("paymentMethod.onlineDemo", "Online Demo"),
      CashOnDelivery: t("paymentMethod.cashOnDelivery", "Cash On Delivery"),
      BankTransfer: t("paymentMethod.bankTransfer", "Bank Transfer"),
      OnlineDemo: t("paymentMethod.onlineDemo", "Online Demo"),
    };

    return map[method] || method || "N/A";
  };

  useEffect(() => {
    const loadPayments = async () => {
      try {
        const response = await paymentApi.getMine();
        setPayments(response.data || []);
      } catch {
        toast.error(
          t("toast.loadFailed", "Load failed"),
          t("payment.historyLoadFailed", "Could not load payment history."),
        );
      } finally {
        setLoading(false);
      }
    };

    loadPayments();
  }, [t, toast]);

  return (
    <ProtectedRoute>
      <MainLayout>
        <section className="page-shell payment-history-page">
          <div className="container">
            <div className="payment-history-hero card">
              <div>
                <span className="payment-history-badge">
                  {t("payment.center", "Payment Center")}
                </span>

                <h1 className="page-title">
                  {t("payment.historyTitle", "Payment History")}
                </h1>

                <p className="page-subtitle">
                  {t(
                    "payment.historySubtitle",
                    "Review your payment records, methods, and payment statuses.",
                  )}
                </p>
              </div>
            </div>

            {loading ? (
              <Loader
                text={t("payment.loadingPayments", "Loading payments...")}
              />
            ) : payments.length === 0 ? (
              <EmptyState
                title={t("payment.noPayments", "No payments yet")}
                description={t(
                  "payment.noPaymentsDescription",
                  "There are no payment records available for your account.",
                )}
              />
            ) : (
              <div className="payment-history-list">
                {payments.map((payment) => {
                  const statusText = getPaymentStatusText(
                    payment.paymentStatus,
                  );
                  const statusClass = getPaymentStatusClass(
                    payment.paymentStatus,
                  );

                  return (
                    <div key={payment.id} className="card payment-history-card">
                      <div className="payment-history-top">
                        <div>
                          <span
                            className={`payment-status-badge payment-status-${statusClass}`}
                          >
                            {statusText}
                          </span>

                          <h3>{payment.productTitle}</h3>

                          <div className="payment-history-people">
                            <p>
                              <span>{t("payment.buyer", "Buyer")}</span>
                              <strong>{payment.buyerName}</strong>
                            </p>

                            <p>
                              <span>{t("payment.seller", "Seller")}</span>
                              <strong>{payment.sellerName}</strong>
                            </p>
                          </div>
                        </div>

                        <div className="payment-history-amount">
                          <span>{t("payment.amount", "Amount")}</span>
                          <strong>{formatCurrency(payment.amount)}</strong>
                          <small>{formatDate(payment.createdAt)}</small>
                        </div>
                      </div>

                      <div className="payment-history-grid">
                        <div>
                          <span>{t("payment.transaction", "Transaction")}</span>
                          <strong>#{payment.transactionId}</strong>
                        </div>

                        <div>
                          <span>{t("payment.method", "Method")}</span>
                          <strong>
                            {getPaymentMethodText(payment.paymentMethod)}
                          </strong>
                        </div>

                        <div>
                          <span>{t("payment.reference", "Reference")}</span>
                          <strong>
                            {payment.externalTransactionCode || "—"}
                          </strong>
                        </div>

                        <div>
                          <span>{t("payment.paidAt", "Paid At")}</span>
                          <strong>
                            {payment.paidAt
                              ? formatDate(payment.paidAt)
                              : t("payment.notPaidYet", "Not paid yet")}
                          </strong>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </MainLayout>
    </ProtectedRoute>
  );
}

export default PaymentHistoryPage;
