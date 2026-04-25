import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import MainLayout from "../../layouts/MainLayout";
import ProtectedRoute from "../../components/user/ProtectedRoute";
import paymentApi from "../../api/paymentApi";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import useToast from "../../hooks/useToast";
import { formatCurrency } from "../../utils/formatCurrency";

function PaymentHistoryPage() {
  const { t } = useTranslation();
  const toast = useToast();

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPayments = async () => {
      try {
        const response = await paymentApi.getMine();
        setPayments(response.data || []);
      } catch (error) {
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
        {loading ? (
          <Loader text={t("payment.loadingPayments", "Loading payments...")} />
        ) : (
          <section className="page-shell">
            <div className="container">
              <h1 className="page-title">
                {t("payment.historyTitle", "Payment History")}
              </h1>

              {payments.length === 0 ? (
                <EmptyState
                  title={t("payment.noPayments", "No payments yet")}
                  description={t(
                    "payment.noPaymentsDescription",
                    "There are no payment records available for your account.",
                  )}
                />
              ) : (
                <div className="payment-history-list">
                  {payments.map((payment) => (
                    <div key={payment.id} className="card payment-history-card">
                      <div className="payment-history-top">
                        <div>
                          <h3>{payment.productTitle}</h3>
                          <p className="muted">
                            {t("payment.buyer", "Buyer")}: {payment.buyerName}
                          </p>
                          <p className="muted">
                            {t("payment.seller", "Seller")}:{" "}
                            {payment.sellerName}
                          </p>
                        </div>

                        <div
                          className={`payment-status-badge payment-status-${String(
                            payment.paymentStatus,
                          ).toLowerCase()}`}
                        >
                          {payment.paymentStatus}
                        </div>
                      </div>

                      <div className="payment-history-grid">
                        <div>
                          <span className="muted">
                            {t("payment.transaction", "Transaction")}
                          </span>
                          <strong>#{payment.transactionId}</strong>
                        </div>

                        <div>
                          <span className="muted">
                            {t("payment.method", "Method")}
                          </span>
                          <strong>{payment.paymentMethod}</strong>
                        </div>

                        <div>
                          <span className="muted">
                            {t("payment.amount", "Amount")}
                          </span>
                          <strong>{formatCurrency(payment.amount)}</strong>
                        </div>

                        <div>
                          <span className="muted">
                            {t("payment.paidAt", "Paid At")}
                          </span>
                          <strong>
                            {payment.paidAt
                              ? new Date(payment.paidAt).toLocaleString()
                              : t("payment.notPaidYet", "Not paid yet")}
                          </strong>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}
      </MainLayout>
    </ProtectedRoute>
  );
}

export default PaymentHistoryPage;
