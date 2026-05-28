// ============================================================
// PAC-MAN: LEGEND EDITION  —  Complete Rewrite (clean slate)
// ============================================================

// ---------- CONSTANTS ----------
const COLS = 28;
const ROWS = 31;
const TS   = 16; // tile size in px
const W    = COLS * TS; // 448
const H    = ROWS * TS; // 496

// Map: 1=wall, 2=pellet, 3=power pellet, 0=empty, 5=gate
const BASE_MAP = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,2,2,2,2,2,1],
  [1,2,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,2,1],
  [1,3,1,0,0,1,2,1,0,0,0,1,2,1,1,2,1,0,0,0,1,2,1,0,0,1,3,1],
  [1,2,1,0,0,1,2,1,0,0,0,1,2,1,1,2,1,0,0,0,1,2,1,0,0,1,2,1],
  [1,2,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,2,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
  [1,2,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,2,1],
  [1,2,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,2,1],
  [1,2,2,2,2,2,2,1,1,2,2,2,2,1,1,2,2,2,2,1,1,2,2,2,2,2,2,1],
  [1,1,1,1,1,1,2,1,1,1,1,1,0,1,1,0,1,1,1,1,1,2,1,1,1,1,1,1],
  [0,0,0,0,0,1,2,1,1,1,1,1,0,1,1,0,1,1,1,1,1,2,1,0,0,0,0,0],
  [0,0,0,0,0,1,2,1,1,0,0,0,0,0,0,0,0,0,0,1,1,2,1,0,0,0,0,0],
  [0,0,0,0,0,1,2,1,1,0,1,1,1,5,5,1,1,1,0,1,1,2,1,0,0,0,0,0],
  [1,1,1,1,1,1,2,0,0,0,1,0,0,0,0,0,0,1,0,0,0,2,1,1,1,1,1,1],
  [0,0,0,0,0,1,2,1,1,0,1,0,0,0,0,0,0,1,0,1,1,2,1,0,0,0,0,0],
  [0,0,0,0,0,1,2,1,1,0,1,1,1,1,1,1,1,1,0,1,1,2,1,0,0,0,0,0],
  [0,0,0,0,0,1,2,1,1,0,0,0,0,0,0,0,0,0,0,1,1,2,1,0,0,0,0,0],
  [0,0,0,0,0,1,2,1,1,0,1,1,1,1,1,1,1,1,0,1,1,2,1,0,0,0,0,0],
  [1,1,1,1,1,1,2,1,1,0,1,1,1,1,1,1,1,1,0,1,1,2,1,1,1,1,1,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,2,2,2,2,2,1],
  [1,2,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,2,1],
  [1,2,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,2,1],
  [1,3,2,2,1,1,2,2,2,2,2,2,2,0,0,2,2,2,2,2,2,2,1,1,2,2,3,1],
  [1,1,1,2,1,1,2,1,1,2,1,1,1,1,1,1,1,1,2,1,1,2,1,1,2,1,1,1],
  [1,1,1,2,1,1,2,1,1,2,1,1,1,1,1,1,1,1,2,1,1,2,1,1,2,1,1,1],
  [1,2,2,2,2,2,2,1,1,2,2,2,2,1,1,2,2,2,2,1,1,2,2,2,2,2,2,1],
  [1,2,1,1,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,1,1,2,1],
  [1,2,1,1,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,1,1,2,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

// ---------- GLOBALS ----------
let canvas, ctx;
let map = [];
let pacman, ghost;
let sausages = [];
let score = 0, hiScore = 0, lives = 3, level = 1;
let totalDots, dotsEaten;
let frightenedFrames = 0;
let yellTimer = 0; // frames to show 'תלמד מסים' speech bubble
let state = 'MENU'; // MENU FREEZE PLAYING DEATH GAMEOVER
let freezeTimer = 0;
let soundEnabled = true;
let audioCtx = null;
let ghostImg = null;
let ghostImgLoaded = false;

// ---------- AUDIO ----------
function getAudioCtx() {
  if (!audioCtx) {
    try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch(e) {}
  }
  if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

function beep(freq, type, dur, vol) {
  if (!soundEnabled) return;
  const ac = getAudioCtx();
  if (!ac) return;
  try {
    const o = ac.createOscillator();
    const g = ac.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, ac.currentTime);
    g.gain.setValueAtTime(vol, ac.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + dur);
    o.connect(g); g.connect(ac.destination);
    o.start(); o.stop(ac.currentTime + dur);
  } catch(e) {}
}

function playWaka()    { beep(480, 'triangle', 0.07, 0.12); }
function playPellet()  { beep(200, 'sine', 0.25, 0.06); setTimeout(()=>beep(300,'sine',0.25,0.06),125); }
function playShoot()   { beep(600, 'square', 0.12, 0.08); }
function playSplat()   { beep(120, 'sawtooth', 0.2, 0.15); }
function playEat()     { beep(250, 'square', 0.4, 0.1); setTimeout(()=>beep(800,'square',0.2,0.08),200); }
function playDeath() {
  for (let i = 0; i < 10; i++) setTimeout(()=>beep(500-i*40,'sawtooth',0.09,0.1), i*90);
}
function playStart() {
  const n = [262,330,392,523,392,330,523,0,262,330,392,523];
  const d = [0,100,200,300,440,540,640,720,820,920,1020,1100];
  n.forEach((f,i) => { if (f) setTimeout(()=>beep(f,'triangle',0.12,0.15), d[i]); });
}

// ---------- INIT ----------
window.addEventListener('load', () => {
  canvas = document.getElementById('game-canvas');
  ctx    = canvas.getContext('2d');

  hiScore = parseInt(localStorage.getItem('pm_hi') || '0');
  updateHUD();

  ghostImg = new Image();
  ghostImg.onload = () => { ghostImgLoaded = true; };
  ghostImg.src = 'assets/ghost_guy.png';

  // Key bindings
  window.addEventListener('keydown', e => {
    if ([' ','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)) e.preventDefault();
    if (state !== 'PLAYING') return;
    const m = {'ArrowUp':[0,-1],'w':[0,-1],'W':[0,-1],
                'ArrowDown':[0,1],'s':[0,1],'S':[0,1],
                'ArrowLeft':[-1,0],'a':[-1,0],'A':[-1,0],
                'ArrowRight':[1,0],'d':[1,0],'D':[1,0]};
    if (m[e.key]) pacman.nextDir = m[e.key];
    if (e.key === ' ') shoot();
  });

  // Virtual D-pad
  const btn = (id, act) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', () => { if (state === 'PLAYING') act(); });
  };
  btn('dpad-up',    () => pacman.nextDir=[0,-1]);
  btn('dpad-down',  () => pacman.nextDir=[0,1]);
  btn('dpad-left',  () => pacman.nextDir=[-1,0]);
  btn('dpad-right', () => pacman.nextDir=[1,0]);
  btn('virtual-shoot', shoot);

  // Sound toggle
  const st = document.getElementById('sound-toggle');
  if (st) st.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    st.classList.toggle('active', soundEnabled);
  });

  // Start / Restart
  const sb = document.getElementById('start-btn');
  if (sb) sb.addEventListener('click', () => { getAudioCtx(); startGame(); });
  const rb = document.getElementById('restart-btn');
  if (rb) rb.addEventListener('click', () => { getAudioCtx(); resetGame(); startGame(); });

  requestAnimationFrame(loop);
});

// ---------- GAME CONTROL ----------
function resetGame() {
  score = 0; lives = 3; level = 1;
  updateHUD();
}

function startGame() {
  map = BASE_MAP.map(r => [...r]);
  totalDots = 0; dotsEaten = 0; sausages = []; frightenedFrames = 0;
  map.forEach(r => r.forEach(v => { if (v === 2 || v === 3) totalDots++; }));

  pacman = makePacman(13, 23);
  ghost  = makeGhost(13, 11);

  hideOverlays();
  playStart();
  state = 'FREEZE';
  freezeTimer = 160; // wait for start jingle
}

function hideOverlays() {
  const m = document.getElementById('menu-overlay');
  const s = document.getElementById('status-overlay');
  if (m) m.classList.remove('active');
  if (s) s.classList.remove('active');
}

function gameOver() {
  state = 'GAMEOVER';
  const el = document.getElementById('status-overlay');
  const ti = document.getElementById('status-title');
  const sc = document.getElementById('final-score-val');
  if (ti) { ti.textContent = 'GAME OVER'; ti.className = 'arcade-title neon-red'; }
  if (sc) sc.textContent = score;
  if (el) el.classList.add('active');
}

function levelClear() {
  level++;
  startGame();
}

function updateHUD() {
  const sv = document.getElementById('score-val');
  const hv = document.getElementById('high-score-val');
  if (sv) sv.textContent = String(score).padStart(4,'0');
  if (hv) hv.textContent = String(hiScore).padStart(4,'0');
  const lc = document.getElementById('lives-container');
  if (lc) {
    lc.innerHTML = '';
    for (let i = 0; i < lives; i++) {
      const d = document.createElement('div');
      d.className = 'glowing-pacman';
      lc.appendChild(d);
    }
  }
}

function addScore(pts) {
  score += pts;
  if (score > hiScore) { hiScore = score; localStorage.setItem('pm_hi', hiScore); }
  updateHUD();
}

// ---------- PACMAN ----------
function makePacman(tx, ty) {
  return {
    tx, ty,          // target tile
    x: tx, y: ty,   // current pixel pos (in tile units)
    dir: [0, 0],
    nextDir: [-1, 0],
    speed: 0.125,    // tiles per frame
    mouth: 0,
    mouthDir: 1,
    wakaToggle: false
  };
}

function canMove(x, y, dx, dy) {
  let nx = x + dx, ny = y + dy;
  // tunnel
  if (nx < 0) nx = COLS - 1;
  if (nx >= COLS) nx = 0;
  if (ny < 0 || ny >= ROWS) return false;
  const v = map[ny][nx];
  return v !== 1 && v !== 5;
}

function updatePacman() {
  const p = pacman;

  // Check if we've reached the target tile
  const dx = p.tx - p.x, dy = p.ty - p.y;
  const dist = Math.sqrt(dx*dx + dy*dy);

  if (dist <= p.speed) {
    // Snap to tile
    p.x = p.tx;
    p.y = p.ty;

    // Eat
    const r = Math.round(p.y), c = Math.round(p.x);
    if (r >= 0 && r < ROWS && c >= 0 && c < COLS) {
      if (map[r][c] === 2) {
        map[r][c] = 0; dotsEaten++; addScore(10);
        playWaka();
        if (dotsEaten >= totalDots) { levelClear(); return; }
      } else if (map[r][c] === 3) {
        map[r][c] = 0; dotsEaten++; addScore(50);
        frightenedFrames = 420;
        ghost.frightened = true;
        playPellet();
        if (dotsEaten >= totalDots) { levelClear(); return; }
      }
    }

    // Try to turn
    const [ndx, ndy] = p.nextDir;
    if (ndx !== 0 || ndy !== 0) {
      if (canMove(p.tx, p.ty, ndx, ndy)) {
        p.dir = p.nextDir;
      }
    }

    // Continue in current direction
    const [cdx, cdy] = p.dir;
    if (cdx !== 0 || cdy !== 0) {
      let ntx = p.tx + cdx, nty = p.ty + cdy;
      if (ntx < 0) ntx = COLS - 1;
      if (ntx >= COLS) ntx = 0;
      if (nty < 0 || nty >= ROWS || map[nty][ntx] === 1 || map[nty][ntx] === 5) {
        // wall — stop
      } else {
        p.tx = ntx; p.ty = nty;
      }
    }
  } else {
    // Move towards target
    const len = dist || 1;
    p.x += (dx / len) * p.speed;
    p.y += (dy / len) * p.speed;
    // Tunnel
    if (p.x < -0.5) p.x = COLS - 0.5;
    if (p.x >= COLS) p.x = -0.5;
  }

  // Mouth
  p.mouth += 0.08 * p.mouthDir;
  if (p.mouth >= 0.45) p.mouthDir = -1;
  if (p.mouth <= 0)    p.mouthDir = 1;
}

function drawPacman() {
  const p = pacman;
  const px = p.x * TS + TS/2;
  const py = p.y * TS + TS/2;
  const r  = TS/2 + 1;

  let angle = 0;
  if      (p.dir[0] === 1)  angle = 0;
  else if (p.dir[0] === -1) angle = Math.PI;
  else if (p.dir[1] === 1)  angle = Math.PI/2;
  else if (p.dir[1] === -1) angle = -Math.PI/2;

  ctx.save();
  ctx.translate(px, py);
  ctx.rotate(angle);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.arc(0, 0, r, p.mouth * Math.PI, (2 - p.mouth) * Math.PI);
  ctx.closePath();
  ctx.fillStyle = '#FFD700';
  ctx.shadowBlur = 8; ctx.shadowColor = '#FFD700';
  ctx.fill();
  ctx.restore();
  ctx.shadowBlur = 0;
}

function drawDeathAnim(frame) {
  const p = pacman;
  const px = p.x * TS + TS/2;
  const py = p.y * TS + TS/2;
  const prog = Math.min(frame / 80, 1);
  const r = (TS/2 + 1) * (1 - prog);
  if (r <= 0) return;
  ctx.save();
  ctx.translate(px, py);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  const a = prog * Math.PI;
  ctx.arc(0, 0, r, a, (2 - a) * Math.PI);
  ctx.closePath();
  ctx.fillStyle = '#FFD700';
  ctx.fill();
  ctx.restore();
}

// ---------- GHOST ----------
function makeGhost(tx, ty) {
  return {
    tx, ty, x: tx, y: ty,
    dir: [0, 1],
    nextDir: [0, 1],
    speed: 0.10,
    frightened: false,
    eaten: false,
    scatter: {x: 26, y: 1}
  };
}

function updateGhost() {
  const g = ghost;

  // Manage frightened state
  if (frightenedFrames > 0) {
    frightenedFrames--;
    if (frightenedFrames === 0) { g.frightened = false; }
  }

  const dx = g.tx - g.x, dy = g.ty - g.y;
  const dist = Math.sqrt(dx*dx + dy*dy);

  if (dist <= g.speed) {
    g.x = g.tx; g.y = g.ty;

    // If eaten and back at spawn
    if (g.eaten && Math.round(g.x) === 13 && Math.round(g.y) === 11) {
      g.eaten = false; g.frightened = false;
    }

    // Pick next direction at each tile
    const spd = g.eaten ? 0.25 : (g.frightened ? 0.065 : 0.10 + level * 0.005);
    g.speed = spd;

    let targetX, targetY;
    if (g.eaten) {
      targetX = 13; targetY = 11;
    } else if (g.frightened) {
      // random
      const opts = [[0,-1],[0,1],[-1,0],[1,0]].filter(([ddx,ddy]) => {
        if (ddx === -g.dir[0] && ddy === -g.dir[1]) return false;
        return canMove(g.tx, g.ty, ddx, ddy);
      });
      if (opts.length > 0) g.dir = opts[Math.floor(Math.random() * opts.length)];
      const ntx = g.tx + g.dir[0], nty = g.ty + g.dir[1];
      g.tx = ntx; g.ty = nty; return;
    } else {
      // chase/scatter cycle
      const sec = Math.floor(Date.now() / 1000) % 20;
      if (sec < 7) { targetX = g.scatter.x; targetY = g.scatter.y; }
      else { targetX = Math.round(pacman.x); targetY = Math.round(pacman.y); }
    }

    // Pick best direction using Manhattan distance
    const dirs = [[0,-1],[0,1],[-1,0],[1,0]];
    let best = null, bestDist = Infinity;
    dirs.forEach(([ddx, ddy]) => {
      if (ddx === -g.dir[0] && ddy === -g.dir[1]) return; // no reversal
      if (!canMove(g.tx, g.ty, ddx, ddy)) return;
      const nd = Math.abs(g.tx + ddx - targetX) + Math.abs(g.ty + ddy - targetY);
      if (nd < bestDist) { bestDist = nd; best = [ddx, ddy]; }
    });
    if (best) { g.dir = best; }

    let ntx = g.tx + g.dir[0], nty = g.ty + g.dir[1];
    if (ntx < 0) ntx = COLS - 1;
    if (ntx >= COLS) ntx = 0;
    g.tx = ntx; g.ty = nty;
  } else {
    const len = dist || 1;
    g.x += (dx / len) * g.speed;
    g.y += (dy / len) * g.speed;
    if (g.x < -0.5) g.x = COLS - 0.5;
    if (g.x >= COLS) g.x = -0.5;
  }
}

function drawGhost() {
  const g = ghost;
  const px = g.x * TS;
  const py = g.y * TS;

  if (g.frightened) {
    // Blue/flashing ghost
    const flash = frightenedFrames < 100 && Math.floor(Date.now()/150)%2===0;
    const col = flash ? '#ffffff' : '#0033ff';
    drawGhostBody(px, py, col);
    // sad face
    ctx.fillStyle = flash ? '#0033ff' : '#ffffff';
    ctx.fillRect(px+4, py+6, 2, 2);
    ctx.fillRect(px+10, py+6, 2, 2);
    ctx.fillRect(px+4, py+11, 8, 2);
  } else if (g.eaten) {
    // Just eyes
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(px+5, py+6, 3, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(px+11, py+6, 3, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#00aaff';
    ctx.beginPath(); ctx.arc(px+5+g.dir[0], py+6+g.dir[1], 1.5, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(px+11+g.dir[0], py+6+g.dir[1], 1.5, 0, Math.PI*2); ctx.fill();
  } else {
    // Custom likeness ghost
    if (ghostImgLoaded) {
      ctx.save();
      ctx.shadowBlur = 12; ctx.shadowColor = 'rgba(255,0,80,0.5)';
      ctx.drawImage(ghostImg, px - 1, py - 1, TS + 2, TS + 2);
      ctx.restore();
      ctx.shadowBlur = 0;
    } else {
      drawGhostBody(px, py, '#ff003c');
    }
  }
}

function drawGhostBody(px, py, col) {
  ctx.fillStyle = col;
  ctx.beginPath();
  ctx.arc(px+8, py+8, 8, Math.PI, 0);
  ctx.lineTo(px+16, py+16);
  const t = Math.floor(Date.now()/200)%2;
  ctx.lineTo(px+13, py+13+t*3);
  ctx.lineTo(px+10, py+16);
  ctx.lineTo(px+8,  py+13+t*3);
  ctx.lineTo(px+6,  py+16);
  ctx.lineTo(px+3,  py+13+t*3);
  ctx.lineTo(px,    py+16);
  ctx.closePath();
  ctx.fill();
}

// ---------- SAUSAGES ----------
function shoot() {
  if (state !== 'PLAYING') return;
  if (sausages.length >= 3) return;
  playShoot();
  sausages.push({
    x: pacman.x, y: pacman.y,
    dx: pacman.dir[0] || 1, dy: pacman.dir[1],
    speed: 0.28
  });
}

function updateSausages() {
  for (let i = sausages.length - 1; i >= 0; i--) {
    const s = sausages[i];
    s.x += s.dx * s.speed;
    s.y += s.dy * s.speed;

    // Out of bounds or hit wall
    const c = Math.round(s.x), r = Math.round(s.y);
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS || map[r][c] === 1) {
      sausages.splice(i, 1); continue;
    }

    // Hit ghost
    if (!ghost.eaten) {
      const gd = Math.abs(s.x - ghost.x) + Math.abs(s.y - ghost.y);
      if (gd < 1.0) {
        playSplat();
        if (ghost.frightened) {
          // Eat ghost
          ghost.eaten = true; ghost.frightened = false;
          frightenedFrames = 0;
          addScore(200);
        } else {
          // Scare ghost
          frightenedFrames = 360;
          ghost.frightened = true;
        }
        sausages.splice(i, 1);
      }
    }
  }
}

function drawSausage(s) {
  const px = s.x * TS + TS/2;
  const py = s.y * TS + TS/2;
  const angle = Math.atan2(s.dy, s.dx || 1);

  ctx.save();
  ctx.translate(px, py);
  ctx.rotate(angle);

  // sausage body
  ctx.fillStyle = '#c0392b';
  ctx.beginPath();
  ctx.arc(-5, 0, 4, Math.PI/2, Math.PI*1.5);
  ctx.lineTo(5, -4);
  ctx.arc(5, 0, 4, -Math.PI/2, Math.PI/2);
  ctx.closePath();
  ctx.fill();

  // brown highlight
  ctx.strokeStyle = '#7b241c';
  ctx.lineWidth = 1;
  ctx.stroke();

  // mustard squiggle
  ctx.strokeStyle = '#f1c40f';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(-4, 0);
  ctx.quadraticCurveTo(-1, -2, 2, 0);
  ctx.quadraticCurveTo(4, 2, 5, 0);
  ctx.stroke();

  ctx.restore();
}

// ---------- MAZE DRAWING ----------
function drawMaze() {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const v = map[r][c];
      if (v === 1) {
        ctx.fillStyle = '#06063b';
        ctx.fillRect(c*TS, r*TS, TS, TS);
        ctx.strokeStyle = '#00c3ff';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(c*TS+1, r*TS+1, TS-2, TS-2);
      } else if (v === 5) {
        ctx.fillStyle = '#ff007f';
        ctx.fillRect(c*TS, r*TS+6, TS, 4);
      }
    }
  }
}

function drawDots() {
  const t = Date.now() * 0.005;
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const v = map[r][c];
      if (v === 2) {
        ctx.beginPath();
        ctx.arc(c*TS+TS/2, r*TS+TS/2, 2.5, 0, Math.PI*2);
        ctx.fillStyle = '#ffd700';
        ctx.shadowBlur = 5; ctx.shadowColor = '#ffd700';
        ctx.fill();
        ctx.shadowBlur = 0;
      } else if (v === 3) {
        const pulse = 4.5 + Math.sin(t) * 1.5;
        ctx.beginPath();
        ctx.arc(c*TS+TS/2, r*TS+TS/2, pulse, 0, Math.PI*2);
        ctx.fillStyle = '#ff7b00';
        ctx.shadowBlur = 12; ctx.shadowColor = '#ff7b00';
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }
  }
}

