const SearchBar = ({ value, onChange, onSearch, placeholder = '搜索商品' }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch?.();
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        className="search-bar__input"
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <button type="submit" className="search-bar__btn">搜索</button>
    </form>
  );
};

export default SearchBar;
