import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import ProtectedRoute from "../../components/user/ProtectedRoute";
import paymentApi from "../../api/paymentApi";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import useToast from "../../hooks/useToast";
import { formatCurrency } from "../../utils/formatCurrency";

function PaymentHistoryPage() {
  const toast = useToast();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPayments = async () => {
      try {
        const response = await paymentApi.getMine();
        setPayments(response.data || []);
      } catch (error) {
        toast.error("Load failed", "Could not load payment history.");
      } finally {
        setLoading(false);
      }
    };

    loadPayments();
  }, []);

  return (
    <ProtectedRoute>
      <MainLayout>
        {loading ? (
          <Loader text="Loading payments..." />
        ) : (
          <section className="page-shell">
            <div className="container">
              <h1 className="page-title">Payment History</h1>

              {payments.length === 0 ? (
                <EmptyState
                  title="No payments yet"
                  description="There are no payment records available for your account."
                />
              ) : (
                <div className="payment-history-list">
                  {payments.map((payment) => (
                    <div key={payment.id} className="card payment-history-card">
                      <div className="payment-history-top">
                        <div>
                          <h3>{payment.productTitle}</h3>
                          <p className="muted">Buyer: {payment.buyerName}</p>
                          <p className="muted">Seller: {payment.sellerName}</p>
                        </div>
                        <div
                          className={`payment-status-badge payment-status-${String(payment.paymentStatus).toLowerCase()}`}
                        >
                          {payment.paymentStatus}
                        </div>
                      </div>

                      <div className="payment-history-grid">
                        <div>
                          <span className="muted">Transaction</span>
                          <strong>#{payment.transactionId}</strong>
                        </div>
                        <div>
                          <span className="muted">Method</span>
                          <strong>{payment.paymentMethod}</strong>
                        </div>
                        <div>
                          <span className="muted">Amount</span>
                          <strong>{formatCurrency(payment.amount)}</strong>
                        </div>
                        <div>
                          <span className="muted">Paid At</span>
                          <strong>
                            {payment.paidAt
                              ? new Date(payment.paidAt).toLocaleString()
                              : "Not paid yet"}
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
