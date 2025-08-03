-- Create residents table for storing resident registration data
CREATE TABLE IF NOT EXISTS residents (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    id_number VARCHAR(50) NOT NULL,
    birth_date DATE NOT NULL,
    gender VARCHAR(10) NOT NULL CHECK (gender IN ('Laki-laki', 'Perempuan')),
    occupation VARCHAR(255),
    address TEXT NOT NULL,
    emergency_contact_name VARCHAR(255) NOT NULL,
    emergency_contact_phone VARCHAR(20) NOT NULL,
    emergency_contact_relation VARCHAR(100) NOT NULL,
    room_type VARCHAR(100),
    move_in_date DATE,
    contract_duration INTEGER, -- in months
    monthly_rent DECIMAL(12,2),
    deposit_amount DECIMAL(12,2),
    id_card_url TEXT,
    photo_url TEXT,
    notes TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'active', 'inactive')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_residents_email ON residents(email);
CREATE INDEX IF NOT EXISTS idx_residents_status ON residents(status);
CREATE INDEX IF NOT EXISTS idx_residents_created_at ON residents(created_at);
CREATE INDEX IF NOT EXISTS idx_residents_phone ON residents(phone);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_residents_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_residents_updated_at
    BEFORE UPDATE ON residents
    FOR EACH ROW
    EXECUTE FUNCTION update_residents_updated_at();

-- Insert sample data for testing
INSERT INTO residents (
    full_name, email, phone, id_number, birth_date, gender, occupation, address,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relation,
    room_type, move_in_date, contract_duration, monthly_rent, deposit_amount,
    notes, status
) VALUES 
(
    'Ahmad Rizki Pratama', 'ahmad.rizki@email.com', '081234567890', '3201234567890001', 
    '1998-05-15', 'Laki-laki', 'Software Developer', 'Jl. Sudirman No. 123, Jakarta Pusat',
    'Siti Pratama', '081234567891', 'Ibu', 
    'Kamar Standard', '2024-02-01', 12, 1200000, 2400000,
    'Penghuni yang baik dan tertib', 'active'
),
(
    'Sari Dewi Lestari', 'sari.dewi@email.com', '081234567892', '3201234567890002', 
    '1999-08-22', 'Perempuan', 'Mahasiswa UI', 'Jl. Thamrin No. 456, Jakarta Pusat',
    'Budi Lestari', '081234567893', 'Ayah', 
    'Kamar Premium', '2024-01-15', 6, 1500000, 3000000,
    'Mahasiswa semester akhir', 'approved'
),
(
    'Budi Santoso', 'budi.santoso@email.com', '081234567894', '3201234567890003', 
    '1997-12-10', 'Laki-laki', 'Marketing Executive', 'Jl. Gatot Subroto No. 789, Jakarta Selatan',
    'Ani Santoso', '081234567895', 'Istri', 
    'Kamar Deluxe', NULL, NULL, NULL, NULL,
    'Sedang mencari kamar yang cocok', 'pending'
);
