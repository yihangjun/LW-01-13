import { ChevronLeft, ChevronRight } from "lucide-react";
import "./Pagination.css";

export default function Pagination({ current, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  const maxVisible = 5;
  let start = Math.max(1, current - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages, start + maxVisible - 1);
  if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);

  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className="pagination">
      <button
        className="pagination-btn"
        disabled={current <= 1}
        onClick={() => onChange(current - 1)}
      >
        <ChevronLeft size={16} />
      </button>
      {start > 1 && (
        <>
          <button className="pagination-num" onClick={() => onChange(1)}>1</button>
          {start > 2 && <span className="pagination-ellipsis">…</span>}
        </>
      )}
      {pages.map(p => (
        <button
          key={p}
          className={`pagination-num ${p === current ? "active" : ""}`}
          onClick={() => onChange(p)}
        >
          {p}
        </button>
      ))}
      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="pagination-ellipsis">…</span>}
          <button className="pagination-num" onClick={() => onChange(totalPages)}>{totalPages}</button>
        </>
      )}
      <button
        className="pagination-btn"
        disabled={current >= totalPages}
        onClick={() => onChange(current + 1)}
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
