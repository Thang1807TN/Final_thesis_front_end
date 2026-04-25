import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import MainLayout from "../../layouts/MainLayout";
import ProtectedRoute from "../../components/user/ProtectedRoute";
import ProductForm from "../../components/product/ProductForm";
import productApi from "../../api/productApi";
import Loader from "../../components/common/Loader";
import useToast from "../../hooks/useToast";

function EditProductPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const response = await productApi.getById(id);
        setProduct(response.data);
      } catch {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const handleUpdate = async (payload) => {
    try {
      await productApi.update(id, payload);

      toast.success(
        t("products.updated", "Updated"),
        t("products.updatedSuccess", "Listing updated successfully."),
      );

      navigate("/my-products");
    } catch (error) {
      toast.error(
        t("products.updateFailed", "Update failed"),
        error.response?.data?.message ||
          t("products.couldNotUpdate", "Could not update listing."),
      );
    }
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <section className="page-shell">
          <div className="container">
            {loading ? (
              <Loader text={t("products.loadingOne", "Loading product...")} />
            ) : (
              <>
                <h1 className="page-title">
                  {t("products.editTitle", "Edit Listing")}
                </h1>

                <ProductForm
                  initialValues={product}
                  onSubmit={handleUpdate}
                  submitText={t("products.updateButton", "Update Product")}
                />
              </>
            )}
          </div>
        </section>
      </MainLayout>
    </ProtectedRoute>
  );
}

export default EditProductPage;
