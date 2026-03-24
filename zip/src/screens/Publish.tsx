import React, { useState } from 'react';
import { GraduationCap, UserSearch, Banknote, Calendar, Moon, FileEdit, Send, CheckCircle2, X } from 'lucide-react';
import { Message, Requirement } from '../App';

interface PublishProps {
  addMessage?: (msg: Omit<Message, 'id' | 'timestamp' | 'isRead'>) => void;
  requirement: Requirement | null;
  setRequirement: (req: Requirement | null) => void;
}

export function Publish({ addMessage, requirement, setRequirement }: PublishProps) {
  const [grade, setGrade] = useState(requirement?.grade || '初中');
  const [subjects, setSubjects] = useState(requirement?.subjects || ['奥数冲刺']);
  const [gender, setGender] = useState(requirement?.gender || '不限');
  const [schoolBg, setSchoolBg] = useState(requirement?.schoolBg || '不限');
  const [timeSlot, setTimeSlot] = useState(requirement?.timeSlot || '平时晚上');
  const [budget, setBudget] = useState(requirement?.budget || 150);
  const [details, setDetails] = useState(requirement?.details || '');
  
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const isPublished = requirement !== null && !isEditing;

  const toggleSubject = (subject: string) => {
    setSubjects(prev => 
      prev.includes(subject) ? prev.filter(s => s !== subject) : [...prev, subject]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRequirement({
      grade, subjects, gender, schoolBg, timeSlot, budget, details
    });
    setIsEditing(false);
    setShowModal(true);
    if (addMessage) {
      addMessage({
        title: '需求发布成功',
        content: `您已成功发布【${grade} - ${subjects.join(', ')}】的教学需求，我们的教育顾问将尽快为您匹配导师。`,
        type: 'system'
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in duration-500">
      {/* Hero Section */}
      <section className="mb-10 text-center">
        <h2 className="text-4xl font-headline font-bold text-primary mb-2 tracking-tight">发布教学需求</h2>
        <p className="text-tertiary text-sm tracking-widest font-light">为您的孩子寻找最契合的顶尖学府导师</p>
      </section>

      {isPublished ? (
        <div className="glass-card p-8 rounded-2xl space-y-8 animate-in zoom-in-95 duration-300">
          <div className="flex items-center justify-between border-b border-outline-variant/50 pb-6">
            <div>
              <h3 className="text-2xl font-headline font-bold text-primary mb-1">已发布需求</h3>
              <p className="text-sm text-tertiary">正在为您匹配最合适的导师...</p>
            </div>
            <div className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              匹配中
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <p className="text-xs text-tertiary uppercase tracking-widest">基本信息</p>
              <p className="text-on-surface font-medium">{grade} · {subjects.join('、')}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-tertiary uppercase tracking-widest">导师要求</p>
              <p className="text-on-surface font-medium">{gender} · {schoolBg}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-tertiary uppercase tracking-widest">时间与预算</p>
              <p className="text-on-surface font-medium">{timeSlot} · ¥{budget}-{budget+50}/小时</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-tertiary uppercase tracking-widest">详细描述</p>
              <p className="text-on-surface font-medium text-sm leading-relaxed">{details || '无补充说明'}</p>
            </div>
          </div>

          <div className="pt-6 border-t border-outline-variant/50 flex gap-4">
            <button 
              onClick={() => setIsEditing(true)}
              className="flex-1 py-4 bg-surface-container-high text-primary font-bold rounded-xl border border-primary/30 hover:bg-surface-container-highest transition-all active:scale-95 duration-200 flex items-center justify-center gap-2"
            >
              <FileEdit className="w-4 h-4" />
              修改重发布
            </button>
          </div>
        </div>
      ) : (
        <form className="space-y-8 animate-in fade-in duration-300" onSubmit={handleSubmit}>
          {/* Section 1: Academic Background */}
          <div className="glass-card p-6 rounded-xl space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <GraduationCap className="text-primary w-6 h-6" />
              <h3 className="font-headline text-xl font-semibold text-on-surface">学术背景</h3>
            </div>
            
            <div className="space-y-4">
              <label className="block text-xs font-medium text-outline uppercase tracking-widest">孩子年级</label>
              <div className="grid grid-cols-3 gap-3">
                {['小学', '初中', '高中'].map(g => (
                  <button 
                    key={g}
                    type="button"
                    onClick={() => setGrade(g)}
                    className={`py-3 px-2 rounded-lg text-sm transition-all ${
                      grade === g 
                        ? 'bg-primary/10 border border-primary text-primary font-semibold' 
                        : 'bg-surface-container border border-outline-variant hover:border-primary/50 text-on-surface'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-xs font-medium text-outline uppercase tracking-widest">辅导科目</label>
              <div className="flex flex-wrap gap-2">
                {['数学', '奥数冲刺', '物理', '英语', '化学'].map(s => (
                  <span 
                    key={s}
                    onClick={() => toggleSubject(s)}
                    className={`px-4 py-2 rounded-full text-sm border cursor-pointer transition-colors ${
                      subjects.includes(s)
                        ? 'bg-primary/20 text-primary border-primary/50 font-medium'
                        : 'bg-surface-container-highest border-transparent hover:border-primary/50 text-on-surface'
                    }`}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Section 2: Tutor Requirements */}
          <div className="glass-card p-6 rounded-xl space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <UserSearch className="text-primary w-6 h-6" />
              <h3 className="font-headline text-xl font-semibold text-on-surface">家教要求</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <label className="block text-xs font-medium text-outline uppercase tracking-widest">性别要求</label>
                <select 
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full bg-transparent border-b border-outline-variant focus:border-primary focus:outline-none text-on-surface py-2 px-0 transition-colors appearance-none cursor-pointer"
                >
                  <option className="bg-surface">不限</option>
                  <option className="bg-surface">男大学生</option>
                  <option className="bg-surface">女大学生</option>
                </select>
              </div>
              <div className="space-y-4">
                <label className="block text-xs font-medium text-outline uppercase tracking-widest">学校背景</label>
                <select 
                  value={schoolBg}
                  onChange={(e) => setSchoolBg(e.target.value)}
                  className="w-full bg-transparent border-b border-outline-variant focus:border-primary focus:outline-none text-on-surface py-2 px-0 transition-colors appearance-none cursor-pointer"
                >
                  <option className="bg-surface">不限</option>
                  <option className="bg-surface">985 / 211院校</option>
                  <option className="bg-surface">知名师范院校</option>
                  <option className="bg-surface">QS前100海外名校</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Time & Budget */}
          <div className="glass-card p-6 rounded-xl space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <Banknote className="text-primary w-6 h-6" />
              <h3 className="font-headline text-xl font-semibold text-on-surface">时间与预算</h3>
            </div>
            
            <div className="space-y-4">
              <label className="block text-xs font-medium text-outline uppercase tracking-widest">补习时段</label>
              <div className="grid grid-cols-2 gap-3">
                <div 
                  onClick={() => setTimeSlot('周末全天')}
                  className={`p-4 rounded-xl border flex items-center gap-3 cursor-pointer transition-colors ${
                    timeSlot === '周末全天'
                      ? 'bg-primary/5 border-primary/30 text-primary'
                      : 'bg-surface-container-low border-outline-variant hover:bg-surface-container-high text-on-surface'
                  }`}
                >
                  <Calendar className={timeSlot === '周末全天' ? 'text-primary' : 'text-tertiary'} w-5 h-5 />
                  <span className={`text-sm ${timeSlot === '周末全天' ? 'font-medium' : ''}`}>周末全天</span>
                </div>
                <div 
                  onClick={() => setTimeSlot('平时晚上')}
                  className={`p-4 rounded-xl border flex items-center gap-3 cursor-pointer transition-colors ${
                    timeSlot === '平时晚上'
                      ? 'bg-primary/5 border-primary/30 text-primary'
                      : 'bg-surface-container-low border-outline-variant hover:bg-surface-container-high text-on-surface'
                  }`}
                >
                  <Moon className={timeSlot === '平时晚上' ? 'text-primary' : 'text-tertiary'} w-5 h-5 />
                  <span className={`text-sm ${timeSlot === '平时晚上' ? 'font-medium' : ''}`}>平时晚上</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-xs font-medium text-outline uppercase tracking-widest">期望时薪 (元/小时)</label>
              <div className="relative pt-6 px-2">
                <input 
                  type="range" 
                  min="50" 
                  max="500" 
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full h-1 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between mt-4 text-sm font-medium text-primary">
                  <span>¥100</span>
                  <span className="bg-primary text-on-primary px-3 py-1 rounded-full text-xs">当前: ¥{budget}-{budget+50}</span>
                  <span>¥500+</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Details */}
          <div className="glass-card p-6 rounded-xl space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <FileEdit className="text-primary w-6 h-6" />
              <h3 className="font-headline text-xl font-semibold text-on-surface">详细描述</h3>
            </div>
            <textarea 
              rows={4}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="例如：希望找一个有奥数辅导经验的学长，能帮助孩子梳理初一数学逻辑，耐心细致..."
              className="w-full bg-surface-container-low border border-outline-variant rounded-xl focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20 text-on-surface p-4 text-sm placeholder:text-outline/50 resize-none"
            ></textarea>
          </div>

          {/* Submit Button */}
          <button 
            type="submit"
            className="w-full py-5 editorial-gradient text-on-primary font-bold rounded-xl shadow-[0_4px_24px_rgba(212,175,55,0.3)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Send className="w-5 h-5" />
            <span>立即发布需求</span>
          </button>
        </form>
      )}

      {/* Success Modal */}
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
                <CheckCircle2 className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-headline font-bold text-on-surface mb-2">需求发布成功</h3>
              <p className="text-sm text-tertiary leading-relaxed">您的教学需求已成功发布，我们的专属教育顾问将尽快为您匹配合适的顶尖学府导师。</p>
              <button 
                onClick={() => setShowModal(false)}
                className="mt-8 w-full py-3 editorial-gradient text-on-primary font-bold rounded-xl active:scale-95 transition-transform"
              >
                查看已发布需求
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
