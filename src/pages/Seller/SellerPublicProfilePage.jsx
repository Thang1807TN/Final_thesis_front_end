import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import MainLayout from "../../layouts/MainLayout";
import sellerDashboardApi from "../../api/sellerDashboardApi";
import productApi from "../../api/productApi";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import ProductGrid from "../../components/product/ProductGrid";
import SellerReviewList from "../../components/review/SellerReviewList";
import { formatDate } from "../../utils/formatDate";

function SellerPublicProfilePage() {
  const { t } = useTranslation();
  const { sellerId } = useParams();

  const [profile, setProfile] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const [profileResponse, productsResponse] = await Promise.all([
          sellerDashboardApi.getPublicProfile(sellerId),
          productApi.getBySellerId(sellerId),
        ]);

        setProfile(profileResponse.data);
        setProducts(productsResponse.data || []);
      } catch {
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [sellerId]);

  if (loading) {
    return (
      <MainLayout>
        <section className="page-shell">
          <div className="container">
            <Loader
              text={t("seller.loadingProfile", "Loading seller profile...")}
            />
          </div>
        </section>
      </MainLayout>
    );
  }

  if (!profile) {
    return (
      <MainLayout>
        <section className="page-shell">
          <div className="container">
            <EmptyState
              title={t("seller.notFound", "Seller not found")}
              description={t(
                "seller.notFoundDescription",
                "The requested seller profile could not be loaded.",
              )}
            />
          </div>
        </section>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <section className="page-shell seller-public-page">
        <div className="container">
          <div className="card seller-public-hero">
            <div className="seller-public-avatar">
              {(profile.fullName || "S").charAt(0).toUpperCase()}
            </div>

            <div className="seller-public-main">
              <div className="seller-public-title-row">
                <div>
                  <span className="seller-public-badge">
                    {t("seller.publicProfile", "Seller Public Profile")}
                  </span>

                  <h1 className="page-title">{profile.fullName}</h1>

                  <p className="page-subtitle">
                    {t("seller.joinedOn", "Joined on")}{" "}
                    {formatDate(profile.joinedAt)}
                  </p>
                </div>

                {profile.isVerifiedSeller && (
                  <span className="seller-verified-badge">
                    ✓ {t("seller.verifiedSeller", "Verified Seller")}
                  </span>
                )}
              </div>

              <div className="seller-public-stats">
                <div className="card seller-public-stat-card">
                  <span>{t("seller.totalListings", "Total Listings")}</span>
                  <strong>{profile.totalListings}</strong>
                </div>

                <div className="card seller-public-stat-card">
                  <span>
                    {t("seller.availableListings", "Available Listings")}
                  </span>
                  <strong>{profile.availableListings}</strong>
                </div>

                <div className="card seller-public-stat-card">
                  <span>{t("seller.soldListings", "Sold Listings")}</span>
                  <strong>{profile.soldListings}</strong>
                </div>

                <div className="card seller-public-stat-card rating">
                  <span>{t("seller.averageRating", "Average Rating")}</span>
                  <strong>{profile.averageRating || 0} / 5</strong>
                </div>

                <div className="card seller-public-stat-card">
                  <span>{t("seller.totalReviews", "Total Reviews")}</span>
                  <strong>{profile.totalReviews}</strong>
                </div>
              </div>
            </div>
          </div>

          <div className="seller-public-section">
            <div className="seller-public-section-header">
              <div>
                <h2>{t("seller.publicListings", "Public Listings")}</h2>
                <p>
                  {t(
                    "seller.publicListingsSubtitle",
                    "Products currently visible from this seller.",
                  )}
                </p>
              </div>
            </div>

            {products.length === 0 ? (
              <EmptyState
                title={t("seller.noPublicListings", "No public listings")}
                description={t(
                  "seller.noPublicListingsDescription",
                  "This seller has no public listings at the moment.",
                )}
              />
            ) : (
              <ProductGrid products={products} />
            )}
          </div>

          <div className="seller-public-section">
            <div className="seller-public-section-header">
              <div>
                <h2>{t("seller.reviews", "Seller Reviews")}</h2>
                <p>
                  {t(
                    "seller.reviewsSubtitle",
                    "Feedback from buyers after completed transactions.",
                  )}
                </p>
              </div>
            </div>

            <SellerReviewList sellerId={sellerId} />
          </div>
        </div>
      </section>
    </MainLayout>
  );
}

export default SellerPublicProfilePage;
