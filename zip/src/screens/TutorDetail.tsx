import { useState } from 'react';
import { BadgeCheck, GraduationCap, TrendingUp, Sparkles, Quote, User, CheckCircle2, X } from 'lucide-react';
import { Message } from '../App';

interface TutorDetailProps {
  addMessage?: (msg: Omit<Message, 'id' | 'timestamp' | 'isRead'>) => void;
}

export function TutorDetail({ addMessage }: TutorDetailProps) {
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', desc: '' });

  const handleAction = (type: 'consult' | 'book') => {
    if (type === 'consult') {
      setModalContent({ 
        title: '咨询请求已发送', 
        desc: '专属教育顾问李老师（Vincent）将很快与您联系，为您解答疑问。' 
      });
      if (addMessage) {
        addMessage({
          title: '咨询请求已发送',
          content: '您已向导师 陆同学 发送了咨询请求，专属教育顾问将很快与您联系。',
          type: 'tutor',
          sender: '陆同学',
          avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDerl80SHxfadjTOGSKEdoR3NF9s49HcpAiZUWbapdgxQ2St7QR7-82ivkWUaKf06T3QEBvgb0xd79N7UUcNyZ7cb20I-7KXeoV06df41FBUM8Kanf1o7ydve7VmNavv0z8Y6Rx4PxzOZjoLhRWUcY0aKnh3alc0vXrzej_GBctwoQMuQBGQ0TBSwuB7_JWaQYQ48das7KE6Ru8X42-6iJ1G0JbrhNg51adwGAhTlOLm5iawhmlS77zGV3n3vbUjljcpuqoLciI2I1L'
        });
      }
    } else {
      setModalContent({ 
        title: '试听预约成功', 
        desc: '已为您安排陆同学的试听课程，请留意短信通知及后续安排。' 
      });
      if (addMessage) {
        addMessage({
          title: '试听预约成功',
          content: '已为您安排陆同学的试听课程，请留意短信通知及后续安排。',
          type: 'system'
        });
      }
    }
    setShowModal(true);
  };

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in duration-500 pb-24">
      {/* Hero Section: Intentional Asymmetry */}
      <section className="relative grid grid-cols-1 md:grid-cols-12 gap-8 mb-16 items-end">
        <div className="md:col-span-5 relative aspect-[3/4] rounded-2xl overflow-hidden border border-primary/20 shadow-2xl">
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDerl80SHxfadjTOGSKEdoR3NF9s49HcpAiZUWbapdgxQ2St7QR7-82ivkWUaKf06T3QEBvgb0xd79N7UUcNyZ7cb20I-7KXeoV06df41FBUM8Kanf1o7ydve7VmNavv0z8Y6Rx4PxzOZjoLhRWUcY0aKnh3alc0vXrzej_GBctwoQMuQBGQ0TBSwuB7_JWaQYQ48das7KE6Ru8X42-6iJ1G0JbrhNg51adwGAhTlOLm5iawhmlS77zGV3n3vbUjljcpuqoLciI2I1L" 
            alt="Tutor Profile" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent"></div>
          <div className="absolute bottom-6 left-6 flex flex-wrap gap-2">
            <span className="px-3 py-1 glass-panel text-primary text-xs font-medium rounded-full border border-primary/30 flex items-center gap-1">
              <BadgeCheck className="w-3 h-3" /> 已认证
            </span>
            <span className="px-3 py-1 glass-panel text-on-surface text-xs font-medium rounded-full border border-outline-variant">3年教龄</span>
          </div>
        </div>
        
        <div className="md:col-span-7 pb-4">
          <div className="mb-4">
            <h2 className="text-5xl font-headline font-bold text-on-surface mb-2 tracking-tight">陆同学 <span className="text-lg font-body font-normal text-tertiary ml-4">复旦大学 · 物理学系</span></h2>
            <p className="text-primary text-xl font-headline italic tracking-wide">“不仅是提分，更是共鸣。我走过你正在走的路。”</p>
          </div>
          
          {/* Core Highlights Bento */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="bg-surface-container-low p-6 rounded-2xl border-l-4 border-primary">
              <p className="text-tertiary text-xs uppercase tracking-widest mb-1">平均提分</p>
              <p className="text-3xl font-headline font-bold text-primary">+24<span className="text-sm">pts</span></p>
            </div>
            <div className="bg-surface-container-low p-6 rounded-2xl">
              <p className="text-tertiary text-xs uppercase tracking-widest mb-1">授课时长</p>
              <p className="text-3xl font-headline font-bold text-on-surface">1,280<span className="text-sm">h</span></p>
            </div>
            <div className="bg-surface-container-low p-6 rounded-2xl">
              <p className="text-tertiary text-xs uppercase tracking-widest mb-1">家长好评</p>
              <p className="text-3xl font-headline font-bold text-on-surface">99.2<span className="text-sm">%</span></p>
            </div>
          </div>
        </div>
      </section>

      {/* Personal Bio: Scholar's Voice */}
      <section className="mb-16">
        <div className="flex items-baseline gap-4 mb-8">
          <h3 className="text-3xl font-headline font-bold">个人简介</h3>
          <div className="h-px flex-1 bg-outline-variant opacity-30"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="md:col-span-2 space-y-6 text-on-surface-variant leading-relaxed text-lg">
            <p>
              作为复旦大学大三在读学生，我深知当今中考、高考物理考核的侧重点。不同于传统的“题海战术”，我主张**“思维可视化”**的学习方法，通过建立物理模型，将抽象的公式具象化。
            </p>
            <p>
              我不仅是你的老师，也是你的学长。我能理解你在大考前的焦虑，也更清楚那些困扰你的知识点瓶颈。我会分享我自己的错题笔记整理术和临场心态调节方案，让学习变得有迹可循。
            </p>
            <div className="flex flex-wrap gap-3 pt-4">
              <span className="bg-surface-container-high px-4 py-2 rounded-lg text-primary text-sm border border-outline-variant"># 高考物理 148分</span>
              <span className="bg-surface-container-high px-4 py-2 rounded-lg text-primary text-sm border border-outline-variant"># 全国物理竞赛二等奖</span>
              <span className="bg-surface-container-high px-4 py-2 rounded-lg text-primary text-sm border border-outline-variant"># 擅长压轴题拆解</span>
            </div>
          </div>
          <div className="bg-primary/5 p-8 rounded-3xl border border-primary/10 relative overflow-hidden">
            <GraduationCap className="absolute -right-4 -bottom-4 w-32 h-32 text-primary/10 rotate-12" />
            <h4 className="font-headline text-xl text-primary mb-4 font-bold">辅导理念</h4>
            <ul className="space-y-4 text-sm text-tertiary relative z-10">
              <li className="flex gap-3">
                <span className="text-primary font-bold">01.</span>
                <span>建立底层逻辑，拒绝死记硬背。</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">02.</span>
                <span>同龄人视角沟通，无代沟授课。</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">03.</span>
                <span>个性化定制方案，紧扣当地考纲。</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Academic Results: Tonal Layering Cards */}
      <section className="mb-16">
        <div className="flex items-baseline gap-4 mb-8">
          <h3 className="text-3xl font-headline font-bold">教学成果</h3>
          <div className="h-px flex-1 bg-outline-variant opacity-30"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Achievement Card 1 */}
          <div className="group bg-surface-container rounded-2xl p-8 border border-transparent hover:border-primary/20 transition-all duration-300">
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-xs text-primary font-medium tracking-widest uppercase mb-2 block">2023秋季学期</span>
                <h5 className="text-xl font-headline font-bold">高三林同学 · 物理跃升</h5>
              </div>
              <div className="bg-primary/10 p-3 rounded-full">
                <TrendingUp className="text-primary w-5 h-5" />
              </div>
            </div>
            <div className="relative h-2 bg-surface-container-highest rounded-full mb-4 overflow-hidden">
              <div className="absolute top-0 left-0 h-full editorial-gradient w-[85%] shadow-[0_0_10px_rgba(242,202,80,0.4)]"></div>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-tertiary">起始：62分</span>
              <span className="text-primary font-bold">最终：91分 (上海物理等级考 A)</span>
            </div>
          </div>
          
          {/* Achievement Card 2 */}
          <div className="group bg-surface-container rounded-2xl p-8 border border-transparent hover:border-primary/20 transition-all duration-300">
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-xs text-primary font-medium tracking-widest uppercase mb-2 block">2024寒假特训</span>
                <h5 className="text-xl font-headline font-bold">初三王同学 · 数理衔接</h5>
              </div>
              <div className="bg-primary/10 p-3 rounded-full">
                <Sparkles className="text-primary w-5 h-5" />
              </div>
            </div>
            <div className="relative h-2 bg-surface-container-highest rounded-full mb-4 overflow-hidden">
              <div className="absolute top-0 left-0 h-full editorial-gradient w-[92%] shadow-[0_0_10px_rgba(242,202,80,0.4)]"></div>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-tertiary">起始：基础薄弱</span>
              <span className="text-primary font-bold">成果：提前掌握力学核心，开学测试全班第1</span>
            </div>
          </div>
        </div>
      </section>

      {/* Parents Feedback: Editorial Layout */}
      <section className="mb-16">
        <div className="flex items-baseline gap-4 mb-8">
          <h3 className="text-3xl font-headline font-bold">家长评价</h3>
          <div className="h-px flex-1 bg-outline-variant opacity-30"></div>
        </div>
        <div className="space-y-8">
          <div className="bg-surface-container-low p-8 rounded-2xl relative">
            <Quote className="absolute top-4 left-4 w-10 h-10 text-primary/10 fill-current" />
            <div className="pl-8">
              <p className="text-lg italic text-on-surface mb-6 leading-relaxed">
                “陆同学非常负责。孩子之前很排斥物理，觉得太抽象。陆同学用生活中的例子来解释动力学，孩子现在甚至会主动看一些物理科普书了。提分固然重要，但这种对学科兴趣的激发是更让我们惊喜的。”
              </p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-primary border border-primary/20">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold">王女士</p>
                  <p className="text-xs text-tertiary">高二家长 · 授课24次</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-surface-container-low p-8 rounded-2xl relative">
            <Quote className="absolute top-4 left-4 w-10 h-10 text-primary/10 fill-current" />
            <div className="pl-8">
              <p className="text-lg italic text-on-surface mb-6 leading-relaxed">
                “大学生老师确实更懂学生的痛点。陆老师教的方法很实战，没有那么多教条。期末考试物理从不及格直接考到了80多，孩子自己也找回了自信。”
              </p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-primary border border-primary/20">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold">李先生</p>
                  <p className="text-xs text-tertiary">初三家长 · 授课12次</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Action Shell */}
      <footer className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-6 pb-8 pt-4 backdrop-blur-2xl bg-surface/90 border-t border-primary/15 rounded-t-3xl shadow-[0_-4px_24px_rgba(0,0,0,0.4)]">
        <div className="flex-1 flex gap-4 max-w-4xl mx-auto">
          <button 
            onClick={() => handleAction('consult')}
            className="flex-[2] py-4 bg-surface-container-high text-primary font-bold rounded-2xl border border-primary/30 hover:bg-surface-container-highest transition-all active:scale-95 duration-200"
          >
            立即咨询
          </button>
          <button 
            onClick={() => handleAction('book')}
            className="flex-[3] py-4 editorial-gradient text-on-primary font-bold rounded-2xl shadow-[0_4px_20px_rgba(242,202,80,0.2)] hover:opacity-90 transition-all active:scale-95 duration-200"
          >
            预约试听
          </button>
        </div>
      </footer>

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
    </div>
  );
}
