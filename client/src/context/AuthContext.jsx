import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import api, { setAccessToken, setUnauthorizedHandler } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pendingToken, setPendingToken] = useState(null);
  const heartbeatRef = useRef(null);

  const stopHeartbeat = () => {
    if (heartbeatRef.current) clearInterval(heartbeatRef.current);
    heartbeatRef.current = null;
  };

  const startHeartbeat = () => {
    stopHeartbeat();
    // initial beat and then every 30s
    api.post('/auth/heartbeat').catch(() => {});
    heartbeatRef.current = setInterval(() => {
      api.post('/auth/heartbeat').catch(() => {});
    }, 30000);
  };

  useEffect(() => {
    setUnauthorizedHandler(() => {
      setUser(null);
      setAccessToken(null);
      stopHeartbeat();
    });
  }, []);

  useEffect(() => {
    // try refresh on mount (if session cookie still present in this browser session)
    (async () => {
      try {
        const { data } = await api.post('/auth/refresh');
        setAccessToken(data.accessToken);
        setUser(data.user);
        startHeartbeat();
      } catch {
        setAccessToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
    return () => stopHeartbeat();
  }, []);

  useEffect(() => {
    const logoutBeacon = () => {
      try {
        const url = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api') + '/auth/logout';
        navigator.sendBeacon(url, new Blob([], { type: 'application/json' }));
      } catch {}
      setAccessToken(null);
    };
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') logoutBeacon();
    };
    window.addEventListener('pagehide', logoutBeacon);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.removeEventListener('pagehide', logoutBeacon);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    setPendingToken(data.pendingToken);
    return data;
  };

  const verify2fa = async (code) => {
    const { data } = await api.post('/auth/verify-2fa', { code, pendingToken });
    setAccessToken(data.accessToken);
    setUser(data.user);
    setPendingToken(null);
    startHeartbeat();
    return data;
  };

  const resendCode = async () => {
    await api.post('/auth/resend-code', { pendingToken });
  };

  const register = async (payload) => {
    const { data } = await api.post('/auth/register', payload);
    return data;
  };

  const logout = async () => {
    try { await api.post('/auth/logout'); } catch {}
    setAccessToken(null);
    setUser(null);
    stopHeartbeat();
  };

  const value = useMemo(() => ({ user, loading, pendingToken, login, verify2fa, resendCode, register, logout }), [user, loading, pendingToken]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
