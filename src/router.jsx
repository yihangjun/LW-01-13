import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';

import App from './App';
import AdminLayout from './layouts/AdminLayout';

const HomePage = lazy(() => import('./pages/HomePage'));
const CategoryPage = lazy(() => import('./pages/CategoryPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const MyPage = lazy(() => import('./pages/MyPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const DetailPage = lazy(() => import('./pages/DetailPage'));
const CreateOrderPage = lazy(() => import('./pages/CreateOrderPage'));
const PayPage = lazy(() => import('./pages/PayPage'));
const PaySuccessPage = lazy(() => import('./pages/PaySuccessPage'));
const OrderListPage = lazy(() => import('./pages/OrderListPage'));
const OrderDetailPage = lazy(() => import('./pages/OrderDetailPage'));
const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage'));
const AdminGoodsPage = lazy(() => import('./pages/admin/AdminGoodsPage'));
const AdminCategoriesPage = lazy(() => import('./pages/admin/AdminCategoriesPage'));
const AdminOrdersPage = lazy(() => import('./pages/admin/AdminOrdersPage'));
const AdminRolesPage = lazy(() => import('./pages/admin/AdminRolesPage'));
const MySubPage = lazy(() => import('./pages/MySubPage'));

const PageLoader = () => <div style={{ padding: 24, textAlign: 'center' }}>加载中...</div>;

const withSuspense = (Component) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
);

const router = createBrowserRouter([
  {
    path: '/',
    Component: App,
    children: [
      { index: true, element: withSuspense(HomePage) },
      { path: 'category', element: withSuspense(CategoryPage) },
      { path: 'cart', element: withSuspense(CartPage) },
      { path: 'my', element: withSuspense(MyPage) },
      { path: 'my/:section', element: withSuspense(MySubPage) },
      { path: 'login', element: withSuspense(LoginPage) },
      { path: 'register', element: withSuspense(RegisterPage) },
      { path: 'forgot-password', element: withSuspense(ForgotPasswordPage) },
      { path: 'detail/:goodId', element: withSuspense(DetailPage) },
      { path: 'create-order/:goodId', element: withSuspense(CreateOrderPage) },
      { path: 'pay/:orderId', element: withSuspense(PayPage) },
      { path: 'pay-success/:orderId', element: withSuspense(PaySuccessPage) },
      { path: 'order-list', element: withSuspense(OrderListPage) },
      { path: 'order-detail/:orderId', element: withSuspense(OrderDetailPage) },
    ],
  },
  {
    path: '/admin/login',
    element: withSuspense(AdminLoginPage),
  },
  {
    path: '/admin',
    Component: AdminLayout,
    children: [
      { path: 'goods', element: withSuspense(AdminGoodsPage) },
      { path: 'categories', element: withSuspense(AdminCategoriesPage) },
      { path: 'orders', element: withSuspense(AdminOrdersPage) },
      { path: 'roles', element: withSuspense(AdminRolesPage) },
    ],
  },
]);

export default router;
