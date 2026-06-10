import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { getItem, setItem, removeItem } from '../utils/storage';

const STORAGE_KEY = 'mall_user';
const USERS_KEY = 'mall_users';

export const DEMO_ACCOUNT = {
  username: 'member',
  password: '123456',
  nickname: 'member',
};

const UserContext = createContext(null);

function loadUsers() {
  const users = getItem(USERS_KEY, []);
  const hasDemo = users.some((u) => u.username === DEMO_ACCOUNT.username);
  return hasDemo ? users : [...users, { ...DEMO_ACCOUNT }];
}

function saveUsers(users) {
  setItem(USERS_KEY, users);
}

export function UserProvider({ children }) {
  const [user, setUser] = useState(() => getItem(STORAGE_KEY));

  useEffect(() => {
    saveUsers(loadUsers());
  }, []);

  const login = useCallback((username, password) => {
    const trimmed = username.trim();
    if (!trimmed) {
      return { ok: false, message: '请输入用户名' };
    }
    if (!password) {
      return { ok: false, message: '请输入密码' };
    }
    if (password.length < 6) {
      return { ok: false, message: '密码至少 6 位' };
    }

    const users = loadUsers();
    const found = users.find(
      (u) => u.username === trimmed && u.password === password,
    );

    if (!found) {
      return { ok: false, message: '用户名或密码错误' };
    }

    const session = {
      username: found.username,
      nickname: found.nickname || found.username,
      phone: found.phone || '',
      address: found.address || '',
    };
    setUser(session);
    setItem(STORAGE_KEY, session);
    return { ok: true };
  }, []);

  const loginWithDemo = useCallback(() => {
    const result = login(DEMO_ACCOUNT.username, DEMO_ACCOUNT.password);
    return {
      ...result,
      account: { ...DEMO_ACCOUNT },
    };
  }, [login]);

  const register = useCallback((username, password) => {
    const trimmed = username.trim();
    if (!trimmed) {
      return { ok: false, message: '请输入用户名' };
    }
    if (trimmed.length < 2) {
      return { ok: false, message: '用户名至少 2 个字符' };
    }
    if (!password) {
      return { ok: false, message: '请输入密码' };
    }
    if (password.length < 6) {
      return { ok: false, message: '密码至少 6 位' };
    }

    const users = loadUsers();
    if (users.some((u) => u.username === trimmed)) {
      return { ok: false, message: '用户名已存在' };
    }

    const newUser = { username: trimmed, password, nickname: trimmed };
    saveUsers([...users, newUser]);
    return { ok: true, message: '注册成功，请登录' };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    removeItem(STORAGE_KEY);
  }, []);

  const updateUser = useCallback((updates) => {
    if (!user) return;
    const users = loadUsers();
    const idx = users.findIndex((u) => u.username === user.username);
    if (idx === -1) return;

    const next = { ...users[idx], ...updates };
    users[idx] = next;
    saveUsers(users);

    const session = {
      username: next.username,
      nickname: next.nickname || next.username,
      phone: next.phone || '',
      address: next.address || '',
    };
    setUser(session);
    setItem(STORAGE_KEY, session);
  }, [user]);

  const getDemoAccount = useCallback(() => ({ ...DEMO_ACCOUNT }), []);

  return (
    <UserContext.Provider
      value={{
        user,
        login,
        loginWithDemo,
        register,
        logout,
        updateUser,
        getDemoAccount,
        isLoggedIn: !!user,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error('useUser must be used within UserProvider');
  }
  return ctx;
}
