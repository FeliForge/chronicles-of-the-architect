const Bosses = [
  { id: 1, name: 'The Scrap Guardian', type: 'boss1', hp: 220, atk: 14, def: 6, spd: 5,
    intro: [{ speaker: 'Narrator', text: 'Rusted metal rises. A guardian of scrap blocks the first tower.' }, { speaker: 'Forge', text: 'Held together by hope and bad welding. Perfect.' }],
    attacks: [{ name: 'Scrap Toss', power: 1.0, target: 'single' }, { name: 'Iron Slam', power: 1.6, target: 'single' }], mechanic: null },
  { id: 2, name: 'The Thorn Witch', type: 'boss2', hp: 280, atk: 17, def: 7, spd: 8,
    intro: [{ speaker: 'Narrator', text: 'Vines erupt. A witch of thorns emerges from the undergrowth.' }, { speaker: 'Itap', text: 'Poisonous. Logical. Extremely inconvenient.' }],
    attacks: [{ name: 'Vine Whip', power: 1.1, target: 'single' }, { name: 'Poison Spores', power: 0.75, target: 'all', effect: 'poison' }], mechanic: 'poison' },
  { id: 3, name: 'The Crystal Beast', type: 'boss3', hp: 340, atk: 19, def: 18, spd: 6,
    intro: [{ speaker: 'Narrator', text: 'A beast of living crystal bars the path.' }, { speaker: 'Tango', text: '*barks at his own reflection*' }],
    attacks: [{ name: 'Crystal Shard', power: 1.3, target: 'single' }, { name: 'Prismatic Ray', power: 1.5, target: 'single' }, { name: 'Crystal Shield', power: 0, target: 'self', effect: 'shield' }], mechanic: 'shield' },
  { id: 4, name: 'The Clockwork Knight', type: 'boss4', hp: 380, atk: 22, def: 12, spd: 9,
    intro: [{ speaker: 'Narrator', text: 'Gears scream. A golden knight winds itself into motion.' }, { speaker: 'Forge', text: 'I could fix that squeak. Or smash it. Smashing it is.' }],
    attacks: [{ name: 'Gear Strike', power: 1.1, target: 'single' }, { name: 'Wind Up', power: 0, target: 'self', effect: 'windup' }], mechanic: 'delayed' },
  { id: 5, name: 'The Shadow Jester', type: 'boss5', hp: 320, atk: 24, def: 9, spd: 14,
    intro: [{ speaker: 'Narrator', text: 'Laughter without a source. Shadows twist into a grinning jester.' }, { speaker: 'Itap', text: 'Illusions feed on attention. Do not stare.' }],
    attacks: [{ name: 'Shadow Bolt', power: 1.25, target: 'single' }, { name: 'Confusion', power: 0.9, target: 'all', effect: 'confuse' }], mechanic: 'illusion' },
  { id: 6, name: 'The Iron Colossus', type: 'boss6', hp: 560, atk: 30, def: 22, spd: 4,
    intro: [{ speaker: 'Narrator', text: 'The ground trembles. An iron titan blots out the sky.' }, { speaker: 'Tango', text: '*whimpers and hides behind Forge*' }],
    attacks: [{ name: 'Mega Punch', power: 1.7, target: 'single' }, { name: 'Earthquake', power: 1.15, target: 'all' }], mechanic: 'highdef' },
  { id: 7, name: 'The Storm Dragon', type: 'boss7', hp: 480, atk: 27, def: 13, spd: 11,
    intro: [{ speaker: 'Narrator', text: 'Lightning splits the clouds. A dragon of storms descends.' }, { speaker: 'Forge', text: 'Lightning rod? More like lightning target!' }],
    attacks: [{ name: 'Tail Whip', power: 1.35, target: 'single' }, { name: 'Chain Lightning', power: 1.05, target: 'all' }], mechanic: 'multi' },
  { id: 8, name: 'The Void Alchemist', type: 'boss8', hp: 440, atk: 25, def: 11, spd: 10,
    intro: [{ speaker: 'Narrator', text: 'Reality bends. A floating alchemist reshapes the battlefield.' }, { speaker: 'Itap', text: 'His affinity shifts. Adapt or perish.' }],
    attacks: [{ name: 'Void Blast', power: 1.45, target: 'single' }, { name: 'Elemental Shift', power: 0, target: 'self', effect: 'shift' }], mechanic: 'elemental' },
  { id: 9, name: 'The Fallen Champion', type: 'boss9', hp: 650, atk: 32, def: 16, spd: 12,
    intro: [{ speaker: 'Narrator', text: 'A once-legendary hero, now corrupted, draws a familiar sword.' }, { speaker: 'Forge', text: 'I forged that blade... I am sorry.' }],
    attacks: [{ name: "Hero's Strike", power: 1.55, target: 'single' }, { name: 'Despair Aura', power: 1.05, target: 'all', effect: 'debuff' }], mechanic: 'phases' },
  { id: 10, name: 'The Final Architect', type: 'boss10', hp: 900, atk: 36, def: 18, spd: 13,
    intro: [{ speaker: 'Narrator', text: 'The sky tears open. The Architect floats above the last tower.' }, { speaker: 'Itap', text: 'This is the source. End it.' }, { speaker: 'Forge', text: 'One last swing.' }, { speaker: 'Tango', text: '*growls, ready*' }],
    attacks: [{ name: 'Reality Tear', power: 1.7, target: 'single' }, { name: 'System Purge', power: 1.25, target: 'all' }, { name: 'Core Overload', power: 2.8, target: 'all', effect: 'overload' }], mechanic: 'final' }
];
const Story = {
  intro: [
    { speaker: 'Narrator', text: 'Reality fractures. Ten towers rise. At their peak sits the Final Architect, rewriting the world.' },
    { speaker: 'Forge', text: 'My hammer is ready. We climb. We break whatever stands in the way.' },
    { speaker: 'Itap', text: 'Survival probability is low but non-zero. Acceptable.' },
    { speaker: 'Tango', text: '*barks and spins in a circle*' }
  ],
  intermissions: [
    [{ speaker: 'Forge', text: 'Warm-up over. Real scrap starts now.' }, { speaker: 'Itap', text: 'Energy readings climb with every floor.' }],
    [{ speaker: 'Itap', text: 'Biological anomalies. Poisonous. Predictable.' }, { speaker: 'Tango', text: '*sneezes and looks offended*' }],
    [{ speaker: 'Forge', text: 'Pretty rocks. Wonder if they melt well.' }, { speaker: 'Itap', text: 'Focus. Souvenirs later.' }],
    [{ speaker: 'Tango', text: '*growls at ticking gears*' }, { speaker: 'Forge', text: 'Easy, boy. Just overgrown clocks.' }],
    [{ speaker: 'Itap', text: 'Do not look at the shadows too long.' }, { speaker: 'Forge', text: 'Already blinked. Too late.' }],
    [{ speaker: 'Forge', text: 'That thing was bigger than my entire forge.' }, { speaker: 'Tango', text: '*pants and leans on Forge*' }],
    [{ speaker: 'Itap', text: 'The storm thins. Apex is near.' }, { speaker: 'Forge', text: 'Hammer is sparking. It knows.' }],
    [{ speaker: 'Forge', text: 'Up is down. My hammer feels light.' }, { speaker: 'Itap', text: 'The Architect grows desperate. Stay sharp.' }],
    [{ speaker: 'Tango', text: '*whimpers, stays close*' }, { speaker: 'Itap', text: 'Even you sense it. Good hound.' }]
  ],
  ending: [
    { speaker: 'Narrator', text: 'The Architect dissolves into light. The towers begin to fade.' },
    { speaker: 'Forge', text: 'It is finished. The world holds.' },
    { speaker: 'Itap', text: 'Probability of success... adequately exceeded.' },
    { speaker: 'Tango', text: "*licks Forge's face*" },
    { speaker: 'Forge', text: 'Haha. Alright. Who wants steak?' }
  ]
};
