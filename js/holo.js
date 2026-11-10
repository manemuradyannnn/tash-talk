const REST = [
  { x: 26, y: 16 },
  { x: 72, y: 24 },
  { x: 38, y: 70 }
];

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

function paint(card, x, y, opacity) {
  const cx = x - 50;
  const cy = y - 50;
  const from = Math.min(Math.hypot(cx, cy) / 50, 1);
  const style = card.style;
  style.setProperty('--pointer-x', x.toFixed(2) + '%');
  style.setProperty('--pointer-y', y.toFixed(2) + '%');
  style.setProperty('--pointer-from-center', from.toFixed(4));
  style.setProperty('--pointer-from-top', (y / 100).toFixed(4));
  style.setProperty('--pointer-from-left', (x / 100).toFixed(4));
  style.setProperty('--card-opacity', opacity);
  style.setProperty('--rotate-x', Math.round(-(cx / 3.5)) + 'deg');
  style.setProperty('--rotate-y', Math.round(cy / 3.5) + 'deg');
  style.setProperty('--background-x', (37 + (x / 100) * 26).toFixed(2) + '%');
  style.setProperty('--background-y', (33 + (y / 100) * 34).toFixed(2) + '%');
}

export function initHolo() {
  document.querySelectorAll('.pcard').forEach((card, index) => {
    const face = card.querySelector('.pcard__rotator');
    if (!face) return;

    const rest = REST[index % REST.length];
    paint(card, rest.x, rest.y, 1);

    let frame = 0;
    const track = (event) => {
      cancelAnimationFrame(frame);
      const rect = face.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const x = clamp(Math.round((100 / rect.width) * (event.clientX - rect.left)), 0, 100);
      const y = clamp(Math.round((100 / rect.height) * (event.clientY - rect.top)), 0, 100);
      paint(card, x, y, 1);
    };

    const leave = () => {
      const fromX = parseFloat(card.style.getPropertyValue('--pointer-x')) || rest.x;
      const fromY = parseFloat(card.style.getPropertyValue('--pointer-y')) || rest.y;
      const start = performance.now();
      const tick = (now) => {
        const t = Math.min((now - start) / 520, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        paint(card, fromX + (rest.x - fromX) * eased, fromY + (rest.y - fromY) * eased, 1);
        if (t < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    };

    face.addEventListener('pointermove', track);
    face.addEventListener('pointerdown', track);
    face.addEventListener('pointerleave', leave);
  });
}
