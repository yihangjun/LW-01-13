import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import './SearchBar.css';

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/category?search=${encodeURIComponent(query.trim())}`);
      setQuery('');
      onSearch?.();
    }
  };

  const handleClear = () => setQuery('');

  return (
    <form className="searchbar" onSubmit={handleSubmit}>
      <Search size={16} className="searchbar-icon" />
      <input
        type="text"
        className="searchbar-input"
        placeholder="搜索商品..."
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
      {query && (
        <button type="button" className="searchbar-clear" onClick={handleClear}>
          <X size={14} />
        </button>
      )}
    </form>
  );
}
