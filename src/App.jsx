import { Outlet, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import BottomNav from './components/BottomNav';
import './App.css';

const NO_LAYOUT_PREFIXES = [
  '/login',
  '/register',
  '/forgot-password',
  '/admin',
];

export default function App() {
  const { pathname } = useLocation();
  const bare = NO_LAYOUT_PREFIXES.some((p) => pathname.startsWith(p));

  if (bare) {
    return <Outlet />;
  }

  return (
    <div className="app">
      <Header />
      <main className="app-main">
        <Outlet />
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
}
