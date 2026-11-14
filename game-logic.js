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

function healTarget(target, amount) {
  amount = Math.floor(amount + Heroes.itap.passives.healBonus);
  target.hp = Math.min(target.maxHp, target.hp + amount);
  showDmg(220 + Math.random() * 80, 360, `+${amount}`, '#06d6a0');
}

function startCombat(bossData) {
  State.scene = 'combat';
  const boss = {
    ...bossData,
    maxHp: bossData.hp,
    hp: bossData.hp,
    currentPhase: 1,
    shield: false,
    windup: false,
    tempDef: 0,
    animState: 'idle'
  };
  State.combat = {
    boss,
    phase: 'player_select',
    turnQueue: [],
    timingMultiplier: 1,
    defenseMultiplier: 1,
    timingActive: false,
    timingPos: 0,
    timingDir: 1,
    timingTarget: null,
    timingType: 'attack',
    timingSkill: null,
    poisonTurns: 0,
    pendingAttack: null
  };
  document.getElementById('top-hud').classList.remove('hidden');
  document.getElementById('bottom-panel').classList.remove('hidden');
  updateHUD();
  showCombatMenu();
}

function showCombatMenu() {
  const menu = document.getElementById('action-menu');
  const dialogue = document.getElementById('dialogue-box');
  dialogue.style.display = 'none';
  menu.style.display = 'grid';
  menu.innerHTML = '';
  if (State.combat.phase !== 'player_select') return;

  const alive = ['forge', 'itap', 'tango'].filter(id => Heroes[id].hp > 0);
  if (!alive.length) { endCombat(false); return; }

  if (!State.combat.turnQueue.length) {
    State.combat.turnQueue = [...alive].sort((a, b) => Heroes[b].spd - Heroes[a].spd);
  }
  const heroId = State.combat.turnQueue.shift();
  State.combat.activeHero = heroId;
  const hero = Heroes[heroId];

  const header = document.createElement('div');
  header.style.cssText = 'grid-column:1/-1;text-align:center;color:#ffd166;font-weight:800;font-size:13px;letter-spacing:0.5px;';
  header.textContent = `${hero.name}'s Turn`;
  menu.appendChild(header);

  hero.skills.forEach(skill => {
    const btn = document.createElement('button');
    btn.className = 'btn';
    btn.textContent = skill.cost > 0 ? `${skill.name} (${skill.cost})` : skill.name;
    btn.disabled = hero.mp < skill.cost;
    btn.onclick = () => executePlayerAction(heroId, skill);
    menu.appendChild(btn);
  });

  Synergies.forEach(syn => {
    const reqMet = syn.req.every(id => Heroes[id].hp > 0);
    const totalMp = ['forge', 'itap', 'tango'].reduce((s, id) => s + Heroes[id].mp, 0);
    const btn = document.createElement('button');
    btn.className = 'btn btn-synergy';
    btn.textContent = `[S] ${syn.name}`;
    btn.title = syn.desc;
    btn.disabled = !reqMet || totalMp < syn.cost;
    btn.onclick = () => executeSynergy(syn);
    menu.appendChild(btn);
  });

  const defBtn = document.createElement('button');
  defBtn.className = 'btn';
  defBtn.textContent = 'Defend';
  defBtn.onclick = () => startTiming('defend', heroId);
  menu.appendChild(defBtn);
}

