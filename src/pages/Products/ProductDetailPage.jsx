import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import MainLayout from "../../layouts/MainLayout";
import productApi from "../../api/productApi";
import transactionApi from "../../api/transactionApi";
import chatApi from "../../api/chatApi";
import favoriteApi from "../../api/favoriteApi";
import reviewApi from "../../api/reviewApi";
import reportApi from "../../api/reportApi";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import ProductImageGallery from "../../components/product/ProductImageGallery";
import useToast from "../../hooks/useToast";
import { formatCurrency } from "../../utils/formatCurrency";

function ProductDetailPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);
  const [messaging, setMessaging] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const [summary, setSummary] = useState(null);

  const [showReportForm, setShowReportForm] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportDescription, setReportDescription] = useState("");
  const [reporting, setReporting] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const isOwner = currentUser?.id && product?.sellerId === currentUser.id;
  const isLoggedIn = !!currentUser?.id;

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

  useEffect(() => {
    const load = async () => {
      try {
        const response = await productApi.getById(id);
        const productData = response.data;
        setProduct(productData);

        if (productData?.sellerId) {
          const sellerSummary = await reviewApi.getSellerSummary(
            productData.sellerId,
          );
          setSummary(sellerSummary.data);
        }

        if (currentUser?.id) {
          const favRes = await favoriteApi.check(id);
          setFavorite(favRes.data?.isFavorite || false);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id, currentUser?.id]);

  const handleBuyNow = async () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    try {
      setBuying(true);
      const response = await transactionApi.create({ productId: product.id });

      toast.success(
        t("toast.transactionCreated", "Transaction created"),
        t("toast.continueToPayment", "You can now continue to payment."),
      );

      navigate("/payments", { state: { transaction: response.data } });
    } catch (error) {
      toast.error(
        t("toast.transactionCreateFailed", "Could not create transaction"),
        error.response?.data?.message ||
          t("common.tryAgain", "Please try again."),
      );
    } finally {
      setBuying(false);
    }
  };

  const handleMessageSeller = async () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    try {
      setMessaging(true);
      const response = await chatApi.createConversation({
        productId: product.id,
      });

      toast.success(
        t("toast.conversationReady", "Conversation ready"),
        t("toast.chatWithSeller", "You can now chat with the seller."),
      );

      navigate("/inbox", { state: { conversationId: response.data.id } });
    } catch (error) {
      toast.error(
        t("toast.chatStartFailed", "Could not start chat"),
        error.response?.data?.message ||
          t("common.tryAgain", "Please try again."),
      );
    } finally {
      setMessaging(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    try {
      const response = await favoriteApi.toggle(product.id);
      setFavorite(response.data?.isFavorite || false);
    } catch {
      toast.error(
        t("toast.favoriteFailed", "Favorite failed"),
        t("toast.wishlistUpdateFailed", "Could not update wishlist."),
      );
    }
  };

  const handleOpenReport = () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    setShowReportForm((prev) => !prev);
  };

  const handleSubmitReport = async (e) => {
    e.preventDefault();

    if (!reportReason.trim()) {
      toast.error(
        t("reports.reasonRequired", "Reason required"),
        t("reports.enterReason", "Please enter a report reason."),
      );
      return;
    }

    try {
      setReporting(true);

      await reportApi.create({
        productId: product.id,
        reportedUserId: product.sellerId,
        reason: reportReason.trim(),
        description: reportDescription.trim(),
      });

      toast.success(
        t("reports.reportSubmitted", "Report submitted"),
        t(
          "reports.reportSubmittedDescription",
          "Thank you. Admin will review this report.",
        ),
      );

      setReportReason("");
      setReportDescription("");
      setShowReportForm(false);
    } catch (error) {
      toast.error(
        t("reports.reportFailed", "Report failed"),
        error.response?.data?.message ||
          t("common.tryAgain", "Please try again."),
      );
    } finally {
      setReporting(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <section className="page-shell">
          <div className="container">
            <Loader
              text={t("products.loadingDetails", "Loading product details...")}
            />
          </div>
        </section>
      </MainLayout>
    );
  }

  if (!product) {
    return (
      <MainLayout>
        <section className="page-shell">
          <div className="container">
            <EmptyState
              title={t("products.notFound", "Product not found")}
              description={t(
                "products.notFoundDescription",
                "The requested product could not be loaded.",
              )}
            />
          </div>
        </section>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <section className="page-shell product-detail-page">
        <div className="container">
          <div className="product-detail-layout">
            <div className="product-detail-gallery-card">
              <ProductImageGallery images={product.imageUrls || []} />
            </div>

            <div className="card product-detail-info">
              <div className="product-detail-top">
                <span
                  className={`product-availability ${
                    product.isAvailable ? "available" : "sold"
                  }`}
                >
                  {product.isAvailable
                    ? t("common.available", "Available")
                    : t("common.sold", "Sold")}
                </span>

                <button
                  className={`product-save-pill ${favorite ? "active" : ""}`}
                  onClick={handleToggleFavorite}
                  type="button"
                >
                  {favorite
                    ? `♥ ${t("products.savedProduct", "Saved")}`
                    : `♡ ${t("products.saveProduct", "Save")}`}
                </button>
              </div>

              <h1 className="page-title">{product.title}</h1>

              <p className="product-price">{formatCurrency(product.price)}</p>

              <p className="product-detail-description">
                {product.description}
              </p>

              <div className="product-detail-meta">
                <div>
                  <span>{t("products.condition", "Condition")}</span>
                  <strong>{getConditionLabel(product.condition)}</strong>
                </div>

                <div>
                  <span>{t("products.location", "Location")}</span>
                  <strong>{product.location}</strong>
                </div>

                <div>
                  <span>{t("products.seller", "Seller")}</span>
                  <strong>{product.sellerName}</strong>
                </div>

                <div>
                  <span>{t("products.rating", "Rating")}</span>
                  <strong>{summary?.averageRating || 0} / 5</strong>
                </div>
              </div>

              <div className="seller-mini-card">
                <div className="seller-mini-avatar">
                  {(product.sellerName || "S").charAt(0).toUpperCase()}
                </div>

                <div>
                  <p>{t("products.seller", "Seller")}</p>
                  <strong>{product.sellerName}</strong>
                  <span>
                    {summary?.totalReviews || 0}{" "}
                    {t("products.reviews", "reviews")}
                  </span>
                </div>

                <Link
                  to={`/seller/${product.sellerId}`}
                  className="btn btn-outline"
                >
                  {t("products.viewProfile", "View Profile")}
                </Link>
              </div>

              <div className="product-detail-actions">
                {!isOwner && product.isAvailable && (
                  <>
                    <button
                      className="btn btn-primary"
                      onClick={handleBuyNow}
                      disabled={buying}
                    >
                      {buying
                        ? t("common.creating", "Creating...")
                        : t("products.buyNow", "Buy Now")}
                    </button>

                    <button
                      className="btn btn-outline"
                      onClick={handleMessageSeller}
                      disabled={messaging}
                    >
                      {messaging
                        ? t("common.opening", "Opening...")
                        : t("products.messageSeller", "Message Seller")}
                    </button>
                  </>
                )}

                {!isOwner && (
                  <button
                    className="btn btn-outline btn-danger-outline"
                    onClick={handleOpenReport}
                    type="button"
                  >
                    {showReportForm
                      ? t("reports.closeReport", "Close Report")
                      : t("reports.reportProduct", "Report Product")}
                  </button>
                )}

                {isOwner && (
                  <Link
                    to={`/products/edit/${product.id}`}
                    className="btn btn-primary"
                  >
                    {t("products.editListing", "Edit Listing")}
                  </Link>
                )}

                {!product.isAvailable && (
                  <button className="btn btn-outline" disabled>
                    {t("products.productUnavailable", "Product Unavailable")}
                  </button>
                )}
              </div>

              {showReportForm && !isOwner && (
                <form
                  className="card report-product-form"
                  onSubmit={handleSubmitReport}
                  style={{
                    marginTop: "18px",
                    padding: "18px",
                    display: "grid",
                    gap: "12px",
                  }}
                >
                  <h3>{t("reports.reportProduct", "Report Product")}</h3>

                  <div className="input-group">
                    <label className="input-label">
                      {t("reports.reason", "Reason")}
                    </label>
                    <select
                      className="input-field"
                      value={reportReason}
                      onChange={(e) => setReportReason(e.target.value)}
                      required
                    >
                      <option value="">
                        {t("reports.selectReason", "Select reason")}
                      </option>
                      <option value="Fake product">
                        {t("reports.fakeProduct", "Fake product")}
                      </option>
                      <option value="Inappropriate content">
                        {t(
                          "reports.inappropriateContent",
                          "Inappropriate content",
                        )}
                      </option>
                      <option value="Scam or fraud">
                        {t("reports.scam", "Scam or fraud")}
                      </option>
                      <option value="Wrong information">
                        {t("reports.wrongInfo", "Wrong information")}
                      </option>
                      <option value="Other">
                        {t("reports.other", "Other")}
                      </option>
                    </select>
                  </div>

                  <div className="input-group">
                    <label className="input-label">
                      {t("reports.description", "Description")}
                    </label>
                    <textarea
                      className="input-field"
                      rows="4"
                      value={reportDescription}
                      onChange={(e) => setReportDescription(e.target.value)}
                      placeholder={t(
                        "reports.descriptionPlaceholder",
                        "Describe the issue...",
                      )}
                    />
                  </div>

                  <div
                    style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}
                  >
                    <button
                      className="btn btn-primary"
                      type="submit"
                      disabled={reporting}
                    >
                      {reporting
                        ? t("common.submitting", "Submitting...")
                        : t("reports.submitReport", "Submit Report")}
                    </button>

                    <button
                      className="btn btn-outline"
                      type="button"
                      onClick={() => setShowReportForm(false)}
                    >
                      {t("common.cancel", "Cancel")}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}

export default ProductDetailPage;
