import { useTranslation } from "react-i18next";
import { formatCurrency } from "../../utils/formatCurrency";

function CheckoutSummary({ transaction, finalAmount = null }) {
  const { t } = useTranslation();

  if (!transaction) return null;

  return (
    <div className="checkout-summary card">
      <h3>{t("payment.checkoutSummary", "Checkout Summary")}</h3>

      <p>
        {t("payment.product", "Product")}:{" "}
        <strong>{transaction.productTitle}</strong>
      </p>

      <p>
        {t("payment.buyer", "Buyer")}: <strong>{transaction.buyerName}</strong>
      </p>

      <p>
        {t("payment.seller", "Seller")}:{" "}
        <strong>{transaction.sellerName}</strong>
      </p>

      <p>
        {t("payment.originalTotal", "Original Total")}:{" "}
        <strong>{formatCurrency(transaction.totalAmount)}</strong>
      </p>

      {finalAmount !== null && (
        <p>
          {t("payment.finalTotal", "Final Total")}:{" "}
          <strong>{formatCurrency(finalAmount)}</strong>
        </p>
      )}
    </div>
  );
}

export default CheckoutSummary;
