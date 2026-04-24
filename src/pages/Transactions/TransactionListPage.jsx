import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import ProtectedRoute from "../../components/user/ProtectedRoute";
import TransactionCard from "../../components/transaction/TransactionCard";
import transactionApi from "../../api/transactionApi";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import useToast from "../../hooks/useToast";
import OrderTimeline from "../../components/transaction/OrderTimeline";

function TransactionListPage() {
  const toast = useToast();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadTransactions = async () => {
    try {
      const response = await transactionApi.getMine();
      setTransactions(response.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const handleComplete = async (transactionId) => {
    try {
      const response = await transactionApi.complete(transactionId);
      setTransactions((prev) =>
        prev.map((item) => (item.id === transactionId ? response.data : item)),
      );
      toast.success("Completed", "Transaction marked as completed.");
    } catch (error) {
      toast.error(
        "Complete failed",
        error.response?.data?.message || "Could not complete transaction.",
      );
    }
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        {loading ? (
          <Loader text="Loading transactions..." />
        ) : (
          <section className="page-shell">
            <div className="container">
              <h1 className="page-title">Transactions</h1>
              <p className="page-subtitle">
                Monitor your current transaction records and statuses.
              </p>

              {transactions.length === 0 ? (
                <EmptyState
                  title="No transactions yet"
                  description="You do not have any recorded transactions."
                />
              ) : (
                <div className="transaction-list">
                  {transactions.map((transaction) => (
                    <div key={transaction.id}>
                      <TransactionCard
                        transaction={transaction}
                        onCompleted={handleComplete}
                      />
                      <OrderTimeline transactionId={transaction.id} />
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

export default TransactionListPage;
