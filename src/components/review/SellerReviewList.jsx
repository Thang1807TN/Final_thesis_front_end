import { useEffect, useMemo, useState } from "react";
import reviewApi from "../../api/reviewApi";

function SellerReviewList({ sellerId }) {
  const [reviews, setReviews] = useState([]);
  const [sortBy, setSortBy] = useState("latest");
  const [ratingFilter, setRatingFilter] = useState("");

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const response = await reviewApi.getSellerReviews(sellerId);
        setReviews(response.data || []);
      } catch {
        setReviews([]);
      }
    };

    if (sellerId) {
      loadReviews();
    }
  }, [sellerId]);

  const filteredReviews = useMemo(() => {
    let result = [...reviews];

    if (ratingFilter) {
      result = result.filter((item) => item.rating === Number(ratingFilter));
    }

    if (sortBy === "rating-high") {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "rating-low") {
      result.sort((a, b) => a.rating - b.rating);
    } else {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return result;
  }, [reviews, sortBy, ratingFilter]);

  if (!sellerId) return null;

  return (
    <div className="card seller-review-list-card">
      <div className="page-title-row">
        <h3>Seller Reviews</h3>

        <div style={{ display: "flex", gap: "10px" }}>
          <select
            className="input"
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
          >
            <option value="">All Ratings</option>
            <option value="5">5 stars</option>
            <option value="4">4 stars</option>
            <option value="3">3 stars</option>
            <option value="2">2 stars</option>
            <option value="1">1 star</option>
          </select>

          <select
            className="input"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="latest">Latest</option>
            <option value="rating-high">Highest Rating</option>
            <option value="rating-low">Lowest Rating</option>
          </select>
        </div>
      </div>

      {filteredReviews.length === 0 ? (
        <p className="muted">No reviews yet.</p>
      ) : (
        <div className="review-list">
          {filteredReviews.map((review) => (
            <div key={review.id} className="review-item">
              <div className="review-item-top">
                <strong>{review.reviewerName}</strong>
                <span>{review.rating} / 5</span>
              </div>

              <p>{review.comment}</p>

              {review.sellerReply && (
                <div className="review-reply-box">
                  <strong>Seller reply:</strong>
                  <p>{review.sellerReply}</p>
                </div>
              )}

              <small className="muted">
                {new Date(review.createdAt).toLocaleDateString()}
              </small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SellerReviewList;
