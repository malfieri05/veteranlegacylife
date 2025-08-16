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
  
  // Add production CSS link if it doesn't exist
  if (!content.includes('veteran-funnel.css')) {
    content = content.replace(
      '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">',
      '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">\n    <link rel="stylesheet" href="veteran-funnel.css">'
    );
  }
  
      // Add a test button to trigger the modal
    if (!content.includes('Test Modal')) {
      content = content.replace(
        '<script src="veteran-funnel.iife.js"></script>',
        `<script src="veteran-funnel.iife.js"></script>
    <script>
        // Add test button after 3 seconds
        setTimeout(() => {
            const testButton = document.createElement('button');
            testButton.textContent = 'TEST MODAL';
            testButton.style.cssText = 'position:fixed;top:20px;right:20px;z-index:9999;background:red;color:white;padding:10px;border:none;cursor:pointer;';
            testButton.onclick = () => {
                console.log('🎯 Test button clicked');
                if (window.VeteranFunnel) {
                    console.log('✅ VeteranFunnel found');
                    console.log('🔍 Is initialized:', window.VeteranFunnel.isInitialized());
                    console.log('🔍 Is open:', window.VeteranFunnel.isOpen());
                    window.VeteranFunnel.open();
                    console.log('🎯 Modal opened via test button');
                } else {
                    console.log('❌ VeteranFunnel not found');
                }
            };
            document.body.appendChild(testButton);
        }, 3000);
    </script>`
      );
    }
    
    // Write the modified content to dist/index.html
    fs.writeFileSync(destPath, content, 'utf8');
    
    console.log('✅ Successfully created dist/index.html for production');
} catch (error) {
  console.error('❌ Error creating dist/index.html:', error.message);
  process.exit(1);
}