// ---------- COLLISION CHECK ----------
function checkCollision() {
  if (!ghost || ghost.eaten) return;
  const dx = pacman.x - ghost.x, dy = pacman.y - ghost.y;
  const d = Math.sqrt(dx*dx + dy*dy);

  // Yell 'תלמד מסים' when ghost gets close
  if (d < 3.5 && !ghost.frightened) {
    if (yellTimer === 0) yellTimer = 160; // start yelling
  }
  if (yellTimer > 0) yellTimer--;

  if (d < 0.75) {
    if (ghost.frightened) {
      ghost.eaten = true; ghost.frightened = false; frightenedFrames = 0;
      yellTimer = 0;
      addScore(200); playEat();
    } else {
      yellTimer = 200; // keep yelling as pacman dies
      pacmanDied();
    }
  }
}

function pacmanDied() {
  lives--;
  updateHUD();
  playDeath();
  state = 'DEATH';
  freezeTimer = 100;
}

// ---------- MAIN LOOP ----------
let deathFrame = 0;
function loop() {
  requestAnimationFrame(loop);

  ctx.clearRect(0, 0, W, H);

  if (state === 'MENU') {
    // Just show a blank canvas — the HTML overlay covers it
    return;
  }

  if (state === 'FREEZE') {
    freezeTimer--;
    drawMaze(); drawDots();
    if (freezeTimer <= 0) state = 'PLAYING';
    return;
  }

  if (state === 'GAMEOVER') {
    drawMaze(); drawDots();
    return;
  }

  if (state === 'DEATH') {
    drawMaze(); drawDots();
    drawDeathAnim(100 - freezeTimer);
    drawGhost();
    freezeTimer--;
    if (freezeTimer <= 0) {
      if (lives <= 0) {
        gameOver();
      } else {
        // Respawn
        sausages = [];
        pacman = makePacman(13, 23);
        ghost  = makeGhost(13, 11);
        state = 'FREEZE';
        freezeTimer = 80;
      }
    }
    return;
  }

  if (state === 'PLAYING') {
    updatePacman();
    updateGhost();
    updateSausages();
    checkCollision();

    drawMaze();
    drawDots();
    sausages.forEach(s => drawSausage(s));
    drawGhost();
    if (yellTimer > 0) drawYell();
    drawPacman();
  }
}

