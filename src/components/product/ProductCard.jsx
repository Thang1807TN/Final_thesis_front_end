import { Link } from "react-router-dom";
import { formatCurrency } from "../../utils/formatCurrency";

function ProductCard({ product }) {
  const imageUrl =
    product.imageUrl ||
    product.imageUrls?.[0] ||
    "https://via.placeholder.com/600x400?text=Product";

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
          {product.condition || "Unknown"}
        </span>

        {isSold && <span className="product-sold-badge">Sold</span>}
      </div>

      <div className="product-card-body">
        <h3 className="product-card-title">{product.title}</h3>
        <p className="product-card-location">{product.location}</p>

        {typeof product.sellerAverageRating !== "undefined" && (
          <p className="muted">
            Seller rating: {product.sellerAverageRating} / 5
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
