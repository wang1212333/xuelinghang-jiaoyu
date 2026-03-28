import { useState, useEffect } from 'react';
import { Users, FileText, CheckCircle, Clock } from 'lucide-react';
import { adminApi } from '../services/api';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTutors: 0,
    pendingRequirements: 0,
    matchedRequirements: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [users, tutors, requirements] = await Promise.all([
          adminApi.getUsers(),
          adminApi.getTutors(),
          adminApi.getRequirements()
        ]);

        setStats({
          totalUsers: users?.length || 0,
          totalTutors: tutors?.length || 0,
          pendingRequirements: requirements?.filter(r => r.status === 'matching').length || 0,
          matchedRequirements: requirements?.filter(r => r.status === 'matched').length || 0
        });
      } catch (error) {
        console.error('Failed to load stats:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          label="总用户数"
          value={stats.totalUsers}
          color="text-blue-500"
        />
        <StatCard
          icon={FileText}
          label="导师数量"
          value={stats.totalTutors}
          color="text-green-500"
        />
        <StatCard
          icon={Clock}
          label="待审核需求"
          value={stats.pendingRequirements}
          color="text-yellow-500"
        />
        <StatCard
          icon={CheckCircle}
          label="已配对需求"
          value={stats.matchedRequirements}
          color="text-primary"
        />
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold mb-4">欢迎使用学领航管理后台</h3>
        <p className="text-on-surface-variant">
          在左侧菜单中选择功能：
        </p>
        <ul className="mt-4 space-y-2 text-on-surface-variant">
          <li>• <strong>用户管理</strong> - 查看所有注册用户信息</li>
          <li>• <strong>需求审批</strong> - 审核用户的课程需求和配对申请</li>
        </ul>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: number; color: string }) {
  return (
    <div className="card flex items-center gap-4">
      <div className={`p-3 rounded-xl bg-surface-container-high ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm text-on-surface-variant">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}