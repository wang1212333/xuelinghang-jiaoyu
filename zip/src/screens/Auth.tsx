import { useState } from 'react';
import { Mail, Lock, User, Phone, Eye, EyeOff, ArrowLeft, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AuthProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onSwitchToRegister: () => void;
}

export function Login({ onLogin, onSwitchToRegister }: AuthProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('请输入邮箱和密码');
      return;
    }

    setIsLoading(true);

    try {
      await onLogin(email, password);
    } catch (err: any) {
      setError(err.message || '登录失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <div className="p-4">
        <button className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center">
          <ArrowLeft className="w-5 h-5 text-on-surface" />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-sm space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-headline font-bold text-on-surface">欢迎回来</h1>
            <p className="text-tertiary">登录您的学领航员账号</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-on-surface">邮箱</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-tertiary" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="请输入邮箱"
                  className="w-full bg-surface-container-high border border-outline-variant focus:border-primary rounded-xl py-4 pl-12 pr-4 text-on-surface placeholder:text-outline"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-on-surface">密码</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-tertiary" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="请输入密码"
                  className="w-full bg-surface-container-high border border-outline-variant focus:border-primary rounded-xl py-4 pl-12 pr-12 text-on-surface placeholder:text-outline"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-tertiary hover:text-on-surface"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-error/10 border border-error/20 text-error text-sm p-3 rounded-xl">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-on-primary font-bold py-4 rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
              登录
            </button>
          </form>

          <div className="text-center">
            <span className="text-tertiary">还没有账号？</span>
            <button
              onClick={onSwitchToRegister}
              className="text-primary font-medium hover:underline ml-1"
            >
              立即注册
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface RegisterProps {
  onRegister: (email: string, password: string) => Promise<void>;
  onSwitchToLogin: () => void;
}

export function Register({ onRegister, onSwitchToLogin }: RegisterProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    wechat: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('邮箱和密码不能为空');
      return;
    }

    if (formData.password.length < 6) {
      setError('密码至少需要6位');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }

    setIsLoading(true);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            phone: formData.phone,
            wechat: formData.wechat
          }
        }
      });

      if (signUpError) {
        setError(signUpError.message || '注册失败，请稍后重试');
        return;
      }

      if (data.user) {
        await supabase.from('profiles').insert({
          user_id: data.user.id,
          name: formData.name,
          phone: formData.phone || '',
          wechat: formData.wechat || '',
          role: 'user'
        });
        await onRegister(formData.email, formData.password);
      }
    } catch (err: any) {
      setError(err.message || '注册失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <div className="p-4">
        <button
          onClick={onSwitchToLogin}
          className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 text-on-surface" />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-sm space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-headline font-bold text-on-surface">创建账号</h1>
            <p className="text-tertiary">加入学领航员，开启教育之旅</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-on-surface">姓名</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-tertiary" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="请输入您的姓名"
                  className="w-full bg-surface-container-high border border-outline-variant focus:border-primary rounded-xl py-4 pl-12 pr-4 text-on-surface placeholder:text-outline"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-on-surface">邮箱</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-tertiary" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="请输入邮箱"
                  className="w-full bg-surface-container-high border border-outline-variant focus:border-primary rounded-xl py-4 pl-12 pr-4 text-on-surface placeholder:text-outline"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-on-surface">密码</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-tertiary" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="请输入密码（至少6位）"
                  className="w-full bg-surface-container-high border border-outline-variant focus:border-primary rounded-xl py-4 pl-12 pr-12 text-on-surface placeholder:text-outline"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-tertiary hover:text-on-surface"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-on-surface">确认密码</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-tertiary" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="请再次输入密码"
                  className="w-full bg-surface-container-high border border-outline-variant focus:border-primary rounded-xl py-4 pl-12 pr-4 text-on-surface placeholder:text-outline"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-on-surface">手机号（选填）</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-tertiary" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="请输入手机号"
                  className="w-full bg-surface-container-high border border-outline-variant focus:border-primary rounded-xl py-4 pl-12 pr-4 text-on-surface placeholder:text-outline"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-on-surface">微信号（选填）</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-tertiary" />
                <input
                  type="text"
                  name="wechat"
                  value={formData.wechat}
                  onChange={handleChange}
                  placeholder="请输入微信号"
                  className="w-full bg-surface-container-high border border-outline-variant focus:border-primary rounded-xl py-4 pl-12 pr-4 text-on-surface placeholder:text-outline"
                />
              </div>
            </div>

            {error && (
              <div className="bg-error/10 border border-error/20 text-error text-sm p-3 rounded-xl">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-on-primary font-bold py-4 rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
              注册
            </button>
          </form>

          <div className="text-center">
            <span className="text-tertiary">已有账号？</span>
            <button
              onClick={onSwitchToLogin}
              className="text-primary font-medium hover:underline ml-1"
            >
              立即登录
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}