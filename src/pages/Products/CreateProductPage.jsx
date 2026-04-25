import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import MainLayout from "../../layouts/MainLayout";
import ProtectedRoute from "../../components/user/ProtectedRoute";
import ProductForm from "../../components/product/ProductForm";
import productApi from "../../api/productApi";
import useToast from "../../hooks/useToast";

function CreateProductPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const toast = useToast();

  const handleCreate = async (payload) => {
    try {
      await productApi.create(payload);

      toast.success(
        t("products.created", "Created"),
        t("products.createdSuccess", "Listing created successfully."),
      );

      navigate("/my-products");
    } catch (error) {
      toast.error(
        t("products.createFailed", "Create failed"),
        error.response?.data?.message ||
          t("products.couldNotCreate", "Could not create listing."),
      );
    }
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <section className="page-shell create-product-page">
          <div className="container">
            <div className="create-product-hero card">
              <div>
                <span className="create-product-badge">
                  {t("products.sellerMode", "Seller Mode")}
                </span>

                <h1 className="page-title">
                  {t("products.createTitle", "Create Listing")}
                </h1>

                <p className="page-subtitle">
                  {t(
                    "products.createSubtitle",
                    "Add a new second-hand product to the marketplace.",
                  )}
                </p>
              </div>

              <div className="create-product-steps">
                <div>
                  <strong>01</strong>
                  <span>Product details</span>
                </div>
                <div>
                  <strong>02</strong>
                  <span>Images</span>
                </div>
                <div>
                  <strong>03</strong>
                  <span>Publish</span>
                </div>
              </div>
            </div>

            <div className="card create-product-card">
              <ProductForm
                onSubmit={handleCreate}
                submitText={t("products.createButton", "Create Product")}
              />
            </div>
          </div>
        </section>
      </MainLayout>
    </ProtectedRoute>
  );
}

export default CreateProductPage;
