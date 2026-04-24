import { Link } from "react-router-dom";
import { formatCurrency } from "../../utils/formatCurrency";
import TransactionStatusBadge from "./TransactionStatusBadge";

function TransactionCard({ transaction, onCompleted }) {
  return (
    <div className="card transaction-card">
      <div className="transaction-card-top">
        <div>
          <h3>{transaction.productTitle}</h3>
          <p className="muted">Seller: {transaction.sellerName}</p>
          <p className="muted">Buyer: {transaction.buyerName}</p>
          {transaction.paymentStatus && (
            <p className="muted">Payment: {transaction.paymentStatus}</p>
          )}
        </div>

        <TransactionStatusBadge status={transaction.status} />
      </div>

      <div className="transaction-card-bottom">
        <strong>
          {formatCurrency(transaction.totalAmount || transaction.amount)}
        </strong>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {!transaction.isPaid && (
            <Link
              to="/payments"
              state={{ transaction }}
              className="btn btn-outline"
            >
              Pay Now
            </Link>
          )}

          <Link
            to={`/transactions/${transaction.id}`}
            className="btn btn-outline"
          >
            View Details
          </Link>

          {transaction.status === "Paid" && (
            <button
              className="btn btn-outline"
              onClick={() => onCompleted?.(transaction.id)}
            >
              Mark Completed
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default TransactionCard;
