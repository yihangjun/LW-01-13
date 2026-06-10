import { useUser } from '../contexts/UserContext';

/** 商城 UI（同学版）所需的认证 API，底层仍使用 UserContext */
export function useMallAuth() {
  const { user, logout, updateUser, isLoggedIn } = useUser();
  return {
    user: user
      ? {
          ...user,
          id: user.username,
        }
      : null,
    logout,
    updateUser,
    isLoggedIn,
  };
}
