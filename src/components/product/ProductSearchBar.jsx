function ProductSearchBar({ value, onChange, onSubmit }) {
  return (
    <form className="search-bar card" onSubmit={onSubmit}>
      <input
        className="search-input"
        type="text"
        placeholder="Search products by title or keyword..."
        value={value}
        onChange={onChange}
      />
      <button type="submit" className="btn btn-primary">
        Search
      </button>
    </form>
  );
}

export default ProductSearchBar;
