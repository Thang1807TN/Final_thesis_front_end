import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import sellerDashboardApi from "../../api/sellerDashboardApi";
import productApi from "../../api/productApi";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import ProductGrid from "../../components/product/ProductGrid";
import SellerReviewList from "../../components/review/SellerReviewList";

function SellerPublicProfilePage() {
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
        <Loader text="Loading seller profile..." />
      </MainLayout>
    );
  }

  if (!profile) {
    return (
      <MainLayout>
        <section className="page-shell">
          <div className="container">
            <EmptyState
              title="Seller not found"
              description="The requested seller profile could not be loaded."
            />
          </div>
        </section>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <section className="page-shell">
        <div className="container">
          <div className="card seller-public-profile-card">
            <div className="page-title-row">
              <div>
                <h1 className="page-title">{profile.fullName}</h1>
                <p className="page-subtitle">
                  Joined on {new Date(profile.joinedAt).toLocaleDateString()}
                </p>
              </div>

              {profile.isVerifiedSeller && (
                <span className="badge">Verified Seller</span>
              )}
            </div>

            <div className="dashboard-stats-grid">
              <div className="card dashboard-stat-card">
                <span>Total Listings</span>
                <strong>{profile.totalListings}</strong>
              </div>
              <div className="card dashboard-stat-card">
                <span>Available Listings</span>
                <strong>{profile.availableListings}</strong>
              </div>
              <div className="card dashboard-stat-card">
                <span>Sold Listings</span>
                <strong>{profile.soldListings}</strong>
              </div>
              <div className="card dashboard-stat-card">
                <span>Average Rating</span>
                <strong>{profile.averageRating}</strong>
              </div>
              <div className="card dashboard-stat-card">
                <span>Total Reviews</span>
                <strong>{profile.totalReviews}</strong>
              </div>
            </div>
          </div>

          <div style={{ marginTop: "24px" }}>
            <h2 className="page-title">Public Listings</h2>
            {products.length === 0 ? (
              <EmptyState
                title="No public listings"
                description="This seller has no public listings at the moment."
              />
            ) : (
              <ProductGrid products={products} />
            )}
          </div>

          <div style={{ marginTop: "24px" }}>
            <SellerReviewList sellerId={sellerId} />
          </div>
        </div>
      </section>
    </MainLayout>
  );
}

export default SellerPublicProfilePage;
