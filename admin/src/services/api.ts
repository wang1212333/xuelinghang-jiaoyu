const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const ADMIN_TOKEN_KEY = 'admin_token';
const ADMIN_ROLE_KEY = 'admin_role';
const ADMIN_EMAIL_KEY = 'admin_email';

export function getAdminToken(): string | null {
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

export function setAdminToken(token: string): void {
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
}

export function clearAdminToken(): void {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
  localStorage.removeItem(ADMIN_ROLE_KEY);
  localStorage.removeItem(ADMIN_EMAIL_KEY);
}

export function getAdminRole(): string | null {
  return localStorage.getItem(ADMIN_ROLE_KEY);
}

export function setAdminRole(role: string): void {
  localStorage.setItem(ADMIN_ROLE_KEY, role);
}

export function getAdminEmail(): string | null {
  return localStorage.getItem(ADMIN_EMAIL_KEY);
}

export function setAdminEmail(email: string): void {
  localStorage.setItem(ADMIN_EMAIL_KEY, email);
}

async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const token = getAdminToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {})
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  if (response.status === 204) return null;

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || `API Error: ${response.status}`);
  }

  return data;
}

export interface User {
  id: string;
  email: string;
  phone?: string;
  wechat?: string;
  role: string;
  created_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  name: string;
  avatar_url?: string;
  gender?: string;
  grade?: string;
  city?: string;
  district?: string;
  address?: string;
  role_label?: string;
  wallet_balance?: number;
  created_at: string;
}

export interface Requirement {
  id: string;
  user_id: string;
  grade: string;
  subjects: string[];
  gender: string;
  school_bg: string;
  time_slot: string;
  budget: number;
  details?: string;
  status: 'matching' | 'matched' | 'completed' | 'cancelled';
  created_at: string;
  profiles?: Profile;
  users?: User;
}

export interface Message {
  id: string;
  user_id: string;
  title: string;
  content: string;
  type: 'system' | 'tutor' | 'advisor';
  sender_name?: string;
  sender_avatar?: string;
  is_read: boolean;
  created_at: string;
}

export interface Tutor {
  id: string;
  user_id: string;
  name: string;
  university: string;
  subjects: string[];
  categories: string[];
  rating: number;
  total_hours: number;
  price: number;
  image_url?: string;
  bio?: string;
  is_verified: boolean;
  is_active: boolean;
  created_at: string;
}

export const adminApi = {
  login: async (email: string, password: string) => {
    const data = await fetchApi('/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });

    if (!data || !data.success) {
      throw new Error(data?.error || '登录失败');
    }

    if (data.user.role !== 'admin') {
      clearAdminToken();
      throw new Error('您没有管理员权限');
    }

    setAdminToken(data.token);
    setAdminRole(data.user.role);
    setAdminEmail(data.user.email);
    return data;
  },

  logout: () => {
    clearAdminToken();
  },

  getCurrentAdmin: async () => {
    const token = getAdminToken();
    const email = getAdminEmail();
    const role = getAdminRole();
    if (!token || !role) return null;
    return { email, role };
  },

  getUsers: async (): Promise<(User & { profiles?: Profile })[]> => {
    return fetchApi('/admin/users');
  },

  getProfiles: async (): Promise<Profile[]> => {
    return fetchApi('/admin/profiles');
  },

  getRequirements: async (): Promise<Requirement[]> => {
    return fetchApi('/admin/requirements');
  },

  updateRequirementStatus: async (id: string, status: string) => {
    return fetchApi(`/admin/requirements/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  },

  createMessage: async (message: Omit<Message, 'id' | 'created_at'>) => {
    return fetchApi('/admin/messages', {
      method: 'POST',
      body: JSON.stringify(message)
    });
  },

  getMessages: async (userId?: string): Promise<Message[]> => {
    const filter = userId ? `?user_id=${userId}` : '';
    return fetchApi(`/admin/messages${filter}`);
  },

  getTutors: async (): Promise<Tutor[]> => {
    return fetchApi('/admin/tutors');
  },

  getUserMessages: async (userId: string): Promise<Message[]> => {
    return fetchApi(`/admin/messages?user_id=${userId}`);
  }
};

export default adminApi;