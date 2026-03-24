import { useState, useMemo, useEffect } from 'react';
import { Search, BookOpen, Rocket, Medal, Palette, Award, BadgeCheck, Star, Book, PenTool, Brush, X, CheckCircle2 } from 'lucide-react';
import { Message } from '../App';
import api, { Tutor, Course } from '../services/api';

interface HomeProps {
  onSelectTutor: (id: string) => void;
  enrolledCourses: string[];
  setEnrolledCourses: (courses: string[]) => void;
  addMessage: (msg: Omit<Message, 'id' | 'timestamp' | 'isRead'>) => void;
  onEnrollCourse?: (courseId: string) => void;
}

const CATEGORIES = [
  { icon: BookOpen, label: '小学辅导' },
  { icon: Rocket, label: '中考冲刺' },
  { icon: Medal, label: '高考提分' },
  { icon: Palette, label: '艺术特长' },
  { icon: Award, label: '竞赛培优', colSpan: true }
];

const FALLBACK_COURSE_ICONS: Record<string, any> = {
  BookOpen,
  Book,
  PenTool,
  Brush
};

export function Home({ onSelectTutor, enrolledCourses, addMessage, onEnrollCourse }: HomeProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [enrollSuccess, setEnrollSuccess] = useState(false);
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [tutorsData, coursesData] = await Promise.all([
          api.tutor.getAll(),
          api.course.getAll()
        ]);
        setTutors(tutorsData || []);
        setCourses(coursesData || []);
      } catch (error) {
        console.warn('Failed to load data from API:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleEnroll = () => {
    if (selectedCourse && onEnrollCourse) {
      onEnrollCourse(selectedCourse.id);
      setEnrollSuccess(true);
      addMessage({
        title: '课程报名成功',
        content: `您已成功报名【${selectedCourse.title}】。我们的教育顾问将尽快与您联系安排后续事宜。`,
        type: 'system'
      });
    }
  };

  const handleCancelEnrollment = () => {
    if (selectedCourse) {
      setSelectedCourse(null);
    }
  };

  const filteredTutors = useMemo(() => {
    return tutors.filter(tutor => {
      const matchesSearch =
        tutor.name.includes(searchQuery) ||
        tutor.university.includes(searchQuery) ||
        tutor.subjects.some(s => s.includes(searchQuery));

      const matchesCategory = activeCategory ? tutor.categories.includes(activeCategory) : true;

      return matchesSearch && matchesCategory;
    });
  }, [tutors, searchQuery, activeCategory]);

  const featuredCourse = useMemo(() => courses.find(c => c.is_featured) || courses[0], [courses]);
  const secondaryCourses = useMemo(() => courses.filter(c => !c.is_featured).slice(0, 3), [courses]);

  const getIconComponent = (iconName?: string) => {
    if (!iconName) return Book;
    return FALLBACK_COURSE_ICONS[iconName] || Book;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <section className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-4xl md:text-5xl font-headline font-bold text-on-surface tracking-tight leading-tight">
            启迪智慧，<br/><span className="text-primary italic">名校精英</span> 在此等候。
          </h2>
          <p className="text-tertiary font-body max-w-md">连接顶尖学府学子，为您的孩子定制卓越成长之路。</p>
        </div>

        <div className="relative group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="text-primary/60 group-focus-within:text-primary transition-colors w-5 h-5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索科目或高校，如清华数学"
            className="w-full bg-surface-container-high border-b-2 border-outline-variant focus:border-primary focus:outline-none text-on-surface placeholder:text-outline transition-all py-5 pl-12 pr-4 rounded-t-xl font-body text-lg"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
            <button onClick={() => setSearchQuery('物理')} className="px-3 py-1 bg-surface-container-highest text-xs text-primary-fixed-dim rounded-full border border-primary/10 hover:bg-primary/10 transition-colors">物理</button>
            <button onClick={() => setSearchQuery('清华')} className="px-3 py-1 bg-surface-container-highest text-xs text-primary-fixed-dim rounded-full border border-primary/10 hover:bg-primary/10 transition-colors">清华</button>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {CATEGORIES.map((cat, i) => (
          <div
            key={i}
            onClick={() => setActiveCategory(activeCategory === cat.label ? null : cat.label)}
            className={`p-4 rounded-xl flex flex-col items-center justify-center gap-3 transition-colors border cursor-pointer ${cat.colSpan ? 'col-span-2 md:col-span-1' : ''} ${
              activeCategory === cat.label
                ? 'bg-primary/10 border-primary/30 shadow-sm'
                : 'bg-surface-container-low border-outline-variant/5 hover:bg-surface-container-high'
            }`}
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
              activeCategory === cat.label ? 'bg-primary/20' : 'bg-primary/10'
            }`}>
              <cat.icon className="text-primary w-6 h-6" />
            </div>
            <span className={`text-sm font-medium ${activeCategory === cat.label ? 'text-primary' : 'text-on-surface-variant'}`}>
              {cat.label}
            </span>
          </div>
        ))}
      </section>

      <section className="space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-xs tracking-[0.2em] text-primary font-bold mb-1">
              {activeCategory ? `${activeCategory} 导师` : (searchQuery ? '搜索结果' : 'ELITE TUTORS')}
            </p>
            <h3 className="text-2xl font-headline font-bold">
              {activeCategory || searchQuery ? '为您推荐' : '明星家教'}
            </h3>
          </div>
          {(activeCategory || searchQuery) && (
            <button
              onClick={() => { setActiveCategory(null); setSearchQuery(''); }}
              className="text-sm text-tertiary hover:text-primary transition-colors"
            >
              清除筛选
            </button>
          )}
        </div>

        {filteredTutors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTutors.map((tutor) => (
              <div key={tutor.id} onClick={() => onSelectTutor(tutor.id)} className="group relative bg-surface-container rounded-2xl overflow-hidden hover:translate-y-[-4px] transition-all duration-300 cursor-pointer border border-transparent hover:border-primary/20">
                <div className="absolute top-4 left-4 z-10 bg-primary-container text-on-primary-container text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                  <BadgeCheck className="w-3 h-3" /> 学生认证
                </div>
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={tutor.image || tutor.image_url}
                    alt={tutor.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-container to-transparent"></div>
                </div>
                <div className="p-5 -mt-12 relative z-10">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-lg font-bold text-on-surface">{tutor.name} <span className="text-xs font-normal text-tertiary ml-2">{tutor.university}</span></h4>
                      <p className="text-sm text-primary-fixed-dim">{tutor.subjects.join(' / ')}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center justify-end text-primary gap-1">
                        <Star className="w-3 h-3 fill-current" />
                        <span className="text-sm font-bold">{tutor.rating.toFixed(1)}</span>
                      </div>
                      <p className="text-xs text-outline">已授{tutor.hours || tutor.total_hours}课时</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-outline-variant/10">
                    <div className="flex items-baseline gap-1">
                      <span className="text-primary font-bold text-xl">¥{tutor.price}</span>
                      <span className="text-xs text-outline">/小时</span>
                    </div>
                    <button className="bg-primary text-on-primary px-4 py-1.5 rounded-lg text-sm font-bold active:scale-95 transition-transform">立即预约</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center bg-surface-container-low rounded-2xl border border-outline-variant/10">
            <div className="w-16 h-16 bg-surface-container-highest rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-tertiary" />
            </div>
            <h4 className="text-lg font-bold text-on-surface mb-2">未找到匹配的导师</h4>
            <p className="text-tertiary text-sm max-w-xs mx-auto">
              没有找到符合您搜索条件的导师，请尝试更换关键词或分类。
            </p>
            <button
              onClick={() => { setActiveCategory(null); setSearchQuery(''); }}
              className="mt-6 text-primary font-medium hover:underline"
            >
              查看全部导师
            </button>
          </div>
        )}
      </section>

      {featuredCourse && (
        <section className="space-y-6">
          <div>
            <p className="text-xs tracking-[0.2em] text-primary font-bold mb-1">CURATED COURSES</p>
            <h3 className="text-2xl font-headline font-bold">推荐课程方案</h3>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            <div
              onClick={() => setSelectedCourse(featuredCourse)}
              className="flex-1 bg-surface-container-high rounded-3xl p-8 border border-primary/10 relative overflow-hidden group cursor-pointer hover:border-primary/30 transition-colors"
            >
              {enrolledCourses.includes(featuredCourse.id) && (
                <div className="absolute top-4 right-4 bg-primary text-on-primary text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 z-10">
                  <CheckCircle2 className="w-3 h-3" /> 已报名
                </div>
              )}
              <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors"></div>
              <span className="text-xs font-bold text-primary px-3 py-1 bg-primary/10 rounded-full border border-primary/20 inline-block mb-4">名师打造</span>
              <h4 className="text-3xl font-headline font-bold mb-3 leading-tight">{featuredCourse.title}</h4>
              <p className="text-tertiary mb-6 max-w-xs">{featuredCourse.desc || featuredCourse.description}</p>

              <div className="flex items-center gap-6 mb-8">
                <div className="flex -space-x-3">
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuADy99IvKNlwblt462c9V4IkX-Z_OIXUW6xl_OavqeuR8VSf2dqps-5dBMQGpgd-WRZcrMGxK2RsIU_4q3mPp2k9fWZcJCVnQ1VV57cJTGSD_iFEvVHYeaoli1fEV3iuZsShRbHjvKf6ELP4IXTHYOT_ZGO_nc2uk2hEv9OikPH5-jUDn47PNISJPI12CCobg8TwGQCO3_C7wngfceXXUpcVswqaacSUVuPCAgqa_xt6pIE7luXVk4KUQDd2AF4D5BlOCvJKSXUL92I" alt="Tutor" className="w-10 h-10 rounded-full border-2 border-surface-container-high object-cover" />
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCtNy0N-AC273qlPlhXliQ4ikTkUUl9dljUOozMEaQ-8WwNtUAG1JLZRXO5OxxxO6ZQtl00mBUcmfXRrPu_oPklvrPE_usMaraIoQBOdPXbtlKCwBpcYYYl5So2DNy_1JmgTbhzU7NBpSTk1wz9o8f4sqO40GIZ8UgacAVw_Qx1_bh0jlGiuEBSNtQaEnuwundwaHQ99XVv211VDCPd_qLYyxiyFgjFMCucapRXmieR1h7zcZIKlMGTUxJ_arXJG0fksJCO8sMmQn5Z" alt="Tutor" className="w-10 h-10 rounded-full border-2 border-surface-container-high object-cover" />
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDuODewD5FIH8XjCMl_ZmxjcfP-3_tOYNQAsd4-kRQwGXOZI9obBLj9yV6iHZj43GgtlXul1XjwwgZZ6S46Kzwd9zgp59LUrEnDJpVOm_ZvqZQ-I6bhsrKQMeYamkXGuXLv8CH2lVt00jajPobihphmJxyoA9jwULiQXYCUZvSXjKU_pQj9jZZuwTRjavaBuHEGgIVvWUZpC-BgmUTVCbmizNOBwwgkMuBJd5bsPfhexUI9cABLqBYIIALMYNiunzXAXNBSThXqwURY" alt="Tutor" className="w-10 h-10 rounded-full border-2 border-surface-container-high object-cover" />
                </div>
                <span className="text-xs text-outline">{featuredCourse.students || featuredCourse.students_count}位同学已加入</span>
              </div>
              <button className="bg-primary text-on-primary px-8 py-3 rounded-full font-bold hover:shadow-[0_0_20px_rgba(242,202,80,0.3)] transition-shadow">探索方案</button>
            </div>

            <div className="w-full md:w-80 space-y-4">
              {secondaryCourses.map((course, i) => {
                const Icon = getIconComponent(course.icon);
                return (
                  <div
                    key={i}
                    onClick={() => setSelectedCourse(course)}
                    className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant/5 flex gap-4 items-center group cursor-pointer hover:bg-surface-container transition-colors"
                  >
                    <div className="w-16 h-16 rounded-xl bg-surface-container-highest flex items-center justify-center">
                      <Icon className="text-primary w-8 h-8" />
                    </div>
                    <div>
                      <h5 className="font-bold text-on-surface flex items-center gap-2">
                        {course.title}
                        {enrolledCourses.includes(course.id) && (
                          <CheckCircle2 className="w-4 h-4 text-primary" />
                        )}
                      </h5>
                      <p className="text-xs text-outline">{course.desc || course.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {selectedCourse && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-surface/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-surface-container-high border border-primary/20 p-8 rounded-3xl max-w-md w-full shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => {
                setSelectedCourse(null);
                setEnrollSuccess(false);
              }}
              className="absolute top-4 right-4 text-tertiary hover:text-primary transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {enrollSuccess ? (
              <div className="flex flex-col items-center text-center py-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-headline font-bold text-on-surface mb-2">报名成功</h3>
                <p className="text-sm text-tertiary leading-relaxed">您已成功报名该课程，我们的专属教育顾问将尽快与您联系安排后续事宜。</p>
                <button
                  onClick={() => {
                    setEnrollSuccess(false);
                    setSelectedCourse(null);
                  }}
                  className="mt-8 w-full py-3 editorial-gradient text-on-primary font-bold rounded-xl active:scale-95 transition-transform"
                >
                  完成
                </button>
              </div>
            ) : (
              <div className="mb-2">
                <div className="flex gap-2 mb-4 flex-wrap">
                  {(selectedCourse.tags || []).map((tag: string, idx: number) => (
                    <span key={idx} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="text-2xl font-headline font-bold text-on-surface mb-2">{selectedCourse.title}</h3>
                <p className="text-primary font-bold text-xl mb-6">{selectedCourse.price}</p>

                <div className="space-y-4 mb-8">
                  <div>
                    <h4 className="text-sm font-bold text-on-surface mb-1">课程简介</h4>
                    <p className="text-sm text-tertiary leading-relaxed">{selectedCourse.desc || selectedCourse.description}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-on-surface mb-1">详细内容</h4>
                    <p className="text-sm text-tertiary leading-relaxed">{selectedCourse.details}</p>
                  </div>
                </div>

                {enrolledCourses.includes(selectedCourse.id) ? (
                  <div className="space-y-3">
                    <div className="bg-primary/10 text-primary p-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      您已报名此课程
                    </div>
                    <button
                      onClick={handleCancelEnrollment}
                      className="w-full py-3 bg-surface-container-highest text-on-surface font-bold rounded-xl active:scale-95 transition-transform hover:bg-surface-container-high"
                    >
                      关闭
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleEnroll}
                    className="w-full py-3 editorial-gradient text-on-primary font-bold rounded-xl active:scale-95 transition-transform"
                  >
                    立即报名
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}