function executePlayerAction(heroId, skill) {
  const hero = Heroes[heroId];
  hero.mp -= skill.cost;
  document.getElementById('action-menu').style.display = 'none';
  hero.animState = skill.type === 'attack' ? 'attack' : 'cast';
  setTimeout(() => { hero.animState = 'idle'; }, 500);

  if (skill.type === 'attack') {
    startTiming('attack', heroId, skill);
  } else if (skill.type === 'heal') {
    const target = ['forge', 'itap', 'tango']
      .filter(id => Heroes[id].hp > 0)
      .sort((a, b) => (Heroes[a].hp / Heroes[a].maxHp) - (Heroes[b].hp / Heroes[b].maxHp))[0];
    healTarget(Heroes[target], skill.power + hero.atk * 0.3);
    setTimeout(endPlayerTurn, 700);
  } else if (skill.type === 'buff') {
    if (skill.target === 'party') {
      ['forge', 'itap', 'tango'].forEach(id => {
        if (Heroes[id].hp > 0) Heroes[id][skill.stat] += skill.amount;
      });
    } else if (skill.target === 'ally') {
      const target = ['forge', 'itap', 'tango'].filter(id => Heroes[id].hp > 0 && id !== heroId)[0] || heroId;
      Heroes[target][skill.stat] += skill.amount;
    } else {
      hero[skill.stat] += skill.amount;
    }
    showDmg(250, 340, `+${skill.amount} ${skill.stat.toUpperCase()}`, '#4cc9f0');
    setTimeout(endPlayerTurn, 700);
  }
}

function executeSynergy(syn) {
  syn.req.forEach(id => {
    Heroes[id].mp = Math.max(0, Heroes[id].mp - Math.floor(syn.cost / syn.req.length));
  });
  document.getElementById('action-menu').style.display = 'none';
  startTiming('attack', syn.req[0], { execute: syn.execute, hits: 1 });
}

function startTiming(type, heroId, skill = null) {
  State.combat.phase = type === 'attack' ? 'timing_attack' : 'timing_defend';
  State.combat.timingType = type;
  State.combat.timingTarget = heroId;
  State.combat.timingSkill = skill;
  State.combat.timingPos = 0;
  State.combat.timingDir = 1;
  State.combat.timingMultiplier = 1;
  State.combat.defenseMultiplier = 1;

  const bar = document.getElementById('timing-bar');
  const zone = document.getElementById('timing-zone');
  const perfect = document.getElementById('timing-perfect');
  zone.style.left = '35%';
  zone.style.width = '30%';
  perfect.style.left = 'calc(50% - 2px)';
  bar.style.display = 'block';
  State.combat.timingActive = true;
}

function handleTimingInput() {
  if (!State.combat || !State.combat.timingActive) return;
  State.combat.timingActive = false;
  document.getElementById('timing-bar').style.display = 'none';

  const pos = State.combat.timingPos;
  const dist = Math.abs(pos - 50);
  let mult = 0.75, text = 'MISS', color = '#ff4d6d';
  if (dist <= 3) { mult = 2.0; text = 'PERFECT!'; color = '#ffd166'; }
  else if (dist <= 12) { mult = 1.5; text = 'GREAT!'; color = '#06d6a0'; }
  else if (dist <= 25) { mult = 1.2; text = 'GOOD'; color = '#4cc9f0'; }

  showDmg(450, 280, text, color);

  if (State.combat.timingType === 'defend') {
    State.combat.defenseMultiplier = mult >= 2 ? 0 : 1 - (mult - 0.75) * 0.6;
    setTimeout(() => {
      if (State.combat.pendingAttack) applyEnemyAttack();
      else endPlayerTurn();
    }, 400);
  } else {
    State.combat.timingMultiplier = mult;
    const skill = State.combat.timingSkill;
    if (skill && skill.execute) {
      skill.execute(State.combat);
      setTimeout(endPlayerTurn, 600);
    } else if (skill) {
      const hero = Heroes[State.combat.timingTarget];
      const base = hero.atk * (skill.power || 1);
      const hits = skill.hits || 1;
      if (skill.target === 'all') {
        dealDamage(State.combat.boss, base * hits, hero.id);
      } else {
        for (let i = 0; i < hits; i++) {
          setTimeout(() => dealDamage(State.combat.boss, base, hero.id), i * 180);
        }
      }
      setTimeout(endPlayerTurn, hits * 180 + 450);
    } else {
      setTimeout(endPlayerTurn, 400);
    }
  }
}

