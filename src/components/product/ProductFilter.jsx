function ProductFilter({
  category,
  condition,
  categories = [],
  onCategoryChange,
  onConditionChange,
}) {
  return (
    <div className="filter-panel card">
      <div className="filter-row">
        <div className="input-group" style={{ marginBottom: 0 }}>
          <label className="input-label">Category</label>
          <select
            className="input-field"
            value={category}
            onChange={onCategoryChange}
          >
            <option value="">All Categories</option>
            {categories.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        <div className="input-group" style={{ marginBottom: 0 }}>
          <label className="input-label">Condition</label>
          <select
            className="input-field"
            value={condition}
            onChange={onConditionChange}
          >
            <option value="">All Conditions</option>
            <option value="LikeNew">Like New</option>
            <option value="VeryGood">Very Good</option>
            <option value="Good">Good</option>
            <option value="Fair">Fair</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default ProductFilter;
