# Veteran Funnel Integration Guide

This guide shows you how to integrate the React funnel component into your existing Veteran Life Insurance website.

## Quick Integration Steps

### 1. Copy Built Files

Copy the built files from `funnel-app/dist/` to your website directory:

```bash
cp funnel-app/dist/veteran-funnel.iife.js /path/to/your/website/veteran-funnel.js
cp funnel-app/dist/veteran-funnel.css /path/to/your/website/veteran-funnel.css
```

### 2. Update index.html

Add these lines to your `index.html`:

```html
<!-- Add in <head> section -->
<link rel="stylesheet" href="veteran-funnel.css">

<!-- Add before closing </body> tag -->
<script src="veteran-funnel.js"></script>
```

### 3. Replace Funnel Triggers

Find your existing funnel trigger code and replace it:

```javascript
// OLD CODE (find and replace):
// document.querySelector('.qualify-button').addEventListener('click', openFunnelModal);
// document.querySelector('#open-funnel-btn').addEventListener('click', openFunnelModal);

// NEW CODE (use this):
document.querySelector('.qualify-button').addEventListener('click', () => {
  window.VeteranFunnel.open();
});

document.querySelector('#open-funnel-btn').addEventListener('click', () => {
  window.VeteranFunnel.open();
});
```

## Detailed Integration

### File Structure After Integration

Your website should look like this:

```
your-website/
├── index.html
├── styles.css
├── script.js
├── veteran-funnel.js      ← New file
├── veteran-funnel.css     ← New file
└── ... (other files)
```

### HTML Changes

#### Add to `<head>` section:

```html
<link rel="stylesheet" href="veteran-funnel.css">
```

#### Add before `</body>` tag:

```html
<script src="veteran-funnel.js"></script>
```

### JavaScript Changes

#### Replace Existing Funnel Code

Find these patterns in your `script.js`:

```javascript
// OLD - Remove these functions:
function openFunnelModal() { ... }
function closeFunnelModal() { ... }
function showFunnelStep() { ... }

// OLD - Remove these event listeners:
document.querySelector('.qualify-button').addEventListener('click', openFunnelModal);
document.querySelector('#open-funnel-btn').addEventListener('click', openFunnelModal);
```

#### Add New Event Listeners

```javascript
// NEW - Add these event listeners:
document.querySelector('.qualify-button').addEventListener('click', () => {
  window.VeteranFunnel.open();
});

document.querySelector('#open-funnel-btn').addEventListener('click', () => {
  window.VeteranFunnel.open();
});

// Optional: Add close functionality if needed
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && window.VeteranFunnel.isOpen()) {
    window.VeteranFunnel.close();
  }
});
```

### CSS Changes

The React component is self-contained and won't conflict with your existing styles. However, you may want to remove old funnel CSS:

```css
/* OLD - Remove these CSS classes if they exist: */
.funnel-modal { ... }
.funnel-modal-content { ... }
.funnel-form-step { ... }
```

## Testing the Integration

### 1. Test Basic Functionality

Open your website and test:

```javascript
// In browser console:
window.VeteranFunnel.open()    // Should open modal
window.VeteranFunnel.close()   // Should close modal
window.VeteranFunnel.isOpen()  // Should return true/false
```

### 2. Test Form Flow

1. Click "Get Quote" or "Qualify Now" button
2. Modal should open with state selection
3. Fill out the form step by step
4. Verify data is submitted to Google Sheets
5. Test on mobile devices

### 3. Test Error Handling

- Try submitting with invalid data
- Test network failures
- Verify error messages appear

## Rollback Plan

If you need to revert to the old funnel:

### 1. Remove New Files

```bash
rm veteran-funnel.js
rm veteran-funnel.css
```

### 2. Remove HTML Changes

Remove these lines from `index.html`:
```html
<link rel="stylesheet" href="veteran-funnel.css">
<script src="veteran-funnel.js"></script>
```

### 3. Restore Old JavaScript

Restore your original funnel functions and event listeners.

## Troubleshooting

### Component Not Loading

**Symptoms:** `window.VeteranFunnel` is undefined

**Solutions:**
1. Check file paths are correct
2. Verify script is loaded before `</body>`
3. Check browser console for errors
4. Ensure no JavaScript errors before the script

### Styles Not Applied

**Symptoms:** Modal appears but looks unstyled

**Solutions:**
1. Verify CSS file is loaded
2. Check CSS file path
3. Ensure no CSS conflicts
4. Check browser network tab

### Form Not Working

**Symptoms:** Can't progress through steps

**Solutions:**
1. Check browser console for errors
2. Verify all required fields are filled
3. Check form validation
4. Test on different browsers

### Google Sheets Not Receiving Data

**Symptoms:** Form submits but no data in sheets

**Solutions:**
1. Check network tab for failed requests
2. Verify Google Apps Script endpoint
3. Check CORS settings
4. Test endpoint manually

## Performance Considerations

### Bundle Size
- JS: ~318KB (101KB gzipped)
- CSS: ~6KB (1.6KB gzipped)
- Total: ~324KB (102KB gzipped)

### Loading Strategy
- CSS loads in `<head>` for immediate styling
- JS loads before `</body>` for faster page load
- Component initializes on DOM ready

### Caching
- Files can be cached by CDN/browser
- Version files if needed: `veteran-funnel.js?v=1.0.0`

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## API Reference

### Methods

```javascript
// Open the funnel modal
window.VeteranFunnel.open()

// Close the funnel modal
window.VeteranFunnel.close()

// Check if modal is open
window.VeteranFunnel.isOpen() // returns boolean

// Reset funnel state (clears all data)
window.VeteranFunnel.reset()
```

### Events

The component doesn't emit custom events, but you can listen for:

```javascript
// Listen for modal open/close
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === 'childList') {
      const modal = document.querySelector('.veteran-funnel .modal-overlay');
      if (modal) {
        console.log('Modal is in DOM');
      }
    }
  });
});

observer.observe(document.body, { childList: true });
```

## Security Considerations

- Component is self-contained
- No external dependencies loaded
- Form data sent to your existing Google Apps Script
- No third-party tracking or analytics
- All validation happens client-side

## Support

For integration issues:

1. Check browser console for errors
2. Verify file paths and loading order
3. Test on different browsers/devices
4. Check network tab for failed requests
5. Review this guide for common solutions

The component is designed to be a drop-in replacement that maintains all existing functionality while providing a modern, smooth user experience. 