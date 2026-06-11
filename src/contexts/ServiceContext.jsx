import { createContext, useEffect, useState } from 'react';
import goodService from '../services/goodService';
import orderService from '../services/orderService';
import categoryService from '../services/categoryService';
import cartService from '../services/cartService';
import adminService from '../services/adminService';
import { checkApiHealth } from '../utils/api';

const ServiceContext = createContext();

const ServiceProvider = ({ children }) => {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      const healthy = await checkApiHealth();
      if (!healthy) {
        if (!cancelled) {
          setError('无法连接后端服务，请先运行 npm run server');
        }
        return;
      }

      try {
        await Promise.all([
          goodService.init(),
          orderService.init(),
          categoryService.init(),
          adminService.init(),
        ]);
        if (!cancelled) {
          setReady(true);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || '数据加载失败');
        }
      }
    }

    bootstrap();
    return () => { cancelled = true; };
  }, []);

  const value = {
    good: goodService,
    order: orderService,
    category: categoryService,
    cart: cartService,
    admin: adminService,
  };

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        textAlign: 'center',
        color: '#c0392b',
      }}
      >
        <div>
          <p style={{ fontSize: '18px', marginBottom: '8px' }}>后端服务未启动</p>
          <p style={{ color: '#666' }}>{error}</p>
          <p style={{ marginTop: '16px', color: '#666' }}>
            请在项目根目录执行：<code>npm run server</code> 或 <code>npm run dev:all</code>
          </p>
        </div>
      </div>
    );
  }

  if (!ready) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#666',
      }}
      >
        正在加载商城数据…
      </div>
    );
  }

  return (
    <ServiceContext.Provider value={value}>
      {children}
    </ServiceContext.Provider>
  );
};

export { ServiceContext, ServiceProvider };
