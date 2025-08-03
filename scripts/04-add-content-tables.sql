-- First, let's make sure we create the gallery table if it doesn't exist
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

-- Create location_info table
CREATE TABLE IF NOT EXISTS location_info (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) DEFAULT 'Lokasi Strategis',
    description TEXT DEFAULT 'Terletak di jantung Jakarta dengan akses mudah ke berbagai tempat penting seperti kampus, pusat bisnis, dan fasilitas umum.',
    address TEXT DEFAULT 'Jl. Kebon Jeruk Raya No. 123, Jakarta Barat',
    google_maps_url TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    nearby_places TEXT[], -- Array of nearby places
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

-- Insert default data only if tables are empty
INSERT INTO hero_content (title, subtitle, badge_text) 
SELECT 'ANTIEQ WISMA KOST', 'Hunian nyaman dengan fasilitas lengkap di lokasi strategis Jakarta. Cocok untuk mahasiswa dan pekerja muda.', '⭐ Kos Terpercaya di Jakarta'
WHERE NOT EXISTS (SELECT 1 FROM hero_content);

INSERT INTO about_section (title, description, vision, mission) 
SELECT 'Tentang ANTIEQ WISMA KOST', 
 'ANTIEQ WISMA KOST adalah hunian modern yang mengutamakan kenyamanan dan keamanan penghuni. Dengan fasilitas lengkap dan lokasi strategis, kami menjadi pilihan utama untuk mahasiswa dan pekerja muda di Jakarta.',
 'Menjadi penyedia hunian terbaik yang mengutamakan kenyamanan, keamanan, dan kepuasan penghuni.',
 'Memberikan pelayanan terbaik dengan fasilitas modern dan harga terjangkau untuk semua kalangan.'
WHERE NOT EXISTS (SELECT 1 FROM about_section);

INSERT INTO location_info (title, description, nearby_places) 
SELECT 'Lokasi Strategis', 
 'Terletak di jantung Jakarta dengan akses mudah ke berbagai tempat penting seperti kampus, pusat bisnis, dan fasilitas umum.',
 ARRAY['5 menit ke Stasiun KRL', '10 menit ke Mall Central Park', '15 menit ke Universitas Trisakti', '20 menit ke Bundaran HI']
WHERE NOT EXISTS (SELECT 1 FROM location_info);

INSERT INTO seo_settings (meta_title, meta_description, meta_keywords) 
SELECT 'ANTIEQ WISMA KOST - Kos Nyaman & Terjangkau di Jakarta',
 'Hunian nyaman dengan fasilitas lengkap di lokasi strategis Jakarta. Cocok untuk mahasiswa dan pekerja muda. Booking sekarang!',
 'kos jakarta, kost murah, boarding house, hunian mahasiswa, kos nyaman'
WHERE NOT EXISTS (SELECT 1 FROM seo_settings);

-- Insert sample gallery items only if gallery is empty
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
