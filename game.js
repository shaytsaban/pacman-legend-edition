// ============================================================
// PAC-MAN: AVIV RUFFEL EDITION — Full Engine v2
// Multiple Ruffel ghosts · Chiptune music · Upgraded shooting
// ============================================================

const COLS = 28, ROWS = 31, TS = 16;
const W = COLS * TS, H = ROWS * TS;

// Map: 1=wall, 2=pellet, 3=power, 0=empty, 5=gate
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

// Ghost spawn offsets so they don't all pile up
const GHOST_SPAWNS = [
  [13,11],[12,13],[14,13],[11,11],[15,11],[13,9],[12,9],[14,9]
];

// =============================================
// AUDIO ENGINE — rich chiptune using Web Audio
// =============================================
let audioCtx = null;
let musicNodes = [];
let soundEnabled = true;
let musicPlaying = false;

function getAC() {
  if (!audioCtx) {
    try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch(e){}
  }
  if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

function tone(freq, type, start, dur, vol=0.08, ac=null) {
  const a = ac || getAC(); if (!a || !soundEnabled) return;
  try {
    const o = a.createOscillator(), g = a.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, start);
    g.gain.setValueAtTime(vol, start);
    g.gain.exponentialRampToValueAtTime(0.001, start + dur);
    o.connect(g); g.connect(a.destination);
    o.start(start); o.stop(start + dur);
    musicNodes.push(o);
  } catch(e){}
}

// --- Chiptune Theme (classic Pac-Man inspired 3-voice) ---
function startMusic() {
  if (musicPlaying) return;
  const ac = getAC(); if (!ac || !soundEnabled) return;
  musicPlaying = true;

  // Notes: [freq, duration_beats]
  const melody = [
    [494,0.5],[523,0.5],[587,0.5],[659,0.5],[698,0.5],[784,0.5],[880,1],
    [784,0.5],[698,0.5],[659,0.5],[587,0.5],[523,0.5],[494,0.5],[440,1],
    [392,0.5],[440,0.5],[494,0.5],[523,0.5],[587,0.5],[659,1.0],
    [587,0.5],[523,0.5],[494,0.5],[440,0.5],[392,0.5],[349,1.5],
    [330,0.5],[370,0.5],[415,0.5],[440,0.5],[494,0.5],[523,1],
    [494,0.5],[440,0.5],[415,0.5],[370,0.5],[330,0.5],[294,1.5],
  ];
  const bass = [
    [131,1],[147,1],[165,1],[175,1],[196,1],[220,2],
    [196,1],[175,1],[165,1],[147,1],[131,1],[110,2],
    [98,1],[110,1],[123,1],[131,1],[147,2],
    [131,1],[110,1],[98,1],[87,1],[82,2],
  ];
  const bpm = 200;
  const beat = 60 / bpm;
  const totalBeats = melody.reduce((s,[,d])=>s+d, 0);
  const loopDur = totalBeats * beat;

  function scheduleLoop(startTime) {
    if (!musicPlaying) return;
    let t = startTime;
    melody.forEach(([f,d]) => { tone(f,'square',t,d*beat*0.85,0.06); t+=d*beat; });
    t = startTime;
    bass.forEach(([f,d]) => { tone(f,'triangle',t,d*beat*0.8,0.05); t+=d*beat; });
    // Harmony voice (melody shifted)
    t = startTime;
    melody.forEach(([f,d],i) => {
      if (i%3===0) tone(f*1.5,'sine',t,d*beat*0.7,0.03);
      t+=d*beat;
    });
    setTimeout(()=>scheduleLoop(ac.currentTime), (loopDur-0.3)*1000);
  }
  scheduleLoop(ac.currentTime + 0.05);
}

function stopMusic() {
  musicPlaying = false;
  musicNodes.forEach(n=>{try{n.stop();}catch(e){}});
  musicNodes = [];
}

