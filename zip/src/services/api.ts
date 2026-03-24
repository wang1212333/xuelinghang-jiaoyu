import config from '../config/api';

const BASE_URL = config.apiBaseUrl;

const AUTH_TOKEN_KEY = 'auth_token';
const USER_DATA_KEY = 'user_data';

interface ApiError {
  message?: string;
}

export function getAuthToken(): string | null {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setAuthToken(token: string): void {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function clearAuth(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(USER_DATA_KEY);
}

export function getStoredUser(): any | null {
  const data = localStorage.getItem(USER_DATA_KEY);
  return data ? JSON.parse(data) : null;
}

export function setStoredUser(user: any): void {
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
}

async function fetchApi(endpoint: string, options: RequestInit = {}) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const token = getAuthToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {})
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (response.status === 204) {
      return null;
    }

    const data = await response.json();

    if (!response.ok) {
      return { error: data.error || `请求失败 (${response.status})` };
    }

    return data;
  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.warn(`API timeout for ${endpoint}, using fallback data`);
    } else {
      console.warn(`API error for ${endpoint}:`, error.message);
    }
    return { error: error.message || '网络错误' };
  }
}

export interface UserProfile {
  id?: string;
  user_id?: string;
  name: string;
  role: string;
  gender: string;
  grade: string;
  phone: string;
  email?: string;
  wechat: string;
  city: string;
  district: string;
  address: string;
  avatar_url?: string;
  avatarUrl?: string;
  wallet_balance?: number;
}

export interface Tutor {
  id: string;
  name: string;
  university: string;
  subjects: string[];
  categories: string[];
  rating: number;
  total_hours?: number;
  hours?: number;
  price: number;
  image_url?: string;
  image?: string;
  bio?: string;
  achievements?: any[];
  parent_feedback?: any[];
  is_verified?: boolean;
}

export interface Course {
  id: string;
  title: string;
  description?: string;
  desc?: string;
  details: string;
  price: string;
  tags: string[];
  students_count?: string;
  students?: string;
  icon?: string;
}

export interface Message {
  id: string;
  title: string;
  content: string;
  timestamp?: string;
  created_at?: string;
  is_read: boolean;
  isRead?: boolean;
  type: 'system' | 'tutor' | 'advisor';
  sender_name?: string;
  sender_avatar?: string;
  sender?: string;
  avatar?: string;
}

export interface Requirement {
  id?: string;
  user_id?: string;
  grade: string;
  subjects: string[];
  gender: string;
  school_bg: string;
  time_slot: string;
  budget: number;
  details: string;
  status?: string;
}

