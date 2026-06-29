import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import timelineApi from "../../api/timelineApi";

function OrderTimeline({ transactionId }) {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);

  useEffect(() => {
    const loadTimeline = async () => {
      try {
        const response = await timelineApi.getByTransactionId(transactionId);
        setItems(response.data || []);
      } catch {
        setItems([]);
      }
    };

    if (transactionId) {
      loadTimeline();
    }
  }, [transactionId]);

  const normalizeText = (value) => {
    return String(value || "").trim();
  };

  const translateStatus = (status) => {
    const normalized = normalizeText(status).replace(".", "");

    const map = {
      Pending: t("status.pending", "Pending"),
      Confirmed: t("status.confirmed", "Confirmed"),
      Paid: t("status.paid", "Paid"),
      Completed: t("status.completed", "Completed"),
      Cancelled: t("status.cancelled", "Cancelled"),
      Failed: t("status.failed", "Failed"),
      Refunded: t("status.refunded", "Refunded"),
    };

    return map[normalized] || normalized;
  };

  const translatePaymentMethod = (method) => {
    const normalized = normalizeText(method).replace(".", "");

    const map = {
      CashOnDelivery: t("paymentMethod.cashOnDelivery", "Cash on Delivery"),
      BankTransfer: t("paymentMethod.bankTransfer", "Bank Transfer"),
      OnlineDemo: t("paymentMethod.onlineDemo", "Online Demo"),
    };

    return map[normalized] || normalized;
  };

  const translateTitle = (title) => {
    const normalized = normalizeText(title);

    const map = {
      "Transaction created": t(
        "timeline.transactionCreated",
        "Transaction created",
      ),
      "Payment created": t("timeline.paymentCreated", "Payment created"),
      "Order completed": t("timeline.orderCompleted", "Order completed"),
      "Transaction updated": t(
        "timeline.transactionUpdated",
        "Transaction updated",
      ),
      "Transaction status updated": t(
        "timeline.transactionStatusUpdated",
        "Transaction status updated",
      ),
      "Payment updated": t("timeline.paymentUpdated", "Payment updated"),
      "Payment confirmed": t("timeline.paymentConfirmed", "Payment confirmed"),
    };

    return map[normalized] || normalized;
  };

  const translateDescription = (description) => {
    const normalized = normalizeText(description);

    if (!normalized) return "";

    const transactionCreatedForProductMatch = normalized.match(
      /^A transaction was created for product "(.+)"\.$/,
    );

    if (transactionCreatedForProductMatch) {
      return t("timeline.transactionCreatedFor", {
        product: transactionCreatedForProductMatch[1],
        defaultValue: 'A transaction was created for product "{{product}}".',
      });
    }

    const transactionCreatedMatch = normalized.match(
      /^Transaction created for "(.+)"\.$/,
    );

    if (transactionCreatedMatch) {
      return t("timeline.transactionCreatedFor", {
        product: transactionCreatedMatch[1],
        defaultValue: 'A transaction was created for product "{{product}}".',
      });
    }

    const paymentCreatedMatch = normalized.match(
      /^Method: (.+), Status: (.+)$/,
    );

    if (paymentCreatedMatch) {
      return t("timeline.paymentCreatedDescription", {
        method: translatePaymentMethod(paymentCreatedMatch[1]),
        status: translateStatus(paymentCreatedMatch[2]),
        defaultValue: "Method: {{method}}, Status: {{status}}",
      });
    }

    const statusChangedMatch = normalized.match(/^Status changed to (.+)$/);

    if (statusChangedMatch) {
      return t("timeline.statusChangedTo", {
        status: translateStatus(statusChangedMatch[1]),
        defaultValue: "Status changed to {{status}}",
      });
    }

    const transactionStatusChangedMatch = normalized.match(
      /^Transaction status changed to (.+)\.$/,
    );

    if (transactionStatusChangedMatch) {
      return t("timeline.transactionStatusChanged", {
        status: translateStatus(transactionStatusChangedMatch[1]),
        defaultValue: "Transaction status changed to {{status}}.",
      });
    }

    const paymentUpdatedMatch = normalized.match(
      /^Status: (.+)\. Transaction status: (.+)\.$/,
    );

    if (paymentUpdatedMatch) {
      return t("timeline.paymentUpdatedDescription", {
        paymentStatus: translateStatus(paymentUpdatedMatch[1]),
        transactionStatus: translateStatus(paymentUpdatedMatch[2]),
        defaultValue:
          "Status: {{paymentStatus}}. Transaction status: {{transactionStatus}}.",
      });
    }

    const paymentConfirmedMatch = normalized.match(
      /^Payment method: (.+)\. Status: (.+)\.$/,
    );

    if (paymentConfirmedMatch) {
      return t("timeline.paymentConfirmedDescription", {
        method: translatePaymentMethod(paymentConfirmedMatch[1]),
        status: translateStatus(paymentConfirmedMatch[2]),
        defaultValue: "Payment method: {{method}}. Status: {{status}}.",
      });
    }

    const map = {
      "Transaction marked as completed": t(
        "timeline.transactionMarkedCompleted",
        "Transaction marked as completed",
      ),
      "The transaction has been marked as completed.": t(
        "timeline.transactionMarkedCompleted",
        "Transaction marked as completed",
      ),
    };

    return map[normalized] || normalized;
  };

  if (!items.length) return null;

  return (
    <div className="card order-timeline-card">
      <h4>{t("transactions.orderTimeline", "Order Timeline")}</h4>

      <div className="timeline-list">
        {items.map((item) => (
          <div key={item.id} className="timeline-item">
            <div className="timeline-dot" />

            <div>
              <strong>{translateTitle(item.title)}</strong>
              <p>{translateDescription(item.description)}</p>
              <small className="muted">
                {new Date(item.createdAt).toLocaleString()}
              </small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OrderTimeline;
