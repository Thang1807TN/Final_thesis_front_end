import { useState } from "react";
import { useTranslation } from "react-i18next";
import reviewApi from "../../api/reviewApi";
import useToast from "../../hooks/useToast";

function ReviewSellerForm({ transactionId, onSuccess }) {
  const { t } = useTranslation();
  const toast = useToast();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      await reviewApi.create({
        transactionId,
        rating,
        comment,
      });

      toast.success(
        t("review.success", "Reviewed"),
        t("review.successDesc", "Seller review submitted successfully."),
      );

      setComment("");
      onSuccess?.();
    } catch (error) {
      toast.error(
        t("review.failed", "Review failed"),
        error.response?.data?.message ||
          t("review.failedDesc", "Could not submit review."),
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="card review-form-card" onSubmit={handleSubmit}>
      <h4>{t("review.title", "Review Seller")}</h4>

      <div className="form-group">
        <label>{t("review.rating", "Rating")}</label>

        <select
          className="input"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
        >
          <option value={5}>5 - {t("review.excellent", "Excellent")}</option>

          <option value={4}>4 - {t("review.veryGood", "Very Good")}</option>

          <option value={3}>3 - {t("review.good", "Good")}</option>

          <option value={2}>2 - {t("review.fair", "Fair")}</option>

          <option value={1}>1 - {t("review.poor", "Poor")}</option>
        </select>
      </div>

      <div className="form-group">
        <label>{t("review.comment", "Comment")}</label>

        <textarea
          className="input textarea"
          rows="4"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={t("review.commentPlaceholder", "Write your feedback...")}
        />
      </div>

      <button className="btn btn-primary" disabled={submitting}>
        {submitting
          ? t("review.submitting", "Submitting...")
          : t("review.submit", "Submit Review")}
      </button>
    </form>
  );
}

export default ReviewSellerForm;
