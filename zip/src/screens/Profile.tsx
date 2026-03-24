import { useState } from 'react';
import { Star, LineChart, TrendingUp, Wallet, ArrowRight, Calendar, ClipboardList, Receipt, Bookmark, MessageCircle, Phone, X, Info, ArrowLeft, Clock, CheckCircle, ChevronRight, MapPin } from 'lucide-react';
import { Message, UserProfile } from '../App';

interface ProfileProps {
  userProfile: UserProfile;
  addMessage?: (msg: Omit<Message, 'id' | 'timestamp' | 'isRead'>) => void;
  onEditProfile?: () => void;
  onNavigateToMessages?: () => void;
  onLogout?: () => void;
}

export function Profile({ userProfile, addMessage, onEditProfile, onNavigateToMessages, onLogout }: ProfileProps) {
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', desc: '' });
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [showPhoneModal, setShowPhoneModal] = useState(false);

  const avatarUrl = userProfile.avatarUrl;

  const handleAction = (title: string, desc: string) => {
    if (title === '在线咨询') {
      if (addMessage) {
        addMessage({
          title: '专属顾问已上线',
          content: '您好，我是您的专属教育顾问李老师 (Vincent)，请问有什么可以帮您？',
          type: 'advisor',
          sender: '李老师 (Vincent)',
          avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBgghhlSfJik-trBKAWfob_722APwzogSPjto4E0aOW6N6ybSTZJFQQBxJfdDC817wi-b5-lC-2oKkIPZQLsN2UBj71JmX9MYxOh1OBa_9IQNs3AI0fwKq93FaiAqBFUik8vsNb8eP4lRpQ-3-vpzAzqggluBcpuRyesAl4GZPVcy6dk_NZTKooFUdLWYS6ZWEfO3sa7jHy4i2eSLLjkbipluHRMLhR8uCBDwzVG88d64Wj8w2R3IeA10AFtX9mwbLjbjeqoKDneVA4'
        });
      }
      if (onNavigateToMessages) {
        onNavigateToMessages();
      } else {
        setModalContent({ title, desc: '已发送消息给您的专属顾问，请前往消息中心查看。' });
        setShowModal(true);
      }
      return;
    }

    if (title === '拨打电话') {
      setShowPhoneModal(true);
      return;
    }

    setModalContent({ title, desc });
    setShowModal(true);
  };

  const renderModuleContent = () => {
    switch (activeModule) {
      case '家教需求':
        return (
          <div className="space-y-4">
            {[
              { id: 1, subject: '高中数学', grade: '高二', status: '匹配中', time: '2026-03-20', desc: '需要有耐心，最好是女老师，重点梳理函数和解析几何。', price: '200-300 学分/小时' },
              { id: 2, subject: '初中英语', grade: '初三', status: '已匹配', time: '2026-03-15', desc: '中考冲刺，侧重口语和写作训练。', price: '150-200 学分/小时' }
            ].map(item => (
              <div key={item.id} className="bg-surface-container-low rounded-2xl p-5 border border-outline-variant/10 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs font-bold">{item.grade}</span>
                      <h4 className="text-lg font-headline font-bold text-on-surface">{item.subject}</h4>
                    </div>
                    <p className="text-xs text-tertiary flex items-center gap-1"><Clock className="w-3 h-3"/> 发布于 {item.time}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${item.status === '匹配中' ? 'bg-secondary/10 text-secondary' : 'bg-primary/10 text-primary'}`}>
                    {item.status}
                  </span>
                </div>
                <p className="text-sm text-on-surface/80 leading-relaxed">{item.desc}</p>
                <div className="pt-3 border-t border-outline-variant/10 flex justify-between items-center">
                  <span className="text-sm font-bold text-primary">{item.price}</span>
                  <button className="text-xs font-medium text-tertiary hover:text-primary transition-colors flex items-center gap-1">
                    查看详情 <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        );
      case '我的预约':
        return (
          <div className="space-y-4">
            {[
              { id: 1, tutor: '陈博士', subject: '高等数学', time: '明天 10:00-12:00', status: '待上课', type: '线上' },
              { id: 2, tutor: 'Sarah', subject: 'A-Level 物理', time: '周五 16:00-17:30', status: '待确认', type: '线下 (徐汇区)' }
            ].map(item => (
              <div key={item.id} className="bg-surface-container-low rounded-2xl p-5 border border-outline-variant/10 flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-on-surface">{item.subject} <span className="text-sm font-normal text-tertiary">· {item.tutor}</span></h4>
                  <p className="text-xs text-tertiary flex items-center gap-1"><Clock className="w-3 h-3"/> {item.time}</p>
                  <p className="text-xs text-tertiary flex items-center gap-1"><MapPin className="w-3 h-3"/> {item.type}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${item.status === '待上课' ? 'bg-primary/10 text-primary' : 'bg-surface-container-highest text-tertiary'}`}>
                    {item.status}
                  </span>
                  <button className="text-xs font-medium text-primary hover:underline">管理</button>
                </div>
              </div>
            ))}
          </div>
        );
      case '消课记录':
        return (
          <div className="space-y-4">
            {[
              { id: 1, tutor: '李老师', subject: '高中化学', date: '2026-03-18', duration: '2小时', cost: '-400 学分' },
              { id: 2, tutor: '王学长', subject: '雅思口语', date: '2026-03-15', duration: '1.5小时', cost: '-300 学分' }
            ].map(item => (
              <div key={item.id} className="bg-surface-container-low rounded-2xl p-5 border border-outline-variant/10 flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-on-surface">{item.subject} <span className="text-sm font-normal text-tertiary">· {item.tutor}</span></h4>
                  <p className="text-xs text-tertiary">{item.date} · {item.duration}</p>
                </div>
                <div className="text-right">
                  <span className="text-base font-bold text-on-surface">{item.cost}</span>
                  <p className="text-xs text-tertiary mt-1 flex items-center justify-end gap-1"><CheckCircle className="w-3 h-3 text-primary"/> 已完成</p>
                </div>
              </div>
            ))}
          </div>
        );
      case '我的收藏':
        return (
          <div className="space-y-4">
            {[
              { id: 1, name: '陈博士', title: '清华大学数学系博士', tags: ['数学竞赛', '考研辅导'], rating: 4.9 },
              { id: 2, name: 'Sarah', title: '剑桥大学物理系硕士', tags: ['A-Level', 'IGCSE'], rating: 5.0 }
            ].map(item => (
              <div key={item.id} className="bg-surface-container-low rounded-2xl p-5 border border-outline-variant/10 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center text-primary font-bold text-lg">
                  {item.name[0]}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-start">
                    <h4 className="text-base font-bold text-on-surface">{item.name}</h4>
                    <span className="text-xs font-bold text-primary flex items-center gap-1"><Star className="w-3 h-3 fill-current"/> {item.rating}</span>
                  </div>
                  <p className="text-xs text-tertiary">{item.title}</p>
                  <div className="flex gap-2 mt-2">
                    {item.tags.map(tag => (
                      <span key={tag} className="text-[10px] px-2 py-0.5 bg-surface-container-highest text-tertiary rounded">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Profile Header Section */}
      <section className="relative flex flex-col md:flex-row items-start md:items-center gap-6 py-8">
        <div className="relative">
          <div 
            className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-primary p-1 bg-gradient-to-tr from-primary-container to-primary cursor-pointer hover:scale-105 transition-transform"
            onClick={() => setShowAvatarModal(true)}
          >
            <img 
              src={avatarUrl} 
              alt={userProfile.name} 
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-primary text-on-primary px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase pointer-events-none">
            Elite
          </div>
        </div>
        
        <div className="space-y-1">
          <h2 className="text-3xl font-headline text-on-surface tracking-tight">{userProfile.name}</h2>
          <div className="flex items-center gap-2">
            <Star className="text-primary w-4 h-4 fill-current" />
            <span className="text-xs font-medium tracking-widest text-tertiary">{userProfile.role} · 会员周期剩124天</span>
          </div>
        </div>
        
        <div className="md:ml-auto flex gap-3">
          <button 
            onClick={() => onNavigateToMessages && onNavigateToMessages()}
            className="bg-surface-container-high text-on-surface border border-outline-variant/30 px-4 py-2 rounded-xl text-sm font-semibold active:scale-95 transition-all flex items-center gap-2 hover:bg-surface-container-highest"
          >
            <MessageCircle className="w-4 h-4" />
            消息中心
          </button>
          <button 
            onClick={() => onEditProfile ? onEditProfile() : handleAction('编辑资料', '资料编辑页面正在开发中，敬请期待。')}
            className="bg-primary text-on-primary px-6 py-2 rounded-xl text-sm font-semibold active:scale-95 transition-all shadow-[0_4px_20px_rgba(242,202,80,0.15)]"
          >
            编辑资料
          </button>
          {onLogout && (
            <button 
              onClick={onLogout}
              className="bg-surface-container-high text-error border border-error/30 px-4 py-2 rounded-xl text-sm font-semibold active:scale-95 transition-all hover:bg-error/10"
            >
              退出登录
            </button>
          )}
        </div>
      </section>

      {/* Academic Butler Dashboard (Asymmetric Bento Grid) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-surface-container-low rounded-3xl p-8 relative overflow-hidden group border border-outline-variant/10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-container/5 blur-3xl rounded-full -mr-20 -mt-20"></div>
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex justify-between items-start mb-8">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-tertiary mb-1">Academic Analysis</p>
                <h3 className="text-2xl font-headline text-primary">学术管家仪表盘</h3>
              </div>
              <LineChart className="text-primary w-6 h-6" />
            </div>
            
            <div className="grid grid-cols-2 gap-8 mt-auto">
              <div>
                <p className="text-sm text-tertiary mb-2">本月补习时长</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-headline text-on-surface">42.5</span>
                  <span className="text-sm text-tertiary">小时</span>
                </div>
                <div className="mt-4 w-full h-1 bg-surface-container rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[75%] shadow-[0_0_8px_#f2ca50]"></div>
                </div>
              </div>
              <div>
                <p className="text-sm text-tertiary mb-2">孩子学习进度</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-headline text-on-surface">88</span>
                  <span className="text-sm text-tertiary">%</span>
                </div>
                <p className="text-[10px] text-primary mt-4 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  较上月提升12%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Wallet Card */}
        <div className="editorial-gradient rounded-3xl p-8 flex flex-col justify-between shadow-[0_12px_40px_rgba(212,175,55,0.15)] text-on-primary">
          <div>
            <div className="flex justify-between items-center mb-6">
              <Wallet className="w-6 h-6" />
              <span className="text-[10px] font-bold border border-on-primary/20 px-2 py-0.5 rounded">WALLET</span>
            </div>
            <p className="text-sm font-medium opacity-80">学分钱包余额</p>
            <h3 className="text-4xl font-headline font-bold mt-1 tracking-tight">¥ 12,840.00</h3>
          </div>
          <button 
            onClick={() => handleAction('立即充值', '充值通道正在接入中...')}
            className="w-full bg-surface text-primary py-3 rounded-xl text-sm font-bold mt-8 flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            立即充值
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Functional Modules */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Calendar, title: '我的预约', desc: '3场待参与课程', actionDesc: '正在加载您的预约列表...' },
          { icon: ClipboardList, title: '家教需求', desc: '已发布 2 条需求', actionDesc: '正在加载您的需求记录...' },
          { icon: Receipt, title: '消课记录', desc: '查阅历史课耗', actionDesc: '正在加载您的消课明细...' },
          { icon: Bookmark, title: '我的收藏', desc: '12位心仪导师', actionDesc: '正在加载您的收藏列表...' },
        ].map((item, i) => (
          <div 
            key={i} 
            onClick={() => setActiveModule(item.title)}
            className="bg-surface-container-low hover:bg-surface-container-high transition-colors p-6 rounded-2xl flex flex-col gap-4 cursor-pointer group"
          >
            <item.icon className="text-primary w-6 h-6 group-hover:scale-110 transition-transform" />
            <div>
              <p className="text-sm font-semibold text-on-surface">{item.title}</p>
              <p className="text-[10px] text-tertiary">{item.desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Dedicated Advisor Section */}
      <section className="bg-surface-container-low rounded-3xl p-1 overflow-hidden border border-outline-variant/10">
        <div className="flex flex-col md:flex-row items-center gap-6 p-7">
          <div className="w-16 h-16 rounded-full overflow-hidden border border-primary/20 flex-shrink-0">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBgghhlSfJik-trBKAWfob_722APwzogSPjto4E0aOW6N6ybSTZJFQQBxJfdDC817wi-b5-lC-2oKkIPZQLsN2UBj71JmX9MYxOh1OBa_9IQNs3AI0fwKq93FaiAqBFUik8vsNb8eP4lRpQ-3-vpzAzqggluBcpuRyesAl4GZPVcy6dk_NZTKooFUdLWYS6ZWEfO3sa7jHy4i2eSLLjkbipluHRMLhR8uCBDwzVG88d64Wj8w2R3IeA10AFtX9mwbLjbjeqoKDneVA4" 
              alt="Education Consultant" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-center md:text-left flex-grow">
            <p className="text-[10px] uppercase tracking-widest text-tertiary mb-1">Dedicated Service</p>
            <h4 className="text-lg font-headline text-on-surface">专属教育顾问：李老师 (Vincent)</h4>
            <p className="text-xs text-tertiary mt-1">随时为您解答学术路径规划、导师匹配等问题</p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <button 
              onClick={() => handleAction('在线咨询', '正在连接您的专属顾问...')}
              className="flex-1 md:flex-none border border-outline-variant/30 text-on-surface px-6 py-2.5 rounded-xl text-xs font-medium hover:bg-surface-container-high transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              在线咨询
            </button>
            <button 
              onClick={() => handleAction('拨打电话', '正在呼叫专属顾问...')}
              className="flex-1 md:flex-none bg-primary/10 text-primary px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-primary/20 transition-all flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4" />
              拨打电话
            </button>
          </div>
        </div>
      </section>

      {/* Info Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-surface/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-surface-container-high border border-primary/20 p-8 rounded-3xl max-w-sm w-full shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-tertiary hover:text-primary transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Info className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-headline font-bold text-on-surface mb-2">{modalContent.title}</h3>
              <p className="text-sm text-tertiary leading-relaxed">{modalContent.desc}</p>
              <button 
                onClick={() => setShowModal(false)}
                className="mt-8 w-full py-3 editorial-gradient text-on-primary font-bold rounded-xl active:scale-95 transition-transform"
              >
                我知道了
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Avatar Modal */}
      {showAvatarModal && (
        <div 
          className="fixed inset-0 z-[110] flex items-center justify-center px-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200 cursor-zoom-out"
          onClick={() => setShowAvatarModal(false)}
        >
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setShowAvatarModal(false);
            }}
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors bg-black/20 p-2 rounded-full backdrop-blur-sm"
          >
            <X className="w-6 h-6" />
          </button>
          <img 
            src={avatarUrl} 
            alt={userProfile.name} 
            className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl animate-in zoom-in-95 duration-300 cursor-default"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
      {/* Phone Modal */}
      {showPhoneModal && (
        <div 
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center px-4 pb-8 sm:pb-0 bg-surface/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setShowPhoneModal(false)}
        >
          <div 
            className="bg-surface-container-high border border-outline-variant/20 p-6 sm:p-8 rounded-3xl max-w-sm w-full shadow-2xl relative animate-in slide-in-from-bottom-8 sm:zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setShowPhoneModal(false)}
              className="absolute top-4 right-4 text-tertiary hover:text-primary transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex flex-col items-center text-center mt-2">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary/20 mb-4">
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBgghhlSfJik-trBKAWfob_722APwzogSPjto4E0aOW6N6ybSTZJFQQBxJfdDC817wi-b5-lC-2oKkIPZQLsN2UBj71JmX9MYxOh1OBa_9IQNs3AI0fwKq93FaiAqBFUik8vsNb8eP4lRpQ-3-vpzAzqggluBcpuRyesAl4GZPVcy6dk_NZTKooFUdLWYS6ZWEfO3sa7jHy4i2eSLLjkbipluHRMLhR8uCBDwzVG88d64Wj8w2R3IeA10AFtX9mwbLjbjeqoKDneVA4" 
                  alt="李老师 (Vincent)" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-headline font-bold text-on-surface mb-1">李老师 (Vincent)</h3>
              <p className="text-sm text-tertiary mb-6">专属教育顾问</p>
              
              <div className="w-full bg-surface-container rounded-2xl p-4 mb-6 flex items-center justify-between">
                <span className="text-lg font-mono font-bold tracking-wider text-on-surface">400-820-8820</span>
                <span className="text-[10px] bg-primary/10 text-primary px-2 py-1 rounded font-bold">免费</span>
              </div>

              <div className="flex gap-3 w-full">
                <button 
                  onClick={() => setShowPhoneModal(false)}
                  className="flex-1 py-3 bg-surface-container text-on-surface font-bold rounded-xl active:scale-95 transition-transform"
                >
                  取消
                </button>
                <a 
                  href="tel:4008208820"
                  onClick={() => setShowPhoneModal(false)}
                  className="flex-1 py-3 editorial-gradient text-on-primary font-bold rounded-xl active:scale-95 transition-transform flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  呼叫
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Module Detail Overlay */}
      {activeModule && (
        <div className="fixed inset-0 z-[90] bg-surface flex flex-col animate-in slide-in-from-right-full duration-300">
          <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/10 bg-surface/80 backdrop-blur-md pt-8">
            <button onClick={() => setActiveModule(null)} className="text-tertiary hover:text-primary transition-colors p-2 -ml-2">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h2 className="text-lg font-headline font-bold text-on-surface">{activeModule}</h2>
            <div className="w-10" />
          </div>
          <div className="flex-1 overflow-y-auto p-6 pb-24 max-w-5xl mx-auto w-full">
            {renderModuleContent()}
          </div>
        </div>
      )}
    </div>
  );
}
