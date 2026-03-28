import { useState } from 'react';
import { Lock, Mail, User } from 'lucide-react';

export default function AdminRegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      // 直接使用 Supabase API 创建管理员
      const response = await fetch('https://mxciauwvqwcjkpjhznwu.supabase.co/auth/v1/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'sb_publishable_212yua6bkmJ77gYr4jTrLA_zETYakk_'
        },
        body: JSON.stringify({
          email,
          password,
          options: {
            data: {
              role: 'admin'
            }
          }
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || '创建失败');
      }

      // 创建 profile
      const profileResponse = await fetch('https://mxciauwvqwcjkpjhznwu.supabase.co/rest/v1/profiles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'sb_publishable_212yua6bkmJ77gYr4jTrLA_zETYakk_',
          'Authorization': `Bearer sb_publishable_212yua6bkmJ77gYr4jTrLA_zETYakk_`,
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          user_id: data.user.id,
          name: name || email.split('@')[0],
          role_label: '管理员'
        })
      });

      if (!profileResponse.ok) {
        console.error('Profile creation failed:', await profileResponse.text());
      }

      setMessage('✅ 管理员账号创建成功！请使用此账号登录。');
      setEmail('');
      setPassword('');
      setName('');
    } catch (error: any) {
      setMessage('❌ ' + (error.message || '注册失败'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-headline font-bold text-primary mb-2">创建管理员账号</h1>
          <p className="text-on-surface-variant">首次使用，请先创建管理员账号</p>
        </div>

        {message && (
          <div className={`mb-4 p-4 rounded-xl ${message.includes('✅') ? 'bg-green-500/20 border-green-500/30 text-green-500' : 'bg-error/10 border-error/30 text-error'} border`}>
            {message}
          </div>
        )}

        <div className="card">
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-on-surface">姓名</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-tertiary" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="请输入姓名"
                  className="input-field pl-12"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-on-surface">邮箱</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-tertiary" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="请输入管理员邮箱"
                  className="input-field pl-12"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-on-surface">密码</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-tertiary" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="请输入密码（至少 6 位）"
                  className="input-field pl-12"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '创建中...' : '创建管理员账号'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-tertiary mt-6">
          创建完成后，请使用此账号登录
        </p>
      </div>
    </div>
  );
}
