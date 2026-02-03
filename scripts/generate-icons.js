import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const publicDir = join(__dirname, '..', 'public');

// SVG icon with the CF logo
const createSvgIcon = (size, padding = 0) => {
  const innerSize = size - (padding * 2);
  const centerOffset = padding;
  const fontSize = Math.floor(innerSize * 0.39);
  const textY = Math.floor(innerSize * 0.62) + centerOffset;
  const centerX = size / 2;
  const circleRadius = innerSize / 2;
  const circleCenter = size / 2;

  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#2563eb"/>
      <stop offset="100%" style="stop-color:#1d4ed8"/>
    </linearGradient>
  </defs>
  <circle cx="${circleCenter}" cy="${circleCenter}" r="${circleRadius}" fill="url(#bg)"/>
  <text x="${centerX}" y="${textY}" font-family="Arial, sans-serif" font-size="${fontSize}" font-weight="bold" fill="white" text-anchor="middle">CF</text>
</svg>`);
};

// Maskable icon with safe zone padding (icon occupies 80% of the area)
const createMaskableSvgIcon = (size) => {
  // For maskable icons, the safe zone is the inner 80% (10% padding on each side)
  const padding = Math.floor(size * 0.1);
  const innerSize = size - (padding * 2);
  const fontSize = Math.floor(innerSize * 0.39);
  const textY = Math.floor(size * 0.62);
  const centerX = size / 2;
  const circleRadius = innerSize / 2;
  const circleCenter = size / 2;

  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#2563eb"/>
      <stop offset="100%" style="stop-color:#1d4ed8"/>
    </linearGradient>
  </defs>
  <!-- Background fill for maskable icon -->
  <rect width="${size}" height="${size}" fill="#2563eb"/>
  <!-- Inner circle with logo -->
  <circle cx="${circleCenter}" cy="${circleCenter}" r="${circleRadius}" fill="url(#bg)"/>
  <text x="${centerX}" y="${textY}" font-family="Arial, sans-serif" font-size="${fontSize}" font-weight="bold" fill="white" text-anchor="middle">CF</text>
</svg>`);
};

async function generateIcons() {
  console.log('Generating PWA icons...');

  // Generate favicon PNGs
  await sharp(createSvgIcon(16))
    .png()
    .toFile(join(publicDir, 'favicon-16x16.png'));
  console.log('Created favicon-16x16.png');

  await sharp(createSvgIcon(32))
    .png()
    .toFile(join(publicDir, 'favicon-32x32.png'));
  console.log('Created favicon-32x32.png');

  // Generate apple-touch-icon (180x180, no padding needed as iOS handles masking)
  await sharp(createSvgIcon(180))
    .png()
    .toFile(join(publicDir, 'apple-touch-icon.png'));
  console.log('Created apple-touch-icon.png');

  // Generate PWA icons (regular)
  await sharp(createSvgIcon(192))
    .png()
    .toFile(join(publicDir, 'pwa-192x192.png'));
  console.log('Created pwa-192x192.png');

  await sharp(createSvgIcon(512))
    .png()
    .toFile(join(publicDir, 'pwa-512x512.png'));
  console.log('Created pwa-512x512.png');

  // Generate maskable icons (with safe zone for adaptive icons)
  await sharp(createMaskableSvgIcon(192))
    .png()
    .toFile(join(publicDir, 'pwa-maskable-192x192.png'));
  console.log('Created pwa-maskable-192x192.png');

  await sharp(createMaskableSvgIcon(512))
    .png()
    .toFile(join(publicDir, 'pwa-maskable-512x512.png'));
  console.log('Created pwa-maskable-512x512.png');

  console.log('All icons generated successfully!');
}

generateIcons().catch(console.error);
