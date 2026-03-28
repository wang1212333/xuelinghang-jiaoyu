-- =====================================================
-- Mojin Academy Database Schema
-- 在 Supabase SQL Editor 中执行：https://supabase.com/dashboard
-- =====================================================

-- 启用必要的扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users 表（存储用户基本信息）
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  wechat TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'tutor')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Profiles 表（存储用户详细信息）
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

-- Tutors 表（讲师信息）
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

-- Courses 表（课程信息）
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

-- Enrollments 表（课程报名）
CREATE TABLE IF NOT EXISTS enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Requirements 表（家教需求）
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

-- Messages 表（消息通知）
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  type TEXT DEFAULT 'system' CHECK (type IN ('system', 'requirement', 'match')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_tutors_user_id ON tutors(user_id);
CREATE INDEX IF NOT EXISTS idx_requirements_user_id ON requirements(user_id);
CREATE INDEX IF NOT EXISTS idx_requirements_status ON requirements(status);
CREATE INDEX IF NOT EXISTS idx_messages_user_id ON messages(user_id);

-- 创建自动更新时间戳的触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 为需要自动更新时间的表添加触发器
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_tutors_updated_at ON tutors;
CREATE TRIGGER update_tutors_updated_at
  BEFORE UPDATE ON tutors
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_courses_updated_at ON courses;
CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON courses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_requirements_updated_at ON requirements;
CREATE TRIGGER update_requirements_updated_at
  BEFORE UPDATE ON requirements
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 创建初始管理员账号
-- =====================================================

-- 注意：这需要在 Supabase Authentication 中先创建用户
-- 然后在这里插入对应的 users 和 profiles 记录

-- 示例：创建一个管理员（需要在 Auth 中先创建用户后，将 user_id 替换为实际 ID）
-- INSERT INTO users (id, email, role) 
-- VALUES ('从 Auth 获取的用户 ID', 'admin@xuelinghang.com', 'admin');
-- 
-- INSERT INTO profiles (user_id, name, role_label)
-- VALUES ('从 Auth 获取的用户 ID', '管理员', '管理员');

-- 设置 Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tutors ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- 创建策略：允许用户查看自己的数据
CREATE POLICY "Users can view own data" ON users
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT
  USING (auth.uid() = user_id);

-- 创建策略：允许所有人查看公开数据（讲师、课程）
CREATE POLICY "Anyone can view tutors" ON tutors
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view courses" ON courses
  FOR SELECT
  USING (true);

-- 创建策略：管理员可以查看所有数据
CREATE POLICY "Admins can view all users" ON users
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users u 
      WHERE u.id = auth.uid() AND u.role = 'admin'
    )
  );

CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users u 
      WHERE u.id = auth.uid() AND u.role = 'admin'
    )
  );

-- =====================================================
-- 完成提示
-- =====================================================
-- 执行完成后，请：
-- 1. 前往 Authentication → Users 创建管理员账号
-- 2. 将创建的用户 ID 复制到上面的 INSERT 语句中
-- 3. 或者使用管理后台的注册功能自动创建
-- =====================================================
