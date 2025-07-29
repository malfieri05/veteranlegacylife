-- Supabase Database Schema for Veteran Legacy Life Funnel
-- Replaces 51-column Google Sheets structure

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Main funnel data table (replaces Google Sheets)
CREATE TABLE funnel_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('Lead', 'LeadPartial', 'Partial', 'Application')),
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    last_activity TIMESTAMPTZ DEFAULT NOW(),
    
    -- Contact Information (columns 5-11)
    first_name TEXT,
    last_name TEXT,
    email TEXT,
    phone TEXT,
    date_of_birth DATE,
    transactional_consent BOOLEAN DEFAULT FALSE,
    marketing_consent BOOLEAN DEFAULT FALSE,
    
    -- Pre-qualification (columns 12-16)
    state TEXT,
    military_status TEXT,
    branch_of_service TEXT,
    marital_status TEXT,
    coverage_amount TEXT,
    
    -- Medical Answers (columns 17-22)
    tobacco_use TEXT,
    medical_conditions TEXT,
    height TEXT,
    weight TEXT,
    hospital_care TEXT,
    diabetes_medication TEXT,
    
    -- Application Data (columns 23-35)
    street_address TEXT,
    city TEXT,
    application_state TEXT,
    zip_code TEXT,
    beneficiary_name TEXT,
    beneficiary_relationship TEXT,
    va_number TEXT,
    service_connected TEXT,
    ssn TEXT, -- Will be encrypted
    drivers_license TEXT, -- Will be encrypted
    bank_name TEXT,
    routing_number TEXT, -- Will be encrypted
    account_number TEXT, -- Will be encrypted
    
    -- Quote Data (columns 36-41)
    policy_date DATE,
    quote_coverage TEXT,
    quote_premium TEXT,
    quote_age TEXT,
    quote_gender TEXT,
    quote_type TEXT,
    
    -- Tracking Data (columns 42-49)
    current_step TEXT,
    step_name TEXT,
    form_type TEXT,
    user_agent TEXT,
    referrer TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    
    -- Email Status (columns 50-51)
    partial_email_sent BOOLEAN DEFAULT FALSE,
    completed_email_sent BOOLEAN DEFAULT FALSE,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_funnel_submissions_session_id ON funnel_submissions(session_id);
CREATE INDEX idx_funnel_submissions_status ON funnel_submissions(status);
CREATE INDEX idx_funnel_submissions_email ON funnel_submissions(email);
CREATE INDEX idx_funnel_submissions_timestamp ON funnel_submissions(timestamp);

-- Email notifications log
CREATE TABLE email_notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    submission_id UUID REFERENCES funnel_submissions(id) ON DELETE CASCADE,
    notification_type TEXT NOT NULL CHECK (notification_type IN ('lead', 'lead_confirmation', 'partial_lead', 'abandonment_recovery', 'application_complete', 'application_confirmation')),
    recipient_email TEXT NOT NULL,
    subject TEXT NOT NULL,
    html_content TEXT,
    sent_at TIMESTAMPTZ DEFAULT NOW(),
    status TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'failed', 'pending')),
    error_message TEXT
);

-- SMS notifications log
CREATE TABLE sms_notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    submission_id UUID REFERENCES funnel_submissions(id) ON DELETE CASCADE,
    notification_type TEXT NOT NULL CHECK (notification_type IN ('lead', 'application_complete', 'abandonment_alert')),
    recipient_phone TEXT NOT NULL,
    message TEXT NOT NULL,
    sent_at TIMESTAMPTZ DEFAULT NOW(),
    status TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'failed', 'pending')),
    error_message TEXT
);

-- Session tracking
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id TEXT UNIQUE NOT NULL,
    submission_id UUID REFERENCES funnel_submissions(id) ON DELETE CASCADE,
    current_step INTEGER DEFAULT 1,
    step_name TEXT,
    last_activity TIMESTAMPTZ DEFAULT NOW(),
    abandoned_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Configuration table