// ---------- YELL SPEECH BUBBLE ----------
function drawYell() {
  const gx = ghost.x * TS + TS / 2;
  const gy = ghost.y * TS;

  const text = 'תלמד מסים!';
  const bubbleW = 112;
  const bubbleH = 34;
  const bx = gx - bubbleW / 2;
  const by = gy - bubbleH - 20;

  // Shake when fresh / urgent
  const shake = yellTimer > 100 ? (Math.random() - 0.5) * 2.5 : 0;

  ctx.save();
  ctx.translate(shake, shake);

  // White bubble background
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#cc0000';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(bx + 10, by);
  ctx.lineTo(bx + bubbleW - 10, by);
  ctx.quadraticCurveTo(bx + bubbleW, by, bx + bubbleW, by + 10);
  ctx.lineTo(bx + bubbleW, by + bubbleH - 10);
  ctx.quadraticCurveTo(bx + bubbleW, by + bubbleH, bx + bubbleW - 10, by + bubbleH);
  ctx.lineTo(bx + 10, by + bubbleH);
  ctx.quadraticCurveTo(bx, by + bubbleH, bx, by + bubbleH - 10);
  ctx.lineTo(bx, by + 10);
  ctx.quadraticCurveTo(bx, by, bx + 10, by);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Tail triangle pointing down to ghost
  ctx.beginPath();
  ctx.moveTo(gx - 7, by + bubbleH);
  ctx.lineTo(gx + 7, by + bubbleH);
  ctx.lineTo(gx, by + bubbleH + 13);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  // redraw stroke sides of triangle
  ctx.strokeStyle = '#cc0000';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(gx - 7, by + bubbleH + 1);
  ctx.lineTo(gx, by + bubbleH + 13);
  ctx.lineTo(gx + 7, by + bubbleH + 1);
  ctx.stroke();

  // Hebrew RTL text
  ctx.font = 'bold 15px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.direction = 'rtl';
  ctx.fillStyle = '#cc0000';
  ctx.fillText(text, gx, by + bubbleH / 2);
  ctx.direction = 'ltr';

  ctx.restore();
}
