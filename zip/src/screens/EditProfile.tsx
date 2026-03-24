import { useState, ChangeEvent, FormEvent, useRef, useEffect } from 'react';
import { ArrowLeft, Camera, MapPin, Phone, Mail, User, Save, Building, Search } from 'lucide-react';
import { UserProfile } from '../App';

interface EditProfileProps {
  initialData: UserProfile;
  onBack: () => void;
  onSave: (data: UserProfile) => void;
}

const MOCK_ADDRESSES = [
  { city: '上海市', district: '浦东新区', address: '世纪大道 100 号', full: '上海市浦东新区世纪大道 100 号' },
  { city: '上海市', district: '黄浦区', address: '南京东路 299 号', full: '上海市黄浦区南京东路 299 号' },
  { city: '上海市', district: '徐汇区', address: '淮海中路 999 号', full: '上海市徐汇区淮海中路 999 号' },
  { city: '北京市', district: '朝阳区', address: '建国路 87 号', full: '北京市朝阳区建国路 87 号' },
  { city: '北京市', district: '海淀区', address: '中关村大街 27 号', full: '北京市海淀区中关村大街 27 号' },
  { city: '广州市', district: '天河区', address: '天河路 208 号', full: '广州市天河区天河路 208 号' },
  { city: '深圳市', district: '南山区', address: '深南大道 9009 号', full: '深圳市南山区深南大道 9009 号' },
];

