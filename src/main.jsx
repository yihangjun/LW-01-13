import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router';
import router from './router';
import { ServiceProvider } from './contexts/ServiceContext';
import { UserProvider } from './contexts/UserContext';
import { CartProvider } from './contexts/CartContext';
import { ToastProvider } from './components/Toast';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ToastProvider>
      <UserProvider>
        <ServiceProvider>
          <CartProvider>
            <RouterProvider router={router} />
          </CartProvider>
        </ServiceProvider>
      </UserProvider>
    </ToastProvider>
  </React.StrictMode>,
);
