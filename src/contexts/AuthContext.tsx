import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkLoginState, signOut, getCurrentUser } from '../services/authService';
import { initAuth, resetLoginState } from '../config/cloudbase';
import type { AuthUser } from '../types';

interface AuthContextType {
  user: AuthUser | null;
  isLoggedIn: boolean;
  loading: boolean;
  login: () => void;
  logout: () => Promise<void>;
  refreshUser: (overrides?: Partial<Pick<AuthUser, 'name' | 'picture'>>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoggedIn: false,
  loading: true,
  login: () => {},
  logout: async () => {},
  refreshUser: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 初始化：检测登录状态
  useEffect(() => {
    async function init() {
      await initAuth();
      const currentUser = await checkLoginState();
      if (currentUser) {
        setUser(currentUser);
      }
      setLoading(false);
    }
    init();
  }, []);

  const login = useCallback(() => {
    navigate('/login');
  }, [navigate]);

  const logout = useCallback(async () => {
    await signOut();
    setUser(null);
    // 退出后重置状态并重新匿名登录
    resetLoginState();
    await initAuth();
  }, []);

  const refreshUser = useCallback(async (overrides?: Partial<Pick<AuthUser, 'name' | 'picture'>>) => {
    const currentUser = await getCurrentUser();
    if (currentUser && overrides) {
      // 直接使用调用方提供的最新数据覆盖，避免缓存和延迟问题
      if (overrides.name !== undefined) currentUser.name = overrides.name;
      if (overrides.picture !== undefined) currentUser.picture = overrides.picture;
    }
    setUser(currentUser);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        loading,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