export function EditProfile({ initialData, onBack, onSave }: EditProfileProps) {
  const [formData, setFormData] = useState<UserProfile>(initialData);

  const [suggestions, setSuggestions] = useState<typeof MOCK_ADDRESSES>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(initialData.avatarUrl);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarUrl(url);
      setFormData(prev => ({ ...prev, avatarUrl: url }));
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, address: value }));
    
    if (value.trim().length > 0) {
      const filtered = MOCK_ADDRESSES.filter(addr => 
        addr.full.toLowerCase().includes(value.toLowerCase()) || 
        addr.address.toLowerCase().includes(value.toLowerCase()) ||
        addr.city.toLowerCase().includes(value.toLowerCase()) ||
        addr.district.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (suggestion: typeof MOCK_ADDRESSES[0]) => {
    setFormData(prev => ({
      ...prev,
      city: suggestion.city,
      district: suggestion.district,
      address: suggestion.address
    }));
    setShowSuggestions(false);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500 pb-10">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="text-tertiary hover:text-primary transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-3xl font-headline font-bold text-on-surface tracking-tight">编辑资料</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Avatar Section */}
        <section className="flex flex-col items-center justify-center gap-4">
          <div 
            className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-primary/20 bg-surface-container group cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <img 
              src={avatarUrl} 
              alt="Avatar" 
              className="w-full h-full object-cover group-hover:opacity-50 transition-opacity"
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
              <Camera className="w-8 h-8 text-white" />
            </div>
          </div>
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleAvatarChange}
          />
          <p className="text-xs text-tertiary">点击更换头像</p>
        </section>

        {/* Basic Info */}
        <section className="bg-surface-container-low p-6 rounded-3xl border border-outline-variant/10 space-y-4">
          <h3 className="text-lg font-bold text-primary flex items-center gap-2 mb-4">
            <User className="w-5 h-5" />
            基本信息
          </h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-tertiary mb-1">昵称</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-surface-container border border-outline-variant/30 focus:border-primary focus:outline-none rounded-xl px-4 py-3 text-on-surface transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-tertiary mb-1">身份标签</label>
                <select 
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full bg-surface-container border border-outline-variant/30 focus:border-primary focus:outline-none rounded-xl px-4 py-3 text-on-surface transition-colors appearance-none"
                >
                  <option value="学领航员">学领航员</option>
                  <option value="家长">家长</option>
                  <option value="学生">学生</option>
                  <option value="教师">教师</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-tertiary mb-1">性别</label>
                <select 
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full bg-surface-container border border-outline-variant/30 focus:border-primary focus:outline-none rounded-xl px-4 py-3 text-on-surface transition-colors appearance-none"
                >
                  <option value="男">男</option>
                  <option value="女">女</option>
                  <option value="保密">保密</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-tertiary mb-1">孩子年级</label>
                <select 
                  name="grade"
                  value={formData.grade}
                  onChange={handleChange}
                  className="w-full bg-surface-container border border-outline-variant/30 focus:border-primary focus:outline-none rounded-xl px-4 py-3 text-on-surface transition-colors appearance-none"
                >
                  <option value="小学">小学</option>
                  <option value="初中">初中</option>
                  <option value="高一">高一</option>
                  <option value="高二">高二</option>
                  <option value="高三">高三</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Info */}
        <section className="bg-surface-container-low p-6 rounded-3xl border border-outline-variant/10 space-y-4">
          <h3 className="text-lg font-bold text-primary flex items-center gap-2 mb-4">
            <Phone className="w-5 h-5" />
            联系方式
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-tertiary mb-1">手机号码</label>
              <input 
                type="tel" 
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-surface-container border border-outline-variant/30 focus:border-primary focus:outline-none rounded-xl px-4 py-3 text-on-surface transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-tertiary mb-1">微信号</label>
              <input 
                type="text" 
                name="wechat"
                value={formData.wechat}
                onChange={handleChange}
                className="w-full bg-surface-container border border-outline-variant/30 focus:border-primary focus:outline-none rounded-xl px-4 py-3 text-on-surface transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-tertiary mb-1">电子邮箱</label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-surface-container border border-outline-variant/30 focus:border-primary focus:outline-none rounded-xl px-4 py-3 text-on-surface transition-colors"
              />
            </div>
          </div>
        </section>

        {/* Location Info */}
        <section className="bg-surface-container-low p-6 rounded-3xl border border-outline-variant/10 space-y-4">
          <h3 className="text-lg font-bold text-primary flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5" />
            位置信息
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-tertiary mb-1">省/市</label>
              <input 
                type="text" 
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full bg-surface-container border border-outline-variant/30 focus:border-primary focus:outline-none rounded-xl px-4 py-3 text-on-surface transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-tertiary mb-1">区/县</label>
              <input 
                type="text" 
                name="district"
                value={formData.district}
                onChange={handleChange}
                className="w-full bg-surface-container border border-outline-variant/30 focus:border-primary focus:outline-none rounded-xl px-4 py-3 text-on-surface transition-colors"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-tertiary mb-1">详细地址</label>
            <div className="relative" ref={suggestionsRef}>
              <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-tertiary" />
              <input 
                type="text" 
                name="address"
                value={formData.address}
                onChange={handleAddressChange}
                onFocus={() => {
                  if (formData.address.trim().length > 0 && suggestions.length > 0) {
                    setShowSuggestions(true);
                  }
                }}
                placeholder="输入地址搜索或手动填写"
                className="w-full bg-surface-container border border-outline-variant/30 focus:border-primary focus:outline-none rounded-xl pl-12 pr-4 py-3 text-on-surface transition-colors"
              />
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-50 left-0 right-0 mt-2 bg-surface-container-high border border-outline-variant/20 rounded-xl shadow-lg overflow-hidden max-h-60 overflow-y-auto animate-in slide-in-from-top-2 duration-200">
                  {suggestions.map((suggestion, index) => (
                    <div 
                      key={index}
                      onClick={() => handleSelectSuggestion(suggestion)}
                      className="px-4 py-3 hover:bg-surface-container-highest cursor-pointer transition-colors border-b border-outline-variant/10 last:border-0 flex items-start gap-3"
                    >
                      <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-on-surface">{suggestion.address}</p>
                        <p className="text-xs text-tertiary mt-0.5">{suggestion.city} {suggestion.district}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        <button 
          type="submit"
          className="w-full py-4 editorial-gradient text-on-primary font-bold rounded-xl active:scale-95 transition-transform flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(242,202,80,0.2)]"
        >
          <Save className="w-5 h-5" />
          保存修改
        </button>
      </form>
    </div>
  );
}
