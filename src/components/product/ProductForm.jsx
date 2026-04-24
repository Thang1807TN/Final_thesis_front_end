import { useEffect, useState } from "react";
import categoryApi from "../../api/categoryApi";
import { uploadService } from "../../services/uploadService";
import useToast from "../../hooks/useToast";

const defaultValues = {
  title: "",
  description: "",
  price: "",
  location: "",
  condition: "Good",
  categoryId: "",
  imageUrls: [],
  isAvailable: true,
};

function ProductForm({
  initialValues = null,
  onSubmit,
  submitText = "Save Product",
}) {
  const toast = useToast();

  const [form, setForm] = useState(defaultValues);
  const [categories, setCategories] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await categoryApi.getAll();
        setCategories(response.data || []);
      } catch {
        setCategories([]);
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    if (initialValues) {
      setForm({
        title: initialValues.title || "",
        description: initialValues.description || "",
        price: initialValues.price || "",
        location: initialValues.location || "",
        condition: initialValues.condition || "Good",
        categoryId: initialValues.categoryId || "",
        imageUrls: initialValues.imageUrls || [],
        isAvailable:
          typeof initialValues.isAvailable === "boolean"
            ? initialValues.isAvailable
            : true,
      });
    }
  }, [initialValues]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    try {
      setUploading(true);
      const uploadedUrls = await uploadService.uploadImages(files);

      setForm((prev) => ({
        ...prev,
        imageUrls: [...prev.imageUrls, ...(uploadedUrls || [])],
      }));

      toast.success("Uploaded", "Images uploaded successfully.");
    } catch (error) {
      toast.error(
        "Upload failed",
        error.response?.data?.message || "Could not upload images.",
      );
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (imageUrl) => {
    setForm((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((item) => item !== imageUrl),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      await onSubmit({
        title: form.title,
        description: form.description,
        price: Number(form.price),
        location: form.location,
        condition: form.condition,
        categoryId: Number(form.categoryId),
        imageUrls: form.imageUrls,
        isAvailable: form.isAvailable,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="card product-form-card" onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="form-group">
          <label>Title</label>
          <input
            className="input"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Price</label>
          <input
            className="input"
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Location</label>
          <input
            className="input"
            name="location"
            value={form.location}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Category</label>
          <select
            className="input"
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
            required
          >
            <option value="">Select category</option>
            {categories.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Condition</label>
          <select
            className="input"
            name="condition"
            value={form.condition}
            onChange={handleChange}
          >
            <option value="LikeNew">Like New</option>
            <option value="VeryGood">Very Good</option>
            <option value="Good">Good</option>
            <option value="Fair">Fair</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea
          className="input textarea"
          name="description"
          rows="5"
          value={form.description}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Upload Images</label>
        <input type="file" multiple onChange={handleUpload} />
        {uploading && <p className="muted">Uploading...</p>}
      </div>

      {form.imageUrls.length > 0 && (
        <div className="uploaded-image-list">
          {form.imageUrls.map((imageUrl) => (
            <div key={imageUrl} className="uploaded-image-item">
              <img src={imageUrl} alt="Uploaded" />
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => removeImage(imageUrl)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      {initialValues && (
        <div className="form-group">
          <label className="checkbox-row">
            <input
              type="checkbox"
              name="isAvailable"
              checked={form.isAvailable}
              onChange={handleChange}
            />
            Available
          </label>
        </div>
      )}

      <button className="btn btn-primary" disabled={submitting}>
        {submitting ? "Saving..." : submitText}
      </button>
    </form>
  );
}

export default ProductForm;
