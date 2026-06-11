import {
  ADMIN_MODULES,
  DEFAULT_ADMIN_USERS,
  DEFAULT_ROLES,
} from '../constants/adminPermissions';
import { request } from '../utils/api';

const SESSION_KEY = 'mall_admin';

function normalizeRoles(roles) {
  return roles.map((r) => {
    const fallback = DEFAULT_ROLES.find((d) => d.id === r.id);
    const permissions = Array.isArray(r.permissions)
      ? [...r.permissions]
      : [...(fallback?.permissions ?? [])];
    return { ...fallback, ...r, permissions };
  });
}

class AdminService {
  roles = [];
  users = [];
  ready = false;

  async init() {
    const [rolesRes, usersRes] = await Promise.all([
      request('/admin/roles'),
      request('/admin/users'),
    ]);
    this.roles = normalizeRoles(rolesRes.data || []);
    this.users = usersRes.data || DEFAULT_ADMIN_USERS.map((u) => ({ ...u }));
    this.ready = true;
    this.refreshSessionPermissions();
    return { roles: this.roles, users: this.users };
  }

  getModules() {
    return ADMIN_MODULES;
  }

  getRoles() {
    return this.roles;
  }

  getRoleById(roleId) {
    return this.roles.find((r) => r.id === roleId);
  }

  async updateRolePermissions(roleId, permissions) {
    const role = this.roles.find((r) => r.id === roleId);
    if (!role) {
      throw new Error('角色不存在');
    }
    const res = await request(`/admin/roles/${roleId}/permissions`, {
      method: 'PUT',
      body: { permissions },
    });
    if (!res.ok) {
      throw new Error('权限更新失败');
    }
    role.permissions = permissions;
    return true;
  }

  getUsers() {
    return this.users;
  }

  async addUser(user) {
    if (this.users.some((u) => u.username === user.username)) {
      throw new Error('用户名已存在');
    }
    await request('/admin/users', { method: 'POST', body: user });
    this.users.push(user);
    return { ok: true };
  }

  async updateUser(username, patch) {
    const idx = this.users.findIndex((u) => u.username === username);
    if (idx === -1) {
      throw new Error('用户不存在');
    }
    const res = await request(`/admin/users/${username}`, { method: 'PUT', body: patch });
    if (!res.ok) {
      throw new Error(res.message || '更新失败');
    }
    this.users[idx] = { ...this.users[idx], ...patch };
    return { ok: true };
  }

  async deleteUser(username) {
    if (username === 'admin') {
      throw new Error('不能删除默认超级管理员');
    }
    await request(`/admin/users/${username}`, { method: 'DELETE' });
    this.users = this.users.filter((u) => u.username !== username);
    return { ok: true };
  }

  login(username, password) {
    return request('/admin/login', {
      method: 'POST',
      body: { username, password },
    })
      .then((res) => {
        const session = res.data;
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
        return { ok: true, user: session };
      })
      .catch((err) => ({ ok: false, message: err.message || '账号或密码错误' }));
  }

  logout() {
    localStorage.removeItem(SESSION_KEY);
  }

  getSession() {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  hasPermission(permission) {
    const session = this.getSession();
    return session?.permissions?.includes(permission) ?? false;
  }

  getDemoAccount() {
    return { username: 'admin', password: 'admin123' };
  }

  refreshSessionPermissions() {
    const session = this.getSession();
    if (!session) return;
    const role = this.getRoleById(session.roleId);
    if (!role) return;
    const updated = { ...session, permissions: [...role.permissions], roleName: role.name };
    localStorage.setItem(SESSION_KEY, JSON.stringify(updated));
  }
}

const adminService = new AdminService();
export default adminService;
