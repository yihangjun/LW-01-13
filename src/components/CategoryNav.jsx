import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { ServiceContext } from '../contexts/ServiceContext';

const COLORS = ['#ff9a76', '#6b8cff', '#a8e6cf', '#ffd3b6', '#ff6900', '#cf0a2c', '#1a5fb4', '#52c41a'];

const CategoryNav = ({ limit = 8 }) => {
  const { category } = useContext(ServiceContext);
  const list = (category.getList() || []).filter((c) => c?.id).slice(0, limit);

  if (list.length === 0) return null;

  return (
    <nav className="category-nav" aria-label="商品分类">
      {list.map((c, i) => (
        <Link key={c.id} to={`/category/${c.id}`} className="category-nav__item">
          <span
            className="category-nav__icon"
            style={{ background: COLORS[i % COLORS.length] }}
          >
            {c.name[0]}
          </span>
          <span className="category-nav__label">{c.name}</span>
        </Link>
      ))}
    </nav>
  );
};

export default CategoryNav;
