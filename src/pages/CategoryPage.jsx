import { useContext, useState, useEffect } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { ServiceContext } from "../contexts/ServiceContext";
import ProductGrid from "../components/ProductGrid";
import { isGoodOnSale } from "../utils/goodDisplay";
import "./CategoryPage.css";

export default function CategoryPage() {
  const { categoryId } = useParams();
  const [searchParams] = useSearchParams();
  const services = useContext(ServiceContext);
  const [goods, setGoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const searchQuery = searchParams.get("search") || "";

  useEffect(() => {
    let list = services.good.getGoodList().filter(isGoodOnSale);
    if (categoryId) {
      list = list.filter((g) => services.category.goodsMatchCategory(g.categoryId, categoryId));
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(g => g.name.toLowerCase().includes(q));
    }
    setGoods(list);
    setCategories(services.category.getAll());
  }, [categoryId, searchQuery, services]);

  const activeMeta = categoryId ? services.category.findCategory(categoryId) : null;
  const parentId = activeMeta?.isParent ? activeMeta.id : activeMeta?.parentId;
  const parentCategory = parentId ? services.category.getById(parentId) : null;
  const subCategories = parentCategory?.children || [];
  const pageTitle = searchQuery
    ? `搜索: "${searchQuery}"`
    : activeMeta
      ? (activeMeta.isParent ? activeMeta.name : `${activeMeta.parentName} · ${activeMeta.name}`)
      : "全部分类";

  return (
    <div className="category-page container">
      <div className="category-sidebar">
        <h3 className="category-sidebar-title">商品分类</h3>
        <Link to="/category" className={`category-link ${!categoryId ? "active" : ""}`}>全部分类</Link>
        {categories.map(cat => (
          <Link
            key={cat.id}
            to={`/category/${cat.id}`}
            className={`category-link ${services.category.getParentId(categoryId || '') === cat.id ? "active" : ""}`}
          >
            <span>{cat.icon}</span> {cat.name}
          </Link>
        ))}
      </div>
      <div className="category-main">
        <div className="category-header">
          <h2>{pageTitle}</h2>
          <span className="category-count">{goods.length} 件商品</span>
        </div>
        {subCategories.length > 0 && (
          <div className="category-subnav">
            <Link
              to={`/category/${parentId}`}
              className={`category-sub-link ${activeMeta?.isParent ? "active" : ""}`}
            >
              全部
            </Link>
            {subCategories.map((sub) => (
              <Link
                key={sub.id}
                to={`/category/${sub.id}`}
                className={`category-sub-link ${categoryId === sub.id ? "active" : ""}`}
              >
                {sub.name}
              </Link>
            ))}
          </div>
        )}
        <ProductGrid goods={goods} />
      </div>
    </div>
  );
}
