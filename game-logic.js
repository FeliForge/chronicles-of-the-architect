function dealDamage(target, baseDmg, attackerId) {
  const variance = 0.88 + Math.random() * 0.24;
  let def = target.def + (target.tempDef || 0);
  if (target.shield) def += 12;
  let dmg = Math.max(1, Math.floor((baseDmg * variance) - def * 0.45));
  if (State.combat && State.combat.timingMultiplier) {
    dmg = Math.floor(dmg * State.combat.timingMultiplier);
    State.combat.timingMultiplier = 1;
  }
  if (attackerId === 'forge') dmg += Heroes.forge.passives.weaponBonus;
  if (attackerId === 'itap') dmg += Heroes.itap.passives.magicBonus;
  target.hp = Math.max(0, target.hp - dmg);
  const isBoss = target === State.combat.boss;
  const pos = isBoss ? { x: 660, y: 240 } : { x: 200 + Math.random() * 120, y: 360 + Math.random() * 50 };
  showDmg(pos.x, pos.y, dmg, isBoss ? '#ff5555' : '#fff');
  if (isBoss) target.animState = 'hit';
  setTimeout(() => { if (target.animState === 'hit') target.animState = 'idle'; }, 300);
  return dmg;
}

// NOTE: Full game-logic.js is in local artifacts. Upload complete file from artifacts/game-logic.js to restore full combat.
console.warn('Partial game-logic loaded - upload full game-logic.js and game-core.js from project artifacts to GitHub.');
