import { useTranslation } from "react-i18next";

function ProductSearchBar({ value, onChange, onSubmit }) {
  const { t } = useTranslation();

  return (
    <form className="search-bar card" onSubmit={onSubmit}>
      <input
        className="search-input"
        type="text"
        placeholder={t(
          "products.searchPlaceholder",
          "Search products by title or keyword...",
        )}
        value={value}
        onChange={onChange}
      />

      <button type="submit" className="btn btn-primary">
        {t("common.search", "Search")}
      </button>
    </form>
  );
}

export default ProductSearchBar;
