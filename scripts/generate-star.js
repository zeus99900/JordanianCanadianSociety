const fs = require('fs');

function createStarPoints(points, outerRadius, innerRadius, centerX, centerY) {
  let path = '';
  const angleStep = Math.PI / points;

  for (let i = 0; i < points * 2; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = i * angleStep - Math.PI / 2; // Start at top
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    path += `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)} `;
  }
  path += 'Z';
  return path;
}

const points = createStarPoints(7, 45, 18, 50, 50);

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <path d="${points}" fill="#ffffff" />
</svg>`;

fs.writeFileSync('public/images/jordan-star.svg', svg);
console.log('SVG created!');
