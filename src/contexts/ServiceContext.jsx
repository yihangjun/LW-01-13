import { createContext, useEffect, useState, useCallback } from 'react';
import goodService from '../services/goodService';
import orderService from '../services/orderService';
import categoryService from '../services/categoryService';
import cartService from '../services/cartService';
import adminService from '../services/adminService';
import { checkApiHealth } from '../utils/api';

const ServiceContext = createContext();

const isAdminPath = () =>
  typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');

function BootstrapScreen({ message, hint, onRetry, error }) {
  return (
    <div className="app-bootstrap">
      <div className="app-bootstrap__card">
        {!error && <div className="app-bootstrap__spinner" aria-hidden="true" />}
        <p className="app-bootstrap__title">{message}</p>
        {hint && <p className="app-bootstrap__hint">{hint}</p>}
        {error && (
          <p className="app-bootstrap__error">{error}</p>
        )}
        {onRetry && (
          <button type="button" className="app-bootstrap__retry" onClick={onRetry}>
            重新加载
          </button>
        )}
      </div>
    </div>
  );
}

const ServiceProvider = ({ children }) => {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');
  const [bootKey, setBootKey] = useState(0);

  const retry = useCallback(() => {
    setError('');
    setReady(false);
    setBootKey((k) => k + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      const healthy = await checkApiHealth();
      if (!healthy) {
        if (!cancelled) {
          setError(
            '无法连接后端 API。Render 免费实例可能正在唤醒（约 30～60 秒），请稍后点击重新加载。',
          );
        }
        return;
      }

      try {
        const coreInit = [goodService.init(), categoryService.init()];
        if (isAdminPath()) {
          coreInit.push(orderService.init(), adminService.init());
        }
        await Promise.all(coreInit);
        if (!cancelled) {
          setReady(true);
        }
        if (!isAdminPath()) {
          Promise.all([orderService.init(), adminService.init()]).catch(() => {});
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || '数据加载失败');
        }
      }
    }

    bootstrap();
    return () => { cancelled = true; };
  }, [bootKey]);

  const value = {
    good: goodService,
    order: orderService,
    category: categoryService,
    cart: cartService,
    admin: adminService,
  };

  if (error) {
    return (
      <BootstrapScreen
        message="商城暂时无法加载"
        error={error}
        onRetry={retry}
      />
    );
  }

  if (!ready) {
    return (
      <BootstrapScreen
        message="正在加载商城数据…"
        hint="首次打开若较慢，多为后端正在唤醒，请稍候"
      />
    );
  }

  return (
    <ServiceContext.Provider value={value}>
      {children}
    </ServiceContext.Provider>
  );
};

export { ServiceContext, ServiceProvider };
