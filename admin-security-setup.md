# Admin Dashboard Security Setup

## 🔒 SECURITY ALERT
Your admin dashboard was previously **PUBLIC** and accessible to anyone! This has been fixed with authentication protection.

## 🛡️ Protection Implemented

### 1. Password Authentication
- Admin login screen protects dashboard access
- Session management with 24-hour timeout
- Failed attempt protection with delays
- Secure logout functionality

### 2. Environment Configuration
Create a `.env` file in your project root:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Admin Dashboard Security
VITE_ADMIN_PASSWORD=your_secure_admin_password_here
```

### 3. Default Password
- **Current Password**: `admin2025`
- **⚠️ CHANGE THIS IMMEDIATELY** in your `.env` file

### 4. Enhanced Database Security
Add these policies to your Supabase database:

```sql
-- Restrict registration reads to authenticated users only
DROP POLICY IF EXISTS "Allow read for authenticated users" ON registrations;

CREATE POLICY "Restrict registration reads" ON registrations
  FOR SELECT
  TO authenticated
  USING (true);

-- Add IP logging table for security monitoring
CREATE TABLE IF NOT EXISTS admin_access_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  access_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT,
  success BOOLEAN DEFAULT false
);

-- Enable RLS on admin logs
ALTER TABLE admin_access_logs ENABLE ROW LEVEL SECURITY;
```

## 🚨 Immediate Actions Required

1. **Change Admin Password**:
   - Create `.env` file
   - Set `VITE_ADMIN_PASSWORD=YourSecurePassword123!`

2. **Update Database Policies**:
   - Run the SQL commands above in Supabase

3. **Test Security**:
   - Try accessing `/admin` without password
   - Verify login protection works

## 🔐 Security Features

- ✅ Password protection for `/admin` route
- ✅ Session timeout (24 hours)
- ✅ Failed attempt delays
- ✅ Secure logout functionality
- ✅ Visual security warnings
- ✅ Environment-based configuration

## 📝 Best Practices

1. **Use Strong Passwords**: 12+ characters with mixed case, numbers, symbols
2. **Regular Password Changes**: Update admin password monthly
3. **Monitor Access**: Check admin access logs regularly
4. **Secure Environment**: Never commit `.env` file to git
5. **HTTPS Only**: Ensure your site uses HTTPS in production

## 🚨 Security Warning
Anyone who previously accessed `/admin` may have seen sensitive registration data. Consider:
- Reviewing server logs for unauthorized access
- Notifying registrants if data was compromised
- Implementing additional monitoring

Your admin dashboard is now secure! 🛡️
