-- =====================================================
-- Mojin Academy Database Schema
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard
-- =====================================================

-- Users and Profiles
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  wechat TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'tutor')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  avatar_url TEXT,
  gender TEXT DEFAULT '保密',
  grade TEXT,
  city TEXT,
  district TEXT,
  address TEXT,
  role_label TEXT DEFAULT '学领航员',
  wallet_balance DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tutors
CREATE TABLE IF NOT EXISTS tutors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  name TEXT NOT NULL,
  university TEXT NOT NULL,
  subjects TEXT[] NOT NULL,
  categories TEXT[] NOT NULL,
  rating DECIMAL(2, 1) DEFAULT 5.0,
  total_hours INTEGER DEFAULT 0,
  price INTEGER NOT NULL,
  image_url TEXT,
  bio TEXT,
  teaching_philosophy TEXT,
  achievements JSONB DEFAULT '[]',
  parent_feedback JSONB DEFAULT '[]',
  is_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Courses
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  details TEXT,
  price TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  students_count TEXT DEFAULT '0',
  icon TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enrollments
CREATE TABLE IF NOT EXISTS enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Requirements (Published tutoring requests)
CREATE TABLE IF NOT EXISTS requirements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  grade TEXT NOT NULL,
  subjects TEXT[] NOT NULL,
  gender TEXT DEFAULT '不限',
  school_bg TEXT DEFAULT '不限',
  time_slot TEXT NOT NULL,
  budget INTEGER NOT NULL,
  details TEXT,
  status TEXT DEFAULT 'matching' CHECK (status IN ('matching', 'matched', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT DEFAULT 'system' CHECK (type IN ('system', 'tutor', 'advisor')),
  sender_name TEXT,
  sender_avatar TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Appointments
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  tutor_id UUID REFERENCES tutors(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  scheduled_time TIMESTAMP NOT NULL,
  duration TEXT,
  type TEXT DEFAULT 'online' CHECK (type IN ('online', 'offline')),
  location TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Favorites (Bookmarks)
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  tutor_id UUID REFERENCES tutors(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, tutor_id)
);

-- Usage Records (消课记录)
CREATE TABLE IF NOT EXISTS usage_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  tutor_id UUID REFERENCES tutors(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  date DATE NOT NULL,
  duration TEXT NOT NULL,
  cost TEXT NOT NULL,
  status TEXT DEFAULT 'completed' CHECK (status IN ('completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_tutors_university ON tutors(university);
CREATE INDEX IF NOT EXISTS idx_tutors_subjects ON tutors(subjects);
CREATE INDEX IF NOT EXISTS idx_enrollments_user_id ON enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course_id ON enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_requirements_user_id ON requirements(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_user_id ON messages(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_is_read ON messages(is_read);
CREATE INDEX IF NOT EXISTS idx_appointments_user_id ON appointments(user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_tutor_id ON appointments(tutor_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_records_user_id ON usage_records(user_id);

-- =====================================================
-- Seed Data (Optional - run after tables are created)
-- =====================================================

-- Insert demo user
INSERT INTO users (id, email, phone, wechat, role) VALUES
  ('00000000-0000-0000-0000-000000000001', 'sarah.mom@example.com', '138****8888', 'sarah_mom_88', 'user')
ON CONFLICT (id) DO NOTHING;

-- Insert demo profile
INSERT INTO profiles (id, user_id, name, avatar_url, gender, grade, city, district, address, role_label, wallet_balance) VALUES
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Sarah妈妈', 'https://lh3.googleusercontent.com/aida-public/AB6AXuA5EWUQn8TUnKvZoTf6I8utLJoFGRKp9FW4It83wpugIFFur4-zB04Qqb0CHtsb4rW2z9iAme-lfZcbNqu3MgHsnASOMN_nn29ZYiO7JXZaFxcs02ByDM8VSJDpfial0kv8P59Zut_jk0CYku-4Gu3RERsZ5qHdC8496AOCyKTBwy6f5qrIZVMyzxnhmkdgg25LaF_h6zgxtrb8YF2Df-yW-XoVM8_pW20f4aoxCpUncHwAZr0LW9G8kyUXPfS5IeIBCJQWdi2ubdjM', '女', '高二', '上海市', '浦东新区', '世纪大道 100 号', '学领航员', 12840)
ON CONFLICT (id) DO NOTHING;

-- Insert tutors
INSERT INTO tutors (id, name, university, subjects, categories, rating, total_hours, price, image_url, bio, teaching_philosophy, achievements, parent_feedback, is_verified) VALUES
  ('00000000-0000-0000-0000-000000000010', '张同学', '清华大学', ARRAY['数学', '物理竞赛'], ARRAY['竞赛培优', '高考提分'], 4.9, 240, 200, 'https://lh3.googleusercontent.com/aida-public/AB6AXuACdhKdWxWCXc64hHaPdGw9foWrk6yXOlPv792spg04pcmGoQIh5LMOvxPY24rAFE2lUpI3XPl8zQFsX6LlYzumq1e9OQCPXtcTkQezbeiQaxj8f1B7CFHjs36X21Vsus_eEhS8DcotNMW8_hLE36RVwoPJzI3fJsKJHRwqAUruYta4PFprSUYSDsM51LbDV1ECNz0g2NRi09KEA6NsMcVbTIAPlMwQ4YWi-gZQhTyyrUk_KEl7Lf48QVm4H8MHJDwWiVoeSEwR23Cu', '清华大学数学系大三学生，全国数学竞赛一等奖获得者。', '因材施教，注重思维训练', '[{"year": "2023", "title": "高三李同学 · 数学跃升", "result": "从75分提升到142分"}]', '[{"content": "张同学非常专业，孩子数学成绩提升明显。", "parent_name": "王先生", "type": "初三家长"}]', true),
  ('00000000-0000-0000-0000-000000000011', '李同学', '北京大学', ARRAY['英语口语', '考级辅导'], ARRAY['小学辅导', '中考冲刺'], 5.0, 185, 180, 'https://lh3.googleusercontent.com/aida-public/AB6AXuBKvYBgQSPV8CoNRQnQC6nAb5M2GMIdupDXHCPrypLe2jb4PW12ZpNwGeaDb5px09OtgJcn859l8O3AiNdS-Cn7clxU-KeRcnfLBo-6YeOkL3c9Ov2jtkTdb7U6u57-u6uT_HkqxOhD66L0mNWmNJ9-976bWjRSM7vUFu36Jc8dZCAoFvcI3rxPrHRPRXduTkgt2oEJ5hnFsWXaNnQP_ZiVUq5-AD1OjWGNb9mceoSqn06yUso0SoZ8e5bBjz58NloUjDXh5NP0QlmN', '北京大学英语系在读，雅思8.5分获得者。', '沉浸式教学，激发学习兴趣', '[]', '[]', true),
  ('00000000-0000-0000-0000-000000000012', '陆同学', '复旦大学', ARRAY['高中物理', '竞赛'], ARRAY['竞赛培优', '高考提分'], 4.9, 1280, 220, 'https://lh3.googleusercontent.com/aida-public/AB6AXuDerl80SHxfadjTOGSKEdoR3NF9s49HcpAiZUWbapdgxQ2St7QR7-82ivkWUaKf06T3QEBvgb0xd79N7UUcNyZ7cb20I-7KXeoV06df41FBUM8Kanf1o7ydve7VmNavv0z8Y6Rx4PxzOZjoLhRWUcY0aKnh3alc0vXrzej_GBctwoQMuQBGQ0TBSwuB7_JWaQYQ48das7KE6Ru8X42-6iJ1G0JbrhNg51adwGAhTlOLm5iawhmlS77zGV3n3vbUjljcpuqoLciI2I1L', '复旦大学物理学系大三学生，高考物理148分，全国物理竞赛二等奖。', '思维可视化，建立底层逻辑', '[{"year": "2023", "title": "高三林同学 · 物理跃升", "result": "从62分提升到91分"}, {"year": "2024", "title": "初三王同学 · 数理衔接", "result": "力学核心提前掌握，开学测试全班第1"}]', '[{"content": "陆同学非常负责。孩子之前很排斥物理，觉得太抽象。陆同学用生活中的例子来解释动力学，孩子现在甚至会主动看一些物理科普书了。", "parent_name": "王女士", "type": "高二家长"}, {"content": "大学生老师确实更懂学生的痛点。陆老师教的方法很实战，没有那么多教条。", "parent_name": "李先生", "type": "初三家长"}]', true),
  ('00000000-0000-0000-0000-000000000013', '王同学', '中央美术学院', ARRAY['素描', '色彩', '艺考指导'], ARRAY['艺术特长'], 4.8, 320, 250, 'https://picsum.photos/seed/art/400/300?blur=2', '中央美术学院在读，有丰富的艺考指导经验。', '注重基础，循序渐进', '[]', '[]', true)
ON CONFLICT (id) DO NOTHING;

-- Insert courses
INSERT INTO courses (id, title, description, details, price, tags, students_count, icon, is_featured) VALUES
  ('00000000-0000-0000-0000-000000000020', '高考数学最后冲刺提分训练营', '针对新课标，15天建立完整逻辑架构，名校学子带你复盘经典题型。', '本课程由清华、北大数学系学长学姐联合打造。包含15节核心考点直播课、5套历年真题精讲、24小时专属答疑群。适合高三冲刺阶段，目标突破130分的学生。', '¥1999', ARRAY['名师打造', '高三冲刺', '直播+答疑'], '800+', 'BookOpen', true),
  ('00000000-0000-0000-0000-000000000021', '小学全科同步辅导', '夯实基础，培养习惯', '针对1-6年级学生，提供语数英三科同步辅导。重点培养良好的学习习惯、时间管理能力和基础知识的扎实掌握。每周3次课，名校学霸一对一专属辅导。', '¥150/课时', ARRAY['小学', '全科', '习惯培养'], '500+', 'Book', false),
  ('00000000-0000-0000-0000-000000000022', '中考英语听力特训', '场景模拟，高效突破', '精选全国各地近5年中考英语听力真题，按场景分类专项突破。包含外教发音纠正、听力技巧讲解、全真模拟测试。考前30天冲刺必备，目标满分。', '¥899/期', ARRAY['中考', '英语', '听力冲刺'], '300+', 'PenTool', false),
  ('00000000-0000-0000-0000-000000000023', '少儿编程思维启蒙', '逻辑开发，寓教于乐', '专为7-12岁儿童设计的Scratch图形化编程课程。通过制作有趣的小游戏和动画，培养孩子的计算思维、逻辑推理能力和创新创造力。', '¥1299/期', ARRAY['少儿编程', '逻辑思维', 'Scratch'], '200+', 'Brush', false)
ON CONFLICT (id) DO NOTHING;

-- Insert welcome message
INSERT INTO messages (id, user_id, title, content, type, is_read) VALUES
  ('00000000-0000-0000-0000-000000000030', '00000000-0000-0000-0000-000000000001', '欢迎来到 Digital Atheneum', '感谢您注册我们的平台。在这里，您可以找到最顶尖的学府导师。', 'system', false)
ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security (RLS) - for development, we allow all
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tutors ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_records ENABLE ROW LEVEL SECURITY;

-- Allow all operations for now (development mode)
CREATE POLICY "Allow all" ON users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON tutors FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON courses FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON enrollments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON requirements FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON messages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON appointments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON favorites FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON usage_records FOR ALL USING (true) WITH CHECK (true);