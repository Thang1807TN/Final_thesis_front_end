function TransactionStatusBadge({ status }) {
  const normalized = String(status || "").toLowerCase();

  return (
    <span
      className={`transaction-status-badge transaction-status-${normalized}`}
    >
      {status}
    </span>
  );
}

export default TransactionStatusBadge;
