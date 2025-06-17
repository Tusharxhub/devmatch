-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  location VARCHAR(255),
  timezone VARCHAR(100),
  github_username VARCHAR(255),
  stackoverflow_username VARCHAR(255),
  availability BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Skills table
CREATE TABLE IF NOT EXISTS skills (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  category VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User skills junction table
CREATE TABLE IF NOT EXISTS user_skills (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
  proficiency_level INTEGER DEFAULT 1 CHECK (proficiency_level >= 1 AND proficiency_level <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, skill_id)
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'available', 'active', 'completed', 'cancelled')),
  project_type VARCHAR(50) NOT NULL,
  difficulty VARCHAR(20) CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  estimated_duration VARCHAR(50),
  max_collaborators INTEGER DEFAULT 1,
  current_collaborators INTEGER DEFAULT 0,
  github_repo VARCHAR(255),
  demo_url VARCHAR(255),
  is_featured BOOLEAN DEFAULT false,
  likes_count INTEGER DEFAULT 0,
  bookmarks_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Project skills junction table
CREATE TABLE IF NOT EXISTS project_skills (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
  is_required BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(project_id, skill_id)
);

-- Project collaborators table
CREATE TABLE IF NOT EXISTS project_collaborators (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'collaborator',
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'left')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(project_id, user_id)
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
  recipient_id UUID REFERENCES users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  message_type VARCHAR(20) DEFAULT 'text' CHECK (message_type IN ('text', 'system', 'file')),
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User matches table
CREATE TABLE IF NOT EXISTS user_matches (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user1_id UUID REFERENCES users(id) ON DELETE CASCADE,
  user2_id UUID REFERENCES users(id) ON DELETE CASCADE,
  compatibility_score DECIMAL(3,2) CHECK (compatibility_score >= 0 AND compatibility_score <= 1),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'blocked')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user1_id, user2_id)
);

-- Project likes table
CREATE TABLE IF NOT EXISTS project_likes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(project_id, user_id)
);

-- Project bookmarks table
CREATE TABLE IF NOT EXISTS project_bookmarks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(project_id, user_id)
);

-- User settings table
CREATE TABLE IF NOT EXISTS user_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  email_notifications BOOLEAN DEFAULT true,
  push_notifications BOOLEAN DEFAULT true,
  project_recommendations BOOLEAN DEFAULT true,
  match_notifications BOOLEAN DEFAULT true,
  privacy_level VARCHAR(20) DEFAULT 'public' CHECK (privacy_level IN ('public', 'friends', 'private')),
  show_email BOOLEAN DEFAULT false,
  show_location BOOLEAN DEFAULT true,
  show_github BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reports table
CREATE TABLE IF NOT EXISTS reports (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  reporter_id UUID REFERENCES users(id) ON DELETE CASCADE,
  reported_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  reported_project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  reason VARCHAR(100) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'investigating', 'resolved', 'dismissed')),
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_github_username ON users(github_username);
CREATE INDEX IF NOT EXISTS idx_projects_owner_id ON projects(owner_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_messages_sender_recipient ON messages(sender_id, recipient_id);
CREATE INDEX IF NOT EXISTS idx_user_matches_users ON user_matches(user1_id, user2_id);
CREATE INDEX IF NOT EXISTS idx_project_likes_project_user ON project_likes(project_id, user_id);
CREATE INDEX IF NOT EXISTS idx_project_bookmarks_project_user ON project_bookmarks(project_id, user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON user_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reports_updated_at BEFORE UPDATE ON reports FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
