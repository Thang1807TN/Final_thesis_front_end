import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import ProtectedRoute from "../../components/user/ProtectedRoute";
import favoriteApi from "../../api/favoriteApi";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import ProductGrid from "../../components/product/ProductGrid";

function WishlistPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const response = await favoriteApi.getMine();
        setItems(response.data || []);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, []);

  return (
    <ProtectedRoute>
      <MainLayout>
        <section className="page-shell">
          <div className="container">
            <h1 className="page-title">Wishlist</h1>
            <p className="page-subtitle">Products you saved for later.</p>

            {loading ? (
              <Loader text="Loading wishlist..." />
            ) : items.length === 0 ? (
              <EmptyState
                title="No favorites yet"
                description="Save products from product details to see them here."
              />
            ) : (
              <ProductGrid
                products={items.map((item) => ({
                  id: item.productId,
                  title: item.productTitle,
                  price: item.price,
                  location: item.location,
                  condition: item.isAvailable ? "Available" : "Sold",
                  imageUrl: item.imageUrl,
                }))}
              />
            )}
          </div>
        </section>
      </MainLayout>
    </ProtectedRoute>
  );
}

export default WishlistPage;
