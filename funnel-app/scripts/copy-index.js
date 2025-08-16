import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the source index.html
const sourcePath = path.join(__dirname, '..', 'index.html');
const destPath = path.join(__dirname, '..', 'dist', 'index.html');

try {
  // Read the source file
  let content = fs.readFileSync(sourcePath, 'utf8');
  
  // Replace development script with production script
  content = content.replace(
    '<script type="module" src="/src/main.tsx"></script>',
    '<script src="veteran-funnel.iife.js"></script>'
  );
  
  // Replace development CSS with production CSS
  content = content.replace(
    '<link rel="stylesheet" href="/src/styles/globals.css">',
    '<link rel="stylesheet" href="veteran-funnel.css">'
  );
  
  // Write the modified content to dist/index.html
  fs.writeFileSync(destPath, content, 'utf8');
  
  console.log('✅ Successfully created dist/index.html for production');
} catch (error) {
  console.error('❌ Error creating dist/index.html:', error.message);
  process.exit(1);
}
