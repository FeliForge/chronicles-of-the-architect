const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
function log(msg) {
  State.logMsg = msg;
  State.logTimer = 90;
  document.getElementById('log-box').textContent = msg;
}
function drawBackground() {
  const g = ctx.createLinearGradient(0, 0, 0, CONFIG.HEIGHT);
  g.addColorStop(0, '#0b1220');
  g.addColorStop(0.55, '#121c32');
  g.addColorStop(1, '#0a101c');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT);
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  for (let i = 0; i < 40; i++) {
    const sx = ((i * 97) % CONFIG.WIDTH);
    const sy = ((i * 53) % 280);
    const a = 0.15 + Math.sin(State.frame * 0.02 + i) * 0.15;
    ctx.globalAlpha = a;
    ctx.fillRect(sx, sy, 1.5, 1.5);
  }
  ctx.globalAlpha = 1;
  const fg = ctx.createLinearGradient(0, 460, 0, 600);
  fg.addColorStop(0, '#0f172a');
  fg.addColorStop(1, '#070b14');
  ctx.fillStyle = fg;
  ctx.fillRect(0, 460, CONFIG.WIDTH, 140);
  ctx.strokeStyle = 'rgba(255,46,99,0.55)';
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(0, 460); ctx.lineTo(CONFIG.WIDTH, 460); ctx.stroke();
  ctx.strokeStyle = 'rgba(255,46,99,0.15)';
  ctx.lineWidth = 6;
  ctx.beginPath(); ctx.moveTo(0, 460); ctx.lineTo(CONFIG.WIDTH, 460); ctx.stroke();
}
function drawCombatScene() {
  drawBackground();
  if (!State.combat) return;
  const c = State.combat;
  const bossX = 660, bossY = 290;
  if (c.boss.hp > 0) {
    ctx.beginPath();
    ctx.arc(bossX, bossY + 40, 55, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,46,99,0.08)';
    ctx.fill();
    Sprites.draw(ctx, c.boss.type, bossX, bossY, 2.4, State.frame, false, c.boss.animState || 'idle');
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(bossX - 75, bossY - 135, 150, 16);
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 1;
    ctx.strokeRect(bossX - 75, bossY - 135, 150, 16);
    const hpPct = Math.max(0, c.boss.hp / c.boss.maxHp);
    const hpGrad = ctx.createLinearGradient(bossX - 75, 0, bossX + 75, 0);
    hpGrad.addColorStop(0, '#c9184a');
    hpGrad.addColorStop(1, '#ff4d6d');
    ctx.fillStyle = hpGrad;
    ctx.fillRect(bossX - 75, bossY - 135, 150 * hpPct, 16);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 13px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(c.boss.name, bossX, bossY - 145);
    if (c.boss.shield) {
      ctx.strokeStyle = 'rgba(0,206,209,0.7)';
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(bossX, bossY, 72, 0, Math.PI * 2); ctx.stroke();
    }
  }
  const positions = [
    { x: 210, y: 390, id: 'forge' },
    { x: 310, y: 360, id: 'itap' },
    { x: 160, y: 430, id: 'tango' }
  ];
  positions.forEach((p, i) => {
    const h = Heroes[p.id];
    const st = h.animState || 'idle';
    if (h.hp > 0) {
      Sprites.draw(ctx, h.type, p.x, p.y, 1.55, State.frame + i * 12, false, st);
    } else {
      ctx.globalAlpha = 0.3;
      Sprites.draw(ctx, h.type, p.x, p.y, 1.55, State.frame + i * 12, false, 'idle');
      ctx.globalAlpha = 1;
    }
  });
}
function updateHUD() {
  ['forge', 'itap', 'tango'].forEach(id => {
    const h = Heroes[id];
    document.getElementById(`hp-${id}`).style.width = `${Math.max(0, (h.hp / h.maxHp) * 100)}%`;
    document.getElementById(`mp-${id}`).style.width = `${Math.max(0, (h.mp / h.maxMp) * 100)}%`;
    document.getElementById(`lv-${id}`).textContent = `Lv${h.level}`;
  });
}
function showDmg(x, y, text, color = '#fff') {
  const el = document.createElement('div');
  el.className = 'dmg-num';
  el.style.left = `${(x / CONFIG.WIDTH) * 100}%`;
  el.style.top = `${(y / CONFIG.HEIGHT) * 100}%`;
  el.style.color = color;
  el.textContent = text;
  document.getElementById('game-container').appendChild(el);
  setTimeout(() => el.remove(), 950);
}
