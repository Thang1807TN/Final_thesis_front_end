import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
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

function ProductForm({ initialValues = null, onSubmit, submitText }) {
  const { t } = useTranslation();
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
      const conditionMap = {
        1: "LikeNew",
        2: "VeryGood",
        3: "Good",
        4: "Fair",
        LikeNew: "LikeNew",
        VeryGood: "VeryGood",
        Good: "Good",
        Fair: "Fair",
      };

      setForm({
        ...defaultValues,
        ...initialValues,
        condition: conditionMap[initialValues.condition] || "Good",
        categoryId: initialValues.categoryId || "",
        imageUrls: initialValues.imageUrls || [],
        isAvailable:
          initialValues.isAvailable === undefined
            ? true
            : initialValues.isAvailable,
      });
    }
  }, [initialValues]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvailableChange = (e) => {
    setForm((prev) => ({
      ...prev,
      isAvailable: e.target.checked,
    }));
  };

  const normalizeUploadedUrls = (result) => {
    if (Array.isArray(result)) return result;
    if (Array.isArray(result?.urls)) return result.urls;
    if (Array.isArray(result?.imageUrls)) return result.imageUrls;
    if (Array.isArray(result?.data)) return result.data;
    return [];
  };

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    try {
      setUploading(true);

      const result = await uploadService.uploadImages(files);
      const uploadedUrls = normalizeUploadedUrls(result);

      if (!uploadedUrls.length) {
        toast.error(
          t("products.uploadFailed", "Upload failed"),
          t("products.noImageReturned", "No image URLs returned."),
        );
        return;
      }

      setForm((prev) => ({
        ...prev,
        imageUrls: [...prev.imageUrls, ...uploadedUrls],
      }));

      toast.success(
        t("products.uploaded", "Uploaded"),
        t("products.uploadSuccess", "Images uploaded successfully."),
      );
    } catch (error) {
      toast.error(
        t("products.uploadFailed", "Upload failed"),
        error.response?.data?.message ||
          t("products.uploadError", "Could not upload images."),
      );
    } finally {
      setUploading(false);
      e.target.value = "";
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

    if (!form.categoryId) {
      toast.error(
        t("products.missingCategory", "Missing category"),
        t("products.selectCategory", "Please select a category."),
      );
      return;
    }

    if (!form.price || Number(form.price) <= 0) {
      toast.error(
        t("products.invalidPrice", "Invalid price"),
        t("products.pricePositive", "Price must be greater than 0."),
      );
      return;
    }

    const conditionMap = {
      LikeNew: 1,
      VeryGood: 2,
      Good: 3,
      Fair: 4,
    };

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      location: form.location.trim(),
      condition: conditionMap[form.condition],
      categoryId: Number(form.categoryId),
      imageUrls: form.imageUrls,
    };

    if (initialValues) {
      payload.isAvailable = form.isAvailable;
    }

    try {
      setSubmitting(true);
      await onSubmit(payload);
    } catch (error) {
      toast.error(
        t("products.saveFailed", "Save failed"),
        error.response?.data?.message ||
          t("products.saveError", "Could not save listing."),
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="product-form-card" onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="form-group">
          <label>{t("products.title", "Title")}</label>
          <input
            className="input"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>{t("products.price", "Price")}</label>
          <input
            className="input"
            name="price"
            type="number"
            min="1"
            value={form.price}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>{t("products.location", "Location")}</label>
          <input
            className="input"
            name="location"
            value={form.location}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>{t("products.category", "Category")}</label>
          <select
            className="input"
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
            required
          >
            <option value="">
              {t("products.selectCategory", "Select category")}
            </option>

            {categories.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>{t("products.condition", "Condition")}</label>
          <select
            className="input"
            name="condition"
            value={form.condition}
            onChange={handleChange}
          >
            <option value="LikeNew">
              {t("condition.likeNew", "Like New")}
            </option>
            <option value="VeryGood">
              {t("condition.veryGood", "Very Good")}
            </option>
            <option value="Good">{t("condition.good", "Good")}</option>
            <option value="Fair">{t("condition.fair", "Fair")}</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label>{t("products.description", "Description")}</label>
        <textarea
          className="input textarea"
          name="description"
          rows="5"
          value={form.description}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group upload-box">
        <label>{t("products.uploadImages", "Upload Images")}</label>

        <input
          className="file-input"
          type="file"
          multiple
          accept="image/*"
          onChange={handleUpload}
          disabled={uploading}
        />

        {uploading && (
          <p className="muted">{t("products.uploading", "Uploading...")}</p>
        )}
      </div>

      {form.imageUrls.length > 0 && (
        <div className="uploaded-image-list">
          {form.imageUrls.map((url) => (
            <div key={url} className="uploaded-image-item">
              <img src={url} alt="Uploaded" />

              <button
                type="button"
                className="btn btn-outline btn-danger-outline"
                onClick={() => removeImage(url)}
              >
                {t("common.delete", "Delete")}
              </button>
            </div>
          ))}
        </div>
      )}

      {initialValues && (
        <div className="form-group product-available-row">
          <label className="toggle-label">
            <div>
              <span>{t("products.productStatus", "Product Status")}</span>
              <small>
                {form.isAvailable
                  ? t("common.available", "Available")
                  : t("products.unavailable", "Sold / Unavailable")}
              </small>
            </div>

            <div className="toggle-switch">
              <input
                type="checkbox"
                name="isAvailable"
                checked={form.isAvailable}
                onChange={handleAvailableChange}
              />
              <span className="toggle-slider"></span>
            </div>
          </label>
        </div>
      )}

      <button
        className="btn btn-primary"
        type="submit"
        disabled={submitting || uploading}
      >
        {submitting ? t("products.saving", "Saving...") : submitText}
      </button>
    </form>
  );
}

export default ProductForm;
