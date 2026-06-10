import {
  ADMIN_MODULES,
  DEFAULT_ADMIN_USERS,
  DEFAULT_ROLES,
} from '../constants/adminPermissions';

const SESSION_KEY = 'mall_admin';
const USERS_KEY = 'mall_admin_users';
const ROLES_KEY = 'mall_admin_roles';

function normalizeRoles(roles) {
  return roles.map((r) => {
    const fallback = DEFAULT_ROLES.find((d) => d.id === r.id);
    const permissions = Array.isArray(r.permissions)
      ? [...r.permissions]
      : [...(fallback?.permissions ?? [])];
    return { ...fallback, ...r, permissions };
  });
}

function loadRoles() {
  const raw = localStorage.getItem(ROLES_KEY);
  if (raw) return normalizeRoles(JSON.parse(raw));
  const roles = DEFAULT_ROLES.map((r) => ({ ...r, permissions: [...r.permissions] }));
  localStorage.setItem(ROLES_KEY, JSON.stringify(roles));
  return roles;
}

function saveRoles(roles) {
  localStorage.setItem(ROLES_KEY, JSON.stringify(roles));
}

function loadUsers() {
  const raw = localStorage.getItem(USERS_KEY);
  if (raw) return JSON.parse(raw);
  localStorage.setItem(USERS_KEY, JSON.stringify(DEFAULT_ADMIN_USERS));
  return DEFAULT_ADMIN_USERS.map((u) => ({ ...u }));
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

class AdminService {
  getModules() {
    return ADMIN_MODULES;
  }

  getRoles() {
    return loadRoles();
  }

  getRoleById(roleId) {
    return loadRoles().find((r) => r.id === roleId);
  }

  updateRolePermissions(roleId, permissions) {
    const roles = loadRoles();
    const role = roles.find((r) => r.id === roleId);
    if (!role) return false;
    role.permissions = permissions;
    saveRoles(roles);
    return true;
  }

  getUsers() {
    return loadUsers();
  }

  addUser(user) {
    const users = loadUsers();
    if (users.some((u) => u.username === user.username)) {
      return { ok: false, message: '用户名已存在' };
    }
    users.push(user);
    saveUsers(users);
    return { ok: true };
  }

  updateUser(username, patch) {
    const users = loadUsers();
    const idx = users.findIndex((u) => u.username === username);
    if (idx === -1) return { ok: false, message: '用户不存在' };
    users[idx] = { ...users[idx], ...patch };
    saveUsers(users);
    return { ok: true };
  }

  deleteUser(username) {
    if (username === 'admin') {
      return { ok: false, message: '不能删除默认超级管理员' };
    }
    saveUsers(loadUsers().filter((u) => u.username !== username));
    return { ok: true };
  }

  login(username, password) {
    const user = loadUsers().find(
      (u) => u.username === username.trim() && u.password === password,
    );
    if (!user) return { ok: false, message: '账号或密码错误' };

    const role = this.getRoleById(user.roleId);
    if (!role) return { ok: false, message: '角色配置异常' };

    const session = {
      username: user.username,
      name: user.name,
      roleId: user.roleId,
      roleName: role.name,
      permissions: [...role.permissions],
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return { ok: true, user: session };
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
