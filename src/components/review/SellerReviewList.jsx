import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import reviewApi from "../../api/reviewApi";
import { formatDate } from "../../utils/formatDate";

function SellerReviewList({ sellerId }) {
  const { t } = useTranslation();

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

    if (sellerId) loadReviews();
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

  const renderStars = (rating) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  if (!sellerId) return null;

  return (
    <div className="card seller-review-list-card">
      <div className="seller-review-header">
        <h3>{t("review.title", "Seller Reviews")}</h3>

        <div className="seller-review-filters">
          <select
            className="input"
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
          >
            <option value="">{t("review.allRatings", "All Ratings")}</option>
            <option value="5">5 ★</option>
            <option value="4">4 ★</option>
            <option value="3">3 ★</option>
            <option value="2">2 ★</option>
            <option value="1">1 ★</option>
          </select>

          <select
            className="input"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="latest">{t("review.latest", "Latest")}</option>
            <option value="rating-high">
              {t("review.highest", "Highest Rating")}
            </option>
            <option value="rating-low">
              {t("review.lowest", "Lowest Rating")}
            </option>
          </select>
        </div>
      </div>

      {filteredReviews.length === 0 ? (
        <p className="muted">{t("review.noReviews", "No reviews yet.")}</p>
      ) : (
        <div className="seller-review-list">
          {filteredReviews.map((review) => (
            <div key={review.id} className="seller-review-item">
              <div className="seller-review-top">
                <div>
                  <strong>{review.reviewerName}</strong>
                  <div className="seller-review-stars">
                    {renderStars(review.rating)}
                  </div>
                </div>

                <span className="seller-review-date">
                  {formatDate(review.createdAt)}
                </span>
              </div>

              <p className="seller-review-comment">{review.comment}</p>

              {review.sellerReply && (
                <div className="seller-review-reply">
                  <strong>{t("review.sellerReply", "Seller reply")}</strong>
                  <p>{review.sellerReply}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SellerReviewList;
