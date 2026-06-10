import { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { TrendingUp, ChevronRight, Flame } from "lucide-react";
import { ServiceContext } from "../contexts/ServiceContext";
import Carousel from "../components/Carousel";
import SearchBar from "../components/SearchBar";
import ProductGrid from "../components/ProductGrid";
import { isGoodOnSale } from "../utils/goodDisplay";
import "./HomePage.css";

export default function HomePage() {
  const services = useContext(ServiceContext);
  const [hotGoods, setHotGoods] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const list = services.good.getGoodList().filter(isGoodOnSale);
    setHotGoods(list.sort((a, b) => (b.sales || 0) - (a.sales || 0)).slice(0, 8));
    setCategories(services.category.getAll());
  }, [services]);

  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="container">
          <div className="home-search-area">
            <h1 className="home-title">发现你的生活好物</h1>
            <p className="home-subtitle">精选品质商品，每日更新</p>
            <div className="home-searchbar">
              <SearchBar />
            </div>
          </div>
          <Carousel />
        </div>
      </section>

      <section className="home-section container">
        <div className="section-header">
          <div className="section-header-left">
            <TrendingUp size={20} />
            <h2>全部分类</h2>
          </div>
        </div>
        <div className="home-categories">
          {categories.map(cat => (
            <Link key={cat.id} to={`/category/${cat.id}`} className="home-cat-item">
              <span className="home-cat-icon">{cat.icon}</span>
              <span className="home-cat-name">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="home-section container">
        <div className="section-header">
          <div className="section-header-left">
            <Flame size={20} />
            <h2>热门推荐</h2>
          </div>
          <Link to="/category" className="section-header-right">
            查看全部 <ChevronRight size={16} />
          </Link>
        </div>
        <ProductGrid goods={hotGoods} />
      </section>
    </div>
  );
}
