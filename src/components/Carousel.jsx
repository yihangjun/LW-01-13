import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./Carousel.css";

const slides = [
  {
    id: 1,
    title: "新品首发",
    subtitle: "春季新款限时特惠",
    banner: "/images/banners/banner-new.svg",
    emoji: "🛍️",
    tone: "blue",
  },
  {
    id: 2,
    title: "限时秒杀",
    subtitle: "每日10点准时开抢",
    banner: "/images/banners/banner-sale.svg",
    emoji: "⚡",
    tone: "coral",
  },
  {
    id: 3,
    title: "品质生活",
    subtitle: "精选好物低至5折",
    banner: "/images/banners/banner-life.svg",
    emoji: "✨",
    tone: "teal",
  },
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
        {slides.map((s) => (
          <div key={s.id} className={`carousel-slide carousel-slide--${s.tone}`}>
            <div className="carousel-slide-bg" />
            <img src={s.banner} alt="" className="carousel-deco" aria-hidden="true" />
            <div className="carousel-slide-content">
              <span className="carousel-emoji" aria-hidden="true">{s.emoji}</span>
              <h2 className="carousel-title">{s.title}</h2>
              <p className="carousel-subtitle">{s.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
      <button type="button" className="carousel-btn prev" onClick={() => goTo(current - 1)} aria-label="上一张">
        <ChevronLeft size={20} />
      </button>
      <button type="button" className="carousel-btn next" onClick={() => goTo(current + 1)} aria-label="下一张">
        <ChevronRight size={20} />
      </button>
      <div className="carousel-dots">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            className={`carousel-dot ${i === current ? "active" : ""}`}
            onClick={() => goTo(i)}
            aria-label={`切换到第 ${i + 1} 张`}
          />
        ))}
      </div>
    </div>
  );
}
