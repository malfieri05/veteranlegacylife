# Build Instructions

## Simple Build Process

This project uses a static file approach with a React funnel component. Here's how to make changes:

### To make changes to the React funnel:

1. **Edit the source files** in `funnel-app/src/`
2. **Run the build script**: `./build.sh`
3. **Refresh your browser** at `localhost:8000`

### What the build script does:

- Compiles the React app from `funnel-app/src/` to `funnel-app/dist/`
- Copies the compiled files to the root directory:
  - `funnel-app/dist/veteran-funnel.iife.js` → `veteran-funnel.iife.js`
  - `funnel-app/dist/veteran-funnel.css` → `veteran-funnel.css`

### To serve the app:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`

### File Structure:

- `funnel-app/src/` - React source code (edit here)
- `funnel-app/dist/` - Compiled React files
- `veteran-funnel.iife.js` - Compiled JS (served by Python server)
- `veteran-funnel.css` - Compiled CSS (served by Python server)
- `index.html` - Main HTML file (served by Python server)

### No more confusion!

- ❌ No React development server
- ❌ No `npm run dev`
- ❌ No `localhost:5173`
- ✅ Just edit, run `./build.sh`, refresh browser 