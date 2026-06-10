import "./LoadingSkeleton.css";

export default function LoadingSkeleton({ count = 3 }) {
  return (
    <div className="skeleton-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton-card">
          <div className="skeleton-img pulse" />
          <div className="skeleton-body">
            <div className="skeleton-line pulse" style={{ width: "80%" }} />
            <div className="skeleton-line pulse" style={{ width: "40%" }} />
            <div className="skeleton-line pulse" style={{ width: "60%", height: "0.75rem" }} />
          </div>
        </div>
      ))}
    </div>
  );
}
