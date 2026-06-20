import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PHOTOS_DIR = path.join(__dirname, '../public/photos');
const OUTPUT_DIR = path.join(__dirname, '../public/photos/optimized');

if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function optimizeImages() {
    console.log('Starting image optimization...');

    try {
        const files = fs.readdirSync(PHOTOS_DIR);

        for (const file of files) {
            if (!file.match(/\.(jpg|jpeg|png)$/i)) continue;

            const inputPath = path.join(PHOTOS_DIR, file);
            const outputPath = path.join(OUTPUT_DIR, file);

            // Skip if already exists
            if (fs.existsSync(outputPath)) {
                console.log(`Skipping ${file} (already exists)`);
                continue;
            }

            console.log(`Processing ${file}...`);

            await sharp(inputPath)
                .resize(1920, 1080, { // Resize to max 1920x1080, maintaining aspect ratio
                    fit: 'inside',
                    withoutEnlargement: true
                })
                .avif({ quality: 80, speed: 6 }) // Compress to AVIF
                .toFile(outputPath);

            console.log(`Saved optimized/${file}`);
        }

        console.log('All images optimized successfully!');
    } catch (error) {
        console.error('Error optimizing images:', error);
    }
}

optimizeImages();
