const API_URL = 'portfolio-builder-sigma-puce.vercel.app/api';

export interface AuthResponse {
  success: boolean;
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export interface User {
  id: string;
  email: string;
  name: string;
}

const setToken = (token: string) => {
  localStorage.setItem('authToken', token);
};

export const getToken = () => {
  return localStorage.getItem('authToken');
};

export const removeToken = () => {
  localStorage.removeItem('authToken');
};

const getAuthHeader = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const authService = {
  async signup(email: string, password: string, name: string): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Signup failed');
    }

    const data = await response.json() as AuthResponse;
    setToken(data.token);
    return data;
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    const data = await response.json() as AuthResponse;
    setToken(data.token);
    return data;
  },

  async getCurrentUser(): Promise<User> {
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: getAuthHeader()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }

    const data = await response.json();
    return data.user;
  },

  logout() {
    removeToken();
  },

  isAuthenticated(): boolean {
    return !!getToken();
  }
};
