import { useState, useEffect, useCallback } from 'react';
import { Home } from './screens/Home';
import { Publish } from './screens/Publish';
import { Profile } from './screens/Profile';
import { EditProfile } from './screens/EditProfile';
import { TutorDetail } from './screens/TutorDetail';
import { Messages } from './screens/Messages';
import { Login, Register } from './screens/Auth';
import { BottomNav, TopNav } from './components/Navigation';
import api, { DEMO_USER_ID, getAuthToken, getStoredUser, clearAuth } from './services/api';
import { supabase } from './lib/supabase';

export interface Message {
  id: string;
  title: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  type: 'system' | 'tutor' | 'advisor';
  sender?: string;
  avatar?: string;
}

export interface Requirement {
  id?: string;
  grade: string;
  subjects: string[];
  gender: string;
  schoolBg: string;
  timeSlot: string;
  budget: number;
  details: string;
  status?: string;
}

export interface UserProfile {
  name: string;
  role: string;
  gender: string;
  grade: string;
  phone: string;
  email: string;
  wechat: string;
  city: string;
  district: string;
  address: string;
  avatarUrl: string;
}

const DEFAULT_PROFILE: UserProfile = {
  name: 'Sarah妈妈',
  role: '学领航员',
  gender: '女',
  grade: '高二',
  phone: '138****8888',
  email: 'sarah.mom@example.com',
  wechat: 'sarah_mom_88',
  city: '上海市',
  district: '浦东新区',
  address: '世纪大道 100 号',
  avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA5EWUQn8TUnKvZoTf6I8utLJoFGRKp9FW4It83wpugIFFur4-zB04Qqb0CHtsb4rW2z9iAme-lfZcbNqu3MgHsnASOMN_nn29ZYiO7JXZaFxcs02ByDM8VSJDpfial0kv8P59Zut_jk0CYku-4Gu3RERsZ5qHdC8496AOCyKTBwy6f5qrIZVMyzxnhmkdgg25LaF_h6zgxtrb8YF2Df-yW-XoVM8_pW20f4aoxCpUncHwAZr0LW9G8kyUXPfS5IeIBCJQWdi2ubdjM'
};

