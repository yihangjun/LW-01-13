import { createContext } from 'react';
import goodService from '../services/goodService';
import orderService from '../services/orderService';
import categoryService from '../services/categoryService';
import cartService from '../services/cartService';
import adminService from '../services/adminService';

const ServiceContext = createContext();

const ServiceProvider = ({ children }) => {
  const value = {
    good: goodService,
    order: orderService,
    category: categoryService,
    cart: cartService,
    admin: adminService,
  };
  return (
    <ServiceContext.Provider value={value}>
      {children}
    </ServiceContext.Provider>
  );
};

export { ServiceContext, ServiceProvider };
