const CONFIG = { WIDTH: 900, HEIGHT: 600, SAVE_KEY: 'architect_rpg_v4' };
const Sprites = {
  draw(ctx, type, x, y, scale = 1, frame = 0, flip = false, state = 'idle') {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale * (flip ? -1 : 1), scale);
    const bounce = Math.sin(frame * 0.12) * (state === 'idle' ? 2.5 : 0);
    const shake = state === 'hit' ? Math.sin(frame * 0.8) * 4 : 0;
    switch (type) {
      case 'forge':
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(-16 + shake, -22 + bounce, 32, 42);
        ctx.fillStyle = '#FFDAB9';
        ctx.beginPath(); ctx.arc(0 + shake, -32 + bounce, 13, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#A0522D';
        ctx.fillRect(-9 + shake, -26 + bounce, 18, 11);
        ctx.fillStyle = '#696969';
        ctx.fillRect(14 + shake, -18 + bounce, 22, 16);
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(10 + shake, -12 + bounce, 12, 6);
        if (state === 'attack') { ctx.fillStyle = '#FFD700'; ctx.beginPath(); ctx.arc(28 + shake, -10, 8, 0, Math.PI * 2); ctx.fill(); }
        break;
      case 'itap':
        ctx.fillStyle = '#2E8B57';
        ctx.beginPath(); ctx.moveTo(-16, 22 + bounce); ctx.lineTo(16, 22 + bounce); ctx.lineTo(11, -16 + bounce); ctx.lineTo(-11, -16 + bounce); ctx.fill();
        ctx.fillStyle = '#FFDAB9';
        ctx.beginPath(); ctx.arc(0, -26 + bounce, 11, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#006400';
        ctx.beginPath(); ctx.moveTo(-13, -26 + bounce); ctx.lineTo(13, -26 + bounce); ctx.lineTo(0, -52 + bounce); ctx.fill();
        ctx.fillStyle = '#8B4513'; ctx.fillRect(13, -42 + bounce, 5, 62);
        ctx.fillStyle = '#00FF7F'; ctx.beginPath(); ctx.arc(15.5, -44 + bounce, 7, 0, Math.PI * 2); ctx.fill();
        if (state === 'attack' || state === 'cast') {
          ctx.globalAlpha = 0.6; ctx.fillStyle = '#00FF7F';
          for (let i = 0; i < 5; i++) {
            const a = frame * 0.15 + i * 1.2;
            ctx.beginPath(); ctx.arc(Math.cos(a) * 25, -20 + Math.sin(a) * 15, 4, 0, Math.PI * 2); ctx.fill();
          }
          ctx.globalAlpha = 1;
        }
        break;
      case 'tango':
        ctx.fillStyle = '#D2691E';
        ctx.beginPath(); ctx.ellipse(0 + shake, 6 + bounce, 22, 13, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(-16 + shake, -4 + bounce, 11, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#8B4513';
        ctx.beginPath(); ctx.ellipse(-22 + shake, -12 + bounce, 5, 9, -0.35, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(-10 + shake, -12 + bounce, 5, 9, 0.35, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#D2691E'; ctx.lineWidth = 5;
        ctx.beginPath(); ctx.moveTo(20 + shake, 2 + bounce); ctx.quadraticCurveTo(32, -8 + bounce + Math.sin(frame * 0.25) * 6, 28, -18 + bounce); ctx.stroke();
        if (state === 'attack') { ctx.fillStyle = '#FFF'; ctx.beginPath(); ctx.arc(-20 + shake, 0, 4, 0, Math.PI * 2); ctx.fill(); }
        break;
      case 'boss1':
        ctx.fillStyle = '#708090'; ctx.fillRect(-32, -42, 64, 84);
        ctx.fillStyle = '#FF4500'; ctx.beginPath(); ctx.arc(-12, -22, 9, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.arc(12, -22, 9, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#2F4F4F'; ctx.fillRect(-42, 2, 22, 42); ctx.fillRect(20, 2, 22, 42);
        break;
      case 'boss2':
        ctx.fillStyle = '#556B2F'; ctx.beginPath(); ctx.arc(0, 0, 38, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#8B008B';
        for (let i = 0; i < 8; i++) { ctx.save(); ctx.rotate(i * Math.PI / 4 + frame * 0.03); ctx.fillRect(32, -6, 22, 12); ctx.restore(); }
        ctx.fillStyle = '#FF00FF'; ctx.beginPath(); ctx.arc(-11, -11, 6, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.arc(11, -11, 6, 0, Math.PI * 2); ctx.fill();
        break;
      case 'boss3':
        ctx.fillStyle = '#00CED1'; ctx.beginPath(); ctx.moveTo(0, -55); ctx.lineTo(42, 0); ctx.lineTo(0, 55); ctx.lineTo(-42, 0); ctx.fill();
        ctx.fillStyle = '#E0FFFF'; ctx.beginPath(); ctx.moveTo(0, -32); ctx.lineTo(22, 0); ctx.lineTo(0, 32); ctx.lineTo(-22, 0); ctx.fill();
        break;
      case 'boss4':
        ctx.fillStyle = '#B8860B'; ctx.fillRect(-28, -44, 56, 88);
        ctx.fillStyle = '#FFD700'; ctx.beginPath(); ctx.arc(0, -22, 16, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#000'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(0, -22); ctx.lineTo(0, -34); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, -22); ctx.lineTo(10, -22); ctx.stroke();
        ctx.fillStyle = '#8B4513'; ctx.fillRect(-44, -12, 22, 64); ctx.fillRect(22, -12, 22, 64);
        break;
      case 'boss5':
        ctx.fillStyle = '#4B0082'; ctx.beginPath(); ctx.arc(0, 0, 34, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#9370DB';
        ctx.beginPath(); ctx.moveTo(-22, -22); ctx.quadraticCurveTo(-34, -55, -12, -42); ctx.moveTo(22, -22); ctx.quadraticCurveTo(34, -55, 12, -42); ctx.fill();
        ctx.fillStyle = '#FFF'; ctx.beginPath(); ctx.arc(-11, -6, 7, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.arc(11, -6, 7, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#FFF'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(0, 12, 12, 0, Math.PI); ctx.stroke();
        break;
      case 'boss6':
        ctx.fillStyle = '#2F4F4F'; ctx.fillRect(-55, -65, 110, 130);
        ctx.fillStyle = '#808080'; ctx.fillRect(-68, -35, 35, 90); ctx.fillRect(33, -35, 35, 90);
        ctx.fillStyle = '#FF0000'; ctx.fillRect(-22, -45, 44, 12);
        break;
      case 'boss7':
        ctx.fillStyle = '#4682B4'; ctx.beginPath(); ctx.ellipse(0, 0, 55, 32, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#87CEFA';
        ctx.beginPath(); ctx.moveTo(-42, -12); ctx.lineTo(-75, -45); ctx.lineTo(-32, -22); ctx.moveTo(42, -12); ctx.lineTo(75, -45); ctx.lineTo(32, -22); ctx.fill();
        ctx.fillStyle = '#FFFF00'; ctx.beginPath(); ctx.arc(-22, -10, 6, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.arc(22, -10, 6, 0, Math.PI * 2); ctx.fill();
        break;
      case 'boss8':
        ctx.fillStyle = '#191970'; ctx.beginPath(); ctx.arc(0, 0, 38, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#9400D3';
        for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.arc(Math.cos(frame * 0.06 + i * 2.1) * 22, Math.sin(frame * 0.06 + i * 2.1) * 22, 11, 0, Math.PI * 2); ctx.fill(); }
        ctx.fillStyle = '#00FFFF'; ctx.beginPath(); ctx.arc(0, 0, 16, 0, Math.PI * 2); ctx.fill();
        break;
      case 'boss9':
        ctx.fillStyle = '#8B0000'; ctx.fillRect(-32, -55, 64, 110);
        ctx.fillStyle = '#C0C0C0';
        ctx.beginPath(); ctx.moveTo(-42, -22); ctx.lineTo(-65, 22); ctx.lineTo(-32, 2); ctx.moveTo(42, -22); ctx.lineTo(65, 22); ctx.lineTo(32, 2); ctx.fill();
        ctx.fillStyle = '#FFD700'; ctx.beginPath(); ctx.moveTo(-16, -55); ctx.lineTo(0, -78); ctx.lineTo(16, -55); ctx.fill();
        break;
      case 'boss10':
        ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(0, 0, 48, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#FFF'; ctx.lineWidth = 3;
        for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.arc(0, 0, 52 + i * 9, frame * 0.025 + i, frame * 0.025 + i + 3.5); ctx.stroke(); }
        ctx.fillStyle = '#FF00FF'; ctx.beginPath(); ctx.arc(0, 0, 22, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#FFF'; ctx.beginPath(); ctx.arc(0, 0, 11, 0, Math.PI * 2); ctx.fill();
        break;
    }
    ctx.restore();
  }
};
const State = { scene: 'menu', currentBossIndex: 0, frame: 0, combat: null, dialogueQueue: [], dialogueCallback: null, logMsg: '', logTimer: 0 };
const Heroes = {
  forge: { id: 'forge', name: 'Forge', type: 'forge', maxHp: 140, hp: 140, maxMp: 45, mp: 45, atk: 20, def: 14, spd: 8, level: 1, xp: 0, xpNext: 60,
    skills: [
      { name: 'Hammer Strike', cost: 0, type: 'attack', target: 'single', power: 1.0 },
      { name: 'Reinforced Armor', cost: 12, type: 'buff', target: 'ally', stat: 'def', amount: 6 },
      { name: 'Weapon Upgrade', cost: 15, type: 'buff', target: 'self', stat: 'atk', amount: 10 },
      { name: 'FORGE MASTERPIECE', cost: 32, type: 'attack', target: 'single', power: 2.8, ultimate: true }
    ], passives: { armorBonus: 0, weaponBonus: 0 } },
  itap: { id: 'itap', name: 'Itap', type: 'itap', maxHp: 95, hp: 95, maxMp: 90, mp: 90, atk: 12, def: 8, spd: 11, level: 1, xp: 0, xpNext: 60,
    skills: [
      { name: 'Emerald Bolt', cost: 0, type: 'attack', target: 'single', power: 1.0 },
      { name: 'Healing Magic', cost: 16, type: 'heal', target: 'ally', power: 45 },
      { name: 'Green Barrier', cost: 22, type: 'buff', target: 'party', stat: 'def', amount: 5 },
      { name: 'EMERALD STORM', cost: 38, type: 'attack', target: 'all', power: 2.0, ultimate: true }
    ], passives: { healBonus: 0, magicBonus: 0 } },
  tango: { id: 'tango', name: 'Tango', type: 'tango', maxHp: 110, hp: 110, maxMp: 55, mp: 55, atk: 16, def: 7, spd: 18, level: 1, xp: 0, xpNext: 60,
    skills: [
      { name: 'Bite', cost: 0, type: 'attack', target: 'single', power: 1.15 },
      { name: 'Zoomies', cost: 14, type: 'attack', target: 'single', power: 0.55, hits: 4 },
      { name: 'Dog Instinct', cost: 12, type: 'buff', target: 'self', stat: 'spd', amount: 12 },
      { name: 'CANINE CHAOS', cost: 34, type: 'attack', target: 'all', power: 1.7, ultimate: true }
    ], passives: { evadeBonus: 0, speedBonus: 0 } }
};
const Synergies = [
  { name: 'Anvil & Fang', req: ['forge', 'tango'], cost: 22, desc: 'Forge arms Tango. Double heavy bites.',
    execute(c) { log('Forge readies the anvil — Tango leaps twice!'); const dmg = Heroes.tango.atk * 2.6 + Heroes.forge.passives.weaponBonus; dealDamage(c.boss, dmg, 'tango'); setTimeout(() => dealDamage(c.boss, dmg, 'tango'), 280); } },
  { name: 'Arcane Forge', req: ['itap', 'forge'], cost: 26, desc: 'Itap enchants the hammer. Massive single hit.',
    execute(c) { log('Emerald fire coats the hammer!'); const dmg = (Heroes.forge.atk + Heroes.itap.atk) * 2.1 + Heroes.itap.passives.magicBonus; dealDamage(c.boss, dmg, 'forge'); } },
  { name: 'Distract & Blast', req: ['tango', 'itap'], cost: 20, desc: 'Tango distracts, Itap lands a heavy bolt.',
    execute(c) { log('Tango bites ankles! Itap channels a bolt!'); c.boss.tempDef = (c.boss.tempDef || 0) - 8; dealDamage(c.boss, Heroes.itap.atk * 3.2 + Heroes.itap.passives.magicBonus, 'itap'); c.boss.tempDef = (c.boss.tempDef || 0) + 8; } },
  { name: 'Trinity Strike', req: ['forge', 'itap', 'tango'], cost: 42, desc: 'All three unite for a devastating blow.',
    execute(c) { log('FORGE • ITAP • TANGO — TRINITY STRIKE!'); const dmg = (Heroes.forge.atk + Heroes.itap.atk + Heroes.tango.atk) * 2.8; dealDamage(c.boss, dmg, 'forge'); } }
];
