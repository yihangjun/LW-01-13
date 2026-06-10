import { Link, useParams } from 'react-router-dom';
import { useRequireUser } from '../hooks/useRequireUser';
import './MyPage.css';

const PAGE_META = {
  address: { title: '地址管理', desc: '管理收货地址，下单时自动选用默认地址。' },
  footprint: { title: '我的足迹', desc: '最近浏览过的商品记录。' },
  follows: { title: '我的关注', desc: '关注的店铺与品牌。' },
  favorites: { title: '我的收藏', desc: '收藏的商品列表。' },
  reviews: { title: '我的评价', desc: '已发布的商品评价。' },
  settings: { title: '设置', desc: '账号与安全、通知偏好等。' },
};

const MySubPage = () => {
  const { section } = useParams();
  const loggedIn = useRequireUser();
  const meta = PAGE_META[section] || { title: '我的', desc: '' };

  if (!loggedIn) return null;

  return (
    <div className="my-sub-page">
      <Link to="/my" className="my-sub-page__back">← 返回我的</Link>
      <h2>{meta.title}</h2>
      <p className="my-sub-page__desc">{meta.desc}</p>
      <p className="my-sub-page__hint">功能页面已接入路由，后续可扩展具体业务。</p>
    </div>
  );
};

export default MySubPage;
