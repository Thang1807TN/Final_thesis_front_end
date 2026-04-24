import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
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
  }, [id]);

  const handleBuyNow = async () => {
    try {
      setBuying(true);
      const response = await transactionApi.create({ productId: product.id });
      toast.success("Transaction created", "You can now continue to payment.");
      navigate("/payments", { state: { transaction: response.data } });
    } catch (error) {
      toast.error(
        "Could not create transaction",
        error.response?.data?.message || "Please try again.",
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
      toast.success("Conversation ready", "You can now chat with the seller.");
      navigate("/inbox", { state: { conversationId: response.data.id } });
    } catch (error) {
      toast.error(
        "Could not start chat",
        error.response?.data?.message || "Please try again.",
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
      toast.error("Favorite failed", "Could not update wishlist.");
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <Loader text="Loading product details..." />
      </MainLayout>
    );
  }

  if (!product) {
    return (
      <MainLayout>
        <section className="page-shell">
          <div className="container">
            <EmptyState
              title="Product not found"
              description="The requested product could not be loaded."
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
                <span>Condition</span>
                <strong>{product.condition}</strong>
              </div>
              <div>
                <span>Location</span>
                <strong>{product.location}</strong>
              </div>
              <div>
                <span>Seller</span>
                <strong>{product.sellerName}</strong>
              </div>
              <div>
                <span>Rating</span>
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
                    {buying ? "Creating..." : "Buy Now"}
                  </button>
                  <button
                    className="btn btn-outline"
                    onClick={handleMessageSeller}
                    disabled={messaging}
                  >
                    {messaging ? "Opening..." : "Message Seller"}
                  </button>
                  <button
                    className="btn btn-outline"
                    onClick={handleToggleFavorite}
                  >
                    {favorite ? "Saved" : "Save"}
                  </button>
                </>
              )}

              <Link
                to={`/seller/${product.sellerId}`}
                className="btn btn-outline"
              >
                View Seller Profile
              </Link>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}

export default ProductDetailPage;