// --- SFX ---
function sfxWaka()   { const a=getAC();if(!a||!soundEnabled)return;tone(500,'square',a.currentTime,0.05,0.09,a);tone(350,'square',a.currentTime+0.05,0.05,0.09,a); }
function sfxShoot()  { const a=getAC();if(!a||!soundEnabled)return;tone(800,'square',a.currentTime,0.04,0.1,a);tone(400,'square',a.currentTime+0.04,0.06,0.07,a); }
function sfxSplat()  { const a=getAC();if(!a||!soundEnabled)return;[200,150,100,80].forEach((f,i)=>tone(f,'sawtooth',a.currentTime+i*0.04,0.05,0.15,a)); }
function sfxEat()    { const a=getAC();if(!a||!soundEnabled)return;[300,400,600,900].forEach((f,i)=>tone(f,'square',a.currentTime+i*0.05,0.06,0.1,a)); }
function sfxPower()  { const a=getAC();if(!a||!soundEnabled)return;[200,300,200,400,200,500].forEach((f,i)=>tone(f,'sine',a.currentTime+i*0.07,0.08,0.07,a)); }
function sfxDeath()  {
  const a=getAC();if(!a||!soundEnabled)return;
  [600,550,500,450,400,350,300,250,200,150].forEach((f,i)=>tone(f,'sawtooth',a.currentTime+i*0.09,0.1,0.12,a));
}
function sfxStart() {
  const a=getAC();if(!a||!soundEnabled)return;
  const ns=[523,659,784,1047,784,1047];
  const ts=[0,0.12,0.24,0.36,0.52,0.64];
  ns.forEach((f,i)=>tone(f,'triangle',a.currentTime+ts[i],0.12,0.15,a));
}
function sfxLevelUp() {
  const a=getAC();if(!a||!soundEnabled)return;
  [523,659,784,1047,1319,1568].forEach((f,i)=>tone(f,'square',a.currentTime+i*0.08,0.1,0.1,a));
}

// =============================================
// GAME STATE
// =============================================
let canvas, ctx;
let map = [], ghosts = [], sausages = [];
let pacman;
let score=0, hiScore=0, lives=3, level=1;
let totalDots=0, dotsEaten=0;
let frightenedFrames=0;
let state='MENU'; // MENU FREEZE PLAYING DEATH GAMEOVER
let freezeTimer=0;
let ghostImg=null, ghostImgLoaded=false;
let shootCooldown=0;
const SHOOT_COOLDOWN_MAX = 18;
let wakaToggle=false;

