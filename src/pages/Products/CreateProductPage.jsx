import { useNavigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import ProtectedRoute from "../../components/user/ProtectedRoute";
import ProductForm from "../../components/product/ProductForm";
import productApi from "../../api/productApi";
import useToast from "../../hooks/useToast";

function CreateProductPage() {
  const navigate = useNavigate();
  const toast = useToast();

  const handleCreate = async (payload) => {
    try {
      await productApi.create(payload);
      toast.success("Created", "Listing created successfully.");
      navigate("/my-products");
    } catch (error) {
      toast.error(
        "Create failed",
        error.response?.data?.message || "Could not create listing.",
      );
    }
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <section className="page-shell">
          <div className="container">
            <h1 className="page-title">Create Listing</h1>
            <p className="page-subtitle">
              Add a new second-hand product to the marketplace.
            </p>

            <ProductForm onSubmit={handleCreate} submitText="Create Product" />
          </div>
        </section>
      </MainLayout>
    </ProtectedRoute>
  );
}

export default CreateProductPage;
