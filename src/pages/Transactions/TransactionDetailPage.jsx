import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import MainLayout from "../../layouts/MainLayout";
import ProtectedRoute from "../../components/user/ProtectedRoute";
import transactionApi from "../../api/transactionApi";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import OrderTimeline from "../../components/transaction/OrderTimeline";
import ReviewSellerForm from "../../components/transaction/ReviewSellerForm";
import useToast from "../../hooks/useToast";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";

function TransactionDetailPage() {
  const { t } = useTranslation();
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

  const paymentSummary = useMemo(() => {
    const originalAmount = Number(
      transaction?.totalAmount ?? transaction?.amount ?? 0,
    );

    const finalAmount = Number(
      transaction?.paidAmount ?? transaction?.finalAmount ?? originalAmount,
    );

    const discountAmount = Number(
      transaction?.discountAmount ?? Math.max(0, originalAmount - finalAmount),
    );

    const discountPercent =
      originalAmount > 0 && discountAmount > 0
        ? Math.round((discountAmount / originalAmount) * 100)
        : 0;

    const couponCode =
      transaction?.appliedCouponCode ||
      transaction?.couponCode ||
      transaction?.payment?.appliedCouponCode ||
      null;

    return {
      originalAmount,
      finalAmount,
      discountAmount,
      discountPercent,
      couponCode,
      hasDiscount: discountAmount > 0,
    };
  }, [transaction]);

  const handleComplete = async () => {
    try {
      const response = await transactionApi.complete(id);
      setTransaction(response.data);

      toast.success(
        t("transactions.completed", "Completed"),
        t("transactions.markedCompleted", "Transaction marked as completed."),
      );
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
            {loading ? (
              <Loader
                text={t("transactions.loadingOne", "Loading transaction...")}
              />
            ) : !transaction ? (
              <EmptyState
                title={t("transactions.notFound", "Transaction not found")}
                description={t(
                  "transactions.notFoundDescription",
                  "The requested transaction could not be loaded.",
                )}
              />
            ) : (
              <div className="transaction-detail-shell">
                <div className="card transaction-detail-card">
                  <div className="transaction-detail-header">
                    <div>
                      <div className="transaction-detail-badge-row">
                        <span
                          className={`transaction-status-badge ${String(
                            transaction.status || "pending",
                          ).toLowerCase()}`}
                        >
                          {transaction.status}
                        </span>

                        {paymentSummary.hasDiscount && (
                          <span className="discount-applied-badge">
                            {t("payment.discountApplied", "Discount applied")}
                            {paymentSummary.discountPercent > 0 &&
                              ` -${paymentSummary.discountPercent}%`}
                          </span>
                        )}
                      </div>

                      <h1 className="page-title">
                        {t("transactions.detailTitle", "Transaction Details")}
                      </h1>

                      <p className="page-subtitle">
                        {t(
                          "transactions.detailSubtitle",
                          "Detailed information about this order flow.",
                        )}
                      </p>
                    </div>

                    <Link to="/transactions" className="btn btn-outline">
                      {t(
                        "transactions.backToTransactions",
                        "Back to Transactions",
                      )}
                    </Link>
                  </div>

                  <div className="transaction-detail-grid">
                    <div className="transaction-info-panel">
                      <h3>
                        {t(
                          "transactions.productInformation",
                          "Product Information",
                        )}
                      </h3>

                      <div className="transaction-info-row">
                        <span>{t("transactions.product", "Product")}</span>
                        <strong>{transaction.productTitle}</strong>
                      </div>

                      <div className="transaction-info-row">
                        <span>{t("transactions.seller", "Seller")}</span>
                        <strong>{transaction.sellerName}</strong>
                      </div>

                      <div className="transaction-info-row">
                        <span>
                          {t("transactions.paymentStatus", "Payment Status")}
                        </span>
                        <strong>{transaction.paymentStatus || "N/A"}</strong>
                      </div>

                      {paymentSummary.couponCode && (
                        <div className="transaction-info-row">
                          <span>{t("coupon.code", "Coupon Code")}</span>
                          <strong className="coupon-code-pill">
                            {paymentSummary.couponCode}
                          </strong>
                        </div>
                      )}
                    </div>

                    <div className="transaction-info-panel">
                      <h3>
                        {t(
                          "transactions.orderInformation",
                          "Order Information",
                        )}
                      </h3>

                      <div className="transaction-info-row">
                        <span>{t("transactions.buyer", "Buyer")}</span>
                        <strong>{transaction.buyerName}</strong>
                      </div>

                      <div className="transaction-info-row">
                        <span>
                          {t("payment.originalTotal", "Original Amount")}
                        </span>
                        <strong>
                          {formatCurrency(paymentSummary.originalAmount)}
                        </strong>
                      </div>

                      {paymentSummary.hasDiscount && (
                        <>
                          <div className="transaction-info-row discount-row">
                            <span>{t("payment.discount", "Discount")}</span>
                            <strong>
                              -{formatCurrency(paymentSummary.discountAmount)}
                            </strong>
                          </div>

                          <div className="transaction-info-row">
                            <span>
                              {t("payment.discountPercent", "Discount Percent")}
                            </span>
                            <strong className="discount-percent-pill">
                              -{paymentSummary.discountPercent}%
                            </strong>
                          </div>
                        </>
                      )}

                      <div className="transaction-info-row">
                        <span>{t("payment.finalTotal", "Final Amount")}</span>
                        <strong className="transaction-detail-price">
                          {formatCurrency(paymentSummary.finalAmount)}
                        </strong>
                      </div>

                      <div className="transaction-info-row">
                        <span>{t("transactions.createdAt", "Created At")}</span>
                        <strong>{formatDate(transaction.createdAt)}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="transaction-detail-actions">
                    {!transaction.isPaid && (
                      <Link
                        to="/payments"
                        state={{ transaction }}
                        className="btn btn-primary"
                      >
                        {t("transactions.goToPayment", "Go to Payment")}
                      </Link>
                    )}

                    {transaction.status === "Paid" && (
                      <button
                        className="btn btn-primary"
                        onClick={handleComplete}
                      >
                        {t("transactions.markCompleted", "Mark Completed")}
                      </button>
                    )}

                    {transaction.status === "Completed" && (
                      <button
                        className="btn btn-outline"
                        onClick={() => setShowReviewForm((prev) => !prev)}
                      >
                        {showReviewForm
                          ? t("transactions.hideReviewForm", "Hide Review Form")
                          : t("transactions.reviewSeller", "Review Seller")}
                      </button>
                    )}

                    <Link
                      to={`/products/${transaction.productId}`}
                      className="btn btn-outline"
                    >
                      {t("transactions.viewProduct", "View Product")}
                    </Link>
                  </div>
                </div>

                <div className="transaction-detail-timeline">
                  <OrderTimeline transactionId={transaction.id} />
                </div>

                {transaction.status === "Completed" && showReviewForm && (
                  <div className="card transaction-detail-review-card">
                    <ReviewSellerForm
                      transactionId={transaction.id}
                      onSuccess={() => {
                        setShowReviewForm(false);
                        toast.success(
                          t("transactions.reviewed", "Reviewed"),
                          t(
                            "transactions.reviewSubmitted",
                            "Seller review submitted.",
                          ),
                        );
                      }}
                    />
                  </div>
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