function endPlayerTurn() {
  if (State.combat.boss.hp <= 0) { endCombat(true); return; }
  State.combat.phase = 'enemy_turn';
  setTimeout(enemyTurn, 700);
}

function enemyTurn() {
  const boss = State.combat.boss;
  if (boss.mechanic === 'phases' && boss.hp < boss.maxHp * 0.5 && boss.currentPhase === 1) {
    boss.currentPhase = 2;
    boss.atk += 10;
    boss.spd += 4;
    showDmg(660, 200, 'PHASE 2!', '#c77dff');
    log('The Fallen Champion enters a second phase!');
  }
  if (boss.mechanic === 'final') {
    if (boss.hp < boss.maxHp * 0.6 && boss.currentPhase === 1) {
      boss.currentPhase = 2;
      boss.atk += 8;
      showDmg(660, 200, 'PHASE 2', '#c77dff');
    }
    if (boss.hp < boss.maxHp * 0.3 && boss.currentPhase === 2) {
      boss.currentPhase = 3;
      boss.atk += 12;
      showDmg(660, 200, 'CORE OVERLOAD!', '#ff2e63');
      log('The Architect overloads its core!');
    }
  }
  if (boss.mechanic === 'shield' && Math.random() < 0.35 && !boss.shield) {
    boss.shield = true;
    showDmg(660, 200, 'SHIELD!', '#4cc9f0');
    setTimeout(() => { boss.shield = false; }, 4000);
  }

  const attack = boss.attacks[Math.floor(Math.random() * boss.attacks.length)];
  log(`${boss.name} uses ${attack.name}`);

  setTimeout(() => {
    if (attack.effect === 'windup') {
      boss.windup = true;
      showDmg(660, 200, 'WINDING UP...', '#ffd166');
      finishEnemyTurn();
      return;
    }
    let power = attack.power;
    if (boss.windup) { power *= 2.1; boss.windup = false; }

    const alive = ['forge', 'itap', 'tango'].filter(id => Heroes[id].hp > 0);
    if (!alive.length) { endCombat(false); return; }

    const targets = attack.target === 'all' ? alive : [alive[Math.floor(Math.random() * alive.length)]];
    State.combat.pendingAttack = { attack, power, targets };
    startTiming('defend', targets[0]);
  }, 900);
}

function applyEnemyAttack() {
  const { attack, power, targets } = State.combat.pendingAttack;
  const defMult = State.combat.defenseMultiplier ?? 1;
  const boss = State.combat.boss;

  targets.forEach(id => {
    if (Heroes[id].hp <= 0) return;
    let dmg = Math.max(1, Math.floor((boss.atk * power * defMult) - Heroes[id].def * 0.45));
    if (id === 'tango' && Math.random() < 0.12 + Heroes.tango.passives.evadeBonus * 0.01) {
      showDmg(200, 400, 'DODGE!', '#06d6a0');
      return;
    }
    Heroes[id].hp = Math.max(0, Heroes[id].hp - dmg);
    showDmg(200 + Math.random() * 100, 360 + Math.random() * 40, dmg, '#ff4d6d');
    if (attack.effect === 'poison') State.combat.poisonTurns = 3;
    if (attack.effect === 'debuff') {
      Heroes[id].atk = Math.max(5, Heroes[id].atk - 3);
    }
  });
  updateHUD();
  finishEnemyTurn();
}

function finishEnemyTurn() {
  if (State.combat.poisonTurns > 0) {
    State.combat.poisonTurns--;
    ['forge', 'itap', 'tango'].forEach(id => {
      if (Heroes[id].hp > 0) {
        Heroes[id].hp = Math.max(0, Heroes[id].hp - 6);
        showDmg(220, 350, 6, '#c77dff');
      }
    });
    updateHUD();
  }
  if (['forge', 'itap', 'tango'].every(id => Heroes[id].hp <= 0)) {
    endCombat(false);
    return;
  }
  State.combat.phase = 'player_select';
  State.combat.pendingAttack = null;
  updateHUD();
  showCombatMenu();
}

