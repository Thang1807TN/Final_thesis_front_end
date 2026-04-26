import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import MainLayout from "../../layouts/MainLayout";
import ProtectedRoute from "../../components/user/ProtectedRoute";
import productApi from "../../api/productApi";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import useToast from "../../hooks/useToast";
import { formatCurrency } from "../../utils/formatCurrency";

function MyProductsPage() {
  const { t } = useTranslation();
  const toast = useToast();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const getConditionText = (condition) => {
    const map = {
      1: t("condition.likeNew", "Like New"),
      2: t("condition.veryGood", "Very Good"),
      3: t("condition.good", "Good"),
      4: t("condition.fair", "Fair"),
      LikeNew: t("condition.likeNew", "Like New"),
      VeryGood: t("condition.veryGood", "Very Good"),
      Good: t("condition.good", "Good"),
      Fair: t("condition.fair", "Fair"),
    };

    return map[condition] || condition || t("common.unknown", "Unknown");
  };

  const loadProducts = async () => {
    try {
      const response = await productApi.getMyProducts();
      setProducts(response.data || []);
    } catch (error) {
      toast.error(
        t("toast.loadFailed", "Load failed"),
        t("products.myListingsLoadFailed", "Could not load your listings."),
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      t("products.deleteConfirm", "Delete this listing?"),
    );

    if (!confirmed) return;

    try {
      await productApi.remove(id);

      setProducts((prev) => prev.filter((item) => item.id !== id));

      toast.success(
        t("products.deleted", "Deleted"),
        t("products.deletedSuccess", "Listing deleted successfully."),
      );
    } catch (error) {
      toast.error(
        t("products.deleteFailed", "Delete failed"),
        t("products.couldNotDelete", "Could not delete listing."),
      );
    }
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <section className="page-shell">
          <div className="container">
            <div className="my-listings-header">
              <div>
                <h1 className="page-title">
                  {t("products.myListingsTitle", "My Listings")}
                </h1>

                <p className="page-subtitle">
                  {t(
                    "products.myListingsSubtitle",
                    "Manage the products you have published.",
                  )}
                </p>
              </div>

              <Link to="/products/create" className="btn btn-primary">
                {t("products.createTitle", "Create Listing")}
              </Link>
            </div>

            {loading ? (
              <Loader
                text={t(
                  "products.myListingsLoading",
                  "Loading your listings...",
                )}
              />
            ) : products.length === 0 ? (
              <EmptyState
                title={t("products.noListings", "No listings yet")}
                description={t(
                  "products.noListingsDescription",
                  "Create your first product listing to start selling.",
                )}
              />
            ) : (
              <div className="my-listings-grid">
                {products.map((product) => {
                  const imageUrl =
                    product.imageUrl ||
                    product.imageUrls?.[0] ||
                    "https://via.placeholder.com/600x400?text=Product";

                  return (
                    <div key={product.id} className="card my-listing-card">
                      <div className="my-listing-image-wrap">
                        <img
                          src={imageUrl}
                          alt={product.title}
                          className="my-listing-image"
                        />

                        <span
                          className={`my-listing-status ${
                            product.isAvailable ? "available" : "sold"
                          }`}
                        >
                          {product.isAvailable
                            ? t("common.available", "Available")
                            : t("common.sold", "Sold")}
                        </span>
                      </div>

                      <div className="my-listing-body">
                        <h3>{product.title}</h3>

                        <p className="my-listing-desc">{product.description}</p>

                        <div className="my-listing-meta">
                          <span>{getConditionText(product.condition)}</span>
                          <span>{product.location}</span>
                        </div>

                        <strong className="my-listing-price">
                          {formatCurrency(product.price)}
                        </strong>

                        <div className="my-listing-actions">
                          <Link
                            to={`/products/edit/${product.id}`}
                            className="btn btn-outline"
                          >
                            {t("common.edit", "Edit")}
                          </Link>

                          <button
                            type="button"
                            className="btn btn-outline btn-danger-outline"
                            onClick={() => handleDelete(product.id)}
                          >
                            {t("common.delete", "Delete")}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </MainLayout>
    </ProtectedRoute>
  );
}

export default MyProductsPage;
