import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import ProtectedRoute from "../../components/user/ProtectedRoute";
import productApi from "../../api/productApi";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import useToast from "../../hooks/useToast";
import { formatCurrency } from "../../utils/formatCurrency";

function MyProductsPage() {
  const toast = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadProducts = async () => {
    try {
      const response = await productApi.getMyProducts();
      setProducts(response.data || []);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (id) => {
    try {
      await productApi.remove(id);
      setProducts((prev) => prev.filter((item) => item.id !== id));
      toast.success("Deleted", "Listing deleted successfully.");
    } catch (error) {
      toast.error(
        "Delete failed",
        error.response?.data?.message || "Could not delete listing.",
      );
    }
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <section className="page-shell">
          <div className="container">
            <div className="page-title-row">
              <div>
                <h1 className="page-title">My Listings</h1>
                <p className="page-subtitle">
                  Manage the products you have published.
                </p>
              </div>
              <Link to="/products/create" className="btn btn-primary">
                Create Listing
              </Link>
            </div>

            {loading ? (
              <Loader text="Loading your listings..." />
            ) : products.length === 0 ? (
              <EmptyState
                title="No listings yet"
                description="You have not created any product listings."
              />
            ) : (
              <div className="my-product-list">
                {products.map((item) => (
                  <div key={item.id} className="card my-product-card">
                    <div>
                      <h3>{item.title}</h3>
                      <p className="muted">{item.location}</p>
                      <strong>{formatCurrency(item.price)}</strong>
                    </div>

                    <div
                      style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}
                    >
                      <Link
                        className="btn btn-outline"
                        to={`/products/edit/${item.id}`}
                      >
                        Edit
                      </Link>
                      <button
                        className="btn btn-outline btn-danger-outline"
                        onClick={() => handleDelete(item.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </MainLayout>
    </ProtectedRoute>
  );
}

export default MyProductsPage;
