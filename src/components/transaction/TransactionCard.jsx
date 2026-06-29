import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { formatCurrency } from "../../utils/formatCurrency";
import TransactionStatusBadge from "./TransactionStatusBadge";

function TransactionCard({ transaction, onCompleted }) {
  const { t } = useTranslation();

  const translateStatus = (value) => {
    const normalized = String(value || "")
      .trim()
      .toLowerCase();

    const map = {
      pending: t("status.pending", "Pending"),
      confirmed: t("status.confirmed", "Confirmed"),
      paid: t("status.paid", "Paid"),
      completed: t("status.completed", "Completed"),
      cancelled: t("status.cancelled", "Cancelled"),
      failed: t("status.failed", "Failed"),
      refunded: t("status.refunded", "Refunded"),
    };

    return map[normalized] || value || "N/A";
  };

  const status = String(transaction.status || "");
  const paymentStatus = String(transaction.paymentStatus || "");

  const isPaid =
    transaction.isPaid === true ||
    paymentStatus === "Paid" ||
    Number(transaction.paymentStatus) === 2;

  const canPay =
    !isPaid &&
    status !== "Completed" &&
    status !== "Cancelled" &&
    status !== "Refunded";

  const canComplete = status === "Paid" && isPaid;

  const originalAmount = Number(
    transaction.totalAmount ?? transaction.amount ?? 0,
  );

  const finalAmount = Number(
    transaction.paidAmount ?? transaction.finalAmount ?? originalAmount,
  );

  const discountAmount = Number(
    transaction.discountAmount ?? Math.max(0, originalAmount - finalAmount),
  );

  const discountPercent =
    transaction.discountPercent ||
    (originalAmount > 0 && discountAmount > 0
      ? Math.round((discountAmount / originalAmount) * 100)
      : 0);

  return (
    <div className="card transaction-card">
      <div className="transaction-card-top">
        <div>
          <div className="transaction-card-title-row">
            <h3>{transaction.productTitle}</h3>

            {discountAmount > 0 && (
              <span className="transaction-discount-badge">
                -{discountPercent}%
              </span>
            )}
          </div>

          <p className="muted">
            {t("transactions.seller", "Seller")}: {transaction.sellerName}
          </p>

          <p className="muted">
            {t("transactions.buyer", "Buyer")}: {transaction.buyerName}
          </p>

          <p className="muted">
            {t("transactions.paymentStatus", "Payment")}:{" "}
            {paymentStatus
              ? translateStatus(paymentStatus)
              : t("status.pending", "Pending")}
          </p>

          {transaction.appliedCouponCode && (
            <p className="muted">
              {t("coupon.code", "Coupon")}:{" "}
              <strong>{transaction.appliedCouponCode}</strong>
            </p>
          )}
        </div>

        <TransactionStatusBadge status={transaction.status} />
      </div>

      <div className="transaction-card-bottom">
        <div className="transaction-price-block">
          {discountAmount > 0 && (
            <span className="transaction-old-price">
              {formatCurrency(originalAmount)}
            </span>
          )}

          <strong>{formatCurrency(finalAmount)}</strong>

          {discountAmount > 0 && (
            <span className="transaction-discount-mini">
              -{formatCurrency(discountAmount)}
            </span>
          )}
        </div>

        <div className="transaction-actions">
          {canPay && (
            <Link
              to="/payments"
              state={{ transaction }}
              className="btn btn-primary"
            >
              {t("transactions.payNow", "Pay Now")}
            </Link>
          )}

          <Link
            to={`/transactions/${transaction.id}`}
            className="btn btn-outline"
          >
            {t("transactions.viewDetails", "View Details")}
          </Link>

          {canComplete && (
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => onCompleted?.(transaction.id)}
            >
              {t("transactions.markCompleted", "Mark Completed")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default TransactionCard;
