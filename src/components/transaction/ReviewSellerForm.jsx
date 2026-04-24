import { useState } from "react";
import reviewApi from "../../api/reviewApi";
import useToast from "../../hooks/useToast";

function ReviewSellerForm({ transactionId, onSuccess }) {
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

      toast.success("Reviewed", "Seller review submitted successfully.");
      setComment("");
      onSuccess?.();
    } catch (error) {
      toast.error(
        "Review failed",
        error.response?.data?.message || "Could not submit review.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="card review-form-card" onSubmit={handleSubmit}>
      <h4>Review Seller</h4>

      <div className="form-group">
        <label>Rating</label>
        <select
          className="input"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
        >
          <option value={5}>5 - Excellent</option>
          <option value={4}>4 - Very Good</option>
          <option value={3}>3 - Good</option>
          <option value={2}>2 - Fair</option>
          <option value={1}>1 - Poor</option>
        </select>
      </div>

      <div className="form-group">
        <label>Comment</label>
        <textarea
          className="input textarea"
          rows="4"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>

      <button className="btn btn-primary" disabled={submitting}>
        {submitting ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}

export default ReviewSellerForm;
