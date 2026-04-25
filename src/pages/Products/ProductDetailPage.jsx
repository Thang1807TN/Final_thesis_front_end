import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import MainLayout from "../../layouts/MainLayout";
import productApi from "../../api/productApi";
import transactionApi from "../../api/transactionApi";
import chatApi from "../../api/chatApi";
import favoriteApi from "../../api/favoriteApi";
import reviewApi from "../../api/reviewApi";
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

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const isOwner = currentUser?.id && product?.sellerId === currentUser.id;

  useEffect(() => {
    const load = async () => {
      try {
        const response = await productApi.getById(id);
        setProduct(response.data);

        if (response.data?.sellerId) {
          const sellerSummary = await reviewApi.getSellerSummary(
            response.data.sellerId,
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

  if (loading) {
    return (
      <MainLayout>
        <Loader
          text={t("products.loadingDetails", "Loading product details...")}
        />
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
      <section className="page-shell">
        <div className="container product-detail-layout">
          <ProductImageGallery images={product.imageUrls || []} />

          <div className="card product-detail-info">
            <h1 className="page-title">{product.title}</h1>
            <p className="product-price">{formatCurrency(product.price)}</p>
            <p className="muted">{product.description}</p>

            <div className="product-detail-meta">
              <div>
                <span>{t("products.condition", "Condition")}</span>
                <strong>{product.condition}</strong>
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

            <div className="product-detail-actions">
              {!isOwner && (
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

                  <button
                    className="btn btn-outline"
                    onClick={handleToggleFavorite}
                  >
                    {favorite
                      ? t("products.savedProduct", "Saved")
                      : t("products.saveProduct", "Save")}
                  </button>
                </>
              )}

              <Link
                to={`/seller/${product.sellerId}`}
                className="btn btn-outline"
              >
                {t("products.viewSellerProfile", "View Seller Profile")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}

export default ProductDetailPage;
