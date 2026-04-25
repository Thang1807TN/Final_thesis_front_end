import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import MainLayout from "../../layouts/MainLayout";
import productApi from "../../api/productApi";
import categoryApi from "../../api/categoryApi";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import ProductGrid from "../../components/product/ProductGrid";
import ProductSearchBar from "../../components/product/ProductSearchBar";
import ProductFilter from "../../components/product/ProductFilter";
import Pagination from "../../components/common/Pagination";

function ProductListPage() {
  const { t } = useTranslation();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [keyword, setKeyword] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [condition, setCondition] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [pageNumber, setPageNumber] = useState(1);

  const [paging, setPaging] = useState({
    totalPages: 1,
    totalCount: 0,
  });

  const loadCategories = async () => {
    const response = await categoryApi.getAll();
    setCategories(response.data || []);
  };

  const loadProducts = async () => {
    setLoading(true);

    try {
      const response = await productApi.getAll({
        keyword,
        categoryId: categoryId || undefined,
        condition: condition || undefined,
        sortBy,
        pageNumber,
        pageSize: 9,
      });

      const data = response.data;

      setProducts(data.items || []);
      setPaging({
        totalPages: data.totalPages || 1,
        totalCount: data.totalCount || 0,
      });
    } catch (error) {
      console.error("Failed to load products:", error);
      setProducts([]);
      setPaging({
        totalPages: 1,
        totalCount: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [pageNumber, sortBy, categoryId, condition]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPageNumber(1);

    if (pageNumber === 1) {
      loadProducts();
    }
  };

  return (
    <MainLayout>
      <section className="page-shell">
        <div className="container">
          <h1 className="page-title">
            {t("products.browseTitle", "Browse Products")}
          </h1>

          <p className="page-subtitle">
            {t(
              "products.browseSubtitle",
              "Search and explore available second-hand product listings.",
            )}
          </p>

          <ProductSearchBar
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onSubmit={handleSearchSubmit}
          />

          <ProductFilter
            category={categoryId}
            condition={condition}
            categories={categories}
            onCategoryChange={(e) => {
              setCategoryId(e.target.value);
              setPageNumber(1);
            }}
            onConditionChange={(e) => {
              setCondition(e.target.value);
              setPageNumber(1);
            }}
          />

          <div
            className="card payment-filter-bar"
            style={{ marginTop: "14px" }}
          >
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>{t("products.sortBy", "Sort By")}</label>

              <select
                className="input"
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setPageNumber(1);
                }}
              >
                <option value="latest">{t("common.latest", "Latest")}</option>
                <option value="price-low-high">
                  {t("products.priceLowHigh", "Price: Low to High")}
                </option>
                <option value="price-high-low">
                  {t("products.priceHighLow", "Price: High to Low")}
                </option>
                <option value="available">
                  {t("products.availableFirst", "Available First")}
                </option>
                <option value="sold">
                  {t("products.soldFirst", "Sold First")}
                </option>
              </select>
            </div>
          </div>

          {loading ? (
            <Loader text={t("products.loading", "Loading products...")} />
          ) : products.length === 0 ? (
            <EmptyState
              title={t("products.noProducts", "No products found")}
              description={t(
                "products.tryFilters",
                "Try changing your keyword or filter options.",
              )}
            />
          ) : (
            <>
              <ProductGrid products={products} />

              <Pagination
                currentPage={pageNumber}
                totalPages={paging.totalPages}
                onPageChange={setPageNumber}
              />
            </>
          )}
        </div>
      </section>
    </MainLayout>
  );
}

export default ProductListPage;
