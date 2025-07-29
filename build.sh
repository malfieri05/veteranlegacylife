#!/bin/bash

echo "🔨 Building React funnel app..."
cd funnel-app
npm run build

echo "📁 Copying built files to root directory..."
cp dist/veteran-funnel.iife.js ../veteran-funnel.iife.js
cp dist/veteran-funnel.css ../veteran-funnel.css

echo "✅ Build complete! Files updated in root directory."
echo "🌐 You can now refresh localhost:8000 to see the changes." 