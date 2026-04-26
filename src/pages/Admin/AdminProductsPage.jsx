import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import AdminLayout from "../../layouts/AdminLayout";
import ProtectedRoute from "../../components/user/ProtectedRoute";
import productApi from "../../api/productApi";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import useToast from "../../hooks/useToast";
import { formatCurrency } from "../../utils/formatCurrency";

function AdminProductsPage() {
  const { t } = useTranslation();
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

      toast.success(
        t("products.deleted", "Deleted"),
        t("products.deletedSuccess", "Product removed successfully."),
      );
    } catch (error) {
      toast.error(
        t("products.deleteFailed", "Delete failed"),
        error.response?.data?.message ||
          t("products.deleteError", "Could not delete product."),
      );
    }
  };

  return (
    <ProtectedRoute adminOnly>
      <AdminLayout>
        <section className="page-shell">
          <div className="container">
            <h1 className="page-title">
              {t("admin.productsTitle", "Admin Products")}
            </h1>

            {loading ? (
              <Loader text={t("products.loading", "Loading products...")} />
            ) : products.length === 0 ? (
              <EmptyState
                title={t("products.noProducts", "No products")}
                description={t(
                  "products.noProductsAdminDesc",
                  "There are no products in the system.",
                )}
              />
            ) : (
              <div className="admin-table">
                <div className="admin-table-head admin-table-row admin-table-row-5">
                  <div>{t("products.title", "Title")}</div>
                  <div>{t("products.category", "Category")}</div>
                  <div>{t("products.seller", "Seller")}</div>
                  <div>{t("products.price", "Price")}</div>
                  <div>{t("common.action", "Action")}</div>
                </div>

                {products.map((item) => (
                  <div
                    key={item.id}
                    className="admin-table-row admin-table-row-5"
                  >
                    <div>{item.title}</div>
                    <div>{item.categoryName}</div>
                    <div>{item.sellerName}</div>
                    <div>{formatCurrency(item.price)}</div>

                    <div>
                      <button
                        className="btn btn-outline btn-danger-outline"
                        onClick={() => handleDelete(item.id)}
                      >
                        {t("common.delete", "Delete")}
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