export const userApi = {
  get: async (id: string) => {
    const data = await fetchApi(`/users/${id}`);
    if (!data) return null;
    return {
      ...data,
      avatarUrl: data.avatar_url
    };
  },
  update: (id: string, data: Partial<UserProfile>) => fetchApi(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  create: (data: Partial<UserProfile>) => fetchApi('/users', { method: 'POST', body: JSON.stringify(data) })
};

export const tutorApi = {
  getAll: async (params?: { search?: string; category?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    const data = await fetchApi(`/tutors${query ? `?${query}` : ''}`);
    if (!data || !Array.isArray(data)) return [];
    return data.map((t: any) => ({
      ...t,
      hours: t.total_hours,
      image: t.image_url
    }));
  },
  getById: async (id: string) => {
    const data = await fetchApi(`/tutors/${id}`);
    if (!data) return null;
    return {
      ...data,
      hours: data.total_hours,
      image: data.image_url
    };
  },
  getReviews: (id: string) => fetchApi(`/tutors/${id}/reviews`)
};

export const courseApi = {
  getAll: async (params?: { featured?: boolean }) => {
    const query = new URLSearchParams(params as any).toString();
    const data = await fetchApi(`/courses${query ? `?${query}` : ''}`);
    if (!data || !Array.isArray(data)) return [];
    return data.map((c: any) => ({
      ...c,
      desc: c.description || c.desc,
      students: c.students_count
    }));
  },
  getById: async (id: string) => {
    const data = await fetchApi(`/courses/${id}`);
    if (!data) return null;
    return {
      ...data,
      desc: data.description || data.desc,
      students: data.students_count
    };
  }
};

export const requirementApi = {
  getAll: (userId?: string) => fetchApi(`/requirements${userId ? `?user_id=${userId}` : ''}`),
  create: (data: Requirement) => fetchApi('/requirements', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Requirement>) => fetchApi(`/requirements/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => fetchApi(`/requirements/${id}`, { method: 'DELETE' })
};

export const messageApi = {
  getAll: async (userId?: string) => {
    const data = await fetchApi(`/messages${userId ? `?user_id=${userId}` : ''}`);
    if (!data || !Array.isArray(data)) return [];
    return data.map((m: any) => ({
      ...m,
      isRead: m.is_read,
      sender: m.sender_name,
      avatar: m.sender_avatar
    }));
  },
  create: (data: Partial<Message>) => fetchApi('/messages', { method: 'POST', body: JSON.stringify(data) }),
  markAsRead: (id: string) => fetchApi(`/messages/${id}/read`, { method: 'PUT' }),
  markAllAsRead: (userId: string) => fetchApi('/messages/read-all', { method: 'PUT', body: JSON.stringify({ user_id: userId }) })
};

export const appointmentApi = {
  getAll: (userId?: string) => fetchApi(`/appointments${userId ? `?user_id=${userId}` : ''}`),
  create: (data: any) => fetchApi('/appointments', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => fetchApi(`/appointments/${id}`, { method: 'PUT', body: JSON.stringify(data) })
};

export const enrollmentApi = {
  getAll: (userId?: string) => fetchApi(`/enrollments${userId ? `?user_id=${userId}` : ''}`),
  create: (userId: string, courseId: string) => fetchApi('/enrollments', { method: 'POST', body: JSON.stringify({ user_id: userId, course_id: courseId }) }),
  delete: (id: string) => fetchApi(`/enrollments/${id}`, { method: 'DELETE' })
};

export const favoriteApi = {
  getAll: (userId?: string) => fetchApi(`/favorites${userId ? `?user_id=${userId}` : ''}`),
  create: (userId: string, tutorId: string) => fetchApi('/favorites', { method: 'POST', body: JSON.stringify({ user_id: userId, tutor_id: tutorId }) }),
  delete: (tutorId: string, userId: string) => fetchApi(`/favorites/${tutorId}?user_id=${userId}`, { method: 'DELETE' })
};

export const DEMO_USER_ID = '00000000-0000-0000-0000-000000000001';

export const authApi = {
  register: async (data: { email: string; password: string; name?: string; phone?: string; wechat?: string }) => {
    const result = await fetchApi('/auth/register', { method: 'POST', body: JSON.stringify(data) });
    if (result && result.error) {
      return { success: false, error: result.error };
    }
    return result;
  },
  login: async (email: string, password: string) => {
    const data = await fetchApi('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
    if (data && data.error) {
      return { success: false, error: data.error };
    }
    if (data && data.token) {
      setAuthToken(data.token);
      setStoredUser(data.user);
    }
    return data;
  },
  logout: () => {
    clearAuth();
  },
  getCurrentUser: async () => {
    const token = getAuthToken();
    if (!token) return null;
    const data = await fetchApi('/auth/me');
    if (data && data.error) {
      return null;
    }
    if (data) {
      setStoredUser(data);
    }
    return data;
  }
};

export default {
  user: userApi,
  tutor: tutorApi,
  course: courseApi,
  requirement: requirementApi,
  message: messageApi,
  appointment: appointmentApi,
  enrollment: enrollmentApi,
  favorite: favoriteApi,
  auth: authApi,
  DEMO_USER_ID,
  getAuthToken,
  clearAuth,
  getStoredUser,
  setStoredUser
};