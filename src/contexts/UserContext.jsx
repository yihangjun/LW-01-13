import { createContext, useContext, useState, useCallback } from 'react';
import { getItem, setItem, removeItem } from '../utils/storage';
import { request } from '../utils/api';

const STORAGE_KEY = 'mall_user';

export const DEMO_ACCOUNT = {
  username: 'member',
  password: '123456',
  nickname: 'member',
};

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(() => getItem(STORAGE_KEY));

  const login = useCallback(async (username, password) => {
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

    try {
      const res = await request('/users/login', {
        method: 'POST',
        body: { username: trimmed, password },
      });
      const session = res.data;
      setUser(session);
      setItem(STORAGE_KEY, session);
      return { ok: true };
    } catch (err) {
      return { ok: false, message: err.message || '用户名或密码错误' };
    }
  }, []);

  const loginWithDemo = useCallback(async () => {
    const result = await login(DEMO_ACCOUNT.username, DEMO_ACCOUNT.password);
    return {
      ...result,
      account: { ...DEMO_ACCOUNT },
    };
  }, [login]);

  const register = useCallback(async (username, password) => {
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

    try {
      const res = await request('/users/register', {
        method: 'POST',
        body: { username: trimmed, password },
      });
      return { ok: true, message: res.message || '注册成功，请登录' };
    } catch (err) {
      return { ok: false, message: err.message || '注册失败' };
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    removeItem(STORAGE_KEY);
  }, []);

  const updateUser = useCallback(async (updates) => {
    if (!user) return;
    try {
      const res = await request(`/users/${user.username}`, {
        method: 'PUT',
        body: updates,
      });
      const session = res.data;
      setUser(session);
      setItem(STORAGE_KEY, session);
    } catch (err) {
      console.error(err);
    }
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
