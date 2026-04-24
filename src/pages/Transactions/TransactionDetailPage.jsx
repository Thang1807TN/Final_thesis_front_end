import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import ProtectedRoute from "../../components/user/ProtectedRoute";
import transactionApi from "../../api/transactionApi";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import OrderTimeline from "../../components/transaction/OrderTimeline";
import ReviewSellerForm from "../../components/transaction/ReviewSellerForm";
import useToast from "../../hooks/useToast";
import { formatCurrency } from "../../utils/formatCurrency";

function TransactionDetailPage() {
  const { id } = useParams();
  const toast = useToast();

  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    const loadTransaction = async () => {
      try {
        const response = await transactionApi.getById(id);
        setTransaction(response.data);
      } catch {
        setTransaction(null);
      } finally {
        setLoading(false);
      }
    };

    loadTransaction();
  }, [id]);

  const handleComplete = async () => {
    try {
      const response = await transactionApi.complete(id);
      setTransaction(response.data);
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
        <section className="page-shell">
          <div className="container">
            {loading ? (
              <Loader text="Loading transaction..." />
            ) : !transaction ? (
              <EmptyState
                title="Transaction not found"
                description="The requested transaction could not be loaded."
              />
            ) : (
              <div className="transaction-detail-layout">
                <div className="card transaction-detail-card">
                  <div className="page-title-row">
                    <div>
                      <h1 className="page-title">Transaction Details</h1>
                      <p className="page-subtitle">
                        Detailed information about this order flow.
                      </p>
                    </div>

                    <span
                      className={`transaction-status-badge transaction-status-${String(transaction.status).toLowerCase()}`}
                    >
                      {transaction.status}
                    </span>
                  </div>

                  <div className="transaction-detail-grid">
                    <div>
                      <span className="muted">Product</span>
                      <strong>{transaction.productTitle}</strong>
                    </div>
                    <div>
                      <span className="muted">Buyer</span>
                      <strong>{transaction.buyerName}</strong>
                    </div>
                    <div>
                      <span className="muted">Seller</span>
                      <strong>{transaction.sellerName}</strong>
                    </div>
                    <div>
                      <span className="muted">Total Amount</span>
                      <strong>{formatCurrency(transaction.totalAmount)}</strong>
                    </div>
                    <div>
                      <span className="muted">Payment Status</span>
                      <strong>{transaction.paymentStatus || "N/A"}</strong>
                    </div>
                    <div>
                      <span className="muted">Created At</span>
                      <strong>
                        {new Date(transaction.createdAt).toLocaleString()}
                      </strong>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      flexWrap: "wrap",
                      marginTop: "18px",
                    }}
                  >
                    {!transaction.isPaid && (
                      <a href="/payments" className="btn btn-outline">
                        Go to Payment
                      </a>
                    )}

                    {transaction.status === "Paid" && (
                      <button
                        className="btn btn-primary"
                        onClick={handleComplete}
                      >
                        Mark Completed
                      </button>
                    )}

                    {transaction.status === "Completed" && (
                      <button
                        className="btn btn-outline"
                        onClick={() => setShowReviewForm((prev) => !prev)}
                      >
                        {showReviewForm ? "Hide Review Form" : "Review Seller"}
                      </button>
                    )}
                  </div>
                </div>

                <OrderTimeline transactionId={transaction.id} />

                {transaction.status === "Completed" && showReviewForm && (
                  <ReviewSellerForm
                    transactionId={transaction.id}
                    onSuccess={() => {
                      setShowReviewForm(false);
                      toast.success("Reviewed", "Seller review submitted.");
                    }}
                  />
                )}
              </div>
            )}
          </div>
        </section>
      </MainLayout>
    </ProtectedRoute>
  );
}

export default TransactionDetailPage;
