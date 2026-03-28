import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, User, Book, AlertTriangle, MessageSquare } from 'lucide-react';
import { adminApi, Requirement } from '../services/api';

interface RequirementsPageProps {
  onLogout: () => void;
}

export default function RequirementsPage({ onLogout }: RequirementsPageProps) {
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'matching' | 'matched' | 'completed'>('all');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    loadRequirements();
  }, []);

  async function loadRequirements() {
    try {
      const data = await adminApi.getRequirements();
      setRequirements(data || []);
    } catch (error) {
      console.error('Failed to load requirements:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const filteredRequirements = requirements.filter(req => {
    if (filter === 'all') return true;
    return req.status === filter;
  });

  const handleApprove = async (id: string) => {
    if (!window.confirm('确定要批准此需求并通知用户吗？')) return;

    setProcessingId(id);
    try {
      const requirement = requirements.find(r => r.id === id);
      if (!requirement) return;

      await adminApi.updateRequirementStatus(id, 'matched');

      await adminApi.createMessage({
        user_id: requirement.user_id,
        title: '您的需求已配对成功',
        content: `恭喜！您发布的辅导需求已审核通过并成功配对。我们的导师将在24小时内与您联系，请保持手机/微信畅通。\n\n需求详情：\n• 科目：${requirement.subjects?.join('、')}\n• 年级：${requirement.grade}\n• 时间：${requirement.time_slot}\n• 预算：¥${requirement.budget}`,
        type: 'system',
        is_read: false
      });

      setSuccessMessage('需求已批准并通知用户');
      setTimeout(() => setSuccessMessage(''), 3000);
      await loadRequirements();
    } catch (error) {
      console.error('Failed to approve requirement:', error);
      alert('操作失败，请重试');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: string) => {
    if (!window.confirm('确定要拒绝此需求吗？')) return;

    setProcessingId(id);
    try {
      const requirement = requirements.find(r => r.id === id);
      if (!requirement) return;

      await adminApi.updateRequirementStatus(id, 'cancelled');

      await adminApi.createMessage({
        user_id: requirement.user_id,
        title: '您的需求未通过审核',
        content: `抱歉，您发布的辅导需求未通过审核。\n\n如有疑问，请联系客服咨询。`,
        type: 'system',
        is_read: false
      });

      setSuccessMessage('需求已拒绝并通知用户');
      setTimeout(() => setSuccessMessage(''), 3000);
      await loadRequirements();
    } catch (error) {
      console.error('Failed to reject requirement:', error);
      alert('操作失败，请重试');
    } finally {
      setProcessingId(null);
    }
  };

  const handleComplete = async (id: string) => {
    if (!window.confirm('确定要将此需求标记为已完成吗？')) return;

    setProcessingId(id);
    try {
      await adminApi.updateRequirementStatus(id, 'completed');

      const requirement = requirements.find(r => r.id === id);
      if (requirement) {
        await adminApi.createMessage({
          user_id: requirement.user_id,
          title: '您的需求已完成',
          content: `您的辅导需求已完成全部服务。感谢您的信任！\n\n如果您满意我们的服务，欢迎给予好评。`,
          type: 'system',
          is_read: false
        });
      }

      setSuccessMessage('需求已标记为完成');
      setTimeout(() => setSuccessMessage(''), 3000);
      await loadRequirements();
    } catch (error) {
      console.error('Failed to complete requirement:', error);
      alert('操作失败，请重试');
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'matching':
        return <span className="status-badge status-pending"><Clock className="w-3 h-3 mr-1" />待配对</span>;
      case 'matched':
        return <span className="status-badge status-matched"><CheckCircle className="w-3 h-3 mr-1" />已配对</span>;
      case 'completed':
        return <span className="status-badge status-approved"><CheckCircle className="w-3 h-3 mr-1" />已完成</span>;
      case 'cancelled':
        return <span className="status-badge status-rejected"><XCircle className="w-3 h-3 mr-1" />已拒绝</span>;
      default:
        return <span className="status-badge">{status}</span>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {successMessage && (
        <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl flex items-center gap-3 text-green-500">
          <CheckCircle className="w-5 h-5" />
          <span>{successMessage}</span>
        </div>
      )}

      <div className="flex gap-2 flex-wrap">
        {(['all', 'matching', 'matched', 'completed'] as const).map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              filter === status
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
            }`}
          >
            {status === 'all' && '全部'}
            {status === 'matching' && '待配对'}
            {status === 'matched' && '已配对'}
            {status === 'completed' && '已完成'}
            <span className="ml-2 opacity-70">
              ({status === 'all' ? requirements.length : requirements.filter(r => r.status === status).length})
            </span>
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredRequirements.map(requirement => (
          <div key={requirement.id} className="card">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{requirement.profiles?.name || '未知用户'}</p>
                  <p className="text-sm text-on-surface-variant">{requirement.users?.email}</p>
                </div>
              </div>
              {getStatusBadge(requirement.status)}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <p className="text-xs text-on-surface-variant mb-1">年级</p>
                <p className="font-medium">{requirement.grade}</p>
              </div>
              <div>
                <p className="text-xs text-on-surface-variant mb-1">科目</p>
                <p className="font-medium flex items-center gap-1">
                  <Book className="w-4 h-4" />
                  {requirement.subjects?.slice(0, 2).join('、')}
                  {requirement.subjects && requirement.subjects.length > 2 && `...`}
                </p>
              </div>
              <div>
                <p className="text-xs text-on-surface-variant mb-1">时间</p>
                <p className="font-medium">{requirement.time_slot}</p>
              </div>
              <div>
                <p className="text-xs text-on-surface-variant mb-1">预算</p>
                <p className="font-medium text-primary">¥{requirement.budget}</p>
              </div>
            </div>

            {requirement.details && (
              <div className="mb-4 p-3 bg-surface-container-low rounded-xl">
                <p className="text-sm text-on-surface-variant mb-1">详细需求</p>
                <p className="text-sm">{requirement.details}</p>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-outline-variant">
              <div className="text-xs text-on-surface-variant">
                发布时间：{new Date(requirement.created_at).toLocaleDateString('zh-CN')}
              </div>

              <div className="flex gap-2">
                {requirement.status === 'matching' && (
                  <>
                    <button
                      onClick={() => handleApprove(requirement.id)}
                      disabled={processingId === requirement.id}
                      className="btn-primary flex items-center gap-2 disabled:opacity-50"
                    >
                      <CheckCircle className="w-4 h-4" />
                      {processingId === requirement.id ? '处理中...' : '批准并配对'}
                    </button>
                    <button
                      onClick={() => handleReject(requirement.id)}
                      disabled={processingId === requirement.id}
                      className="btn-secondary flex items-center gap-2 text-error border-error/30 hover:bg-error/10"
                    >
                      <XCircle className="w-4 h-4" />
                      拒绝
                    </button>
                  </>
                )}
                {requirement.status === 'matched' && (
                  <button
                    onClick={() => handleComplete(requirement.id)}
                    disabled={processingId === requirement.id}
                    className="btn-primary flex items-center gap-2 disabled:opacity-50"
                  >
                    <CheckCircle className="w-4 h-4" />
                    标记完成
                  </button>
                )}
                {requirement.status === 'completed' && (
                  <span className="text-on-surface-variant flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    服务已完成
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}

        {filteredRequirements.length === 0 && (
          <div className="card text-center py-12">
            <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-tertiary opacity-50" />
            <p className="text-on-surface-variant">暂无需求</p>
          </div>
        )}
      </div>
    </div>
  );
}