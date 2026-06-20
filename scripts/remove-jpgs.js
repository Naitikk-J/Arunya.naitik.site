import fs from 'fs';
import path from 'path';

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const optimizedDir = path.join(__dirname, '../public/photos/optimized');

async function removeJPGs() {
  console.log('Removing JPG files from optimized directory...');
  
  try {
    const files = fs.readdirSync(optimizedDir);
    
    for (const file of files) {
      if (/\.(jpg|jpeg)$/i.test(file)) {
        const filePath = path.join(optimizedDir, file);
        fs.unlinkSync(filePath);
        console.log(`Removed: ${filePath}`);
      }
    }
    
    console.log('All JPG files removed from optimized directory!');
  } catch (error) {
    console.error('Error removing JPG files:', error);
  }
}

removeJPGs();