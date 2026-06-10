import { useContext, useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ServiceContext } from '../contexts/ServiceContext';
import ProductCard from '../components/ProductCard';
import './CategoryPage.css';

const CategoryPage = () => {
  const { category, good } = useContext(ServiceContext);
  const [searchParams] = useSearchParams();
  const categories = (category.getList() || []).filter((c) => c?.id);
  const queryId = searchParams.get('id');

  const [activeId, setActiveId] = useState(
    queryId && category.getById(queryId) ? queryId : categories[0]?.id || '1',
  );
  const [activeSubId, setActiveSubId] = useState(null);

  useEffect(() => {
    if (queryId && category.getById(queryId)) {
      setActiveId(queryId);
      setActiveSubId(null);
    }
  }, [queryId, category]);

  const active = category.getById(activeId);

  const goods = useMemo(() => {
    const list = good.getGoodsByCategory(activeId);
    if (!activeSubId) return list;
    return list.filter((g) => g.categoryId === activeId);
  }, [good, activeId, activeSubId]);

  return (
    <div className="mall-page">
      <header className="mall-page__header">分类</header>
      <div className="category-page">
        <aside className="category-sidebar">
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              className={`category-sidebar__item${c.id === activeId ? ' category-sidebar__item--active' : ''}`}
              onClick={() => {
                setActiveId(c.id);
                setActiveSubId(null);
              }}
            >
              {c.name}
            </button>
          ))}
        </aside>
        <div className="category-content">
          <h3 className="category-content__title">{active?.name}</h3>
          <div className="category-subgrid">
            {active?.children?.map((sub) => (
              <button
                key={sub.id}
                type="button"
                className={`category-subitem${activeSubId === sub.id ? ' category-subitem--active' : ''}`}
                onClick={() => setActiveSubId(sub.id)}
              >
                <div className="category-subitem__icon">{sub.name[0]}</div>
                <span>{sub.name}</span>
              </button>
            ))}
          </div>
          <section className="category-goods-section">
            <h4 className="category-goods-section__title">
              相关商品
              <small>（{goods.length} 件）</small>
            </h4>
            {goods.length === 0 ? (
              <p className="category-goods-empty">该分类下暂无商品</p>
            ) : (
              <div className="product-grid category-product-grid">
                {goods.map((g) => (
                  <ProductCard key={g.id} product={g} />
                ))}
              </div>
            )}
          </section>
          <Link to="/" className="category-back-link">返回首页浏览更多</Link>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
