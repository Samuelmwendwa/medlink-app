-- Create beds table
CREATE TABLE IF NOT EXISTS beds (
  id TEXT PRIMARY KEY,
  status TEXT NOT NULL CHECK (status IN ('Available', 'Occupied', 'Maintenance')),
  department TEXT NOT NULL,
  patient_id TEXT,
  admission_time TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create patients table
CREATE TABLE IF NOT EXISTS patients (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  age INTEGER,
  gender TEXT,
  contact_number TEXT,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  department TEXT,
  chief_complaint TEXT,
  notes TEXT,
  wait_time INTEGER,
  arrival_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT CHECK (status IN ('waiting', 'in-progress', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create alerts table
CREATE TABLE IF NOT EXISTS alerts (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  location TEXT,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  status TEXT CHECK (status IN ('active', 'resolved', 'pending')),
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create resources table
CREATE TABLE IF NOT EXISTS resources (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('staff', 'equipment', 'supply')),
  department TEXT,
  quantity INTEGER,
  status TEXT CHECK (status IN ('available', 'in-use', 'maintenance', 'depleted')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert demo data for beds
INSERT INTO beds (id, status, department, patient_id, admission_time)
VALUES
  ('B-1001', 'Available', 'Emergency', NULL, NULL),
  ('B-1002', 'Occupied', 'Emergency', 'P-12345', NOW() - INTERVAL '3 hours'),
  ('B-1003', 'Maintenance', 'Emergency', NULL, NULL),
  ('B-1004', 'Available', 'Emergency', NULL, NULL),
  ('B-1005', 'Occupied', 'Emergency', 'P-12346', NOW() - INTERVAL '5 hours'),
  ('B-2001', 'Available', 'ICU', NULL, NULL),
  ('B-2002', 'Occupied', 'ICU', 'P-12347', NOW() - INTERVAL '12 hours'),
  ('B-2003', 'Occupied', 'ICU', 'P-12348', NOW() - INTERVAL '24 hours'),
  ('B-2004', 'Maintenance', 'ICU', NULL, NULL),
  ('B-3001', 'Available', 'Cardiology', NULL, NULL),
  ('B-3002', 'Available', 'Cardiology', NULL, NULL),
  ('B-3003', 'Occupied', 'Cardiology', 'P-12349', NOW() - INTERVAL '8 hours'),
  ('B-4001', 'Available', 'Pediatrics', NULL, NULL),
  ('B-4002', 'Occupied', 'Pediatrics', 'P-12350', NOW() - INTERVAL '10 hours'),
  ('B-4003', 'Available', 'Pediatrics', NULL, NULL)
ON CONFLICT (id) DO NOTHING;

-- Insert demo data for patients
INSERT INTO patients (id, name, age, gender, contact_number, priority, department, chief_complaint, notes, wait_time, arrival_time, status)
VALUES
  ('P-12345', 'John Doe', 45, 'Male', '555-123-4567', 'medium', 'Emergency', 'Chest pain', 'Patient has history of hypertension', 45, NOW() - INTERVAL '45 minutes', 'waiting'),
  ('P-12346', 'Jane Smith', 32, 'Female', '555-234-5678', 'high', 'Cardiology', 'Shortness of breath', 'Patient has asthma', 30, NOW() - INTERVAL '30 minutes', 'waiting'),
  ('P-12347', 'Robert Johnson', 67, 'Male', '555-345-6789', 'critical', 'Emergency', 'Stroke symptoms', 'Patient has history of stroke', 15, NOW() - INTERVAL '15 minutes', 'in-progress'),
  ('P-12348', 'Emily Davis', 28, 'Female', '555-456-7890', 'low', 'General Medicine', 'Fever and cough', 'Patient has been sick for 3 days', 60, NOW() - INTERVAL '60 minutes', 'waiting'),
  ('P-12349', 'Michael Wilson', 52, 'Male', '555-567-8901', 'medium', 'Neurology', 'Severe headache', 'Patient reports migraines', 25, NOW() - INTERVAL '25 minutes', 'waiting'),
  ('P-12350', 'Sarah Thompson', 8, 'Female', '555-678-9012', 'high', 'Pediatrics', 'High fever', 'Temperature of 103°F', 20, NOW() - INTERVAL '20 minutes', 'in-progress'),
  ('P-12351', 'David Brown', 71, 'Male', '555-789-0123', 'medium', 'Cardiology', 'Irregular heartbeat', 'History of arrhythmia', 35, NOW() - INTERVAL '35 minutes', 'waiting'),
  ('P-12352', 'Lisa Martinez', 39, 'Female', '555-890-1234', 'low', 'Orthopedics', 'Wrist pain', 'Possible sprain', 50, NOW() - INTERVAL '50 minutes', 'waiting'),
  ('P-12353', 'James Taylor', 60, 'Male', '555-901-2345', 'high', 'Emergency', 'Abdominal pain', 'Possible appendicitis', 10, NOW() - INTERVAL '10 minutes', 'in-progress'),
  ('P-12354', 'Jennifer Garcia', 42, 'Female', '555-012-3456', 'medium', 'General Medicine', 'Back pain', 'Chronic condition', 40, NOW() - INTERVAL '40 minutes', 'waiting')
ON CONFLICT (id) DO NOTHING;

-- Insert demo data for alerts
INSERT INTO alerts (title, description, location, priority, status, created_at)
VALUES
  ('Code Blue', 'Patient in cardiac arrest', 'ICU Room 302', 'critical', 'active', NOW() - INTERVAL '5 minutes'),
  ('Staff Shortage', 'Urgent need for additional nurses', 'Emergency Department', 'high', 'active', NOW() - INTERVAL '15 minutes'),
  ('Equipment Malfunction', 'Ventilator not functioning properly', 'ICU Room 305', 'high', 'resolved', NOW() - INTERVAL '2 hours'),
  ('Supply Shortage', 'Running low on IV fluids', 'General Medicine', 'medium', 'pending', NOW() - INTERVAL '30 minutes'),
  ('Patient Fall', 'Patient fell while attempting to get out of bed', 'Orthopedics Room 203', 'medium', 'resolved', NOW() - INTERVAL '4 hours')
ON CONFLICT DO NOTHING;

-- Insert demo data for resources
INSERT INTO resources (name, type, department, quantity, status)
VALUES
  ('Doctors', 'staff', 'Emergency', 12, 'available'),
  ('Nurses', 'staff', 'Emergency', 28, 'available'),
  ('Support Staff', 'staff', 'Emergency', 5, 'available'),
  ('Ventilators', 'equipment', 'ICU', 15, 'available'),
  ('Ventilators', 'equipment', 'ICU', 5, 'in-use'),
  ('Ventilators', 'equipment', 'ICU', 2, 'maintenance'),
  ('IV Pumps', 'equipment', 'General Medicine', 25, 'available'),
  ('IV Pumps', 'equipment', 'General Medicine', 15, 'in-use'),
  ('Surgical Masks', 'supply', 'Hospital-wide', 500, 'available'),
  ('N95 Respirators', 'supply', 'Emergency', 200, 'available'),
  ('Hand Sanitizer', 'supply', 'Hospital-wide', 100, 'available'),
  ('Gloves', 'supply', 'Hospital-wide', 1000, 'available'),
  ('Gowns', 'supply', 'ICU', 150, 'available'),
  ('Blood Pressure Monitors', 'equipment', 'Cardiology', 10, 'available'),
  ('Blood Pressure Monitors', 'equipment', 'Cardiology', 5, 'in-use'),
  ('Doctors', 'staff', 'Cardiology', 8, 'available'),
  ('Nurses', 'staff', 'Cardiology', 15, 'available'),
  ('Doctors', 'staff', 'Pediatrics', 6, 'available'),
  ('Nurses', 'staff', 'Pediatrics', 12, 'available'),
  ('Doctors', 'staff', 'Neurology', 4, 'available'),
  ('Nurses', 'staff', 'Neurology', 8, 'available'),
  ('Doctors', 'staff', 'Orthopedics', 5, 'available'),
  ('Nurses', 'staff', 'Orthopedics', 10, 'available'),
  ('Doctors', 'staff', 'ICU', 10, 'available'),
  ('Nurses', 'staff', 'ICU', 20, 'available')
ON CONFLICT DO NOTHING;

-- Enable row level security on all tables
ALTER TABLE beds ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

-- Create policies for all authenticated users to view data
DROP POLICY IF EXISTS "Allow all authenticated users to view beds" ON beds;
CREATE POLICY "Allow all authenticated users to view beds"
ON beds FOR SELECT
USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow all authenticated users to view patients" ON patients;
CREATE POLICY "Allow all authenticated users to view patients"
ON patients FOR SELECT
USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow all authenticated users to view alerts" ON alerts;
CREATE POLICY "Allow all authenticated users to view alerts"
ON alerts FOR SELECT
USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow all authenticated users to view resources" ON resources;
CREATE POLICY "Allow all authenticated users to view resources"
ON resources FOR SELECT
USING (auth.role() = 'authenticated');

-- Create policies for all authenticated users to insert/update/delete data
DROP POLICY IF EXISTS "Allow all authenticated users to modify beds" ON beds;
CREATE POLICY "Allow all authenticated users to modify beds"
ON beds FOR ALL
USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow all authenticated users to modify patients" ON patients;
CREATE POLICY "Allow all authenticated users to modify patients"
ON patients FOR ALL
USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow all authenticated users to modify alerts" ON alerts;
CREATE POLICY "Allow all authenticated users to modify alerts"
ON alerts FOR ALL
USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow all authenticated users to modify resources" ON resources;
CREATE POLICY "Allow all authenticated users to modify resources"
ON resources FOR ALL
USING (auth.role() = 'authenticated');

-- Enable realtime for all tables
alter publication supabase_realtime add table beds;
alter publication supabase_realtime add table patients;
alter publication supabase_realtime add table alerts;
alter publication supabase_realtime add table resources;
