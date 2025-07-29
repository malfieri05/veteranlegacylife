# Veteran Funnel React Component

A drop-in React funnel component for the Veteran Life Insurance website that provides a smooth, modern user experience while maintaining all existing business logic.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation & Build
```bash
npm install
npm run build
```

This creates:
- `dist/veteran-funnel.js` - The main component bundle
- `dist/veteran-funnel.css` - The styles

### Integration
Copy the built files to your website directory:
```bash
cp dist/veteran-funnel.js /path/to/your/website/
cp dist/veteran-funnel.css /path/to/your/website/
```

## 📁 Project Structure

```
funnel-app/
├── src/                          # React application source
│   ├── components/               # React components
│   │   ├── steps/               # Funnel step components (18 steps)
│   │   └── shared/              # Shared UI components
│   ├── store/                   # Zustand state management
│   ├── config/                  # Configuration files
│   ├── services/                # API services
│   ├── utils/                   # Utility functions
│   └── styles/                  # Global styles
├── google_scripts/              # Google Apps Script (modular)
│   ├── Main.gs                  # Main entry point
│   ├── Templates.gs             # Email templates
│   ├── README.md                # Script documentation
│   ├── DEPLOYMENT_GUIDE.md      # Deployment guide
│   └── FUNCTIONALITY_COMPARISON.md
├── archive/                     # Archived files (organized)
│   ├── debugging/               # Debug and test files
│   ├── legacy/                  # Legacy monolithic files
│   └── documentation/           # Original documentation
├── dist/                        # Build output
├── public/                      # Static assets
├── README.md                    # This file
├── package.json                 # Dependencies
├── vite.config.ts              # Vite configuration
└── tsconfig.json               # TypeScript config
```

## 🎯 Features

- ✅ **Drop-in Integration**: No changes needed to existing pages/structure
- ✅ **Easy Testing**: Can be tested alongside current funnel
- ✅ **Instant Revert**: Can be removed instantly if issues arise
- ✅ **All Functionality Preserved**: Maintains existing business logic
- ✅ **Smooth UX**: Professional, modern user experience
- ✅ **Mobile Responsive**: Works perfectly on all devices
- ✅ **Google Sheets Integration**: Maintains existing data flow
- ✅ **Clean Architecture**: Modular, maintainable code structure

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run type-check   # TypeScript type checking
```

### Environment Variables
Create `.env.local` for local development:
```env
VITE_API_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

## 📊 Funnel Flow

### Phase 1: Pre-Qualification (Steps 1-11)
1. **State Selection** - Choose your state
2. **Military Status** - Veteran, Active Duty, etc.
3. **Branch of Service** - Army, Navy, Air Force, etc.
4. **Marital Status** - Single, Married, etc.
5. **Coverage Amount** - $10K to $1M options
6. **Contact Information** → **FIRST SUBMISSION** (Google Sheets)
7. **Tobacco Use** - Yes/No/Former
8. **Medical Conditions** - Multi-select
9. **Height & Weight** - BMI calculation
10. **Hospital Care** - Recent hospital visits
11. **Diabetes Medication** → Loading → "Pre-Qualified!"

### Phase 2: Quote & Application (Steps 12-18)
12. **IUL Quote Modal** - Age-based calculations
13. **"Lock in Quote"** → Application Step 1 (Address, Beneficiary, VA Info)
14. **Application Step 2** (SSN, Banking, Policy Date)
15. **Final Success Modal** - Personalized confirmation
16. **SECOND SUBMISSION** (Complete application data to Google Sheets)

## 🔌 API Reference

The component exposes a global `window.VeteranFunnel` object:

```javascript
// Open the funnel modal
window.VeteranFunnel.open()

// Close the funnel modal
window.VeteranFunnel.close()

// Check if modal is open
window.VeteranFunnel.isOpen()

// Reset funnel state
window.VeteranFunnel.reset()
```

## 🛠️ Integration

### HTML Integration
Add these lines to your `index.html`:

```html
<!-- Add in <head> section -->
<link rel="stylesheet" href="veteran-funnel.css">

<!-- Add before closing </body> tag -->
<script src="veteran-funnel.js"></script>
```

### JavaScript Integration
Replace existing funnel trigger code:

```javascript
// OLD CODE (replace this):
// document.querySelector('.qualify-button').addEventListener('click', openFunnelModal);

// NEW CODE (use this):
document.querySelector('.qualify-button').addEventListener('click', () => {
  window.VeteranFunnel.open();
});
```

## 📋 Data Collection

### Contact Information
- First name, last name, email, phone
- Date of birth, consent preferences
- Marketing and transactional consent

### Military Service
- Military status (Veteran, Active Duty, etc.)
- Branch of service
- VA number and service-connected status

### Medical Information
- Tobacco use history
- Medical conditions
- Height, weight, BMI calculation
- Hospital care history
- Diabetes medication

### Financial Information
- Street address, city, state, zip code
- Beneficiary information
- SSN (encrypted)
- Banking information (encrypted)

### Insurance Preferences
- Coverage amount selection
- Quote calculations
- Policy date preferences

## 🔒 Security & Privacy

### Data Protection
- SSN encryption in Google Sheets
- Banking information encryption
- Secure data transmission
- Privacy-compliant data handling

### Consent Management
- Transactional consent tracking
- Marketing consent preferences
- Clear privacy policy integration

## 🧪 Testing

### Development Testing
```bash
npm run dev
# Open http://localhost:5173
# Test all funnel steps
```

### Production Testing
```bash
npm run build
# Deploy dist/ files
# Test in production environment
```

### Google Apps Script Testing
- Test data submission to Google Sheets
- Verify email notifications
- Check SMS alerts
- Validate data encryption

## 📚 Documentation

- [Archive Documentation](./archive/README.md) - Archived files and legacy code
- [Google Apps Script Guide](./google_scripts/README.md) - Script documentation
- [Deployment Guide](./google_scripts/DEPLOYMENT_GUIDE.md) - Deployment instructions

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### File Deployment
Copy these files to your website:
- `dist/veteran-funnel.js`
- `dist/veteran-funnel.css`

### Google Apps Script Deployment
1. Copy code from `google_scripts/Main.gs`
2. Deploy to Google Apps Script
3. Update API URL in configuration
4. Test data submission

## 🔧 Troubleshooting

### Common Issues
- **Component not loading**: Check file paths and script loading order
- **Styles not applied**: Verify CSS file is loaded correctly
- **Form not submitting**: Check Google Apps Script URL and permissions
- **Mobile issues**: Test on actual mobile devices

### Debug Mode
Enable debug logging in development:
```javascript
// Add to your page
window.VETERAN_FUNNEL_DEBUG = true;
```

## 📈 Performance

### Optimizations
- ✅ **Code Splitting**: Lazy-loaded components
- ✅ **Tree Shaking**: Unused code elimination
- ✅ **Minification**: Compressed production builds
- ✅ **Caching**: Optimized asset delivery

### Bundle Size
- **Development**: ~2MB (with source maps)
- **Production**: ~300KB (minified)
- **CSS**: ~6KB (optimized)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

ISC License - See package.json for details.

---

**Version:** 2.0.0 (Clean Architecture)
**Last Updated:** January 2025
**Status:** Production Ready 