// =============================================
// BOOT
// =============================================
window.addEventListener('load', () => {
  canvas = document.getElementById('game-canvas');
  ctx = canvas.getContext('2d');
  hiScore = parseInt(localStorage.getItem('pm_ruffel_hi')||'0');
  updateHUD();

  ghostImg = new Image();
  ghostImg.onload = () => { ghostImgLoaded = true; };
  ghostImg.src = 'assets/ghost_guy.png';

  // Keyboard
  window.addEventListener('keydown', e => {
    if ([' ','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)) e.preventDefault();
    if (state==='PLAYING') {
      const m={'ArrowUp':[0,-1],'w':[0,-1],'W':[0,-1],
               'ArrowDown':[0,1],'s':[0,1],'S':[0,1],
               'ArrowLeft':[-1,0],'a':[-1,0],'A':[-1,0],
               'ArrowRight':[1,0],'d':[1,0],'D':[1,0]};
      if (m[e.key]) pacman.nextDir = m[e.key];
      if (e.key===' ') doShoot();
    }
  });

  // D-pad + shoot
  const btn=(id,fn)=>{const el=document.getElementById(id);if(el)el.addEventListener('click',fn);};
  btn('dpad-up',    ()=>{if(state==='PLAYING')pacman.nextDir=[0,-1];});
  btn('dpad-down',  ()=>{if(state==='PLAYING')pacman.nextDir=[0,1];});
  btn('dpad-left',  ()=>{if(state==='PLAYING')pacman.nextDir=[-1,0];});
  btn('dpad-right', ()=>{if(state==='PLAYING')pacman.nextDir=[1,0];});
  btn('virtual-shoot', ()=>doShoot());

  // Sound toggle
  const st=document.getElementById('sound-toggle');
  if(st)st.addEventListener('click',()=>{
    soundEnabled=!soundEnabled; st.classList.toggle('active',soundEnabled);
    soundEnabled ? startMusic() : stopMusic();
  });

  btn('start-btn',   ()=>{ getAC(); sfxStart(); setTimeout(startGame,800); });
  btn('restart-btn', ()=>{ getAC(); resetGame(); sfxStart(); setTimeout(startGame,800); });

  requestAnimationFrame(loop);
});

// =============================================
// GAME FLOW
// =============================================
function ghostsForLevel(lvl) { return Math.min(1 + lvl, GHOST_SPAWNS.length); }

function resetGame() {
  score=0; lives=3; level=1; updateHUD();
}

function startGame() {
  stopMusic();
  map = BASE_MAP.map(r=>[...r]);
  totalDots=0; dotsEaten=0; sausages=[]; frightenedFrames=0; shootCooldown=0;
  map.forEach(r=>r.forEach(v=>{if(v===2||v===3)totalDots++;}));

  pacman = makePacman(13,23);
  const n = ghostsForLevel(level);
  ghosts = [];
  for (let i=0;i<n;i++) {
    const [tx,ty] = GHOST_SPAWNS[i % GHOST_SPAWNS.length];
    ghosts.push(makeGhost(tx, ty, i));
  }

  hideOverlays();
  startMusic();
  state='FREEZE'; freezeTimer=130;
}

function hideOverlays() {
  ['menu-overlay','status-overlay'].forEach(id=>{
    const el=document.getElementById(id); if(el)el.classList.remove('active');
  });
}

function showGameOver() {
  stopMusic();
  state='GAMEOVER';
  const el=document.getElementById('status-overlay');
  const ti=document.getElementById('status-title');
  const sc=document.getElementById('final-score-val');
  if(ti){ti.textContent='GAME OVER';ti.className='arcade-title neon-red';}
  if(sc)sc.textContent=score;
  if(el)el.classList.add('active');
}

function levelClear() {
  stopMusic(); sfxLevelUp();
  level++;
  state='FREEZE'; freezeTimer=90;
  setTimeout(startGame,1500);
}

function updateHUD() {
  const sv=document.getElementById('score-val');
  const hv=document.getElementById('high-score-val');
  const lv=document.getElementById('level-val');
  if(sv)sv.textContent=String(score).padStart(4,'0');
  if(hv)hv.textContent=String(hiScore).padStart(4,'0');
  if(lv)lv.textContent=level;
  const lc=document.getElementById('lives-container');
  if(lc){
    lc.innerHTML='';
    for(let i=0;i<lives;i++){const d=document.createElement('div');d.className='glowing-pacman';lc.appendChild(d);}
  }
}

function addScore(pts) {
  score+=pts;
  if(score>hiScore){hiScore=score;localStorage.setItem('pm_ruffel_hi',hiScore);}
  updateHUD();
}

// =============================================
// PAC-MAN
// =============================================
function makePacman(tx,ty) {
  return { tx, ty, x:tx, y:ty, dir:[0,0], nextDir:[-1,0], speed:0.12, mouth:0, mouthDir:1 };
}

function canMove(x,y,dx,dy,isGhost=false) {
  let nx=x+dx, ny=y+dy;
  if(nx<0)nx=COLS-1; if(nx>=COLS)nx=0;
  if(ny<0||ny>=ROWS)return false;
  const v=map[ny][nx];
  if(v===1)return false;
  if(v===5&&!isGhost)return false;
  return true;
}

function updatePacman() {
  const p=pacman;
  const dx=p.tx-p.x, dy=p.ty-p.y;
  const dist=Math.sqrt(dx*dx+dy*dy);

  if(dist<=p.speed) {
    p.x=p.tx; p.y=p.ty;

    // Eat
    const r=Math.round(p.y), c=Math.round(p.x);
    if(r>=0&&r<ROWS&&c>=0&&c<COLS) {
      if(map[r][c]===2){
        map[r][c]=0; dotsEaten++; addScore(10);
        if(wakaToggle){sfxWaka();} wakaToggle=!wakaToggle;
        if(dotsEaten>=totalDots){levelClear();return;}
      } else if(map[r][c]===3){
        map[r][c]=0; dotsEaten++; addScore(50);
        frightenedFrames=380; ghosts.forEach(g=>{if(!g.eaten)g.frightened=true;});
        sfxPower();
        if(dotsEaten>=totalDots){levelClear();return;}
      }
    }

    // Turn
    const [ndx,ndy]=p.nextDir;
    if(ndx!==0||ndy!==0){if(canMove(p.tx,p.ty,ndx,ndy))p.dir=p.nextDir;}

    // Advance
    const [cdx,cdy]=p.dir;
    if(cdx!==0||cdy!==0){
      let ntx=p.tx+cdx, nty=p.ty+cdy;
      if(ntx<0)ntx=COLS-1; if(ntx>=COLS)ntx=0;
      if(nty>=0&&nty<ROWS&&map[nty][ntx]!==1&&map[nty][ntx]!==5){
        p.tx=ntx; p.ty=nty;
      }
    }
  } else {
    const len=dist||1;
    p.x+=(dx/len)*p.speed; p.y+=(dy/len)*p.speed;
    if(p.x<-0.5)p.x=COLS-0.5; if(p.x>=COLS)p.x=-0.5;
  }

  p.mouth+=0.09*p.mouthDir;
  if(p.mouth>=0.45)p.mouthDir=-1;
  if(p.mouth<=0)p.mouthDir=1;

  if(shootCooldown>0)shootCooldown--;
}

function drawPacman() {
  const p=pacman;
  const px=p.x*TS+TS/2, py=p.y*TS+TS/2, r=TS/2+1;
  let angle=0;
  if(p.dir[0]===1)angle=0; else if(p.dir[0]===-1)angle=Math.PI;
  else if(p.dir[1]===1)angle=Math.PI/2; else if(p.dir[1]===-1)angle=-Math.PI/2;

  ctx.save();
  ctx.translate(px,py); ctx.rotate(angle);
  ctx.beginPath(); ctx.moveTo(0,0);
  ctx.arc(0,0,r,p.mouth*Math.PI,(2-p.mouth)*Math.PI);
  ctx.closePath();
  ctx.fillStyle='#FFD700';
  ctx.shadowBlur=10; ctx.shadowColor='#FFD700';
  ctx.fill();
  ctx.restore(); ctx.shadowBlur=0;

  // Shoot cooldown arc indicator around pacman
  if(shootCooldown>0) {
    const progress = shootCooldown/SHOOT_COOLDOWN_MAX;
    ctx.save();
    ctx.translate(px,py);
    ctx.beginPath();
    ctx.arc(0,0,r+3, -Math.PI/2, -Math.PI/2 + (1-progress)*Math.PI*2);
    ctx.strokeStyle='rgba(255,100,0,0.8)'; ctx.lineWidth=2;
    ctx.stroke();
    ctx.restore();
  }
}

function drawDeathAnim(frame) {
  const p=pacman, prog=Math.min(frame/80,1), r=(TS/2+1)*(1-prog);
  if(r<=0)return;
  ctx.save(); ctx.translate(p.x*TS+TS/2, p.y*TS+TS/2);
  ctx.beginPath(); ctx.moveTo(0,0);
  const a=prog*Math.PI;
  ctx.arc(0,0,r,a,(2-a)*Math.PI); ctx.closePath();
  ctx.fillStyle='#FFD700'; ctx.fill(); ctx.restore();
}

// =============================================
// GHOSTS — multiple Aviv Ruffels
// =============================================
function makeGhost(tx,ty,idx) {
  const scatterCorners=[[26,1],[1,1],[26,29],[1,29]];
  return {
    tx,ty,x:tx,y:ty,
    dir:[0,1], speed:0.09+idx*0.005,
    frightened:false, eaten:false,
    yellTimer:0,
    scatter: scatterCorners[idx%4],
    idx,
    scoreMulti:1
  };
}

function updateGhost(g) {
  if(frightenedFrames<=0&&g.frightened&&!g.eaten) g.frightened=false;

  const spd = g.eaten ? 0.28 : (g.frightened ? 0.06 : g.speed+(level-1)*0.005);
  g.speed = spd;

  const dx=g.tx-g.x, dy=g.ty-g.y, dist=Math.sqrt(dx*dx+dy*dy);

  if(dist<=spd) {
    g.x=g.tx; g.y=g.ty;

    if(g.eaten&&Math.round(g.x)===GHOST_SPAWNS[g.idx%GHOST_SPAWNS.length][0]
               &&Math.round(g.y)===GHOST_SPAWNS[g.idx%GHOST_SPAWNS.length][1]) {
      g.eaten=false; g.frightened=false;
    }

    // Pick target
    let targetX,targetY;
    if(g.eaten){ [targetX,targetY]=GHOST_SPAWNS[g.idx%GHOST_SPAWNS.length]; }
    else if(g.frightened) {
      const opts=[[0,-1],[0,1],[-1,0],[1,0]].filter(([a,b])=>
        !(a===-g.dir[0]&&b===-g.dir[1]) && canMove(g.tx,g.ty,a,b,true));
      if(opts.length)g.dir=opts[Math.floor(Math.random()*opts.length)];
      let ntx=g.tx+g.dir[0], nty=g.ty+g.dir[1];
      if(ntx<0)ntx=COLS-1; if(ntx>=COLS)ntx=0;
      g.tx=ntx; g.ty=nty; return;
    } else {
      const sec=Math.floor(Date.now()/1000)%20;
      if(sec<5){targetX=g.scatter[0];targetY=g.scatter[1];}
      else { targetX=Math.round(pacman.x); targetY=Math.round(pacman.y); }
    }

    // Pick best dir
    const dirs=[[0,-1],[0,1],[-1,0],[1,0]];
    let best=null,bestD=Infinity;
    dirs.forEach(([a,b])=>{
      if(a===-g.dir[0]&&b===-g.dir[1])return;
      if(!canMove(g.tx,g.ty,a,b,true))return;
      const d=Math.abs(g.tx+a-targetX)+Math.abs(g.ty+b-targetY);
      if(d<bestD){bestD=d;best=[a,b];}
    });
    if(best)g.dir=best;
    let ntx=g.tx+g.dir[0], nty=g.ty+g.dir[1];
    if(ntx<0)ntx=COLS-1; if(ntx>=COLS)ntx=0;
    g.tx=ntx; g.ty=nty;
  } else {
    const len=dist||1;
    g.x+=(dx/len)*spd; g.y+=(dy/len)*spd;
    if(g.x<-0.5)g.x=COLS-0.5; if(g.x>=COLS)g.x=-0.5;
  }

  // Yell logic
  const dd=Math.abs(g.x-pacman.x)+Math.abs(g.y-pacman.y);
  if(dd<3.5&&!g.frightened&&!g.eaten){if(g.yellTimer===0)g.yellTimer=180;}
  if(g.yellTimer>0)g.yellTimer--;
}

function drawGhost(g) {
  const px=g.x*TS, py=g.y*TS;

  if(g.frightened) {
    const flash=frightenedFrames<90&&Math.floor(Date.now()/150)%2===0;
    drawGhostBody(px,py,flash?'#ffffff':'#0033ff');
    ctx.fillStyle=flash?'#0033ff':'#ffffff';
    ctx.fillRect(px+4,py+6,2,2); ctx.fillRect(px+10,py+6,2,2);
    ctx.fillRect(px+4,py+11,8,2);
  } else if(g.eaten) {
    ctx.fillStyle='#ffffff';
    ctx.beginPath();ctx.arc(px+5,py+6,3,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.arc(px+11,py+6,3,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#00aaff';
    ctx.beginPath();ctx.arc(px+5+g.dir[0],py+6+g.dir[1],1.5,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.arc(px+11+g.dir[0],py+6+g.dir[1],1.5,0,Math.PI*2);ctx.fill();
  } else {
    if(ghostImgLoaded) {
      ctx.save(); ctx.shadowBlur=14; ctx.shadowColor='rgba(255,0,80,0.55)';
      ctx.drawImage(ghostImg,px-1,py-1,TS+2,TS+2);
      ctx.restore(); ctx.shadowBlur=0;
    } else {
      drawGhostBody(px,py,'#ff003c');
    }
  }

  // Speech bubble
  if(g.yellTimer>0) drawYell(g);
}

function drawGhostBody(px,py,col) {
  ctx.fillStyle=col;
  ctx.beginPath();
  ctx.arc(px+8,py+8,8,Math.PI,0);
  ctx.lineTo(px+16,py+16);
  const t=Math.floor(Date.now()/200)%2;
  ctx.lineTo(px+13,py+13+t*3); ctx.lineTo(px+10,py+16);
  ctx.lineTo(px+8,py+13+t*3);  ctx.lineTo(px+6,py+16);
  ctx.lineTo(px+3,py+13+t*3);  ctx.lineTo(px,py+16);
  ctx.closePath(); ctx.fill();
}

// =============================================
// SPEECH BUBBLE "תלמד מסים!"
// =============================================
function drawYell(g) {
  const gx=g.x*TS+TS/2, gy=g.y*TS;
  const text='תלמד מסים!';
  const bW=114, bH=34, bx=gx-bW/2, by=gy-bH-20;
  const shake=g.yellTimer>120?(Math.random()-0.5)*2:0;

  ctx.save(); ctx.translate(shake,shake);

  // Bubble
  ctx.fillStyle='#fff'; ctx.strokeStyle='#cc0000'; ctx.lineWidth=2.5;
  ctx.beginPath();
  ctx.moveTo(bx+10,by); ctx.lineTo(bx+bW-10,by);
  ctx.quadraticCurveTo(bx+bW,by,bx+bW,by+10);
  ctx.lineTo(bx+bW,by+bH-10);
  ctx.quadraticCurveTo(bx+bW,by+bH,bx+bW-10,by+bH);
  ctx.lineTo(bx+10,by+bH);
  ctx.quadraticCurveTo(bx,by+bH,bx,by+bH-10);
  ctx.lineTo(bx,by+10);
  ctx.quadraticCurveTo(bx,by,bx+10,by);
  ctx.closePath(); ctx.fill(); ctx.stroke();

  // Triangle tail
  ctx.beginPath();
  ctx.moveTo(gx-7,by+bH); ctx.lineTo(gx+7,by+bH); ctx.lineTo(gx,by+bH+13);
  ctx.fillStyle='#fff'; ctx.fill();
  ctx.strokeStyle='#cc0000'; ctx.lineWidth=2;
  ctx.beginPath();
  ctx.moveTo(gx-7,by+bH+1); ctx.lineTo(gx,by+bH+13); ctx.lineTo(gx+7,by+bH+1);
  ctx.stroke();

  // Text
  ctx.font='bold 14px Arial,sans-serif'; ctx.textAlign='center';
  ctx.textBaseline='middle'; ctx.direction='rtl';
  ctx.fillStyle='#cc0000';
  ctx.fillText(text,gx,by+bH/2);
  ctx.direction='ltr'; ctx.restore();
}

// =============================================
// SAUSAGE SHOOTER — upgraded
// =============================================
function doShoot() {
  if(state!=='PLAYING') return;
  if(shootCooldown>0) return;
  // Shoot in movement direction, or right if standing still
  const dx=pacman.dir[0]||1, dy=pacman.dir[1];
  sausages.push({x:pacman.x,y:pacman.y,dx,dy,speed:0.38,age:0});
  sfxShoot();
  shootCooldown=SHOOT_COOLDOWN_MAX;
}

function updateSausages() {
  for(let i=sausages.length-1;i>=0;i--){
    const s=sausages[i];
    s.x+=s.dx*s.speed; s.y+=s.dy*s.speed; s.age++;

    if(s.age>120){sausages.splice(i,1);continue;}

    const c=Math.round(s.x),r=Math.round(s.y);
    if(r<0||r>=ROWS||c<0||c>=COLS||map[r][c]===1){sausages.splice(i,1);continue;}

    // Hit ghosts
    let hit=false;
    for(let j=0;j<ghosts.length;j++){
      const g=ghosts[j]; if(g.eaten)continue;
      const gd=Math.abs(s.x-g.x)+Math.abs(s.y-g.y);
      if(gd<0.9){
        sfxSplat();
        if(g.frightened){
          g.eaten=true; g.frightened=false;
          addScore(200*g.scoreMulti); g.scoreMulti++;
          showHitScore(g.x,g.y,200);
        } else {
          frightenedFrames=360; g.frightened=true;
          ghosts.forEach(gg=>{if(!gg.eaten)gg.frightened=true;});
        }
        hit=true; break;
      }
    }
    if(hit){sausages.splice(i,1);}
  }
}

function showHitScore(gx,gy,pts) {
  // Flash score briefly via a temp canvas text overlay
  const px=gx*TS+TS/2, py=gy*TS;
  let alpha=1, frame=0;
  const draw=()=>{
    if(frame>30)return;
    ctx.save(); ctx.globalAlpha=1-frame/30;
    ctx.font='bold 12px Arial'; ctx.textAlign='center';
    ctx.fillStyle='#fff'; ctx.fillText('+'+pts,px,py-frame*0.8);
    ctx.restore(); frame++;
    requestAnimationFrame(draw);
  };
  draw();
}

function drawSausage(s) {
  const px=s.x*TS+TS/2, py=s.y*TS+TS/2;
  const angle=Math.atan2(s.dy,s.dx||1);
  ctx.save(); ctx.translate(px,py); ctx.rotate(angle);

  // Glow trail
  ctx.shadowBlur=8; ctx.shadowColor='rgba(255,80,0,0.7)';
  ctx.fillStyle='#c0392b';
  ctx.beginPath();
  ctx.arc(-5,0,4,Math.PI/2,Math.PI*1.5);
  ctx.lineTo(5,-4); ctx.arc(5,0,4,-Math.PI/2,Math.PI/2);
  ctx.closePath(); ctx.fill();
  ctx.shadowBlur=0;

  ctx.strokeStyle='#7b241c'; ctx.lineWidth=1; ctx.stroke();

  // Mustard squiggle
  ctx.strokeStyle='#f1c40f'; ctx.lineWidth=1.5;
  ctx.beginPath(); ctx.moveTo(-4,0);
  ctx.quadraticCurveTo(-1,-2,2,0); ctx.quadraticCurveTo(4,2,5,0);
  ctx.stroke();

  ctx.restore();
}

// =============================================
// COLLISION
// =============================================
function checkCollisions() {
  ghosts.forEach(g=>{
    if(g.eaten)return;
    const dx=pacman.x-g.x, dy=pacman.y-g.y;
    if(Math.sqrt(dx*dx+dy*dy)<0.7){
      if(g.frightened){
        g.eaten=true; g.frightened=false;
        addScore(200*g.scoreMulti); g.scoreMulti++;
        showHitScore(g.x,g.y,200); sfxEat();
      } else {
        pacmanDied();
      }
    }
  });
}

function pacmanDied() {
  lives--; updateHUD(); sfxDeath();
  state='DEATH'; freezeTimer=100;
}

// =============================================
// DRAW MAZE + DOTS
// =============================================
function drawMaze() {
  for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++){
    const v=map[r][c];
    if(v===1){
      ctx.fillStyle='#06063b'; ctx.fillRect(c*TS,r*TS,TS,TS);
      ctx.strokeStyle='#00c3ff'; ctx.lineWidth=1.5;
      ctx.strokeRect(c*TS+1,r*TS+1,TS-2,TS-2);
    } else if(v===5){
      ctx.fillStyle='#ff007f'; ctx.fillRect(c*TS,r*TS+6,TS,4);
    }
  }
}

function drawDots() {
  const t=Date.now()*0.005;
  for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++){
    const v=map[r][c];
    if(v===2){
      ctx.beginPath(); ctx.arc(c*TS+TS/2,r*TS+TS/2,2.5,0,Math.PI*2);
      ctx.fillStyle='#ffd700'; ctx.shadowBlur=5; ctx.shadowColor='#ffd700';
      ctx.fill(); ctx.shadowBlur=0;
    } else if(v===3){
      const pulse=4.5+Math.sin(t)*1.5;
      ctx.beginPath(); ctx.arc(c*TS+TS/2,r*TS+TS/2,pulse,0,Math.PI*2);
      ctx.fillStyle='#ff7b00'; ctx.shadowBlur=14; ctx.shadowColor='#ff7b00';
      ctx.fill(); ctx.shadowBlur=0;
    }
  }
}

// =============================================
// DRAW HUD OVERLAY ON CANVAS
// =============================================
function drawLevelBanner() {
  if(state==='FREEZE'&&freezeTimer>60){
    ctx.save(); ctx.globalAlpha=Math.min((130-freezeTimer)/20,1);
    ctx.fillStyle='rgba(0,0,0,0.6)';
    ctx.fillRect(0,H/2-30,W,60);
    ctx.font='bold 18px "Press Start 2P",monospace';
    ctx.textAlign='center'; ctx.fillStyle='#ffd700';
    ctx.shadowBlur=12; ctx.shadowColor='#ffd700';
    ctx.fillText(`LEVEL ${level} — ${ghostsForLevel(level)} RUFFELS!`,W/2,H/2+7);
    ctx.shadowBlur=0; ctx.restore();
  }
}

// Draw remaining shoot cooldown indicator
function drawShootHUD() {
  const ready = shootCooldown===0;
  const bx=6, by=H-26, bw=50, bh=10;
  ctx.fillStyle='rgba(0,0,0,0.5)'; ctx.fillRect(bx,by,bw,bh);
  const fill=ready?bw:(1-shootCooldown/SHOOT_COOLDOWN_MAX)*bw;
  ctx.fillStyle=ready?'#ff7b00':'#884400';
  ctx.fillRect(bx,by,fill,bh);
  ctx.strokeStyle=ready?'#ffa040':'#663300'; ctx.lineWidth=1.5;
  ctx.strokeRect(bx,by,bw,bh);
  ctx.font='7px Arial'; ctx.textAlign='left'; ctx.fillStyle='#fff';
  ctx.fillText(ready?'🌭 READY':'🌭',bx+2,by+8);
}

// =============================================
// MAIN LOOP
// =============================================
let deathFrame=0;
function loop() {
  requestAnimationFrame(loop);
  ctx.clearRect(0,0,W,H);

  if(state==='MENU')return;

  if(state==='FREEZE'){
    drawMaze(); drawDots();
    drawLevelBanner();
    frightenedFrames=0;
    freezeTimer--;
    if(freezeTimer<=0)state='PLAYING';
    return;
  }

  if(state==='GAMEOVER'||state==='DEATH'&&freezeTimer<=0){
    drawMaze(); drawDots(); return;
  }

  if(state==='DEATH'){
    drawMaze(); drawDots();
    drawDeathAnim(100-freezeTimer);
    ghosts.forEach(drawGhost);
    freezeTimer--;
    if(freezeTimer<=0){
      if(lives<=0){ showGameOver(); }
      else {
        sausages=[]; pacman=makePacman(13,23);
        ghosts.forEach((g,i)=>{
          const [tx,ty]=GHOST_SPAWNS[i%GHOST_SPAWNS.length];
          Object.assign(g,{tx,ty,x:tx,y:ty,dir:[0,1],frightened:false,eaten:false});
        });
        state='FREEZE'; freezeTimer=70;
      }
    }
    return;
  }

  if(state==='PLAYING'){
    if(frightenedFrames>0)frightenedFrames--;
    updatePacman();
    ghosts.forEach(updateGhost);
    updateSausages();
    checkCollisions();

    drawMaze(); drawDots();
    sausages.forEach(drawSausage);
    ghosts.forEach(drawGhost);
    drawPacman();
    drawShootHUD();
  }
}
