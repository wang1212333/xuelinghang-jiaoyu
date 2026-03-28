import { useState, useEffect } from 'react';
import { Search, User, Mail, Phone, MessageCircle } from 'lucide-react';
import { adminApi, User as UserType, Profile } from '../services/api';

interface UserWithProfile extends UserType {
  profiles?: Profile;
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserWithProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserWithProfile | null>(null);

  useEffect(() => {
    async function loadUsers() {
      try {
        const data = await adminApi.getUsers();
        setUsers(data || []);
      } catch (error) {
        console.error('Failed to load users:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadUsers();
  }, []);

  const filteredUsers = users.filter(user => {
    const searchLower = searchQuery.toLowerCase();
    return (
      user.email?.toLowerCase().includes(searchLower) ||
      user.profiles?.name?.toLowerCase().includes(searchLower) ||
      user.phone?.includes(searchLower) ||
      user.wechat?.includes(searchLower)
    );
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-tertiary" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="搜索用户邮箱、姓名、手机号或微信..."
          className="input-field pl-12"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-on-surface-variant">用户列表 ({filteredUsers.length})</h3>
          {filteredUsers.map(user => (
            <div
              key={user.id}
              onClick={() => setSelectedUser(user)}
              className={`card cursor-pointer hover:border-primary transition-colors ${
                selectedUser?.id === user.id ? 'border-primary' : ''
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{user.profiles?.name || '未设置姓名'}</p>
                  <p className="text-sm text-on-surface-variant truncate">{user.email}</p>
                </div>
                <span className={`status-badge ${user.role === 'admin' ? 'status-approved' : 'status-pending'}`}>
                  {user.role === 'admin' ? '管理员' : '用户'}
                </span>
              </div>
            </div>
          ))}

          {filteredUsers.length === 0 && (
            <div className="card text-center py-8 text-on-surface-variant">
              未找到用户
            </div>
          )}
        </div>

        <div className="card sticky top-24">
          {selectedUser ? (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{selectedUser.profiles?.name || '未设置姓名'}</h3>
                  <p className="text-on-surface-variant">{selectedUser.email}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-tertiary" />
                  <span>{selectedUser.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-tertiary" />
                  <span>{selectedUser.phone || '未填写'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-5 h-5 text-tertiary" />
                  <span>{selectedUser.wechat || '未填写'}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-outline-variant">
                <h4 className="text-sm font-medium mb-3">附加信息</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">用户ID</span>
                    <span className="truncate ml-2">{selectedUser.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">角色</span>
                    <span>{selectedUser.profiles?.role_label || selectedUser.role}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">性别</span>
                    <span>{selectedUser.profiles?.gender || '未填写'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">年级</span>
                    <span>{selectedUser.profiles?.grade || '未填写'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">城市</span>
                    <span>{selectedUser.profiles?.city || '未填写'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">注册时间</span>
                    <span>{new Date(selectedUser.created_at).toLocaleDateString('zh-CN')}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-on-surface-variant">
              <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>选择左侧用户查看详情</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}