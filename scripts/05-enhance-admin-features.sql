-- Add admin roles and permissions
CREATE TABLE IF NOT EXISTS admin_roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    permissions TEXT[] DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add role_id to admin_users
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS role_id INTEGER REFERENCES admin_roles(id) DEFAULT 1;

-- Create activity logs table
CREATE TABLE IF NOT EXISTS admin_activity_logs (
    id SERIAL PRIMARY KEY,
    admin_id INTEGER REFERENCES admin_users(id) ON DELETE CASCADE,
    action VARCHAR(255) NOT NULL,
    table_name VARCHAR(100),
    record_id INTEGER,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create website analytics table
CREATE TABLE IF NOT EXISTS website_analytics (
    id SERIAL PRIMARY KEY,
    page_views INTEGER DEFAULT 0,
    unique_visitors INTEGER DEFAULT 0,
    bounce_rate DECIMAL(5,2) DEFAULT 0,
    avg_session_duration INTEGER DEFAULT 0,
    total_bookings INTEGER DEFAULT 0,
    conversion_rate DECIMAL(5,2) DEFAULT 0,
    date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create content scheduler table
CREATE TABLE IF NOT EXISTS content_scheduler (
    id SERIAL PRIMARY KEY,
    content_type VARCHAR(100) NOT NULL, -- 'room', 'testimonial', 'gallery', etc.
    content_data JSONB NOT NULL,
    scheduled_at TIMESTAMP NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'published', 'failed'
    created_by INTEGER REFERENCES admin_users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP
);

-- Create backup logs table
CREATE TABLE IF NOT EXISTS backup_logs (
    id SERIAL PRIMARY KEY,
    backup_type VARCHAR(50) NOT NULL, -- 'manual', 'auto'
    file_path TEXT,
    file_size BIGINT,
    status VARCHAR(50) DEFAULT 'completed', -- 'completed', 'failed'
    created_by INTEGER REFERENCES admin_users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin roles
INSERT INTO admin_roles (name, description, permissions) VALUES 
('Super Admin', 'Full access to all features', ARRAY['*']),
('Content Manager', 'Can manage content but not system settings', ARRAY['rooms', 'testimonials', 'gallery', 'hero', 'about']),
('Viewer', 'Read-only access', ARRAY['view'])
ON CONFLICT (name) DO NOTHING;

-- Update existing admin user to super admin
UPDATE admin_users SET role_id = 1 WHERE username = 'admin';

-- Insert sample analytics data
INSERT INTO website_analytics (page_views, unique_visitors, bounce_rate, avg_session_duration, total_bookings, conversion_rate, date) VALUES 
(150, 120, 35.5, 180, 5, 4.2, CURRENT_DATE - INTERVAL '1 day'),
(180, 145, 32.1, 195, 7, 4.8, CURRENT_DATE - INTERVAL '2 days'),
(165, 135, 38.2, 175, 4, 3.6, CURRENT_DATE - INTERVAL '3 days')
ON CONFLICT DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_activity_logs_admin_id ON admin_activity_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON admin_activity_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_date ON website_analytics(date);
CREATE INDEX IF NOT EXISTS idx_scheduler_scheduled_at ON content_scheduler(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_scheduler_status ON content_scheduler(status);
