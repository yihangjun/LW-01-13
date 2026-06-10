import { useEffect, useState } from 'react';

const Carousel = ({ items, interval = 4000 }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (items.length <= 1) return undefined;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length);
    }, interval);
    return () => clearInterval(timer);
  }, [items.length, interval]);

  if (!items.length) return null;

  const current = items[index];

  return (
    <div className="carousel">
      <div
        className="carousel__slide"
        style={{ background: `linear-gradient(135deg, ${current.color}, ${current.color}cc)` }}
      >
        <div className="carousel__content">
          <p className="carousel__title">{current.title}</p>
          {current.subtitle && (
            <p className="carousel__subtitle">{current.subtitle}</p>
          )}
        </div>
      </div>
      {items.length > 1 && (
        <div className="carousel__dots">
          {items.map((item, i) => (
            <button
              key={item.id}
              type="button"
              className={`carousel__dot${i === index ? ' carousel__dot--active' : ''}`}
              onClick={() => setIndex(i)}
              aria-label={`第 ${i + 1} 张`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Carousel;
