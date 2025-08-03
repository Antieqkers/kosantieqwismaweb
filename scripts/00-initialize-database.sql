-- Complete database initialization script
-- This script creates all necessary tables for the ANTIEQ WISMA KOST website

-- Create rooms table
CREATE TABLE IF NOT EXISTS rooms (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price VARCHAR(100) NOT NULL,
    period VARCHAR(50) NOT NULL DEFAULT '/bulan',
    size VARCHAR(50) NOT NULL,
    available INTEGER NOT NULL DEFAULT 0,
    features TEXT[] NOT NULL DEFAULT '{}',
    image_url TEXT,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create facilities table
CREATE TABLE IF NOT EXISTS facilities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(255),
    content TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create contact_info table
CREATE TABLE IF NOT EXISTS contact_info (
    id SERIAL PRIMARY KEY,
    phone VARCHAR(50),
    whatsapp VARCHAR(50),
    email VARCHAR(255),
    address TEXT,
    instagram VARCHAR(255),
    facebook VARCHAR(255),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    room_type VARCHAR(255),
    message TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create website_settings table
CREATE TABLE IF NOT EXISTS website_settings (
    id SERIAL PRIMARY KEY,
    site_name VARCHAR(255) DEFAULT 'ANTIEQ WISMA KOST',
    tagline VARCHAR(255) DEFAULT 'Kos Nyaman & Terjangkau',
    description TEXT,
    primary_color VARCHAR(7) DEFAULT '#2563eb',
    secondary_color VARCHAR(7) DEFAULT '#1e40af',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create admin users table
CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL CHECK (length(username) >= 3),
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255) CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- Create admin sessions table
CREATE TABLE IF NOT EXISTS admin_sessions (
    id SERIAL PRIMARY KEY,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    admin_id INTEGER REFERENCES admin_users(id) ON DELETE CASCADE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create hero_content table
CREATE TABLE IF NOT EXISTS hero_content (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL DEFAULT 'ANTIEQ WISMA KOST',
    subtitle TEXT DEFAULT 'Hunian nyaman dengan fasilitas lengkap di lokasi strategis Jakarta. Cocok untuk mahasiswa dan pekerja muda.',
    badge_text VARCHAR(100) DEFAULT '⭐ Kos Terpercaya di Jakarta',
    hero_image_url TEXT,
    cta_primary VARCHAR(100) DEFAULT 'Lihat Kamar Tersedia',
    cta_secondary VARCHAR(100) DEFAULT 'Hubungi Kami',
    rating DECIMAL(2,1) DEFAULT 4.9,
    total_reviews INTEGER DEFAULT 127,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create about_section table
CREATE TABLE IF NOT EXISTS about_section (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) DEFAULT 'Tentang ANTIEQ WISMA KOST',
    description TEXT,
    vision TEXT,
    mission TEXT,
    established_year INTEGER DEFAULT 2019,
    total_rooms INTEGER DEFAULT 50,
    happy_residents INTEGER DEFAULT 200,
    years_experience INTEGER DEFAULT 5,
    image_url TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create gallery table
CREATE TABLE IF NOT EXISTS gallery (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    category VARCHAR(100) DEFAULT 'general',
    is_featured BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create location_info table
CREATE TABLE IF NOT EXISTS location_info (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) DEFAULT 'Lokasi Strategis',
    description TEXT DEFAULT 'Terletak di jantung Jakarta dengan akses mudah ke berbagai tempat penting seperti kampus, pusat bisnis, dan fasilitas umum.',
    address TEXT DEFAULT 'Jl. Kebon Jeruk Raya No. 123, Jakarta Barat',
    google_maps_url TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    nearby_places TEXT[],
    image_url TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create seo_settings table
CREATE TABLE IF NOT EXISTS seo_settings (
    id SERIAL PRIMARY KEY,
    meta_title VARCHAR(255) DEFAULT 'ANTIEQ WISMA KOST - Kos Nyaman & Terjangkau di Jakarta',
    meta_description TEXT DEFAULT 'Hunian nyaman dengan fasilitas lengkap di lokasi strategis Jakarta. Cocok untuk mahasiswa dan pekerja muda. Booking sekarang!',
    meta_keywords TEXT DEFAULT 'kos jakarta, kost murah, boarding house, hunian mahasiswa, kos nyaman',
    og_title VARCHAR(255),
    og_description TEXT,
    og_image_url TEXT,
    favicon_url TEXT,
    google_analytics_id VARCHAR(50),
    facebook_pixel_id VARCHAR(50),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create admin roles table
CREATE TABLE IF NOT EXISTS admin_roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    permissions TEXT[] DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add role_id to admin_users if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='admin_users' AND column_name='role_id') THEN
        ALTER TABLE admin_users ADD COLUMN role_id INTEGER REFERENCES admin_roles(id) DEFAULT 1;
    END IF;
END $$;

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
    content_type VARCHAR(100) NOT NULL,
    content_data JSONB NOT NULL,
    scheduled_at TIMESTAMP NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_by INTEGER REFERENCES admin_users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP
);

-- Create backup logs table
CREATE TABLE IF NOT EXISTS backup_logs (
    id SERIAL PRIMARY KEY,
    backup_type VARCHAR(50) NOT NULL,
    file_path TEXT,
    file_size BIGINT,
    status VARCHAR(50) DEFAULT 'completed',
    created_by INTEGER REFERENCES admin_users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON admin_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires ON admin_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_admin_users_username ON admin_users(username);
CREATE INDEX IF NOT EXISTS idx_activity_logs_admin_id ON admin_activity_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON admin_activity_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_date ON website_analytics(date);
CREATE INDEX IF NOT EXISTS idx_scheduler_scheduled_at ON content_scheduler(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_scheduler_status ON content_scheduler(status);

-- Insert initial data only if tables are empty

-- Insert initial rooms data
INSERT INTO rooms (name, price, period, size, available, features, description) 
SELECT * FROM (VALUES
('Kamar Standard', 'Rp 800.000', '/bulan', '3x4 meter', 5, ARRAY['Kasur Single', 'Meja Belajar', 'Lemari Pakaian', 'AC', 'WiFi'], 'Kamar nyaman dengan fasilitas dasar yang lengkap'),
('Kamar Deluxe', 'Rp 1.200.000', '/bulan', '4x5 meter', 3, ARRAY['Kasur Queen', 'Meja Belajar', 'Lemari Pakaian', 'AC', 'WiFi', 'Kamar Mandi Dalam'], 'Kamar luas dengan kamar mandi dalam'),
('Kamar Premium', 'Rp 1.500.000', '/bulan', '5x6 meter', 2, ARRAY['Kasur Queen', 'Meja Belajar', 'Lemari Pakaian', 'AC', 'WiFi', 'Kamar Mandi Dalam', 'Balkon'], 'Kamar premium dengan balkon pribadi')
) AS v(name, price, period, size, available, features, description)
WHERE NOT EXISTS (SELECT 1 FROM rooms);

-- Insert initial facilities data
INSERT INTO facilities (name, description, icon, is_active) 
SELECT * FROM (VALUES
('WiFi Gratis', 'Internet cepat 24 jam', 'Wifi', true),
('Parkir Motor', 'Area parkir luas & aman', 'Car', true),
('Keamanan 24 Jam', 'CCTV & security', 'Shield', true),
('Listrik Termasuk', 'Tidak ada biaya tambahan', 'Zap', true),
('Air Bersih', 'Air mengalir lancar 24 jam', 'Droplets', true),
('AC', 'Setiap kamar ber-AC', 'Wind', true),
('Dapur Bersama', 'Lengkap dengan peralatan', 'Utensils', true),
('Ruang Tamu', 'Area berkumpul yang nyaman', 'Users', true)
) AS v(name, description, icon, is_active)
WHERE NOT EXISTS (SELECT 1 FROM facilities);

-- Insert initial testimonials data
INSERT INTO testimonials (name, role, content, rating, is_active) 
SELECT * FROM (VALUES
('Sari Dewi', 'Mahasiswa UI', 'Kos yang sangat nyaman dan bersih. Fasilitasnya lengkap dan harga terjangkau. Recommended!', 5, true),
('Ahmad Rizki', 'Karyawan Swasta', 'Lokasi strategis, dekat dengan tempat kerja. Pengelola ramah dan responsif. Puas tinggal di sini.', 5, true),
('Maya Putri', 'Mahasiswa Binus', 'Suasana kos seperti rumah sendiri. Teman-teman kos juga baik-baik. Betah banget di sini!', 5, true)
) AS v(name, role, content, rating, is_active)
WHERE NOT EXISTS (SELECT 1 FROM testimonials);

-- Insert initial contact info
INSERT INTO contact_info (phone, whatsapp, email, address, instagram, facebook) 
SELECT '+62 812-3456-7890', '+62 812-3456-7890', 'info@antieqwisma.com', 'Jl. Kebon Jeruk Raya No. 123, Jakarta Barat', '@antieqwisma', 'ANTIEQ WISMA KOST'
WHERE NOT EXISTS (SELECT 1 FROM contact_info);

-- Insert initial website settings
INSERT INTO website_settings (site_name, tagline, description, primary_color, secondary_color) 
SELECT 'ANTIEQ WISMA KOST', 'Kos Nyaman & Terjangkau', 'Hunian nyaman dengan fasilitas lengkap di lokasi strategis Jakarta. Cocok untuk mahasiswa dan pekerja muda.', '#2563eb', '#1e40af'
WHERE NOT EXISTS (SELECT 1 FROM website_settings);

-- Insert default admin roles
INSERT INTO admin_roles (name, description, permissions) 
SELECT * FROM (VALUES
('Super Admin', 'Full access to all features', ARRAY['*']),
('Content Manager', 'Can manage content but not system settings', ARRAY['rooms', 'testimonials', 'gallery', 'hero', 'about']),
('Viewer', 'Read-only access', ARRAY['view'])
) AS v(name, description, permissions)
WHERE NOT EXISTS (SELECT 1 FROM admin_roles);

-- Insert default admin user (username: admin, password: admin123)
INSERT INTO admin_users (username, password_hash, email, role_id) 
SELECT 'admin', '$2b$10$rOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQqQqQqQqQqQqQqQqQqQqQqQ', 'admin@antieqwisma.com', 1
WHERE NOT EXISTS (SELECT 1 FROM admin_users WHERE username = 'admin');

-- Insert default hero content
INSERT INTO hero_content (title, subtitle, badge_text) 
SELECT 'ANTIEQ WISMA KOST', 'Hunian nyaman dengan fasilitas lengkap di lokasi strategis Jakarta. Cocok untuk mahasiswa dan pekerja muda.', '⭐ Kos Terpercaya di Jakarta'
WHERE NOT EXISTS (SELECT 1 FROM hero_content);

-- Insert default about section
INSERT INTO about_section (title, description, vision, mission) 
SELECT 'Tentang ANTIEQ WISMA KOST', 
 'ANTIEQ WISMA KOST adalah hunian modern yang mengutamakan kenyamanan dan keamanan penghuni. Dengan fasilitas lengkap dan lokasi strategis, kami menjadi pilihan utama untuk mahasiswa dan pekerja muda di Jakarta.',
 'Menjadi penyedia hunian terbaik yang mengutamakan kenyamanan, keamanan, dan kepuasan penghuni.',
 'Memberikan pelayanan terbaik dengan fasilitas modern dan harga terjangkau untuk semua kalangan.'
WHERE NOT EXISTS (SELECT 1 FROM about_section);

-- Insert default location info
INSERT INTO location_info (title, description, nearby_places) 
SELECT 'Lokasi Strategis', 
 'Terletak di jantung Jakarta dengan akses mudah ke berbagai tempat penting seperti kampus, pusat bisnis, dan fasilitas umum.',
 ARRAY['5 menit ke Stasiun KRL', '10 menit ke Mall Central Park', '15 menit ke Universitas Trisakti', '20 menit ke Bundaran HI']
WHERE NOT EXISTS (SELECT 1 FROM location_info);

-- Insert default SEO settings
INSERT INTO seo_settings (meta_title, meta_description, meta_keywords) 
SELECT 'ANTIEQ WISMA KOST - Kos Nyaman & Terjangkau di Jakarta',
 'Hunian nyaman dengan fasilitas lengkap di lokasi strategis Jakarta. Cocok untuk mahasiswa dan pekerja muda. Booking sekarang!',
 'kos jakarta, kost murah, boarding house, hunian mahasiswa, kos nyaman'
WHERE NOT EXISTS (SELECT 1 FROM seo_settings);

-- Insert sample gallery items
INSERT INTO gallery (title, description, image_url, category, is_featured) 
SELECT * FROM (VALUES 
('Kamar Standard', 'Kamar nyaman dengan fasilitas lengkap', '/placeholder.svg?height=300&width=400&text=Kamar+Standard', 'rooms', true),
('Kamar Deluxe', 'Kamar luas dengan kamar mandi dalam', '/placeholder.svg?height=300&width=400&text=Kamar+Deluxe', 'rooms', true),
('Ruang Tamu', 'Area berkumpul yang nyaman', '/placeholder.svg?height=300&width=400&text=Ruang+Tamu', 'facilities', false),
('Dapur Bersama', 'Dapur lengkap dengan peralatan modern', '/placeholder.svg?height=300&width=400&text=Dapur+Bersama', 'facilities', false),
('Area Parkir', 'Parkir luas dan aman', '/placeholder.svg?height=300&width=400&text=Area+Parkir', 'facilities', false),
('Eksterior Bangunan', 'Tampak depan ANTIEQ WISMA KOST', '/placeholder.svg?height=300&width=400&text=Eksterior+Bangunan', 'exterior', true)
) AS v(title, description, image_url, category, is_featured)
WHERE NOT EXISTS (SELECT 1 FROM gallery);

-- Insert sample analytics data
INSERT INTO website_analytics (page_views, unique_visitors, bounce_rate, avg_session_duration, total_bookings, conversion_rate, date) 
SELECT * FROM (VALUES
(150, 120, 35.5, 180, 5, 4.2, CURRENT_DATE - INTERVAL '1 day'),
(180, 145, 32.1, 195, 7, 4.8, CURRENT_DATE - INTERVAL '2 days'),
(165, 135, 38.2, 175, 4, 3.6, CURRENT_DATE - INTERVAL '3 days')
) AS v(page_views, unique_visitors, bounce_rate, avg_session_duration, total_bookings, conversion_rate, date)
WHERE NOT EXISTS (SELECT 1 FROM website_analytics);

-- Clean up expired sessions
DELETE FROM admin_sessions WHERE expires_at < NOW();
