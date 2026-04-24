import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import ProtectedRoute from "../../components/user/ProtectedRoute";
import ProductForm from "../../components/product/ProductForm";
import productApi from "../../api/productApi";
import Loader from "../../components/common/Loader";
import useToast from "../../hooks/useToast";

function EditProductPage() {
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
      toast.success("Updated", "Listing updated successfully.");
      navigate("/my-products");
    } catch (error) {
      toast.error(
        "Update failed",
        error.response?.data?.message || "Could not update listing.",
      );
    }
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <section className="page-shell">
          <div className="container">
            {loading ? (
              <Loader text="Loading product..." />
            ) : (
              <>
                <h1 className="page-title">Edit Listing</h1>
                <ProductForm
                  initialValues={product}
                  onSubmit={handleUpdate}
                  submitText="Update Product"
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