function endCombat(victory) {
  document.getElementById('top-hud').classList.add('hidden');
  document.getElementById('bottom-panel').classList.add('hidden');
  document.getElementById('timing-bar').style.display = 'none';
  State.combat = null;

  if (victory) {
    State.scene = 'victory';
    const boss = Bosses[State.currentBossIndex];
    const xpGain = 40 + State.currentBossIndex * 25;
    let text = `<b>${boss.name} defeated!</b><br>Gained ${xpGain} XP.<br>`;

    ['forge', 'itap', 'tango'].forEach(id => {
      const h = Heroes[id];
      h.xp += xpGain;
      while (h.xp >= h.xpNext) {
        h.xp -= h.xpNext;
        h.level++;
        h.xpNext = Math.floor(h.xpNext * 1.45);
        h.maxHp += 16; h.hp = h.maxHp;
        h.maxMp += 6; h.mp = h.maxMp;
        h.atk += 3; h.def += 2; h.spd += 1;
        if (id === 'forge') { h.passives.weaponBonus += 2; h.passives.armorBonus += 1; }
        if (id === 'itap') { h.passives.magicBonus += 2; h.passives.healBonus += 4; }
        if (id === 'tango') { h.passives.evadeBonus += 2; h.passives.speedBonus += 1; }
        text += `<br><b>${h.name} → Lv ${h.level}</b>`;
      }
      h.hp = Math.min(h.maxHp, h.hp + Math.floor(h.maxHp * 0.35));
      h.mp = Math.min(h.maxMp, h.mp + Math.floor(h.maxMp * 0.5));
    });

    document.getElementById('victory-title').textContent = 'Victory!';
    document.getElementById('victory-text').innerHTML = text;
    document.getElementById('screen-victory').classList.remove('hidden');
    State.currentBossIndex++;
    saveGame();
    document.getElementById('btn-next').textContent = State.currentBossIndex >= 10 ? 'Finish' : 'Next Boss';
  } else {
    State.scene = 'gameover';
    document.getElementById('screen-gameover').classList.remove('hidden');
  }
}

function showDialogue(queue, callback) {
  State.dialogueQueue = [...queue];
  State.dialogueCallback = callback;
  document.getElementById('bottom-panel').classList.remove('hidden');
  document.getElementById('dialogue-box').style.display = 'block';
  document.getElementById('action-menu').style.display = 'none';
  advanceDialogue();
}

function advanceDialogue() {
  if (!State.dialogueQueue.length) {
    document.getElementById('dialogue-box').style.display = 'none';
    if (State.dialogueCallback) State.dialogueCallback();
    return;
  }
  const line = State.dialogueQueue.shift();
  document.getElementById('dialogue-speaker').textContent = line.speaker || '';
  document.getElementById('dialogue-text').textContent = line.text;
}

