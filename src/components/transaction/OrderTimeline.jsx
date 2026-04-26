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

  if (!items.length) return null;

  return (
    <div className="card order-timeline-card">
      <h4>{t("transactions.orderTimeline", "Order Timeline")}</h4>

      <div className="timeline-list">
        {items.map((item) => (
          <div key={item.id} className="timeline-item">
            <div className="timeline-dot" />

            <div>
              <strong>{item.title}</strong>
              <p>{item.description}</p>
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
