import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import ProtectedRoute from "../../components/user/ProtectedRoute";
import transactionApi from "../../api/transactionApi";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import useToast from "../../hooks/useToast";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";

const TRANSACTION_STATUS = {
  Pending: 1,
  Confirmed: 2,
  Paid: 3,
  Completed: 4,
  Cancelled: 5,
};

const getTransactionStatusText = (status) => {
  const map = {
    1: "Pending",
    2: "Confirmed",
    3: "Paid",
    4: "Completed",
    5: "Cancelled",
    Pending: "Pending",
    Confirmed: "Confirmed",
    Paid: "Paid",
    Completed: "Completed",
    Cancelled: "Cancelled",
  };

  return map[status] || "Pending";
};

function AdminTransactionsPage() {
  const toast = useToast();

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");

  const loadTransactions = async () => {
    try {
      const response = await transactionApi.getAll();
      setTransactions(response.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Load failed", "Could not load transactions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const filteredTransactions = useMemo(() => {
    if (!statusFilter) return transactions;

    return transactions.filter(
      (item) => getTransactionStatusText(item.status) === statusFilter,
    );
  }, [transactions, statusFilter]);

  const summary = useMemo(() => {
    return {
      total: transactions.length,
      pending: transactions.filter(
        (x) => getTransactionStatusText(x.status) === "Pending",
      ).length,
      paid: transactions.filter(
        (x) => getTransactionStatusText(x.status) === "Paid",
      ).length,
      completed: transactions.filter(
        (x) => getTransactionStatusText(x.status) === "Completed",
      ).length,
      revenue: transactions
        .filter(
          (x) =>
            getTransactionStatusText(x.status) === "Paid" ||
            getTransactionStatusText(x.status) === "Completed",
        )
        .reduce(
          (sum, item) => sum + Number(item.paidAmount || item.totalAmount || 0),
          0,
        ),
    };
  }, [transactions]);

  const handleStatusChange = async (id, statusText, currentStatus) => {
    const currentStatusText = getTransactionStatusText(currentStatus);

    if (statusText === "Completed" && currentStatusText !== "Paid") {
      toast.error(
        "Cannot complete",
        "Transaction must be Paid before it can be Completed.",
      );
      return;
    }

    try {
      setUpdatingId(id);

      const response = await transactionApi.updateStatus(id, {
        status: TRANSACTION_STATUS[statusText],
      });

      setTransactions((prev) =>
        prev.map((item) => (item.id === id ? response.data : item)),
      );

      toast.success("Updated", "Transaction status updated successfully.");
    } catch (error) {
      console.error(error);
      toast.error(
        "Update failed",
        error.response?.data?.message || "Could not update transaction.",
      );
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <ProtectedRoute adminOnly>
      <AdminLayout>
        <section className="page-shell admin-transactions-page">
          <div className="container">
            <div className="admin-payments-hero card">
              <div>
                <span className="admin-page-badge">Transaction Management</span>

                <h1 className="page-title">Admin Transactions</h1>

                <p className="page-subtitle">
                  Manage all marketplace transactions and update their status.
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
                  <option value="Confirmed">Confirmed</option>
                  <option value="Paid">Paid</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {loading ? (
              <Loader text="Loading transactions..." />
            ) : transactions.length === 0 ? (
              <EmptyState
                title="No transactions"
                description="There are no transactions in the system."
              />
            ) : (
              <>
                <div className="admin-payment-summary-grid">
                  <div className="card admin-payment-summary-card">
                    <span>Total Transactions</span>
                    <strong>{summary.total}</strong>
                  </div>

                  <div className="card admin-payment-summary-card warning">
                    <span>Pending</span>
                    <strong>{summary.pending}</strong>
                  </div>

                  <div className="card admin-payment-summary-card success">
                    <span>Completed</span>
                    <strong>{summary.completed}</strong>
                  </div>

                  <div className="card admin-payment-summary-card revenue">
                    <span>Revenue</span>
                    <strong>{formatCurrency(summary.revenue)}</strong>
                  </div>
                </div>

                {filteredTransactions.length === 0 ? (
                  <EmptyState
                    title="No matching transactions"
                    description="Try changing the selected transaction status."
                  />
                ) : (
                  <div className="admin-payment-list">
                    {filteredTransactions.map((transaction) => {
                      const statusText = getTransactionStatusText(
                        transaction.status,
                      );
                      const statusKey = statusText.toLowerCase();

                      return (
                        <div
                          key={transaction.id}
                          className="card admin-payment-card"
                        >
                          <div className="admin-payment-card-top">
                            <div>
                              <span
                                className={`transaction-status-badge transaction-status-${statusKey}`}
                              >
                                {statusText}
                              </span>

                              <h3>{transaction.productTitle}</h3>

                              <div className="admin-payment-people">
                                <p>
                                  <span>Buyer</span>
                                  <strong>{transaction.buyerName}</strong>
                                </p>

                                <p>
                                  <span>Seller</span>
                                  <strong>{transaction.sellerName}</strong>
                                </p>
                              </div>
                            </div>

                            <div className="admin-payment-amount">
                              <span>Total</span>
                              <strong>
                                {formatCurrency(transaction.totalAmount)}
                              </strong>
                              <small>{formatDate(transaction.createdAt)}</small>
                            </div>
                          </div>

                          <div className="admin-payment-grid">
                            <div>
                              <span>Transaction</span>
                              <strong>#{transaction.id}</strong>
                            </div>

                            <div>
                              <span>Product</span>
                              <strong>#{transaction.productId}</strong>
                            </div>

                            <div>
                              <span>Payment</span>
                              <strong>
                                {transaction.paymentStatus || "No Payment"}
                              </strong>
                            </div>

                            <div>
                              <span>Paid Amount</span>
                              <strong>
                                {transaction.paidAmount
                                  ? formatCurrency(transaction.paidAmount)
                                  : "—"}
                              </strong>
                            </div>
                          </div>

                          <div className="admin-payment-actions">
                            <select
                              className="input"
                              value={statusText}
                              disabled={updatingId === transaction.id}
                              onChange={(e) =>
                                handleStatusChange(
                                  transaction.id,
                                  e.target.value,
                                  transaction.status,
                                )
                              }
                            >
                              <option value="Pending">Pending</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Paid">Paid</option>
                              <option value="Completed">Completed</option>
                              <option value="Cancelled">Cancelled</option>
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

export default AdminTransactionsPage;
