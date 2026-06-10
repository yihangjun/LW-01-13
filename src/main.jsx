import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { initAppData } from './utils/initAppData';

initAppData();

import { RouterProvider } from 'react-router';
import router from './router';
import { ServiceProvider } from './contexts/ServiceContext';
import { UserProvider } from './contexts/UserContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <UserProvider>
      <ServiceProvider>
        <RouterProvider router={router} />
      </ServiceProvider>
    </UserProvider>
  </React.StrictMode>,
);
