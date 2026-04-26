import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { formatCurrency } from "../../utils/formatCurrency";

function ProductCard({ product }) {
  const { t } = useTranslation();

  const imageUrl =
    product.imageUrl ||
    product.imageUrls?.[0] ||
    "https://via.placeholder.com/600x400?text=Product";

  const getConditionLabel = (condition) => {
    const map = {
      1: t("condition.likeNew", "Like New"),
      2: t("condition.veryGood", "Very Good"),
      3: t("condition.good", "Good"),
      4: t("condition.fair", "Fair"),
      LikeNew: t("condition.likeNew", "Like New"),
      VeryGood: t("condition.veryGood", "Very Good"),
      Good: t("condition.good", "Good"),
      Fair: t("condition.fair", "Fair"),
      Sold: t("common.sold", "Sold"),
    };

    return map[condition] || t("common.unknown", "Unknown");
  };

  const isSold = product.isAvailable === false || product.condition === "Sold";

  return (
    <Link to={`/products/${product.id}`} className="product-card card">
      <div className="product-card-image-wrap">
        <img
          src={imageUrl}
          alt={product.title}
          className="product-card-image"
        />

        <span className="product-condition">
          {getConditionLabel(product.condition)}
        </span>

        {isSold && (
          <span className="product-sold-badge">{t("common.sold", "Sold")}</span>
        )}
      </div>

      <div className="product-card-body">
        <h3 className="product-card-title">{product.title}</h3>

        <p className="product-card-location">{product.location}</p>

        {typeof product.sellerAverageRating !== "undefined" && (
          <p className="muted">
            {t("products.sellerRating", "Seller rating")}:{" "}
            {product.sellerAverageRating} / 5
          </p>
        )}

        <div className="product-card-bottom">
          <strong className="product-card-price">
            {formatCurrency(product.price)}
          </strong>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
