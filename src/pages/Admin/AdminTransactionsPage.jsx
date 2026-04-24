import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import ProtectedRoute from "../../components/user/ProtectedRoute";
import transactionApi from "../../api/transactionApi";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import useToast from "../../hooks/useToast";

function AdminTransactionsPage() {
  const toast = useToast();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const response = await transactionApi.getAll();
        setTransactions(response.data || []);
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      const response = await transactionApi.updateStatus(id, { status });
      setTransactions((prev) =>
        prev.map((item) => (item.id === id ? response.data : item)),
      );
      toast.success("Updated", "Transaction status updated.");
    } catch (error) {
      toast.error(
        "Update failed",
        error.response?.data?.message || "Could not update transaction.",
      );
    }
  };

  return (
    <ProtectedRoute adminOnly>
      <AdminLayout>
        <section className="page-shell">
          <div className="container">
            <h1 className="page-title">Admin Transactions</h1>

            {loading ? (
              <Loader text="Loading transactions..." />
            ) : transactions.length === 0 ? (
              <EmptyState
                title="No transactions"
                description="There are no transactions in the system."
              />
            ) : (
              <div className="admin-table">
                <div className="admin-table-head admin-table-row admin-table-row-5">
                  <div>Product</div>
                  <div>Buyer</div>
                  <div>Seller</div>
                  <div>Status</div>
                  <div>Action</div>
                </div>

                {transactions.map((item) => (
                  <div
                    key={item.id}
                    className="admin-table-row admin-table-row-5"
                  >
                    <div>{item.productTitle}</div>
                    <div>{item.buyerName}</div>
                    <div>{item.sellerName}</div>
                    <div>{item.status}</div>
                    <div>
                      <select
                        className="input"
                        value={item.status}
                        onChange={(e) =>
                          handleStatusChange(item.id, e.target.value)
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
                ))}
              </div>
            )}
          </div>
        </section>
      </AdminLayout>
    </ProtectedRoute>
  );
}

export default AdminTransactionsPage;
