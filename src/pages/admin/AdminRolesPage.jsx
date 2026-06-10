import { useContext, useCallback, useMemo, useState } from 'react';
import { ServiceContext } from '../../contexts/ServiceContext';
import AdminModal from '../../components/admin/AdminModal';
import AdminConfirm from '../../components/admin/AdminConfirm';
import './Admin.css';

const emptyUserForm = () => ({
  username: '',
  password: '',
  name: '',
  roleId: 'operator',
});

function loadRoleRows(admin) {
  return (admin.getRoles() || [])
    .filter((r) => r?.id)
    .map((r) => ({
      id: r.id,
      name: r.name,
      permissions: [...(r.permissions || [])],
    }));
}

const AdminRolesPage = () => {
  const { admin } = useContext(ServiceContext);
  const [roleRows, setRoleRows] = useState(() => loadRoleRows(admin));
  const [users, setUsers] = useState(() => (admin.getUsers() || []).filter((u) => u?.username));
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [editingUsername, setEditingUsername] = useState(null);
  const [userForm, setUserForm] = useState(emptyUserForm());
  const [deleteUsername, setDeleteUsername] = useState(null);
  const [formError, setFormError] = useState('');
  const [saveHint, setSaveHint] = useState('');
  const [savedSnapshot, setSavedSnapshot] = useState(() => JSON.stringify(loadRoleRows(admin)));

  const hasPermission = admin.hasPermission('roles');
  const modules = useMemo(() => (admin.getModules() || []).filter((m) => m?.key), [admin]);
  const isPermDirty = JSON.stringify(roleRows) !== savedSnapshot;

  const editingUser = editingUsername
    ? users.find((u) => u.username === editingUsername)
    : null;
  const deleteUserTarget = deleteUsername
    ? users.find((u) => u.username === deleteUsername)
    : null;

  const reloadUsers = useCallback(() => {
    setUsers((admin.getUsers() || []).filter((u) => u?.username));
  }, [admin]);

  const showSavedHint = () => {
    setSaveHint('已保存');
    setTimeout(() => setSaveHint(''), 2000);
  };

  const handleTogglePerm = (roleId, permKey) => {
    if (roleId === 'admin') return;

    setRoleRows((prev) =>
      prev.map((role) => {
        if (role.id !== roleId) return role;
        const has = role.permissions.includes(permKey);
        const permissions = has
          ? role.permissions.filter((p) => p !== permKey)
          : [...role.permissions, permKey];
        return { ...role, permissions };
      }),
    );
  };

  const handleSavePermissions = () => {
    roleRows.forEach((role) => {
      admin.updateRolePermissions(role.id, [...role.permissions]);
    });
    admin.refreshSessionPermissions();
    setSavedSnapshot(JSON.stringify(roleRows));
    showSavedHint();
  };

  const handleResetPermissions = () => {
    const fresh = loadRoleRows(admin);
    setRoleRows(fresh);
    setSavedSnapshot(JSON.stringify(fresh));
    setSaveHint('');
  };

  const openAddUser = () => {
    setEditingUsername(null);
    setUserForm(emptyUserForm());
    setFormError('');
    setUserModalOpen(true);
  };

  const openEditUser = (u) => {
    if (!u?.username) return;
    setEditingUsername(u.username);
    setUserForm({
      username: u.username,
      password: u.password,
      name: u.name,
      roleId: u.roleId,
    });
    setFormError('');
    setUserModalOpen(true);
  };

  const handleUserSubmit = () => {
    if (!userForm.username.trim() || !userForm.name.trim()) {
      setFormError('请填写用户名和姓名');
      return;
    }
    if (!editingUsername && !userForm.password) {
      setFormError('请设置密码');
      return;
    }
    const payload = {
      username: userForm.username.trim(),
      password: userForm.password || editingUser?.password,
      name: userForm.name.trim(),
      roleId: userForm.roleId,
    };
    const result = editingUsername
      ? admin.updateUser(editingUsername, payload)
      : admin.addUser(payload);
    if (!result.ok) {
      setFormError(result.message);
      return;
    }
    setUserModalOpen(false);
    setEditingUsername(null);
    reloadUsers();
    showSavedHint();
  };

  if (!hasPermission) {
    return <div className="admin-panel">无权限管理权限</div>;
  }

  return (
    <>
      <section className="admin-card">
        <div className="admin-card__header">
          <div>
            <div className="admin-card__title">角色与模块权限</div>
            <p className="admin-card__desc">
              勾选各角色可访问的模块后，点击保存生效
              {isPermDirty && <span className="admin-dirty-hint"> · 有未保存的修改</span>}
              {saveHint && <span className="admin-save-hint"> · {saveHint}</span>}
            </p>
          </div>
          <div className="admin-card__actions">
            <button
              type="button"
              className="admin-btn admin-btn--outline admin-btn--sm"
              onClick={handleResetPermissions}
              disabled={!isPermDirty}
            >
              重置
            </button>
            <button
              type="button"
              className="admin-btn admin-btn--sm"
              onClick={handleSavePermissions}
              disabled={!isPermDirty}
            >
              保存
            </button>
          </div>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>角色</th>
                {modules.map((m) => (
                  <th key={m.key} title={m.desc}>{m.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {roleRows.map((role) => (
                <tr key={role.id}>
                  <td>
                    <strong>{role.name}</strong>
                    <small>{role.id}</small>
                  </td>
                  {modules.map((m) => {
                    const active = role.permissions.includes(m.key);
                    const locked = role.id === 'admin';
                    return (
                      <td key={m.key} className="admin-table__center">
                        <button
                          type="button"
                          className={`admin-perm-btn${active ? ' admin-perm-btn--on' : ''}${locked ? ' admin-perm-btn--locked' : ''}`}
                          onClick={() => handleTogglePerm(role.id, m.key)}
                          disabled={locked}
                          aria-pressed={active}
                          title={locked ? '超级管理员拥有全部权限' : m.desc}
                        >
                          {active ? '✓' : ''}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="admin-card">
        <div className="admin-card__header">
          <div>
            <div className="admin-card__title">后台用户</div>
            <p className="admin-card__desc">为不同用户分配角色，控制其可访问的模块</p>
          </div>
          <button type="button" className="admin-btn admin-btn--sm" onClick={openAddUser}>添加用户</button>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>用户名</th>
                <th>姓名</th>
                <th>角色</th>
                <th>可访问模块</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const role = roleRows.find((r) => r.id === u.roleId);
                const permLabels = modules
                  .filter((m) => role?.permissions.includes(m.key))
                  .map((m) => m.label);
                return (
                  <tr key={u.username}>
                    <td><strong>{u.username}</strong></td>
                    <td>{u.name}</td>
                    <td>{role?.name || u.roleId}</td>
                    <td>
                      <span className="admin-tag-list">
                        {permLabels.map((label) => (
                          <span key={label} className="admin-chip">{label}</span>
                        ))}
                      </span>
                    </td>
                    <td>
                      <div className="admin-table__actions">
                        <button type="button" className="admin-link" onClick={() => openEditUser(u)}>编辑</button>
                        {u.username !== 'admin' && (
                          <button type="button" className="admin-link admin-link--danger" onClick={() => setDeleteUsername(u.username)}>删除</button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <AdminModal
        open={userModalOpen}
        title={editingUsername ? '编辑用户' : '添加用户'}
        onClose={() => {
          setUserModalOpen(false);
          setEditingUsername(null);
        }}
        footer={
          <>
            <button type="button" className="admin-btn admin-btn--outline admin-btn--sm" onClick={() => setUserModalOpen(false)}>取消</button>
            <button type="button" className="admin-btn admin-btn--sm" onClick={handleUserSubmit}>确定</button>
          </>
        }
      >
        {formError && <p className="admin-error">{formError}</p>}
        <div className="admin-form-grid">
          <label className="admin-form-item">
            <span>用户名</span>
            <input
              disabled={!!editingUsername}
              value={userForm.username}
              onChange={(e) => setUserForm({ ...userForm, username: e.target.value })}
            />
          </label>
          <label className="admin-form-item">
            <span>姓名</span>
            <input value={userForm.name} onChange={(e) => setUserForm({ ...userForm, name: e.target.value })} />
          </label>
          <label className="admin-form-item">
            <span>密码</span>
            <input
              type="password"
              placeholder={editingUsername ? '留空则不修改' : '请输入密码'}
              value={userForm.password}
              onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
            />
          </label>
          <label className="admin-form-item">
            <span>角色</span>
            <select value={userForm.roleId} onChange={(e) => setUserForm({ ...userForm, roleId: e.target.value })}>
              {roleRows.map((r) => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
          </label>
        </div>
      </AdminModal>

      <AdminConfirm
        open={!!deleteUserTarget}
        message={`确定删除用户「${deleteUserTarget?.username ?? ''}」吗？`}
        onCancel={() => setDeleteUsername(null)}
        onConfirm={() => {
          if (deleteUsername) admin.deleteUser(deleteUsername);
          setDeleteUsername(null);
          reloadUsers();
          showSavedHint();
        }}
      />
    </>
  );
};

export default AdminRolesPage;
