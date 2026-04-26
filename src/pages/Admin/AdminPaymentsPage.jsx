import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import ProtectedRoute from "../../components/user/ProtectedRoute";
import paymentApi from "../../api/paymentApi";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import useToast from "../../hooks/useToast";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";

const PAYMENT_STATUS = {
  Pending: 1,
  Paid: 2,
  Failed: 3,
  Refunded: 4,
};

const getPaymentStatusText = (status) => {
  const map = {
    1: "Pending",
    2: "Paid",
    3: "Failed",
    4: "Refunded",
    Pending: "Pending",
    Paid: "Paid",
    Failed: "Failed",
    Refunded: "Refunded",
  };

  return map[status] || "Pending";
};

const getPaymentMethodText = (method) => {
  const map = {
    1: "Cash On Delivery",
    2: "Bank Transfer",
    3: "Online Demo",
    CashOnDelivery: "Cash On Delivery",
    BankTransfer: "Bank Transfer",
    OnlineDemo: "Online Demo",
  };

  return map[method] || method || "N/A";
};

function AdminPaymentsPage() {
  const toast = useToast();

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");

  const loadPayments = async () => {
    try {
      const response = await paymentApi.getMine();
      setPayments(response.data || []);
    } catch {
      toast.error("Load failed", "Could not load payments.");
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
      (item) => getPaymentStatusText(item.paymentStatus) === statusFilter,
    );
  }, [payments, statusFilter]);

  const summary = useMemo(() => {
    return {
      total: payments.length,
      pending: payments.filter(
        (x) => getPaymentStatusText(x.paymentStatus) === "Pending",
      ).length,
      paid: payments.filter(
        (x) => getPaymentStatusText(x.paymentStatus) === "Paid",
      ).length,
      revenue: payments
        .filter((x) => getPaymentStatusText(x.paymentStatus) === "Paid")
        .reduce((sum, item) => sum + Number(item.amount || 0), 0),
    };
  }, [payments]);

  const handleStatusChange = async (id, statusText) => {
    try {
      setUpdatingId(id);

      const response = await paymentApi.updateStatus(id, {
        paymentStatus: PAYMENT_STATUS[statusText],
      });

      setPayments((prev) =>
        prev.map((item) => (item.id === id ? response.data : item)),
      );

      toast.success("Updated", "Payment status updated successfully.");
    } catch (error) {
      console.error(error);
      toast.error(
        "Update failed",
        error.response?.data?.message || "Could not update payment.",
      );
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <ProtectedRoute adminOnly>
      <AdminLayout>
        <section className="page-shell admin-payments-page">
          <div className="container">
            <div className="admin-payments-hero card">
              <div>
                <span className="admin-page-badge">Payment Management</span>
                <h1 className="page-title">Admin Payments</h1>
                <p className="page-subtitle">
                  Manage payment records in the system.
                </p>
              </div>

              <div className="admin-payment-filter">
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
            ) : payments.length === 0 ? (
              <EmptyState
                title="No payments"
                description="There are no payment records."
              />
            ) : (
              <>
                <div className="admin-payment-summary-grid">
                  <div className="card admin-payment-summary-card">
                    <span>Total Payments</span>
                    <strong>{summary.total}</strong>
                  </div>

                  <div className="card admin-payment-summary-card warning">
                    <span>Pending</span>
                    <strong>{summary.pending}</strong>
                  </div>

                  <div className="card admin-payment-summary-card success">
                    <span>Paid</span>
                    <strong>{summary.paid}</strong>
                  </div>

                  <div className="card admin-payment-summary-card revenue">
                    <span>Revenue</span>
                    <strong>{formatCurrency(summary.revenue)}</strong>
                  </div>
                </div>

                {filteredPayments.length === 0 ? (
                  <EmptyState
                    title="No matching payments"
                    description="Try changing the selected payment status."
                  />
                ) : (
                  <div className="admin-payment-list">
                    {filteredPayments.map((payment) => {
                      const statusText = getPaymentStatusText(
                        payment.paymentStatus,
                      );
                      const statusKey = statusText.toLowerCase();

                      return (
                        <div
                          key={payment.id}
                          className="card admin-payment-card"
                        >
                          <div className="admin-payment-card-top">
                            <div>
                              <span
                                className={`payment-status-badge payment-status-${statusKey}`}
                              >
                                {statusText}
                              </span>

                              <h3>{payment.productTitle}</h3>

                              <div className="admin-payment-people">
                                <p>
                                  <span>Buyer</span>
                                  <strong>{payment.buyerName}</strong>
                                </p>

                                <p>
                                  <span>Seller</span>
                                  <strong>{payment.sellerName}</strong>
                                </p>
                              </div>
                            </div>

                            <div className="admin-payment-amount">
                              <span>Amount</span>
                              <strong>{formatCurrency(payment.amount)}</strong>
                              <small>{formatDate(payment.createdAt)}</small>
                            </div>
                          </div>

                          <div className="admin-payment-grid">
                            <div>
                              <span>Transaction</span>
                              <strong>#{payment.transactionId}</strong>
                            </div>

                            <div>
                              <span>Method</span>
                              <strong>
                                {getPaymentMethodText(payment.paymentMethod)}
                              </strong>
                            </div>

                            <div>
                              <span>Reference</span>
                              <strong>
                                {payment.externalTransactionCode || "—"}
                              </strong>
                            </div>

                            <div>
                              <span>Paid At</span>
                              <strong>
                                {payment.paidAt
                                  ? formatDate(payment.paidAt)
                                  : "—"}
                              </strong>
                            </div>
                          </div>

                          <div className="admin-payment-actions">
                            <select
                              className="input"
                              value={statusText}
                              disabled={updatingId === payment.id}
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
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </AdminLayout>
    </ProtectedRoute>
  );
}

export default AdminPaymentsPage;
