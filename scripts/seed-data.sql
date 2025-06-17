-- Insert sample skills
INSERT INTO skills (name, category) VALUES
('React', 'Frontend'),
('Vue.js', 'Frontend'),
('Angular', 'Frontend'),
('TypeScript', 'Language'),
('JavaScript', 'Language'),
('Python', 'Language'),
('Java', 'Language'),
('Node.js', 'Backend'),
('Express.js', 'Backend'),
('Django', 'Backend'),
('Flask', 'Backend'),
('PostgreSQL', 'Database'),
('MongoDB', 'Database'),
('MySQL', 'Database'),
('Redis', 'Database'),
('AWS', 'Cloud'),
('Docker', 'DevOps'),
('Kubernetes', 'DevOps'),
('Git', 'Tools'),
('GraphQL', 'API'),
('REST API', 'API'),
('Machine Learning', 'AI/ML'),
('TensorFlow', 'AI/ML'),
('PyTorch', 'AI/ML'),
('Figma', 'Design'),
('Adobe XD', 'Design'),
('UI/UX Design', 'Design'),
('Mobile Development', 'Mobile'),
('React Native', 'Mobile'),
('Flutter', 'Mobile'),
('Swift', 'Mobile'),
('Kotlin', 'Mobile'),
('Blockchain', 'Web3'),
('Solidity', 'Web3'),
('Web3.js', 'Web3')
ON CONFLICT (name) DO NOTHING;

-- Insert sample users (these will be created via auth, but we can have some sample data)
INSERT INTO users (id, email, name, bio, location, github_username, availability) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'sarah.chen@example.com', 'Sarah Chen', 'Full-stack developer passionate about React and Node.js', 'San Francisco, CA', 'sarahchen', true),
('550e8400-e29b-41d4-a716-446655440002', 'marcus.rodriguez@example.com', 'Marcus Rodriguez', 'Backend engineer specializing in Python and cloud architecture', 'Austin, TX', 'marcusrod', true),
('550e8400-e29b-41d4-a716-446655440003', 'emily.watson@example.com', 'Emily Watson', 'UI/UX designer and frontend developer', 'New York, NY', 'emilywatson', false),
('550e8400-e29b-41d4-a716-446655440004', 'david.kim@example.com', 'David Kim', 'Machine learning engineer and data scientist', 'Seattle, WA', 'davidkim', true)
ON CONFLICT (email) DO NOTHING;

-- Insert sample projects
INSERT INTO projects (id, title, description, owner_id, status, project_type, difficulty, estimated_duration, max_collaborators) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'AI-Powered Code Review Tool', 'Building an intelligent code review assistant using machine learning to help developers write better code.', '550e8400-e29b-41d4-a716-446655440001', 'available', 'AI/ML', 'advanced', '3-6 months', 3),
('660e8400-e29b-41d4-a716-446655440002', 'Real-time Collaboration Platform', 'Creating a modern collaboration platform for remote teams with real-time editing and video chat.', '550e8400-e29b-41d4-a716-446655440002', 'available', 'Fullstack', 'intermediate', '2-4 months', 2),
('660e8400-e29b-41d4-a716-446655440003', 'Mobile Fitness Tracker', 'Developing a cross-platform mobile app for fitness tracking with social features.', '550e8400-e29b-41d4-a716-446655440003', 'active', 'Mobile', 'beginner', '1-3 months', 2),
('660e8400-e29b-41d4-a716-446655440004', 'Blockchain Voting System', 'Building a secure and transparent voting system using blockchain technology.', '550e8400-e29b-41d4-a716-446655440004', 'available', 'Web3', 'advanced', '4-8 months', 4)
ON CONFLICT (id) DO NOTHING;
