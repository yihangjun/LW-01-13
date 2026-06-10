import './App.css';
import { Outlet, useLocation } from 'react-router';
import TabBar from './components/TabBar';
import HeaderNav from './components/HeaderNav';

const HIDE_TAB_PREFIXES = [
  '/login',
  '/register',
  '/forgot-password',
  '/detail',
  '/create-order',
  '/pay',
  '/pay-success',
  '/order-list',
  '/order-detail',
  '/admin',
  '/my/',
];

const FLOW_CENTER_PREFIXES = [
  '/create-order',
  '/pay',
  '/pay-success',
  '/order-list',
  '/order-detail',
];

function App() {
  const { pathname } = useLocation();
  const showNav = !HIDE_TAB_PREFIXES.some((p) => pathname.startsWith(p));
  const isFlowCenter = FLOW_CENTER_PREFIXES.some((p) => pathname.startsWith(p));

  const contentClass = [
    'app__content',
    !showNav && 'app__content--full',
    isFlowCenter && 'app__content--flow',
  ].filter(Boolean).join(' ');

  return (
    <div className="app-shell">
      {showNav && <HeaderNav />}
      <div className="app">
        <main className={contentClass}>
          <Outlet />
        </main>
        {showNav && <TabBar />}
      </div>
    </div>
  );
}

export default App;