export default function App() {
  const [currentTab, setCurrentTab] = useState('home');
  const [selectedTutor, setSelectedTutor] = useState<string | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [publishedRequirement, setPublishedRequirement] = useState<Requirement | null>(null);
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  useEffect(() => {
    async function checkAuth() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setIsAuthenticated(true);
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', session.user.id)
            .single();

          if (profileData) {
            setUserProfile({
              name: profileData.name || '用户',
              role: profileData.role_label || profileData.role || '学领航员',
              gender: profileData.gender || '',
              grade: profileData.grade || '',
              phone: profileData.phone || '',
              email: profileData.email || session.user.email || '',
              wechat: profileData.wechat || '',
              city: profileData.city || '',
              district: profileData.district || '',
              address: profileData.address || '',
              avatarUrl: profileData.avatar_url || profileData.avatarUrl || DEFAULT_PROFILE.avatarUrl
            });
          } else {
            setUserProfile({
              ...DEFAULT_PROFILE,
              email: session.user.email || ''
            });
          }
          return true;
        }
      } catch (error) {
        console.warn('Supabase auth check failed:', error);
      }
      return false;
    }

    async function loadInitialData() {
      try {
        const isAuth = await checkAuth();
        if (isAuth) {
          setIsLoading(false);
          return;
        }

        const profileData = await api.user.get(DEMO_USER_ID);
        if (profileData) {
          setUserProfile({
            name: profileData.name,
            role: profileData.role_label || profileData.role || '学领航员',
            gender: profileData.gender,
            grade: profileData.grade || '高二',
            phone: profileData.phone || '138****8888',
            email: profileData.email || 'sarah.mom@example.com',
            wechat: profileData.wechat || 'sarah_mom_88',
            city: profileData.city || '上海市',
            district: profileData.district || '浦东新区',
            address: profileData.address || '世纪大道 100 号',
            avatarUrl: profileData.avatarUrl || profileData.avatar_url || DEFAULT_PROFILE.avatarUrl
          });
        }

        const messagesData = await api.message.getAll(DEMO_USER_ID);
        if (messagesData && messagesData.length > 0) {
          setMessages(messagesData.map((m: any) => ({
            ...m,
            timestamp: m.created_at || m.timestamp || new Date().toISOString()
          })));
        } else {
          setMessages([{
            id: '1',
            title: '欢迎来到 Digital Atheneum',
            content: '感谢您注册我们的平台。在这里，您可以找到最顶尖的学府导师。',
            timestamp: new Date().toISOString(),
            isRead: false,
            type: 'system'
          }]);
        }

        const requirementsData = await api.requirement.getAll(DEMO_USER_ID);
        if (requirementsData && requirementsData.length > 0) {
          const latest = requirementsData[0];
          setPublishedRequirement({
            id: latest.id,
            grade: latest.grade,
            subjects: latest.subjects,
            gender: latest.gender,
            schoolBg: latest.school_bg,
            timeSlot: latest.time_slot,
            budget: latest.budget,
            details: latest.details,
            status: latest.status
          });
        }

        const enrollmentsData = await api.enrollment.getAll(DEMO_USER_ID);
        if (enrollmentsData) {
          setEnrolledCourses(enrollmentsData.map((e: any) => e.course_id));
        }
      } catch (error) {
        console.warn('Failed to load data from API, using defaults:', error);
        setMessages([{
          id: '1',
          title: '欢迎来到 Digital Atheneum',
          content: '感谢您注册我们的平台。在这里，您可以找到最顶尖的学府导师。',
          timestamp: new Date().toISOString(),
          isRead: false,
          type: 'system'
        }]);
      } finally {
        setIsLoading(false);
      }
    }
    loadInitialData();
  }, []);

  const addMessage = useCallback(async (msg: Omit<Message, 'id' | 'timestamp' | 'isRead'>) => {
    const newMessage: Message = {
      ...msg,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      isRead: false
    };
    setMessages(prev => [newMessage, ...prev]);

    try {
      await api.message.create({
        user_id: DEMO_USER_ID,
        title: msg.title,
        content: msg.content,
        type: msg.type,
        sender_name: msg.sender,
        sender_avatar: msg.avatar
      });
    } catch (error) {
      console.warn('Failed to save message to API:', error);
    }
  }, []);

  const markAsRead = useCallback(async (id: string) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, isRead: true } : m));
    try {
      await api.message.markAsRead(id);
    } catch (error) {
      console.warn('Failed to mark message as read:', error);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    setMessages(prev => prev.map(m => ({ ...m, isRead: true })));
    try {
      await api.message.markAllAsRead(DEMO_USER_ID);
    } catch (error) {
      console.warn('Failed to mark all messages as read:', error);
    }
  }, []);

  const handleSaveProfile = useCallback(async (data: UserProfile) => {
    setUserProfile(data);
    setIsEditingProfile(false);
    addMessage({
      title: '资料更新成功',
      content: '您的个人资料已成功更新。',
      type: 'system'
    });

    try {
      await api.user.update(DEMO_USER_ID, {
        name: data.name,
        gender: data.gender,
        grade: data.grade,
        phone: data.phone,
        wechat: data.wechat,
        city: data.city,
        district: data.district,
        address: data.address,
        avatar_url: data.avatarUrl,
        role_label: data.role
      });
    } catch (error) {
      console.warn('Failed to save profile to API:', error);
    }
  }, [addMessage]);

  const handlePublishRequirement = useCallback(async (req: Requirement) => {
    setPublishedRequirement(req);
    addMessage({
      title: '需求发布成功',
      content: `您已成功发布【${req.grade} - ${req.subjects.join(', ')}】的教学需求，我们的教育顾问将尽快为您匹配导师。`,
      type: 'system'
    });

    try {
      const existingReqs = await api.requirement.getAll(DEMO_USER_ID);
      if (existingReqs && existingReqs.length > 0 && existingReqs[0].id) {
        await api.requirement.update(existingReqs[0].id, {
          grade: req.grade,
          subjects: req.subjects,
          gender: req.gender,
          school_bg: req.schoolBg,
          time_slot: req.timeSlot,
          budget: req.budget,
          details: req.details
        });
      } else {
        await api.requirement.create({
          user_id: DEMO_USER_ID,
          grade: req.grade,
          subjects: req.subjects,
          gender: req.gender,
          school_bg: req.schoolBg,
          time_slot: req.timeSlot,
          budget: req.budget,
          details: req.details
        });
      }
    } catch (error) {
      console.warn('Failed to save requirement to API:', error);
    }
  }, [addMessage]);

  const handleEnrollCourse = useCallback(async (courseId: string) => {
    if (!enrolledCourses.includes(courseId)) {
      setEnrolledCourses(prev => [...prev, courseId]);
      try {
        await api.enrollment.create(DEMO_USER_ID, courseId);
      } catch (error) {
        console.warn('Failed to enroll course:', error);
      }
    }
  }, [enrolledCourses]);

  const unreadCount = messages.filter(m => !m.isRead).length;

  const handleLogin = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    if (data.user) {
      setIsAuthenticated(true);
      setIsLoading(false);
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', data.user.id)
        .single();

      if (profileData) {
        setUserProfile({
          name: profileData.name || '用户',
          role: profileData.role_label || profileData.role || '学领航员',
          gender: profileData.gender || '',
          grade: profileData.grade || '',
          phone: profileData.phone || '',
          email: profileData.email || data.user.email || '',
          wechat: profileData.wechat || '',
          city: profileData.city || '',
          district: profileData.district || '',
          address: profileData.address || '',
          avatarUrl: profileData.avatar_url || profileData.avatarUrl || DEFAULT_PROFILE.avatarUrl
        });
      } else {
        setUserProfile({
          ...DEFAULT_PROFILE,
          email: data.user.email || ''
        });
      }
    }
  }, []);

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setCurrentTab('home');
  }, []);

  const handleRegister = useCallback(async (email: string, password: string) => {
    await handleLogin(email, password);
  }, [handleLogin]);

  const renderScreen = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      );
    }

    if (!isAuthenticated) {
      if (authMode === 'register') {
        return (
          <Register
            onRegister={handleRegister}
            onSwitchToLogin={() => setAuthMode('login')}
          />
        );
      }
      return (
        <Login
          onLogin={handleLogin}
          onSwitchToRegister={() => setAuthMode('register')}
        />
      );
    }

    if (selectedTutor) {
      return <TutorDetail addMessage={addMessage} />;
    }
    if (isEditingProfile) {
      return (
        <EditProfile
          initialData={userProfile}
          onBack={() => setIsEditingProfile(false)}
          onSave={handleSaveProfile}
        />
      );
    }
    switch (currentTab) {
      case 'home': return <Home onSelectTutor={setSelectedTutor} enrolledCourses={enrolledCourses} setEnrolledCourses={setEnrolledCourses} addMessage={addMessage} onEnrollCourse={handleEnrollCourse} />;
      case 'publish': return <Publish addMessage={addMessage} requirement={publishedRequirement} setRequirement={handlePublishRequirement} />;
      case 'profile': return <Profile userProfile={userProfile} addMessage={addMessage} onEditProfile={() => setIsEditingProfile(true)} onNavigateToMessages={() => setCurrentTab('messages')} onLogout={handleLogout} />;
      case 'messages': return <Messages messages={messages} markAsRead={markAsRead} markAllAsRead={markAllAsRead} />;
      default: return <Home onSelectTutor={setSelectedTutor} enrolledCourses={enrolledCourses} setEnrolledCourses={setEnrolledCourses} addMessage={addMessage} onEnrollCourse={handleEnrollCourse} />;
    }
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface pb-32">
      <TopNav
        showBack={!!selectedTutor || isEditingProfile}
        onBack={() => {
          if (selectedTutor) setSelectedTutor(null);
          else if (isEditingProfile) setIsEditingProfile(false);
        }}
        title={selectedTutor ? "导师详情" : isEditingProfile ? "编辑资料" : "墨金学术"}
      />
      <main className="pt-24 px-6 max-w-5xl mx-auto">
        {renderScreen()}
      </main>
      {!selectedTutor && !isEditingProfile && <BottomNav currentTab={currentTab} onChange={setCurrentTab} unreadCount={unreadCount} />}
    </div>
  );
}