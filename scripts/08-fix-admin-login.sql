-- Ensure admin_users table exists with proper structure
CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'admin',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create admin_sessions table
CREATE TABLE IF NOT EXISTS admin_sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  session_token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Delete existing admin user if exists
DELETE FROM admin_users WHERE username = 'adminantieq';

-- Create new admin user with bcrypt hashed password
-- Password: gardaantieq92
-- Hash generated with bcrypt rounds=12
INSERT INTO admin_users (username, email, password_hash, role) 
VALUES (
  'adminantieq', 
  'admin@antieqwisma.com', 
  '$2a$12$LQv3c1yqBFVyhumFWOJhW.1e/4/Uy3y4x4O9V9FkwYOAOIRANxj6G',
  'admin'
);

-- Clean up expired sessions
DELETE FROM admin_sessions WHERE expires_at < NOW();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON admin_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_user_id ON admin_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires ON admin_sessions(expires_at);

-- Verify admin user was created
SELECT id, username, email, role, created_at FROM admin_users WHERE username = 'adminantieq';
