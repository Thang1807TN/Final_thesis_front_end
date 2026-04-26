import { useTranslation } from "react-i18next";

function TransactionStatusBadge({ status }) {
  const { t } = useTranslation();

  const normalized = String(status || "").toLowerCase();

  return (
    <span
      className={`transaction-status-badge transaction-status-${normalized}`}
    >
      {t(`status.${normalized}`, status)}
    </span>
  );
}

export default TransactionStatusBadge;
