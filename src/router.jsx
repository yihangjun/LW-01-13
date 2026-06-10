import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate, useParams } from 'react-router-dom';

function RedirectCreateOrder() {
  const { goodId } = useParams();
  return <Navigate to={goodId ? `/create-order/${goodId}` : '/create-order'} replace />;
}

function RedirectOrderDetail() {
  const { orderId } = useParams();
  return <Navigate to={`/order-detail/${orderId}`} replace />;
}

import App from './App';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingSkeleton from './components/LoadingSkeleton';

const HomePage = lazy(() => import('./pages/HomePage'));
const CategoryPage = lazy(() => import('./pages/CategoryPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const UserPage = lazy(() => import('./pages/UserPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const DetailPage = lazy(() => import('./pages/DetailPage'));
const CreateOrderPage = lazy(() => import('./pages/CreateOrderPage'));
const PayPage = lazy(() => import('./pages/PayPage'));
const OrderListPage = lazy(() => import('./pages/OrderListPage'));
const OrderDetailPage = lazy(() => import('./pages/OrderDetailPage'));
const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage'));
const AdminGoodsPage = lazy(() => import('./pages/admin/AdminGoodsPage'));
const AdminCategoriesPage = lazy(() => import('./pages/admin/AdminCategoriesPage'));
const AdminOrdersPage = lazy(() => import('./pages/admin/AdminOrdersPage'));
const AdminRolesPage = lazy(() => import('./pages/admin/AdminRolesPage'));

const PageLoader = () => (
  <div style={{ padding: 24, textAlign: 'center' }}>加载中...</div>
);

const withSuspense = (Component, skeleton = false) => (
  <Suspense fallback={skeleton ? <LoadingSkeleton count={4} /> : <PageLoader />}>
    <Component />
  </Suspense>
);

const withAuth = (Component, skeleton = false) => (
  <ProtectedRoute>
    {withSuspense(Component, skeleton)}
  </ProtectedRoute>
);

const router = createBrowserRouter([
  {
    path: '/',
    Component: App,
    children: [
      { index: true, element: withSuspense(HomePage, true) },
      { path: 'home', element: withSuspense(HomePage, true) },
      { path: 'category', element: withSuspense(CategoryPage, true) },
      { path: 'category/:categoryId', element: withSuspense(CategoryPage, true) },
      { path: 'cart', element: withAuth(CartPage) },
      { path: 'user', element: withAuth(UserPage) },
      { path: 'my', element: <Navigate to="/user" replace /> },
      { path: 'my/:section', element: <Navigate to="/user" replace /> },
      { path: 'login', element: withSuspense(LoginPage) },
      { path: 'register', element: withSuspense(RegisterPage) },
      { path: 'forgot-password', element: withSuspense(ForgotPasswordPage) },
      { path: 'detail/:goodId', element: withSuspense(DetailPage) },
      { path: 'create-order', element: withAuth(CreateOrderPage) },
      { path: 'create-order/:goodId', element: withAuth(CreateOrderPage) },
      { path: 'pay/:orderId', element: withAuth(PayPage) },
      { path: 'order-list', element: withAuth(OrderListPage) },
      { path: 'order-detail/:orderId', element: withAuth(OrderDetailPage) },
      // 同学版路由兼容
      { path: 'createOrder', element: <Navigate to="/create-order" replace /> },
      { path: 'createOrder/:goodId', element: <RedirectCreateOrder /> },
      { path: 'orderList', element: <Navigate to="/order-list" replace /> },
      { path: 'orderDetail/:orderId', element: <RedirectOrderDetail /> },
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
