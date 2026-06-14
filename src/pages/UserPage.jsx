import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Package, MapPin, Phone, Edit3, Save, X } from 'lucide-react';
import { useMallAuth } from '../hooks/useMallAuth';
import { useToast } from '../components/Toast';
import './UserPage.css';

export default function UserPage() {
  const { user, logout, updateUser } = useMallAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [nickname, setNickname] = useState(user?.nickname || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');

  const handleSave = () => {
    updateUser({ nickname: nickname.trim(), phone: phone.trim(), address: address.trim() });
    setEditing(false);
    toast('保存成功', 'success');
  };

  const handleCancel = () => {
    setNickname(user?.nickname || '');
    setPhone(user?.phone || '');
    setAddress(user?.address || '');
    setEditing(false);
  };

  const handleLogout = () => {
    logout();
    toast('已退出登录', 'info');
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="user-page container">
      <div className="user-card">
        <div className="user-avatar-section">
          <div className="user-avatar">
            <User size={40} />
          </div>
          {!editing ? (
            <div className="user-basic">
              <h2>{user.nickname || user.username}</h2>
              <span className="user-role">普通用户</span>
            </div>
          ) : (
            <div className="user-edit-name">
              <input value={nickname} onChange={e => setNickname(e.target.value)} placeholder="昵称" />
            </div>
          )}
        </div>

        <div className="user-info-grid">
          <div className="user-info-item">
            <User size={16} />
            <span className="info-label">用户名</span>
            <span className="info-value">{user.username}</span>
          </div>
          <div className="user-info-item">
            <Phone size={16} />
            <span className="info-label">手机号</span>
            {editing ? (
              <input className="info-input" value={phone} onChange={e => setPhone(e.target.value)} placeholder="请输入手机号" />
            ) : (
              <span className="info-value">{user.phone || '未设置'}</span>
            )}
          </div>
          <div className="user-info-item">
            <MapPin size={16} />
            <span className="info-label">默认地址</span>
            {editing ? (
              <input className="info-input" value={address} onChange={e => setAddress(e.target.value)} placeholder="请输入收货地址" />
            ) : (
              <span className="info-value">{user.address || '未设置'}</span>
            )}
          </div>
        </div>

        <div className="user-edit-actions">
          {!editing ? (
            <button className="user-edit-btn" onClick={() => setEditing(true)}>
              <Edit3 size={16} /> 编辑资料
            </button>
          ) : (
            <>
              <button className="user-save-btn" onClick={handleSave}><Save size={16} /> 保存</button>
              <button className="user-cancel-btn" onClick={handleCancel}><X size={16} /> 取消</button>
            </>
          )}
        </div>
      </div>

      <div className="user-actions">
        <Link to="/order-list" className="user-action-btn">
          <Package size={20} /> 我的订单
        </Link>
        <button className="user-logout-btn" onClick={handleLogout}>
          退出登录
        </button>
      </div>
    </div>
  );
}
