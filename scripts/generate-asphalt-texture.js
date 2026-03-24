const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

const canvas = createCanvas(800, 800);
const ctx = canvas.getContext('2d');

ctx.fillStyle = '#1f1f1f';
ctx.fillRect(0, 0, 800, 800);

for (let i = 0; i < 40000; i++) {
  const x = Math.random() * 800;
  const y = Math.random() * 800;
  const r = Math.random() * 1.5;
  const shade = Math.random() > 0.5 ? '#252525' : '#181818';
  ctx.fillStyle = shade;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

const dir = path.join(__dirname, '..', 'public', 'images', 'textures');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(path.join(dir, 'asphalt-texture.jpg'), canvas.toBuffer('image/jpeg', { quality: 0.85 }));
console.log('✓ Asphalt texture generated');