CREATE TABLE config (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default configuration
INSERT INTO config (key, value, description) VALUES
('admin_email', 'lindsey08092@gmail.com', 'Admin email for notifications'),
('from_email', 'lindsey08092@gmail.com', 'From email address'),
('reply_to_email', 'lindsey08092@gmail.com', 'Reply-to email address'),
('company_name', 'Veteran Legacy Life', 'Company name'),
('company_phone', '(800) VET-INSURANCE', 'Company phone number'),
('company_phone_dialable', '180083847467', 'Company phone number (dialable)'),
('company_website', 'https://veteranlegacylife.com', 'Company website'),
('sendgrid_api_key', '', 'SendGrid API key for email'),
('twilio_account_sid', '', 'Twilio Account SID'),
('twilio_auth_token', '', 'Twilio Auth Token'),
('twilio_phone_number', '', 'Twilio phone number');

-- Row Level Security (RLS) policies
ALTER TABLE funnel_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE sms_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE config ENABLE ROW LEVEL SECURITY;

-- RLS Policies for funnel_submissions
CREATE POLICY "Allow all operations for authenticated users" ON funnel_submissions
    FOR ALL USING (auth.role() = 'authenticated');

-- RLS Policies for email_notifications
CREATE POLICY "Allow all operations for authenticated users" ON email_notifications
    FOR ALL USING (auth.role() = 'authenticated');

-- RLS Policies for sms_notifications
CREATE POLICY "Allow all operations for authenticated users" ON sms_notifications
    FOR ALL USING (auth.role() = 'authenticated');

-- RLS Policies for sessions
CREATE POLICY "Allow all operations for authenticated users" ON sessions
    FOR ALL USING (auth.role() = 'authenticated');

-- RLS Policies for config
CREATE POLICY "Allow read for authenticated users" ON config
    FOR SELECT USING (auth.role() = 'authenticated');

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_funnel_submissions_updated_at 
    BEFORE UPDATE ON funnel_submissions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sessions_updated_at 
    BEFORE UPDATE ON sessions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to encrypt sensitive data
CREATE OR REPLACE FUNCTION encrypt_sensitive_data(data TEXT)
RETURNS TEXT AS $$
BEGIN
    IF data IS NULL OR LENGTH(data) < 4 THEN
        RETURN data;
    END IF;
    RETURN REPEAT('*', LENGTH(data) - 4) || RIGHT(data, 4);
END;
$$ LANGUAGE plpgsql;

-- Function to get submission by session ID
CREATE OR REPLACE FUNCTION get_submission_by_session(session_id_param TEXT)
RETURNS TABLE (
    id UUID,
    session_id TEXT,
    status TEXT,
    timestamp TIMESTAMPTZ,
    last_activity TIMESTAMPTZ,
    first_name TEXT,
    last_name TEXT,
    email TEXT,
    phone TEXT,
    date_of_birth DATE,
    transactional_consent BOOLEAN,
    marketing_consent BOOLEAN,
    state TEXT,
    military_status TEXT,
    branch_of_service TEXT,
    marital_status TEXT,
    coverage_amount TEXT,
    tobacco_use TEXT,
    medical_conditions TEXT,
    height TEXT,
    weight TEXT,
    hospital_care TEXT,
    diabetes_medication TEXT,
    street_address TEXT,
    city TEXT,
    application_state TEXT,
    zip_code TEXT,
    beneficiary_name TEXT,
    beneficiary_relationship TEXT,
    va_number TEXT,
    service_connected TEXT,
    ssn TEXT,
    drivers_license TEXT,
    bank_name TEXT,
    routing_number TEXT,
    account_number TEXT,
    policy_date DATE,
    quote_coverage TEXT,
    quote_premium TEXT,
    quote_age TEXT,
    quote_gender TEXT,
    quote_type TEXT,
    current_step TEXT,
    step_name TEXT,
    form_type TEXT,
    user_agent TEXT,
    referrer TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    partial_email_sent BOOLEAN,
    completed_email_sent BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        fs.id,
        fs.session_id,
        fs.status,
        fs.timestamp,
        fs.last_activity,
        fs.first_name,
        fs.last_name,
        fs.email,
        fs.phone,
        fs.date_of_birth,
        fs.transactional_consent,
        fs.marketing_consent,
        fs.state,
        fs.military_status,
        fs.branch_of_service,
        fs.marital_status,
        fs.coverage_amount,
        fs.tobacco_use,
        fs.medical_conditions,
        fs.height,
        fs.weight,
        fs.hospital_care,
        fs.diabetes_medication,
        fs.street_address,
        fs.city,
        fs.application_state,
        fs.zip_code,
        fs.beneficiary_name,
        fs.beneficiary_relationship,
        fs.va_number,
        fs.service_connected,
        encrypt_sensitive_data(fs.ssn) as ssn,
        encrypt_sensitive_data(fs.drivers_license) as drivers_license,
        fs.bank_name,
        encrypt_sensitive_data(fs.routing_number) as routing_number,
        encrypt_sensitive_data(fs.account_number) as account_number,
        fs.policy_date,
        fs.quote_coverage,
        fs.quote_premium,
        fs.quote_age,
        fs.quote_gender,
        fs.quote_type,
        fs.current_step,
        fs.step_name,
        fs.form_type,
        fs.user_agent,
        fs.referrer,
        fs.utm_source,
        fs.utm_medium,
        fs.utm_campaign,
        fs.partial_email_sent,
        fs.completed_email_sent
    FROM funnel_submissions fs
    WHERE fs.session_id = session_id_param;
END;
$$ LANGUAGE plpgsql; 