import { formatCurrency } from "../../utils/formatCurrency";

function CheckoutSummary({ transaction, finalAmount = null }) {
  if (!transaction) return null;

  return (
    <div className="checkout-summary card">
      <h3>Checkout Summary</h3>
      <p>
        Product: <strong>{transaction.productTitle}</strong>
      </p>
      <p>
        Buyer: <strong>{transaction.buyerName}</strong>
      </p>
      <p>
        Seller: <strong>{transaction.sellerName}</strong>
      </p>
      <p>
        Original Total:{" "}
        <strong>{formatCurrency(transaction.totalAmount)}</strong>
      </p>
      {finalAmount !== null && (
        <p>
          Final Total: <strong>{formatCurrency(finalAmount)}</strong>
        </p>
      )}
    </div>
  );
}

export default CheckoutSummary;
