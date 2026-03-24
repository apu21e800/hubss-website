import sharp from 'sharp';
import { readdir, stat, writeFile, readFile } from 'fs/promises';
import { join, extname } from 'path';

const PUBLIC_IMAGES = './public/images';
const MAX_WIDTH = 1200;
const QUALITY = 82;
const SIZE_THRESHOLD = 300 * 1024; // 300KB
const SKIP_FOLDERS = ['lunch-learn'];

let totalBefore = 0;
let totalAfter = 0;
let filesProcessed = 0;
let filesSkipped = 0;

async function walkDir(dir) {
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      if (SKIP_FOLDERS.includes(entry.name)) {
        console.log(`⏭️  Skipping folder: ${entry.name}`);
        continue;
      }
      await walkDir(fullPath);
    } else if (entry.isFile()) {
      const ext = extname(entry.name).toLowerCase();
      if (['.jpg', '.jpeg', '.png'].includes(ext)) {
        await processImage(fullPath);
      }
    }
  }
}

async function processImage(filePath) {
  const stats = await stat(filePath);
  const sizeBefore = stats.size;

  if (sizeBefore < SIZE_THRESHOLD) {
    filesSkipped++;
    return;
  }

  totalBefore += sizeBefore;

  try {
    const inputBuffer = await readFile(filePath);
    const image = sharp(inputBuffer);
    const metadata = await image.metadata();

    let pipeline = image;

    // Resize if wider than MAX_WIDTH
    if (metadata.width && metadata.width > MAX_WIDTH) {
      pipeline = pipeline.resize(MAX_WIDTH, null, { withoutEnlargement: true });
    }

    // Compress based on format
    const ext = extname(filePath).toLowerCase();
    if (ext === '.png') {
      pipeline = pipeline.png({ quality: QUALITY, compressionLevel: 9 });
    } else {
      pipeline = pipeline.jpeg({ quality: QUALITY, mozjpeg: true });
    }

    const buffer = await pipeline.toBuffer();

    // Only save if smaller
    if (buffer.length < sizeBefore) {
      await writeFile(filePath, buffer);
      const sizeAfter = buffer.length;
      totalAfter += sizeAfter;
      filesProcessed++;

      const saved = ((sizeBefore - sizeAfter) / sizeBefore * 100).toFixed(1);
      console.log(`✅ ${filePath}`);
      console.log(`   ${(sizeBefore / 1024).toFixed(0)}KB → ${(sizeAfter / 1024).toFixed(0)}KB (-${saved}%)`);
    } else {
      totalAfter += sizeBefore;
      filesSkipped++;
      console.log(`⏭️  ${filePath} (already optimized)`);
    }
  } catch (err) {
    console.error(`❌ Error processing ${filePath}: ${err.message}`);
    totalAfter += sizeBefore;
  }
}

console.log('🖼️  Starting image compression...\n');

await walkDir(PUBLIC_IMAGES);

console.log('\n' + '='.repeat(50));
console.log('📊 SUMMARY');
console.log('='.repeat(50));
console.log(`Files compressed: ${filesProcessed}`);
console.log(`Files skipped: ${filesSkipped}`);
console.log(`Total before: ${(totalBefore / 1024 / 1024).toFixed(2)} MB`);
console.log(`Total after: ${(totalAfter / 1024 / 1024).toFixed(2)} MB`);
console.log(`Total saved: ${((totalBefore - totalAfter) / 1024 / 1024).toFixed(2)} MB (${((totalBefore - totalAfter) / totalBefore * 100).toFixed(1)}%)`);
