import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const directories = [
  'public',
  'public/photos',
  'public/photos/optimized'
];

async function convertToAVIF(imagePath) {
  try {
    const outputPath = imagePath.replace(/\.(jpg|jpeg|png|gif)$/i, '.avif');
    
    await sharp(imagePath)
      .avif({
        quality: 80,
        speed: 6
      })
      .toFile(outputPath);
    
    console.log(`Converted: ${imagePath} -> ${outputPath}`);
    return outputPath;
  } catch (error) {
    console.error(`Error converting ${imagePath}:`, error.message);
    return null;
  }
}

async function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);
    
    if (stats.isDirectory()) {
      await processDirectory(filePath);
    } else if (/\.(jpg|jpeg|png|gif)$/i.test(file)) {
      await convertToAVIF(filePath);
    }
  }
}

async function main() {
  console.log('Starting AVIF conversion...');
  
  for (const dir of directories) {
    console.log(`Processing directory: ${dir}`);
    await processDirectory(dir);
  }
  
  console.log('AVIF conversion completed!');
}

main().catch(console.error);