import { useContext, useMemo, useState } from 'react';
import { banners } from '../mock/banners';
import { ServiceContext } from '../contexts/ServiceContext';
import SearchBar from '../components/SearchBar';
import Carousel from '../components/Carousel';
import ProductCard from '../components/ProductCard';
import CategoryNav from '../components/CategoryNav';
import './HomePage.css';

const brands = [
  { name: '小米', count: 100, color: '#ff6900' },
  { name: 'HUAWEI', count: 100, color: '#cf0a2c' },
  { name: '海澜之家', count: 80, color: '#1a5fb4' },
];

const HomePage = () => {
  const { good } = useContext(ServiceContext);
  const [keyword, setKeyword] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [page, setPage] = useState(1);

  const hotList = useMemo(() => {
    const hot = good.getHotGoods();
    if (hot.length > 0) return hot;
    return good.getGoodList().filter((g) => g.onSale);
  }, [good]);

  const isSearching = searchKeyword.trim().length > 0;
  const displayList = isSearching
    ? good.searchGoods(searchKeyword)
    : hotList.slice(0, page * 4);
  const hasMore = !isSearching && displayList.length < hotList.length;

  return (
    <div className="home-page">
      <header className="home-header">
        <div className="home-header__search">
          <span className="home-header__icon">📷</span>
          <SearchBar
            value={keyword}
            onChange={setKeyword}
            placeholder="请输入商品如：手机"
            onSearch={() => {
              setSearchKeyword(keyword.trim());
              setPage(1);
            }}
          />
          <span className="home-header__icon">💬</span>
        </div>
      </header>

      <div className="home-body">
        <Carousel items={banners} />

        <section className="home-section home-section--categories">
          <h3 className="home-section-label">商品分类</h3>
          <CategoryNav />
        </section>

        <div className="home-brands">
          <h3 className="home-section-label">品牌制造直供</h3>
          <div className="home-brands__row">
            {brands.map((b) => (
              <div key={b.name} className="home-brands__card" style={{ borderColor: b.color }}>
                <strong style={{ color: b.color }}>{b.name}</strong>
                <span>商品数量：{b.count}</span>
              </div>
            ))}
          </div>
        </div>

        <section className="home-section">
          <h2 className="home-section__title">
            {isSearching ? '搜索结果' : '热门商品'}
            <small>（{isSearching ? displayList.length : hotList.length} 件）</small>
          </h2>
          {displayList.length === 0 ? (
            <p className="home-empty">暂无相关商品</p>
          ) : (
            <div className="product-grid">
              {displayList.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          )}
          {!isSearching && hasMore && (
            <button
              type="button"
              className="home-load-more"
              onClick={() => setPage((p) => p + 1)}
            >
              加载更多
            </button>
          )}
        </section>
      </div>
    </div>
  );
};

export default HomePage;
