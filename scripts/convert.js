
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const inputDir = 'src/assets/images/backgrounds';
const outputDir = 'public/images';

const files = fs.readdirSync(inputDir);

files.forEach(file => {
  if (file.endsWith('.png')) {
    const inputPath = path.join(inputDir, file);
    const outputName = file.replace('.png', '.webp');
    const outputPath = path.join(outputDir, outputName);

    sharp(inputPath)
      .webp({ quality: 80 })
      .toFile(outputPath)
      .then(() => console.log(`Converted ${file} → ${outputName}`))
      .catch(err => console.error(`Failed to convert ${file}:`, err));
  }
});
