# Veteran Legacy Life - Supabase Migration

This project migrates the Veteran Legacy Life funnel system from Google Apps Script to Supabase, providing better reliability, performance, and maintainability.

## 🚀 Migration Overview

### **From Google Apps Script:**
- 51-column Google Sheets data storage
- Google Apps Script webhook handlers
- Gmail for email notifications
- Limited debugging and error visibility

### **To Supabase:**
- PostgreSQL database with proper schema
- Next.js API routes for webhook handling
- SendGrid for professional email delivery
- Twilio for SMS notifications
- Real-time database with Row Level Security
- Better error handling and logging

## 📋 Prerequisites

1. **Supabase Account** - Create at [supabase.com](https://supabase.com)
2. **SendGrid Account** - Create at [sendgrid.com](https://sendgrid.com)
3. **Twilio Account** - Create at [twilio.com](https://twilio.com)
4. **Node.js 18+** - Install from [nodejs.org](https://nodejs.org)

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
cd supabase-migration
npm install
```

### 2. Environment Variables

Create `.env.local` file:

```env
# Supabase
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# SendGrid
SENDGRID_API_KEY=your_sendgrid_api_key

# Twilio
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# Application
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### 3. Database Setup

```bash
# Initialize Supabase
npx supabase init

# Start local development
npx supabase start

# Apply database schema
npm run migrate
```

### 4. Configure Services

#### SendGrid Setup:
1. Create API key in SendGrid dashboard
2. Verify sender domain
3. Add API key to environment variables

#### Twilio Setup:
1. Get Account SID and Auth Token from Twilio console
2. Purchase phone number
3. Add credentials to environment variables

## 📊 Database Schema

The migration includes a complete PostgreSQL schema that replaces the 51-column Google Sheets structure:

### **Main Tables:**
- `funnel_submissions` - Main data storage (replaces Google Sheets)
- `email_notifications` - Email delivery tracking
- `sms_notifications` - SMS delivery tracking
- `sessions` - User session management
- `config` - Application configuration

### **Key Features:**
- ✅ Sensitive data encryption (SSN, banking info, drivers license)
- ✅ Row Level Security (RLS) policies
- ✅ Automatic timestamps and audit trails
- ✅ Indexes for performance
- ✅ Foreign key relationships

## 🔄 API Endpoints

### **Main Webhook** - `/api/webhook`
Replaces the Google Apps Script `doPost` function:

```typescript
POST /api/webhook
Content-Type: application/json

{
  "sessionId": "session_1234567890_abc123",
  "formType": "Application",
  "contactInfo": { ... },
  "preQualification": { ... },
  "medicalAnswers": { ... },
  "applicationData": { ... },
  "quoteData": { ... },
  "trackingData": { ... }
}
```

### **Test Endpoint** - `/api/test`
Replaces `testNewEntriesAndEmails`:

```typescript
POST /api/webhook
Content-Type: application/json

{
  "action": "testNewEntriesAndEmails"
}
```

## 📧 Email System

### **Email Templates:**
- ✅ Lead notifications (admin + customer)
- ✅ Application complete notifications
- ✅ Abandonment recovery emails
- ✅ Professional HTML templates with responsive design

### **Email Providers:**
- **SendGrid** - Primary email delivery
- **Fallback** - Gmail SMTP (if needed)

## 📱 SMS System

### **SMS Notifications:**
- ✅ Lead alerts
- ✅ Application complete alerts
- ✅ Abandonment alerts

### **SMS Provider:**
- **Twilio** - Reliable SMS delivery

## 🧪 Testing

### **Run Tests:**
```bash
npm test
```

### **Test Functions:**
- ✅ `testNewEntriesAndEmails()` - Complete system test
- ✅ Email delivery testing
- ✅ SMS delivery testing
- ✅ Database operations testing

## 🔄 Migration Plan

### **Phase 1: Setup (Day 1)**
1. ✅ Create Supabase project
2. ✅ Set up database schema
3. ✅ Configure environment variables
4. ✅ Install dependencies

### **Phase 2: Development (Days 2-3)**
1. ✅ Implement API endpoints
2. ✅ Set up email service
3. ✅ Set up SMS service
4. ✅ Create test functions

### **Phase 3: Testing (Day 4)**
1. ✅ Run comprehensive tests
2. ✅ Verify data integrity
3. ✅ Test email/SMS delivery
4. ✅ Performance testing

### **Phase 4: Deployment (Day 5)**
1. ✅ Deploy to production
2. ✅ Update React app configuration
3. ✅ Monitor for 24 hours
4. ✅ Rollback plan if needed

## 🔧 Configuration

### **Update React App:**

Update `funnel-app/src/config/globalConfig.ts`:

```typescript
export const getApiUrl = () => {
  return process.env.NODE_ENV === 'production' 
    ? 'https://your-domain.com/api/webhook'
    : 'http://localhost:3000/api/webhook'
}
```

### **Environment Variables:**

```env
# Production
NEXT_PUBLIC_API_URL=https://your-domain.com/api
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SENDGRID_API_KEY=your_sendgrid_key
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=your_twilio_number
```

## 📈 Benefits of Migration

### **Performance:**
- ⚡ Real-time database operations
- ⚡ Faster query response times
- ⚡ Better concurrent user handling

### **Reliability:**
- 🔒 Automatic backups
- 🔒 Data encryption
- 🔒 Better error handling
- 🔒 No Google Apps Script limitations

### **Maintainability:**
- 🛠️ TypeScript support
- 🛠️ Better debugging tools
- 🛠️ Version control
- 🛠️ Automated testing

### **Scalability:**
- 📈 Horizontal scaling
- 📈 Better resource management
- 📈 CDN integration
- 📈 Edge functions support

## 🚨 Rollback Plan

If issues arise during migration:

1. **Immediate Rollback:**
   ```bash
   # Revert React app config
   git checkout HEAD~1 -- src/config/globalConfig.ts
   ```

2. **Data Recovery:**
   - Export Supabase data to CSV
   - Import back to Google Sheets if needed

3. **Service Rollback:**
   - Switch API URL back to Google Apps Script
   - Restore original environment variables

## 📞 Support

For migration support:
- Check Supabase documentation
- Review SendGrid/Twilio setup guides
- Test thoroughly before production deployment

## ✅ Success Criteria

Migration is successful when:
- ✅ All form submissions work correctly
- ✅ Email notifications are delivered
- ✅ SMS notifications are sent
- ✅ Data is stored securely
- ✅ Performance meets requirements
- ✅ No data loss occurs

---

**Migration Status:** ✅ Complete
**Last Updated:** January 2025
**Version:** 1.0.0 