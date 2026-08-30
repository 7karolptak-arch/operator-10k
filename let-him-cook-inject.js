/**
 * LET HIM COOK — wklej CAŁOŚĆ w konsoli Scratch (F12), na stronie edytora.
 * https://scratch.mit.edu/projects/1376275663/editor/
 */
(async () => {
  const gui = document.querySelector(".gui");
  if (!gui) throw new Error("Nie jesteś w edytorze Scratch.");
  const fiberKey = Object.keys(gui).find((k) => k.startsWith("__reactFiber"));
  let vm;
  const walk = (f, d) => {
    if (!f || d > 60 || vm) return;
    if (f.memoizedProps && f.memoizedProps.vm) {
      vm = f.memoizedProps.vm;
      return;
    }
    walk(f.child, d + 1);
    walk(f.sibling, d + 1);
  };
  walk(gui[fiberKey], 0);
  if (!vm) throw new Error("Nie znalazłem VM. Odśwież edytor i spróbuj jeszcze raz.");
  window.__scratchVm = vm;

  try {
    await vm.extensionManager.loadExtensionId("music");
  } catch (e) {}

  const uid = () => {
    const c =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!#$%()*+,-./:;=?@[]^_{|}~";
    let s = "";
    for (let i = 0; i < 20; i++) s += c[Math.floor(Math.random() * c.length)];
    return s;
  };
  const byName = (n) => vm.runtime.targets.find((t) => t.getName() === n);

  let base = byName("Wok") || byName("Clicker") || byName("Sprite1") || vm.editingTarget;
  if (base.isStage) base = vm.runtime.targets.find((t) => !t.isStage);

  const extras = vm.runtime.targets.filter((t) => !t.isStage && t.id !== base.id);
  for (const t of extras) {
    try {
      vm.deleteSprite(t.id);
    } catch (e) {}
  }
  base.blocks.deleteAllBlocks();

  await vm.duplicateSprite(base.id);
  const ice = vm.editingTarget;
  await vm.duplicateSprite(base.id);
  const internBtn = vm.editingTarget;
  await vm.duplicateSprite(base.id);
  const needle = vm.editingTarget;
  await vm.duplicateSprite(base.id);
  const iron = vm.editingTarget;
  await vm.duplicateSprite(base.id);
  const gas = vm.editingTarget;
  const wok = base;

  vm.renameSprite(wok.id, "Wok");
  vm.renameSprite(ice.id, "Ice");
  vm.renameSprite(internBtn.id, "Intern");
  vm.renameSprite(needle.id, "Needle");
  vm.renameSprite(iron.id, "CastIron");
  vm.renameSprite(gas.id, "Gas");

  const svgWok = `<svg xmlns='http://www.w3.org/2000/svg' width='240' height='170'><ellipse cx='120' cy='100' rx='108' ry='30' fill='#120c08'/><ellipse cx='120' cy='78' rx='100' ry='52' fill='#2b2420' stroke='#e0b03a' stroke-width='7'/><ellipse cx='120' cy='70' rx='74' ry='34' fill='#e26512'/><ellipse cx='120' cy='62' rx='42' ry='16' fill='#ffd48a'/><rect x='6' y='74' width='32' height='11' rx='5' fill='#c9a227'/><rect x='202' y='74' width='32' height='11' rx='5' fill='#c9a227'/></svg>`;
  const svgIce = `<svg xmlns='http://www.w3.org/2000/svg' width='110' height='120'><rect x='18' y='18' width='74' height='74' rx='10' fill='#6ecfff' stroke='#f2ffff' stroke-width='5'/><path d='M32 42 L55 30 L78 52' fill='none' stroke='#fff' stroke-width='4'/><text x='55' y='112' text-anchor='middle' font-family='Arial' font-size='14' fill='#bfefff'>ICE</text></svg>`;
  const svgNeedle = `<svg xmlns='http://www.w3.org/2000/svg' width='24' height='100'><polygon points='12,2 18,86 12,98 6,86' fill='#ffb000'/><circle cx='12' cy='88' r='7' fill='#fff3c4'/></svg>`;
  const btn = (label, fill) =>
    `<svg xmlns='http://www.w3.org/2000/svg' width='170' height='58'><rect width='170' height='58' rx='14' fill='${fill}' stroke='#e6b422' stroke-width='3'/><text x='85' y='36' text-anchor='middle' font-family='Arial' font-size='15' fill='#f7e7c0'>${label}</text></svg>`;
  const svgBg = `<svg xmlns='http://www.w3.org/2000/svg' width='480' height='360'><rect width='480' height='360' fill='#120d0b'/><rect width='480' height='92' fill='#1b1511'/><path d='M70 108 A170 78 0 0 1 410 108' fill='none' stroke='#3a322c' stroke-width='20' stroke-linecap='round'/><path d='M155 80 A170 78 0 0 1 325 80' fill='none' stroke='#e6b422' stroke-width='12' stroke-linecap='round'/><text x='240' y='34' text-anchor='middle' font-family='Georgia' font-size='26' fill='#e6b422'>LET HIM COOK</text><text x='240' y='56' text-anchor='middle' font-family='Arial' font-size='12' fill='#b3a28a'>stir the wok — stay gold — burnt is worth zero</text><text x='78' y='128' font-family='Arial' font-size='11' fill='#7ecbff'>COLD</text><text x='222' y='64' font-family='Arial' font-size='11' fill='#e6b422'>ZONE</text><text x='372' y='128' font-family='Arial' font-size='11' fill='#ff6a3d'>BURNT</text></svg>`;

  async function paint(target, svg, cx, cy) {
    vm.setEditingTarget(target.id);
    await vm.updateSvg(0, svg, cx, cy);
    while (target.getCostumes().length > 1) {
      vm.setEditingTarget(target.id);
      vm.deleteCostume(target.getCostumes().length - 1);
    }
    target.setCostume(0);
  }
  await paint(wok, svgWok, 120, 78);
  await paint(ice, svgIce, 55, 55);
  await paint(needle, svgNeedle, 12, 88);
  await paint(iron, btn("CAST IRON  25", "#24180f"), 85, 29);
  await paint(gas, btn("CRANK GAS  70", "#2a140e"), 85, 29);
  await paint(internBtn, btn("INTERN  120", "#1a1e18"), 85, 29);
  vm.setEditingTarget(vm.runtime.getTargetForStage().id);
  await vm.updateSvg(0, svgBg, 240, 180);

  wok.setXY(0, -8);
  wok.setSize(100);
  wok.clearEffects();
  wok.setVisible(true);
  ice.setXY(-190, -10);
  ice.setSize(80);
  ice.clearEffects();
  ice.setVisible(true);
  needle.setXY(0, 118);
  needle.setSize(85);
  needle.setVisible(true);
  iron.setXY(-155, -145);
  iron.setSize(90);
  iron.setVisible(true);
  gas.setXY(0, -145);
  gas.setSize(90);
  gas.setVisible(true);
  internBtn.setXY(155, -145);
  internBtn.setSize(90);
  internBtn.setVisible(true);

  const stage = vm.runtime.getTargetForStage();
  const ensureVar = (name, start) => {
    let v = Object.values(stage.variables).find((x) => x.name === name);
    if (!v) v = vm.runtime.createNewGlobalVariable(name);
    v.value = start;
    return v;
  };
  const names = {
    flavor: 0,
    heat: 42,
    zoneLow: 38,
    zoneHigh: 68,
    heatPerStir: 7,
    decay: 1.8,
    flavorBase: 4,
    coolPower: 14,
    intern: 0,
    ironBought: 0,
    gasBought: 0,
    internBought: 0,
    zoneMid: 53,
  };
  const vid = {};
  Object.entries(names).forEach(([n, start]) => {
    vid[n] = ensureVar(n, start).id;
  });
  const putMon = (id, name, x, y) => {
    try {
      vm.runtime.requestAddMonitor({
        id,
        targetId: stage.id,
        spriteName: null,
        opcode: "data_variable",
        params: { VARIABLE: name },
        value: 0,
        mode: "default",
        visible: true,
        x,
        y,
        sliderMin: 0,
        sliderMax: 100,
        isDiscrete: true,
        width: 0,
        height: 0,
        get(k) {
          return this[k];
        },
      });
    } catch (e) {}
  };
  putMon(vid.flavor, "flavor", 5, 5);
  putMon(vid.heat, "heat", 5, 32);

  const put = (t, b) => {
    t.blocks.createBlock(b);
    return b.id;
  };
  const fVar = (name) => ({
    VARIABLE: { name: "VARIABLE", id: vid[name], value: name, variableType: "" },
  });
  const inp = (name, block, shadow) => ({
    [name]: { name, block: block || shadow || null, shadow: shadow || null },
  });
  function shNum(t, p, val, op) {
    const id = uid();
    put(t, {
      id,
      opcode: op || "math_number",
      next: null,
      parent: p,
      inputs: {},
      fields: { NUM: { name: "NUM", value: String(val) } },
      shadow: true,
      topLevel: false,
    });
    return id;
  }
  function shText(t, p, val) {
    const id = uid();
    put(t, {
      id,
      opcode: "text",
      next: null,
      parent: p,
      inputs: {},
      fields: { TEXT: { name: "TEXT", value: String(val) } },
      shadow: true,
      topLevel: false,
    });
    return id;
  }
  function dVar(t, p, name) {
    const id = uid();
    put(t, {
      id,
      opcode: "data_variable",
      next: null,
      parent: p,
      inputs: {},
      fields: fVar(name),
      shadow: false,
      topLevel: false,
    });
    return id;
  }
  function mk(t, opcode, ex) {
    const id = ex.id || uid();
    put(t, {
      id,
      opcode,
      next: ex.next || null,
      parent: ex.parent || null,
      inputs: ex.inputs || {},
      fields: ex.fields || {},
      shadow: false,
      topLevel: !!ex.topLevel,
      x: ex.x,
      y: ex.y,
    });
    return id;
  }
  function link(t, ids) {
    for (let i = 0; i < ids.length; i++) {
      const b = t.blocks.getBlock(ids[i]);
      if (i === 0) {
        b.topLevel = true;
        b.parent = null;
      } else {
        b.parent = ids[i - 1];
        b.topLevel = false;
        t.blocks.getBlock(ids[i - 1]).next = ids[i];
      }
    }
    t.blocks.getBlock(ids[ids.length - 1]).next = null;
  }
  function setV(t, name, val) {
    const id = uid();
    const sh = shText(t, id, val);
    mk(t, "data_setvariableto", { id, fields: fVar(name), inputs: inp("VALUE", sh, sh) });
    return id;
  }
  function chV(t, name, num) {
    const id = uid();
    const sh = shNum(t, id, num);
    mk(t, "data_changevariableby", { id, fields: fVar(name), inputs: inp("VALUE", sh, sh) });
    return id;
  }
  function chByVar(t, name, from) {
    const id = uid();
    const sh = shNum(t, id, 0);
    const r = dVar(t, id, from);
    mk(t, "data_changevariableby", {
      id,
      fields: fVar(name),
      inputs: { VALUE: { name: "VALUE", block: r, shadow: sh } },
    });
    return id;
  }
  function goTo(t, x, y) {
    const id = uid();
    const sx = shNum(t, id, x);
    const sy = shNum(t, id, y);
    mk(t, "motion_gotoxy", { id, inputs: Object.assign({}, inp("X", sx, sx), inp("Y", sy, sy)) });
    return id;
  }
  function setSize(t, n) {
    const id = uid();
    const sh = shNum(t, id, n);
    mk(t, "looks_setsizeto", { id, inputs: inp("SIZE", sh, sh) });
    return id;
  }
  function wait(t, s) {
    const id = uid();
    const sh = shNum(t, id, s, "math_positive_number");
    mk(t, "control_wait", { id, inputs: inp("DURATION", sh, sh) });
    return id;
  }
  function sayFor(t, msg, s) {
    const id = uid();
    const st = shText(t, id, msg);
    const ss = shNum(t, id, s, "math_positive_number");
    mk(t, "looks_sayforsecs", {
      id,
      inputs: Object.assign({}, inp("MESSAGE", st, st), inp("SECS", ss, ss)),
    });
    return id;
  }
  function hide(t) {
    return mk(t, "looks_hide", {});
  }
  function show(t) {
    return mk(t, "looks_show", {});
  }
  function drum(t, drumNo, beats) {
    const id = uid();
    const d = uid();
    const b = shNum(t, id, beats, "math_positive_number");
    put(t, {
      id: d,
      opcode: "music_menu_DRUM",
      next: null,
      parent: id,
      inputs: {},
      fields: { DRUM: { name: "DRUM", value: String(drumNo) } },
      shadow: true,
      topLevel: false,
    });
    mk(t, "music_playDrumForBeats", {
      id,
      inputs: Object.assign({}, inp("DRUM", d, d), inp("BEATS", b, b)),
    });
    return id;
  }
  function note(t, midi, beats) {
    const id = uid();
    const n = shNum(t, id, midi);
    const b = shNum(t, id, beats, "math_positive_number");
    mk(t, "music_playNoteForBeats", {
      id,
      inputs: Object.assign({}, inp("NOTE", n, n), inp("BEATS", b, b)),
    });
    return id;
  }
  function lt(t, aName, bName) {
    const id = uid();
    const s1 = shText(t, id, "");
    const s2 = shText(t, id, "0");
    const A = dVar(t, id, aName);
    const B = dVar(t, id, bName);
    mk(t, "operator_lt", {
      id,
      inputs: {
        OPERAND1: { name: "OPERAND1", block: A, shadow: s1 },
        OPERAND2: { name: "OPERAND2", block: B, shadow: s2 },
      },
    });
    return id;
  }
  function gt(t, aName, bName) {
    const id = uid();
    const s1 = shText(t, id, "");
    const s2 = shText(t, id, "0");
    const A = dVar(t, id, aName);
    const B = dVar(t, id, bName);
    mk(t, "operator_gt", {
      id,
      inputs: {
        OPERAND1: { name: "OPERAND1", block: A, shadow: s1 },
        OPERAND2: { name: "OPERAND2", block: B, shadow: s2 },
      },
    });
    return id;
  }
  function eq(t, aName, num) {
    const id = uid();
    const s1 = shText(t, id, "");
    const s2 = shText(t, id, String(num));
    const A = dVar(t, id, aName);
    mk(t, "operator_equals", {
      id,
      inputs: {
        OPERAND1: { name: "OPERAND1", block: A, shadow: s1 },
        OPERAND2: { name: "OPERAND2", block: s2, shadow: s2 },
      },
    });
    return id;
  }
  function notOp(t, c) {
    const id = uid();
    mk(t, "operator_not", { id, inputs: { OPERAND: { name: "OPERAND", block: c, shadow: null } } });
    t.blocks.getBlock(c).parent = id;
    return id;
  }
  function andOp(t, c1, c2) {
    const id = uid();
    mk(t, "operator_and", {
      id,
      inputs: {
        OPERAND1: { name: "OPERAND1", block: c1, shadow: null },
        OPERAND2: { name: "OPERAND2", block: c2, shadow: null },
      },
    });
    t.blocks.getBlock(c1).parent = id;
    t.blocks.getBlock(c2).parent = id;
    return id;
  }
  function ifElse(t, cond, thenId, elseId) {
    const id = mk(t, "control_if_else", {
      inputs: {
        CONDITION: { name: "CONDITION", block: cond, shadow: null },
        SUBSTACK: { name: "SUBSTACK", block: thenId, shadow: null },
        SUBSTACK2: { name: "SUBSTACK2", block: elseId || null, shadow: null },
      },
    });
    t.blocks.getBlock(cond).parent = id;
    t.blocks.getBlock(thenId).parent = id;
    if (elseId) t.blocks.getBlock(elseId).parent = id;
    return id;
  }
  function ifThen(t, cond, thenId) {
    const id = mk(t, "control_if", {
      inputs: {
        CONDITION: { name: "CONDITION", block: cond, shadow: null },
        SUBSTACK: { name: "SUBSTACK", block: thenId, shadow: null },
      },
    });
    t.blocks.getBlock(cond).parent = id;
    t.blocks.getBlock(thenId).parent = id;
    return id;
  }
  function subHeat(t, fromName) {
    const id = uid();
    const sh = shNum(t, id, 0);
    const sub = uid();
    const z = shNum(t, sub, 0);
    const n2 = shNum(t, sub, 0);
    const r = dVar(t, sub, fromName);
    mk(t, "operator_subtract", {
      id: sub,
      parent: id,
      inputs: {
        NUM1: { name: "NUM1", block: z, shadow: z },
        NUM2: { name: "NUM2", block: r, shadow: n2 },
      },
    });
    mk(t, "data_changevariableby", {
      id,
      fields: fVar("heat"),
      inputs: { VALUE: { name: "VALUE", block: sub, shadow: sh } },
    });
    return id;
  }

  const initIds = [
    mk(wok, "event_whenflagclicked", { topLevel: true, x: 40, y: 40 }),
    setV(wok, "flavor", "0"),
    setV(wok, "heat", "42"),
    setV(wok, "zoneLow", "38"),
    setV(wok, "zoneHigh", "68"),
    setV(wok, "heatPerStir", "7"),
    setV(wok, "decay", "1.8"),
    setV(wok, "flavorBase", "4"),
    setV(wok, "coolPower", "14"),
    setV(wok, "intern", "0"),
    setV(wok, "ironBought", "0"),
    setV(wok, "gasBought", "0"),
    setV(wok, "internBought", "0"),
    setV(wok, "zoneMid", "53"),
    goTo(wok, 0, -8),
    setSize(wok, 100),
    show(wok),
    sayFor(wok, "Stir the wok. Stay gold.", 2),
  ];
  link(wok, initIds);

  const bonus = chByVar(wok, "flavor", "flavorBase");
  const ding = note(wok, 76, 0.15);
  wok.blocks.getBlock(bonus).next = ding;
  wok.blocks.getBlock(ding).parent = bonus;
  const cold = chV(wok, "flavor", 1);
  const burnSnd = note(wok, 48, 0.2);
  const burnt = gt(wok, "heat", "zoneHigh");
  const burnBranch = ifElse(wok, burnt, burnSnd, cold);
  const inZone = andOp(
    wok,
    notOp(wok, lt(wok, "heat", "zoneLow")),
    notOp(wok, gt(wok, "heat", "zoneHigh"))
  );
  const zoneIf = ifElse(wok, inZone, bonus, burnBranch);
  const sizzle = drum(wok, 2, 0.15);
  link(wok, [
    mk(wok, "event_whenthisspriteclicked", { topLevel: true, x: 420, y: 40 }),
    chByVar(wok, "heat", "heatPerStir"),
    sizzle,
    zoneIf,
  ]);

  const loopF = mk(wok, "control_forever", {});
  const tw = wait(wok, 0.15);
  const dh = subHeat(wok, "decay");
  const setZero = setV(wok, "heat", "0");
  const heatLt0 = uid();
  const zs = shText(wok, heatLt0, "");
  const z0 = shText(wok, heatLt0, "0");
  const hv = dVar(wok, heatLt0, "heat");
  mk(wok, "operator_lt", {
    id: heatLt0,
    inputs: {
      OPERAND1: { name: "OPERAND1", block: hv, shadow: zs },
      OPERAND2: { name: "OPERAND2", block: z0, shadow: z0 },
    },
  });
  const ifNeg = ifThen(wok, heatLt0, setZero);
  const set100 = setV(wok, "heat", "100");
  const heatGt100 = uid();
  const g1 = shText(wok, heatGt100, "");
  const g2 = shText(wok, heatGt100, "100");
  const hv2 = dVar(wok, heatGt100, "heat");
  mk(wok, "operator_gt", {
    id: heatGt100,
    inputs: {
      OPERAND1: { name: "OPERAND1", block: hv2, shadow: g1 },
      OPERAND2: { name: "OPERAND2", block: g2, shadow: g2 },
    },
  });
  const ifHot = ifThen(wok, heatGt100, set100);
  const internEq = eq(wok, "intern", 1);
  const pullUp = chV(wok, "heat", 1);
  const pullDn = chV(wok, "heat", -1);
  const ltMid = lt(wok, "heat", "zoneMid");
  const internIf = ifElse(wok, ltMid, pullUp, pullDn);
  const ifIntern = ifThen(wok, internEq, internIf);
  wok.blocks.getBlock(internIf).parent = ifIntern;
  link(wok, [tw, dh, ifNeg, ifHot, ifIntern]);
  wok.blocks.getBlock(tw).parent = loopF;
  wok.blocks.getBlock(loopF).inputs = { SUBSTACK: { name: "SUBSTACK", block: tw, shadow: null } };
  link(wok, [mk(wok, "event_whenflagclicked", { topLevel: true, x: 40, y: 520 }), loopF]);

  const hudF = mk(wok, "control_forever", {});
  const hudSay = uid();
  const join1 = uid();
  const join2 = uid();
  const tA = shText(wok, join1, "FLAVOR ");
  const tB = shText(wok, join2, "   HEAT ");
  const fRep = dVar(wok, join1, "flavor");
  const hRep = dVar(wok, join2, "heat");
  mk(wok, "operator_join", {
    id: join1,
    parent: join2,
    inputs: {
      STRING1: { name: "STRING1", block: tA, shadow: tA },
      STRING2: { name: "STRING2", block: fRep, shadow: shText(wok, join1, "") },
    },
  });
  mk(wok, "operator_join", {
    id: join2,
    parent: hudSay,
    inputs: {
      STRING1: { name: "STRING1", block: join1, shadow: tB },
      STRING2: { name: "STRING2", block: hRep, shadow: shText(wok, join2, "") },
    },
  });
  mk(wok, "looks_say", {
    id: hudSay,
    inputs: { MESSAGE: { name: "MESSAGE", block: join2, shadow: shText(wok, hudSay, "...") } },
  });
  const hudW = wait(wok, 0.2);
  link(wok, [hudW, hudSay]);
  wok.blocks.getBlock(hudW).parent = hudF;
  wok.blocks.getBlock(hudF).inputs = { SUBSTACK: { name: "SUBSTACK", block: hudW, shadow: null } };
  link(wok, [mk(wok, "event_whenflagclicked", { topLevel: true, x: 420, y: 520 }), hudF]);

  link(ice, [
    mk(ice, "event_whenflagclicked", { topLevel: true, x: 40, y: 40 }),
    goTo(ice, -190, -10),
    setSize(ice, 80),
    show(ice),
  ]);
  link(ice, [
    mk(ice, "event_whenthisspriteclicked", { topLevel: true, x: 40, y: 200 }),
    drum(ice, 13, 0.15),
    subHeat(ice, "coolPower"),
  ]);

  const nFor = mk(needle, "control_forever", {});
  const nW = wait(needle, 0.05);
  const nP = uid();
  const sh = shNum(needle, nP, 90);
  const sub = uid();
  const m = uid();
  const s180 = shNum(needle, sub, 180);
  const s18 = shNum(needle, m, 1.8);
  const h = dVar(needle, m, "heat");
  mk(needle, "operator_multiply", {
    id: m,
    parent: sub,
    inputs: {
      NUM1: { name: "NUM1", block: h, shadow: s18 },
      NUM2: { name: "NUM2", block: s18, shadow: s18 },
    },
  });
  mk(needle, "operator_subtract", {
    id: sub,
    parent: nP,
    inputs: {
      NUM1: { name: "NUM1", block: s180, shadow: s180 },
      NUM2: { name: "NUM2", block: m, shadow: shNum(needle, sub, 0) },
    },
  });
  mk(needle, "motion_pointindirection", {
    id: nP,
    inputs: { DIRECTION: { name: "DIRECTION", block: sub, shadow: sh } },
  });
  link(needle, [nW, nP]);
  needle.blocks.getBlock(nW).parent = nFor;
  needle.blocks.getBlock(nFor).inputs = { SUBSTACK: { name: "SUBSTACK", block: nW, shadow: null } };
  link(needle, [
    mk(needle, "event_whenflagclicked", { topLevel: true, x: 40, y: 40 }),
    goTo(needle, 0, 118),
    setSize(needle, 90),
    mk(needle, "motion_setrotationstyle", {
      fields: { STYLE: { name: "STYLE", value: "all around" } },
    }),
    show(needle),
    nFor,
  ]);

  function buyBtn(t, x, flagName, cost, extraSets) {
    link(t, [
      mk(t, "event_whenflagclicked", { topLevel: true, x: 40, y: 40 }),
      goTo(t, x, -145),
      setSize(t, 90),
      show(t),
    ]);
    const notB = eq(t, flagName, 0);
    const ltC = uid();
    const s1 = shText(t, ltC, "");
    const s2 = shText(t, ltC, String(cost));
    const fv = dVar(t, ltC, "flavor");
    mk(t, "operator_lt", {
      id: ltC,
      inputs: {
        OPERAND1: { name: "OPERAND1", block: fv, shadow: s1 },
        OPERAND2: { name: "OPERAND2", block: s2, shadow: s2 },
      },
    });
    const enough = notOp(t, ltC);
    const cond = andOp(t, notB, enough);
    const pay = chV(t, "flavor", -cost);
    const mark = setV(t, flagName, "1");
    const fanfare = note(t, 84, 0.25);
    const body = [pay, mark, fanfare].concat(extraSets).concat([hide(t)]);
    for (let i = 1; i < body.length; i++) {
      t.blocks.getBlock(body[i]).parent = body[i - 1];
      t.blocks.getBlock(body[i - 1]).next = body[i];
    }
    t.blocks.getBlock(body[body.length - 1]).next = null;
    const no = sayFor(t, cost + " flavor to unlock", 1);
    const iff = ifElse(t, cond, pay, no);
    link(t, [mk(t, "event_whenthisspriteclicked", { topLevel: true, x: 40, y: 220 }), iff]);
  }
  buyBtn(iron, -155, "ironBought", 25, [setV(iron, "decay", "1.1")]);
  buyBtn(gas, 0, "gasBought", 70, [
    setV(gas, "heatPerStir", "11"),
    setV(gas, "flavorBase", "7"),
    setV(gas, "zoneLow", "46"),
    setV(gas, "zoneHigh", "62"),
    setV(gas, "decay", "1.5"),
  ]);
  buyBtn(internBtn, 155, "internBought", 120, [setV(internBtn, "intern", "1")]);

  vm.runtime.targets.forEach((t) => {
    if (t.isStage) return;
    Object.values(t.blocks._blocks).forEach((b) => {
      if (!b.inputs) return;
      Object.keys(b.inputs).forEach((k) => {
        const i = b.inputs[k];
        if (i && !i.block && i.shadow) i.block = i.shadow;
      });
    });
    t.blocks.resetCache();
  });

  vm.setEditingTarget(wok.id);
  vm.emitWorkspaceUpdate();
  vm.emitTargetsUpdate();
  if (vm.refreshWorkspace) vm.refreshWorkspace();

  const title = document.querySelector('input[name="Project title here"], input[placeholder="Project title here"]');
  if (title) {
    const proto = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value");
    proto.set.call(title, "LET HIM COOK");
    title.dispatchEvent(new Event("input", { bubbles: true }));
    title.dispatchEvent(new Event("change", { bubbles: true }));
  }

  console.log("LET HIM COOK gotowe. Zielona flagą, klikaj wok. Dźwięki: sizzle / ding / burn / ice / buy.");
  return "OK";
})();
