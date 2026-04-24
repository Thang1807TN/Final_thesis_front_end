import { useEffect, useState } from 'react';
import MainLayout from '../../layouts/MainLayout';
import productApi from '../../api/productApi';
import categoryApi from '../../api/categoryApi';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import ProductGrid from '../../components/product/ProductGrid';
import ProductSearchBar from '../../components/product/ProductSearchBar';
import ProductFilter from '../../components/product/ProductFilter';
import Pagination from '../../components/common/Pagination';

function ProductListPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [keyword, setKeyword] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [condition, setCondition] = useState('');
  const [sortBy, setSortBy] = useState('latest');
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [pageNumber, sortBy]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPageNumber(1);
    loadProducts();
  };

  return (
    <MainLayout>
      <section className="page-shell">
        <div className="container">
          <h1 className="page-title">Browse Products</h1>
          <p className="page-subtitle">
            Search and explore available second-hand product listings.
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
            onCategoryChange={(e) => setCategoryId(e.target.value)}
            onConditionChange={(e) => setCondition(e.target.value)}
          />

          <div className="card payment-filter-bar" style={{ marginTop: '14px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Sort By</label>
              <select
                className="input"
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setPageNumber(1);
                }}
              >
                <option value="latest">Latest</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
                <option value="available">Available First</option>
                <option value="sold">Sold First</option>
              </select>
            </div>
          </div>

          {loading ? (
            <Loader text="Loading products..." />
          ) : products.length === 0 ? (
            <EmptyState
              title="No products found"
              description="Try changing your keyword or filter options."
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