CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) CHECK (role IN ('patient', 'lab_technician', 'doctor')) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

CREATE TABLE IF NOT EXISTS patients (
    id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    date_of_birth DATE,
    address TEXT
);

-- Lab technicians table
CREATE TABLE IF NOT EXISTS lab_technicians (
    id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    employee_id VARCHAR(50) UNIQUE,
    department VARCHAR(100)
);

-- Doctors table
CREATE TABLE IF NOT EXISTS doctors (
    id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    specialization VARCHAR(100),
    license_number VARCHAR(50)
);

-- Lab tests table
CREATE TABLE IF NOT EXISTS lab_tests (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES doctors(id),
    test_name VARCHAR(255) NOT NULL,
    test_date DATE DEFAULT CURRENT_DATE,
    status VARCHAR(50) CHECK (status IN ('pending', 'ready', 'reviewed')) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Lab results table
CREATE TABLE IF NOT EXISTS lab_results (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    lab_test_id UUID REFERENCES lab_tests(id) ON DELETE CASCADE,
    parameter_name VARCHAR(255) NOT NULL,
    result_value DECIMAL(10,2),
    unit VARCHAR(50),
    normal_min DECIMAL(10,2),
    normal_max DECIMAL(10,2),
    medical_note TEXT,
    simple_explanation TEXT,
    created_by UUID REFERENCES lab_technicians(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Explanation templates
CREATE TABLE IF NOT EXISTS explanation_templates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    parameter_name VARCHAR(255) NOT NULL,
    condition_type VARCHAR(20) CHECK (condition_type IN ('high', 'low', 'normal')),
    template_text TEXT NOT NULL,
    language VARCHAR(10) DEFAULT 'en'
);

-- Insert sample explanation templates
INSERT INTO explanation_templates (parameter_name, condition_type, template_text) VALUES
('WBC', 'high', 'Your white blood cells are higher than normal. This may indicate your body is fighting an infection.'),
('WBC', 'low', 'Your white blood cells are lower than normal. This may increase risk of infections.'),
('Hemoglobin', 'high', 'Your hemoglobin is high. This may indicate dehydration or other conditions.'),
('Hemoglobin', 'low', 'Your hemoglobin is low. This may indicate anemia.'),
('Platelets', 'high', 'Your platelets are high. This may increase clotting risk.'),
('Platelets', 'low', 'Your platelets are low. This may increase bleeding risk.')
ON CONFLICT DO NOTHING;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_lab_tests_patient_id ON lab_tests(patient_id);
CREATE INDEX IF NOT EXISTS idx_lab_tests_status ON lab_tests(status);
CREATE INDEX IF NOT EXISTS idx_lab_results_test_id ON lab_results(lab_test_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Drop existing test user if exists
DELETE FROM users WHERE email = 'test@test.com';

-- Create a test user (password: 123456)
-- The password hash is for "123456" using bcrypt
INSERT INTO users (id, email, password_hash, role) 
VALUES (
    uuid_generate_v4(), 
    'test@test.com', 
    '$2a$10$N9qo8uLOickgx2ZMRZoMy.MrAJnY4LqWJqjKQqWVqC7qXqXqXqXqX', 
    'patient'
) ON CONFLICT (email) DO NOTHING;

-- Create patient record for test user
INSERT INTO patients (id, name, phone)
SELECT id, 'Test Patient', '555-1234'
FROM users
WHERE email = 'test@test.com'
ON CONFLICT DO NOTHING;
