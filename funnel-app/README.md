# Veteran Funnel React Component

A drop-in React funnel component for the Veteran Life Insurance website that provides a smooth, modern user experience while maintaining all existing business logic.

## Features

- ✅ **Drop-in Integration**: No changes needed to existing pages/structure
- ✅ **Easy Testing**: Can be tested alongside current funnel
- ✅ **Instant Revert**: Can be removed instantly if issues arise
- ✅ **All Functionality Preserved**: Maintains existing business logic
- ✅ **Smooth UX**: Professional, modern user experience
- ✅ **Mobile Responsive**: Works perfectly on all devices
- ✅ **Google Sheets Integration**: Maintains existing data flow

## Quick Start

### 1. Build the Component

```bash
cd funnel-app
npm install
npm run build
```

This creates:
- `dist/veteran-funnel.js` - The main component bundle
- `dist/veteran-funnel.css` - The styles

### 2. Integrate into Existing Site

Copy the built files to your website directory:

```bash
cp dist/veteran-funnel.js /path/to/your/website/
cp dist/veteran-funnel.css /path/to/your/website/
```

### 3. Update HTML

Add these lines to your `index.html` (or any page where you want the funnel):

```html
<!-- Add in <head> section -->
<link rel="stylesheet" href="veteran-funnel.css">

<!-- Add before closing </body> tag -->
<script src="veteran-funnel.js"></script>
```

### 4. Replace Funnel Triggers

Replace existing funnel trigger code:

```javascript
// OLD CODE (replace this):
// document.querySelector('.qualify-button').addEventListener('click', openFunnelModal);

// NEW CODE (use this):
document.querySelector('.qualify-button').addEventListener('click', () => {
  window.VeteranFunnel.open();
});
```

## API Reference

The component exposes a global `window.VeteranFunnel` object with these methods:

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

## Funnel Flow

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

### Phase 2: Quote & Application (Steps 12-16)
12. **IUL Quote Modal** - Age-based calculations
13. **"Lock in Quote"** → Application Step 1 (Address, Beneficiary, VA Info)
14. **Application Step 2** (SSN, Banking, Policy Date)
15. **Final Success Modal** - Personalized confirmation
16. **SECOND SUBMISSION** (Complete application data to Google Sheets)

## Development

### Local Development

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Type Checking

```bash
npm run type-check
```

## File Structure

```
funnel-app/
├── src/
│   ├── main.tsx              # Entry point & global API
│   ├── components/
│   │   ├── FunnelModal.tsx   # Main modal component
│   │   ├── steps/            # Individual step components
│   │   └── shared/           # Reusable components
│   ├── store/
│   │   └── funnelStore.ts    # Zustand state management
│   ├── utils/
│   │   ├── calculations.ts   # Quote calculations
│   │   └── validation.ts     # Form validation
│   └── styles/
│       └── globals.css       # Component styles
├── dist/                     # Built files
├── vite.config.ts           # Vite configuration
└── package.json
```

## Integration Checklist

- [ ] Build the component (`npm run build`)
- [ ] Copy `veteran-funnel.js` and `veteran-funnel.css` to website
- [ ] Add CSS link to `<head>` section
- [ ] Add JS script before `</body>` tag
- [ ] Replace funnel trigger code with `window.VeteranFunnel.open()`
- [ ] Test on desktop and mobile
- [ ] Verify Google Sheets integration
- [ ] Test form validation and error handling
- [ ] Verify all business logic preserved

## Troubleshooting

### Component Not Loading
- Check browser console for errors
- Verify file paths are correct
- Ensure scripts are loaded in correct order

### Styles Not Applied
- Check CSS file is loaded
- Verify CSS variables are available
- Check for CSS conflicts

### Form Not Submitting
- Check network tab for failed requests
- Verify Google Apps Script endpoint is correct
- Check form validation errors

### Mobile Issues
- Test on actual mobile devices
- Check viewport meta tag
- Verify touch targets are 44px minimum

## Rollback Plan

If issues arise, you can instantly revert:

1. Remove the script and CSS links
2. Restore original funnel trigger code
3. The React component will be completely removed

## Support

For integration issues or questions, check:
1. Browser console for errors
2. Network tab for failed requests
3. Component state in React DevTools
4. Google Apps Script logs

## License

ISC License - See package.json for details. 