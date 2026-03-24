import { MessageCircle, Bell, Info, User, CheckCircle2, CheckCheck } from 'lucide-react';
import { Message } from '../App';

interface MessagesProps {
  messages: Message[];
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

export function Messages({ messages, markAsRead, markAllAsRead }: MessagesProps) {
  const getIcon = (type: Message['type']) => {
    switch (type) {
      case 'system':
        return <Bell className="w-5 h-5 text-primary" />;
      case 'tutor':
        return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case 'advisor':
        return <MessageCircle className="w-5 h-5 text-blue-400" />;
      default:
        return <Info className="w-5 h-5 text-tertiary" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return '刚刚';
    if (diffMins < 60) return `${diffMins}分钟前`;
    if (diffHours < 24) return `${diffHours}小时前`;
    if (diffDays === 1) return '昨天';
    if (diffDays < 7) return `${diffDays}天前`;
    
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  };

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in duration-500">
      {/* Header */}
      <section className="mb-8 flex items-end justify-between">
        <div>
          <h2 className="text-4xl font-headline font-bold text-primary mb-2 tracking-tight">消息中心</h2>
          <p className="text-tertiary text-sm tracking-widest font-light">您的专属通知与沟通记录</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="text-xs text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
            {messages.filter(m => !m.isRead).length} 条未读
          </div>
          {messages.some(m => !m.isRead) && (
            <button 
              onClick={markAllAsRead}
              className="text-xs text-tertiary hover:text-primary flex items-center gap-1 transition-colors"
            >
              <CheckCheck className="w-3 h-3" />
              全部已读
            </button>
          )}
        </div>
      </section>

      {/* Message List */}
      <div className="space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-tertiary">
            <MessageCircle className="w-12 h-12 mb-4 opacity-20" />
            <p>暂无消息记录</p>
          </div>
        ) : (
          messages.map((message) => (
            <div 
              key={message.id} 
              onClick={() => !message.isRead && markAsRead(message.id)}
              className={`glass-card p-5 rounded-2xl relative overflow-hidden transition-all hover:border-primary/30 cursor-pointer ${
                !message.isRead ? 'border-primary/20 bg-surface-container-low' : 'border-transparent bg-surface-container-lowest opacity-80'
              }`}
            >
              {!message.isRead && (
                <div className="absolute top-5 right-5 w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(242,202,80,0.8)]"></div>
              )}
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 mt-1">
                  {message.avatar ? (
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant">
                      <img src={message.avatar} alt={message.sender} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center border border-outline-variant/50">
                      {getIcon(message.type)}
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between mb-1">
                    <h4 className={`text-base font-headline truncate pr-4 ${!message.isRead ? 'font-bold text-on-surface' : 'font-medium text-on-surface-variant'}`}>
                      {message.title}
                    </h4>
                    <span className="text-[10px] text-tertiary flex-shrink-0">{formatDate(message.timestamp)}</span>
                  </div>
                  
                  {message.sender && (
                    <p className="text-xs text-primary mb-2 font-medium">{message.sender}</p>
                  )}
                  
                  <p className={`text-sm leading-relaxed ${!message.isRead ? 'text-on-surface-variant' : 'text-tertiary'}`}>
                    {message.content}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
