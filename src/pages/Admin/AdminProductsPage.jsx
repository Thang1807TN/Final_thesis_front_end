import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import ProtectedRoute from "../../components/user/ProtectedRoute";
import productApi from "../../api/productApi";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import useToast from "../../hooks/useToast";

function AdminProductsPage() {
  const toast = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadProducts = async () => {
    try {
      const response = await productApi.getAll({
        pageNumber: 1,
        pageSize: 100,
      });
      setProducts(response.data?.items || []);
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
      toast.success("Deleted", "Product removed successfully.");
    } catch (error) {
      toast.error(
        "Delete failed",
        error.response?.data?.message || "Could not delete product.",
      );
    }
  };

  return (
    <ProtectedRoute adminOnly>
      <AdminLayout>
        <section className="page-shell">
          <div className="container">
            <h1 className="page-title">Admin Products</h1>

            {loading ? (
              <Loader text="Loading products..." />
            ) : products.length === 0 ? (
              <EmptyState
                title="No products"
                description="There are no products in the system."
              />
            ) : (
              <div className="admin-table">
                <div className="admin-table-head admin-table-row admin-table-row-5">
                  <div>Title</div>
                  <div>Category</div>
                  <div>Seller</div>
                  <div>Price</div>
                  <div>Action</div>
                </div>

                {products.map((item) => (
                  <div
                    key={item.id}
                    className="admin-table-row admin-table-row-5"
                  >
                    <div>{item.title}</div>
                    <div>{item.categoryName}</div>
                    <div>{item.sellerName}</div>
                    <div>{item.price}</div>
                    <div>
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
      </AdminLayout>
    </ProtectedRoute>
  );
}

export default AdminProductsPage;
