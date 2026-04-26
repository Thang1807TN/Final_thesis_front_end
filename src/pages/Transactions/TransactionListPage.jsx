import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import MainLayout from "../../layouts/MainLayout";
import ProtectedRoute from "../../components/user/ProtectedRoute";
import TransactionCard from "../../components/transaction/TransactionCard";
import transactionApi from "../../api/transactionApi";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import useToast from "../../hooks/useToast";
import OrderTimeline from "../../components/transaction/OrderTimeline";

function TransactionListPage() {
  const { t } = useTranslation();
  const toast = useToast();

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const response = await transactionApi.getMine();
      setTransactions(response.data || []);
    } catch (error) {
      console.error(error);
      toast.error(
        t("toast.loadFailed", "Load failed"),
        t("transactions.loadFailed", "Could not load transactions."),
      );
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

      toast.success(
        t("transactions.completed", "Completed"),
        t("transactions.markedCompleted", "Transaction marked as completed."),
      );

      await loadTransactions();
    } catch (error) {
      toast.error(
        t("transactions.completeFailed", "Complete failed"),
        error.response?.data?.message ||
          t("transactions.couldNotComplete", "Could not complete transaction."),
      );
    }
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <section className="page-shell">
          <div className="container">
            <div className="page-title-row">
              <div>
                <h1 className="page-title">
                  {t("transactions.title", "Transactions")}
                </h1>

                <p className="page-subtitle">
                  {t(
                    "transactions.subtitle",
                    "Monitor your current transaction records and statuses.",
                  )}
                </p>
              </div>
            </div>

            {loading ? (
              <Loader
                text={t("transactions.loading", "Loading transactions...")}
              />
            ) : transactions.length === 0 ? (
              <EmptyState
                title={t("transactions.emptyTitle", "No transactions yet")}
                description={t(
                  "transactions.emptyDescription",
                  "You do not have any recorded transactions.",
                )}
              />
            ) : (
              <div className="transaction-list">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="transaction-list-item">
                    <TransactionCard
                      transaction={transaction}
                      onCompleted={handleComplete}
                    />

                    <div className="transaction-timeline-wrap">
                      <OrderTimeline transactionId={transaction.id} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </MainLayout>
    </ProtectedRoute>
  );
}

export default TransactionListPage;
