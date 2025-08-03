-- Insert initial rooms data
INSERT INTO rooms (name, price, period, size, available, features, description) VALUES
('Kamar Standard', 'Rp 800.000', '/bulan', '3x4 meter', 5, ARRAY['Kasur Single', 'Meja Belajar', 'Lemari Pakaian', 'AC', 'WiFi'], 'Kamar nyaman dengan fasilitas dasar yang lengkap'),
('Kamar Deluxe', 'Rp 1.200.000', '/bulan', '4x5 meter', 3, ARRAY['Kasur Queen', 'Meja Belajar', 'Lemari Pakaian', 'AC', 'WiFi', 'Kamar Mandi Dalam'], 'Kamar luas dengan kamar mandi dalam'),
('Kamar Premium', 'Rp 1.500.000', '/bulan', '5x6 meter', 2, ARRAY['Kasur Queen', 'Meja Belajar', 'Lemari Pakaian', 'AC', 'WiFi', 'Kamar Mandi Dalam', 'Balkon'], 'Kamar premium dengan balkon pribadi')
ON CONFLICT DO NOTHING;

-- Insert initial facilities data
INSERT INTO facilities (name, description, icon, is_active) VALUES
('WiFi Gratis', 'Internet cepat 24 jam', 'Wifi', true),
('Parkir Motor', 'Area parkir luas & aman', 'Car', true),
('Keamanan 24 Jam', 'CCTV & security', 'Shield', true),
('Listrik Termasuk', 'Tidak ada biaya tambahan', 'Zap', true),
('Air Bersih', 'Air mengalir lancar 24 jam', 'Droplets', true),
('AC', 'Setiap kamar ber-AC', 'Wind', true),
('Dapur Bersama', 'Lengkap dengan peralatan', 'Utensils', true),
('Ruang Tamu', 'Area berkumpul yang nyaman', 'Users', true)
ON CONFLICT DO NOTHING;

-- Insert initial testimonials data
INSERT INTO testimonials (name, role, content, rating, is_active) VALUES
('Sari Dewi', 'Mahasiswa UI', 'Kos yang sangat nyaman dan bersih. Fasilitasnya lengkap dan harga terjangkau. Recommended!', 5, true),
('Ahmad Rizki', 'Karyawan Swasta', 'Lokasi strategis, dekat dengan tempat kerja. Pengelola ramah dan responsif. Puas tinggal di sini.', 5, true),
('Maya Putri', 'Mahasiswa Binus', 'Suasana kos seperti rumah sendiri. Teman-teman kos juga baik-baik. Betah banget di sini!', 5, true)
ON CONFLICT DO NOTHING;

-- Insert initial contact info
INSERT INTO contact_info (phone, whatsapp, email, address, instagram, facebook) VALUES
('+62 812-3456-7890', '+62 812-3456-7890', 'info@antieqwisma.com', 'Jl. Kebon Jeruk Raya No. 123, Jakarta Barat', '@antieqwisma', 'ANTIEQ WISMA KOST')
ON CONFLICT DO NOTHING;

-- Insert initial website settings
INSERT INTO website_settings (site_name, tagline, description, primary_color, secondary_color) VALUES
('ANTIEQ WISMA KOST', 'Kos Nyaman & Terjangkau', 'Hunian nyaman dengan fasilitas lengkap di lokasi strategis Jakarta. Cocok untuk mahasiswa dan pekerja muda.', '#2563eb', '#1e40af')
ON CONFLICT DO NOTHING;