const Game = {
  startNewGame() {
    State.currentBossIndex = 0;
    Object.values(Heroes).forEach(h => {
      const base = {
        forge: { maxHp: 140, maxMp: 45, atk: 20, def: 14, spd: 8 },
        itap: { maxHp: 95, maxMp: 90, atk: 12, def: 8, spd: 11 },
        tango: { maxHp: 110, maxMp: 55, atk: 16, def: 7, spd: 18 }
      }[h.id];
      h.level = 1; h.xp = 0; h.xpNext = 60;
      Object.assign(h, base);
      h.hp = h.maxHp; h.mp = h.maxMp;
      h.passives = h.id === 'forge' ? { armorBonus: 0, weaponBonus: 0 }
        : h.id === 'itap' ? { healBonus: 0, magicBonus: 0 }
        : { evadeBonus: 0, speedBonus: 0 };
    });
    this.hideAllScreens();
    showDialogue(Story.intro, () => this.startBoss());
  },

  continueGame() {
    const raw = localStorage.getItem(CONFIG.SAVE_KEY);
    if (!raw) return;
    const data = JSON.parse(raw);
    State.currentBossIndex = data.bossIndex;
    data.heroes.forEach(s => {
      const h = Heroes[s.id];
      Object.assign(h, s);
    });
    this.hideAllScreens();
    if (State.currentBossIndex >= 10) {
      this.showEnding();
    } else {
      showDialogue([{ speaker: 'Narrator', text: `Resuming at Tower ${State.currentBossIndex + 1}...` }], () => this.startBoss());
    }
  },

  startBoss() {
    if (State.currentBossIndex >= 10) { this.showEnding(); return; }
    const boss = Bosses[State.currentBossIndex];
    showDialogue(boss.intro, () => startCombat(boss));
  },

  nextStage() {
    this.hideAllScreens();
    if (State.currentBossIndex >= 10) { this.showEnding(); return; }
    const inter = Story.intermissions[State.currentBossIndex - 1] || Story.intermissions[0];
    showDialogue(inter, () => this.startBoss());
  },

  retryBoss() {
    this.hideAllScreens();
    Object.values(Heroes).forEach(h => { h.hp = h.maxHp; h.mp = h.maxMp; });
    this.startBoss();
  },

  showEnding() {
    this.hideAllScreens();
    showDialogue(Story.ending, () => {
      document.getElementById('screen-ending').classList.remove('hidden');
      localStorage.removeItem(CONFIG.SAVE_KEY);
    });
  },

  showControls() {
    this.hideAllScreens();
    document.getElementById('screen-controls').classList.remove('hidden');
  },

  backToMenu() {
    this.hideAllScreens();
    document.getElementById('screen-menu').classList.remove('hidden');
    document.getElementById('btn-continue').style.display = localStorage.getItem(CONFIG.SAVE_KEY) ? 'block' : 'none';
  },

  hideAllScreens() {
    ['screen-menu', 'screen-controls', 'screen-victory', 'screen-gameover', 'screen-ending'].forEach(id => {
      document.getElementById(id).classList.add('hidden');
    });
    document.getElementById('top-hud').classList.add('hidden');
    document.getElementById('bottom-panel').classList.add('hidden');
    document.getElementById('timing-bar').style.display = 'none';
  }
};

function saveGame() {
  const data = {
    bossIndex: State.currentBossIndex,
    heroes: Object.values(Heroes).map(h => ({
      id: h.id, level: h.level, xp: h.xp, xpNext: h.xpNext,
      maxHp: h.maxHp, hp: h.hp, maxMp: h.maxMp, mp: h.mp,
      atk: h.atk, def: h.def, spd: h.spd, passives: h.passives
    }))
  };
  localStorage.setItem(CONFIG.SAVE_KEY, JSON.stringify(data));
}

function gameLoop() {
  State.frame++;
  if (State.logTimer > 0) {
    State.logTimer--;
    if (State.logTimer === 0) document.getElementById('log-box').textContent = '';
  }
  if (State.combat && State.combat.timingActive) {
    State.combat.timingPos += State.combat.timingDir * 2.2;
    if (State.combat.timingPos >= 100 || State.combat.timingPos <= 0) State.combat.timingDir *= -1;
    document.getElementById('timing-indicator').style.left = `${State.combat.timingPos}%`;
  }
  ctx.clearRect(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT);
  if (State.scene === 'combat') drawCombatScene();
  else drawBackground();
  requestAnimationFrame(gameLoop);
}

document.getElementById('game-container').addEventListener('pointerdown', () => {
  if (State.dialogueQueue.length) advanceDialogue();
  else if (State.combat && State.combat.timingActive) handleTimingInput();
});

document.addEventListener('touchstart', e => { if (e.touches.length > 1) e.preventDefault(); }, { passive: false });

Game.backToMenu();
gameLoop();
