import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import ProtectedRoute from "../../components/user/ProtectedRoute";
import paymentApi from "../../api/paymentApi";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import useToast from "../../hooks/useToast";
import { formatCurrency } from "../../utils/formatCurrency";

function AdminPaymentsPage() {
  const toast = useToast();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");

  const loadPayments = async () => {
    try {
      const response = await paymentApi.getMine();
      setPayments(response.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, []);

  const filteredPayments = useMemo(() => {
    if (!statusFilter) return payments;
    return payments.filter(
      (item) => String(item.paymentStatus) === statusFilter,
    );
  }, [payments, statusFilter]);

  const handleStatusChange = async (id, paymentStatus) => {
    try {
      const response = await paymentApi.updateStatus(id, { paymentStatus });
      setPayments((prev) =>
        prev.map((item) => (item.id === id ? response.data : item)),
      );
      toast.success("Updated", "Payment status updated successfully.");
    } catch (error) {
      toast.error(
        "Update failed",
        error.response?.data?.message || "Could not update payment.",
      );
    }
  };

  return (
    <ProtectedRoute adminOnly>
      <AdminLayout>
        <section className="page-shell">
          <div className="container">
            <div className="page-title-row">
              <div>
                <h1 className="page-title">Admin Payments</h1>
                <p className="page-subtitle">
                  Manage payment records in the system.
                </p>
              </div>

              <div className="form-group" style={{ minWidth: 220 }}>
                <label>Status Filter</label>
                <select
                  className="input"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">All</option>
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                  <option value="Failed">Failed</option>
                  <option value="Refunded">Refunded</option>
                </select>
              </div>
            </div>

            {loading ? (
              <Loader text="Loading payments..." />
            ) : filteredPayments.length === 0 ? (
              <EmptyState
                title="No payments"
                description="There are no payment records."
              />
            ) : (
              <div className="payment-history-list">
                {filteredPayments.map((payment) => (
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
                        <span className="muted">Reference</span>
                        <strong>
                          {payment.externalTransactionCode || "—"}
                        </strong>
                      </div>
                    </div>

                    <div style={{ marginTop: "14px", maxWidth: 220 }}>
                      <select
                        className="input"
                        value={payment.paymentStatus}
                        onChange={(e) =>
                          handleStatusChange(payment.id, e.target.value)
                        }
                      >
                        <option value="Pending">Pending</option>
                        <option value="Paid">Paid</option>
                        <option value="Failed">Failed</option>
                        <option value="Refunded">Refunded</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </AdminLayout>
    </ProtectedRoute>
  );
}

export default AdminPaymentsPage;
