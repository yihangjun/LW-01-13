import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./Carousel.css";

const slides = [
  { id: 1, title: "新品首发", subtitle: "春季新款限时特惠", bg: "linear-gradient(135deg, #3d5a80 0%, #5b7fa5 100%)", emoji: "🛍️" },
  { id: 2, title: "限时秒杀", subtitle: "每日10点准时开抢", bg: "linear-gradient(135deg, #e07a5f 0%, #f0a28e 100%)", emoji: "⚡" },
  { id: 3, title: "品质生活", subtitle: "精选好物低至5折", bg: "linear-gradient(135deg, #2a9d8f 0%, #45bfb0 100%)", emoji: "✨" },
];

export default function Carousel() {
  const [current, setCurrent] = useState(0);
  const len = slides.length;

  const goTo = useCallback((idx) => {
    setCurrent(((idx % len) + len) % len);
  }, [len]);

  useEffect(() => {
    const timer = setInterval(() => goTo(current + 1), 4000);
    return () => clearInterval(timer);
  }, [current, goTo]);

  return (
    <div className="carousel">
      <div className="carousel-track" style={{ transform: `translateX(-${current * 100}%)` }}>
        {slides.map(s => (
          <div key={s.id} className="carousel-slide" style={{ background: s.bg }}>
            <div className="carousel-slide-inner">
              <span className="carousel-emoji">{s.emoji}</span>
              <h2 className="carousel-title">{s.title}</h2>
              <p className="carousel-subtitle">{s.subtitle}</p>
            </div>
            <div className="carousel-slide-overlay" />
          </div>
        ))}
      </div>
      <button className="carousel-btn prev" onClick={() => goTo(current - 1)}>
        <ChevronLeft size={20} />
      </button>
      <button className="carousel-btn next" onClick={() => goTo(current + 1)}>
        <ChevronRight size={20} />
      </button>
      <div className="carousel-dots">
        {slides.map((_, i) => (
          <button key={i} className={`carousel-dot ${i === current ? "active" : ""}`} onClick={() => goTo(i)} />
        ))}
      </div>
    </div>
  );
}
