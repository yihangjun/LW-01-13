import { memo, useState } from "react";
import ProductCard from "./ProductCard";
import Pagination from "./Pagination";
import "./ProductGrid.css";

const PAGE_SIZE = 12;

const ProductGrid = memo(function ProductGrid({ goods }) {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil((goods?.length || 0) / PAGE_SIZE);
  const paged = goods ? goods.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE) : [];

  if (!goods || goods.length === 0) {
    return <div className="product-grid-empty">暂无商品</div>;
  }

  return (
    <>
      <div className="product-grid">
        {paged.map(g => <ProductCard key={g.id} good={g} />)}
      </div>
      <Pagination current={page} totalPages={totalPages} onChange={setPage} />
    </>
  );
});

export default ProductGrid;
