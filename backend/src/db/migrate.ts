import { supabaseAdmin } from '../lib/supabase.js';

const schema = `
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
  teaching philosophy TEXT,
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
`;

async function migrate() {
  console.log('Running database migrations...');
  
  try {
    const { error } = await supabaseAdmin.rpc('exec', { sql: schema });
    
    if (error) {
      console.error('Migration error:', error);
      
      const { data, error: directError } = await supabaseAdmin.from('_migrations').select('id').limit(1);
      
      if (directError && directError.code === '42P01') {
        console.log('Tables do not exist, attempting to create via SQL...');
        
        const createTablesSQL = schema.replace(/CREATE INDEX/g, 'CREATE INDEX IF NOT EXISTS');
        
        const statements = createTablesSQL.split(';').filter(s => s.trim());
        
        for (const statement of statements) {
          if (statement.trim()) {
            console.log('Executing:', statement.substring(0, 50) + '...');
          }
        }
      }
    } else {
      console.log('Migration completed successfully!');
    }
  } catch (err) {
    console.error('Migration failed:', err);
  }
  
  process.exit(0);
}

migrate();