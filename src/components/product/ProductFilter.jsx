import { useTranslation } from "react-i18next";

function ProductFilter({
  category,
  condition,
  categories = [],
  onCategoryChange,
  onConditionChange,
}) {
  const { t } = useTranslation();

  const translateCategory = (name) => {
    const map = {
      Books: t("categories.books", "Books"),
      Clothing: t("categories.clothing", "Clothing"),
      Electronics: t("categories.electronics", "Electronics"),
      Furniture: t("categories.furniture", "Furniture"),
      "Home Appliances": t("categories.homeAppliances", "Home Appliances"),
    };

    return map[name] || name;
  };

  return (
    <div className="filter-panel card">
      <div className="filter-row">
        <div className="input-group" style={{ marginBottom: 0 }}>
          <label className="input-label">
            {t("products.category", "Category")}
          </label>

          <select
            className="input-field"
            value={category}
            onChange={onCategoryChange}
          >
            <option value="">
              {t("products.allCategories", "All Categories")}
            </option>

            {categories.map((item) => (
              <option key={item.id} value={item.id}>
                {translateCategory(item.name)}
              </option>
            ))}
          </select>
        </div>

        <div className="input-group" style={{ marginBottom: 0 }}>
          <label className="input-label">
            {t("products.condition", "Condition")}
          </label>

          <select
            className="input-field"
            value={condition}
            onChange={onConditionChange}
          >
            <option value="">
              {t("products.allConditions", "All Conditions")}
            </option>

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
    </div>
  );
}

export default ProductFilter;
