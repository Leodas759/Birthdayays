/* ============ EDIT YOUR MESSAGES HERE ============ */
const CONFIG = {
  name: "Ayshuuu",
  date: "26 October 2026",
  title: "Happy Birthday, Ayshuuu ❤️",
  introText: "Roses for you, Ayshuuu…",
  subtitle: "To the most beautiful part of my life…",
  captions: ["You, my sunshine","Your smile is my favourite sight","Grace in every moment","My heart, my home","You are my happiness, my love, my everything"], // one per photo
  photoText: "You are my happiness, my love, my everything ❤️",
  wishes: [
    "Happy Birthday, My Beautiful Wife Ayshuuu ❤️",
    "You are not just my wife; you are my happiness, my peace, and my favourite person in this world.",
    "Every moment with you is a beautiful memory. I am so lucky to have you in my life.",
    "May your smile shine brighter than every star, and may all your dreams come true.",
    "I would choose you again, in every lifetime. I love you forever. ❤️"
  ],
  letter: "My darling, thank you for every day, every laugh and every quiet moment. You are my home.",
  final: "Happy Birthday, Ayshuuu, My Love! 🎂💖\nForever yours, with all my love. ❤️\n26.10.2026",
  photos: ["assets/wife-photo.jpg","assets/photo2.jpg","assets/photo3.jpg","assets/photo4.jpg","assets/photo5.jpg","assets/photo6.jpg"], // add up to 6; missing files are skipped
  emojis: ["❤️","💖","💕","🥰","😘","🌹","🦋","✨","💐","🎉"]
};
/* ================================================== */
// Background colour palettes (4 colours each) - edit freely
const PAL = {
  s0:["#c1124f","#6e0a30","#2a0a2a","#0b0612"],
  s1:["#ff2d55","#7a0a3a","#2a0a4a","#0b0620"],
  s2:["#ffb347","#ff4e8a","#8a2be2","#2b0a5a"],
  s3:["#18d4ff","#7b5cff","#ff3d9a","#4a0a6a"],
  s4:["#ff7a18","#e0115f","#5a1a9a","#1a0a3a"],
  s5:["#ffd36a","#ff5fa2","#b04dff","#2a0a50"],
  w:[["#ff7a18","#e0115f","#5a1a9a","#1a0a3a"],["#00e0b8","#2f6bff","#9b2dff","#12083a"],["#ff4f8b","#ffb020","#c0145a","#3a0a30"],["#7cf0ff","#b04dff","#ff3d86","#220a50"]]
};
const setPal = a => a && a.forEach((c,i) => document.documentElement.style.setProperty("--c"+(i+1), c));
const $ = id => document.getElementById(id);
const clean = s => s.replace(/[\p{Extended_Pictographic}\uFE0F]/gu,"").replace(/\s+([.!,])/g,"$1").replace(/ +\n/g,"\n").trim();
const sleep = ms => new Promise(r => setTimeout(r, ms));
const music = $("music"), photo = $("photo"), fx = $("fx");
let run = 0, photos = [], slideTimer;

// Placeholder (clearly labelled SAMPLE) used until a real photo loads
const PLACEHOLDER = "data:image/svg+xml;utf8," + encodeURIComponent(
 `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffb3d1"/><stop offset="1" stop-color="#9b6bff"/></linearGradient></defs><rect width="300" height="400" fill="url(#g)"/><circle cx="150" cy="150" r="58" fill="#fff" opacity=".85"/><path d="M40 400c0-90 50-130 110-130s110 40 110 130z" fill="#fff" opacity=".85"/><text x="150" y="375" text-anchor="middle" font-size="22" font-family="sans-serif" fill="#6b2f8a">SAMPLE PHOTO</text></svg>`);

const FOCUS=[[.52,.3,1,1.25],[.55,.42,.85,1.2],[.5,.37,1,1.2],[.53,.31,.38,2.1],[.67,.2,.55,1.4]]; // per photo: face x, y, crop width, zoom
let imgs=[],slideI=0,picT=0,picK=0;
function setPhotos(list){ photos=list; imgs=list.map(u=>{const i=new Image();i.src=u;return i;}); photo.src=list[0]; }
const loadList = l => Promise.all(l.map(u => new Promise(r => { const i = new Image(); i.onload = () => r(u); i.onerror = () => r(null); i.src = u; }))).then(a => a.filter(Boolean));
loadList(CONFIG.photos).then(ok => { if (ok.length) setPhotos(ok); else { photo.src = PLACEHOLDER; $("placeholderNote").hidden = false; } });
function cropRect(k,im){ const [cx,cy,w]=FOCUS[k]||[.5,.3,1],iw=im.naturalWidth,ih=im.naturalHeight; let sw=iw*w,sh=sw/.93; if(sh>ih){sh=ih;sw=sh*.93;}
  const cl=(v,a,b)=>Math.max(a,Math.min(b,v)); return [cl(cx*iw-sw/2,0,iw-sw),cl(cy*ih-sh/2,0,ih-sh),sw,sh]; }
function showSlide(i){ const [cx,cy,,z]=FOCUS[i]||[.5,.3,1,1.2]; photo.src=photos[i]; photo.style.objectPosition=`50% ${cy*100}%`; photo.style.transformOrigin=`${cx*100}% ${cy*100}%`;
  photo.style.setProperty("--z",z); photo.style.animation="none"; void photo.offsetWidth; photo.style.animation="kb 3.6s ease-out forwards";
  const c=CONFIG.captions[i]; if(c) $("photoText").textContent=clean(c); }
function startSlides(){ stopSlides(); slideI=0; showSlide(0); if(photos.length>1) slideTimer=setInterval(()=>{ slideI=(slideI+1)%photos.length; photo.style.opacity=0;
  setTimeout(()=>{ showSlide(slideI); photo.style.opacity=1; burst(26); },450); },3200); }
function stopSlides(){ clearInterval(slideTimer); photo.style.opacity=1; }
$("pick").onchange = e => { const f = [...e.target.files]; if (f.length){ setPhotos(f.map(x => URL.createObjectURL(x))); $("placeholderNote").hidden = true; } };

$("title").textContent = clean(CONFIG.title); $("subtitle").textContent = clean(CONFIG.subtitle); $("date").textContent = CONFIG.date; document.title = "Happy Birthday, " + CONFIG.name;
$("photoText").textContent = clean(CONFIG.photoText);

// Typewriter that stops if a replay starts
async function type(el, text, id, speed = 45){
  text = clean(text); el.textContent = "";
  for (const ch of text){ if (id !== run) return; el.textContent += ch; await sleep(speed); }
}
function scene(id){ setPal(PAL[id]); document.querySelectorAll(".scene").forEach(s => s.classList.toggle("on", s.id === id)); }

// High-resolution particle engine: petals, hearts, bokeh, butterflies, confetti (all vector-drawn)
const cv=$("confetti"),ctx=cv.getContext("2d");let W,H,D,P=[],last=0,amb=0;
const size=()=>{D=Math.min(devicePixelRatio||1,3);W=innerWidth;H=innerHeight;cv.width=W*D;cv.height=H*D;ctx.setTransform(D,0,0,D,0,0)};
size();addEventListener("resize",size);
const R=(a,b)=>a+Math.random()*(b-a), pick=a=>a[Math.random()*a.length|0];
const HEART=new Path2D("M0 -.35C-.1 -.75 -.75 -.7 -.75 -.2C-.75 .25 -.2 .5 0 .85C.2 .5 .75 .25 .75 -.2C.75 -.7 .1 -.75 0 -.35Z");
const PETAL=new Path2D("M0 -1C.35 -1.05 .85 -.4 .75 .2C.65 .75 .25 1 0 1C-.25 1 -.65 .75 -.75 .2C-.85 -.4 -.35 -1.05 0 -1Z");
const WING=new Path2D("M0 0C.15 -1 1.25 -1.05 1.1 -.3C1.05 .1 .5 .15 0 0ZM0 .02C.65 .1 1 .5 .75 .9C.45 1.1 .1 .5 0 .02Z");
const PETALS=[["#ff9db9","#d81b60"],["#ff6f9f","#9c1048"],["#ffd0de","#f0508a"],["#fff3b8","#f2a31b"],["#ffffff","#f7a6c8"]];
const WINGS=[["#ffd0f0","#8f5cff"],["#bfe9ff","#4f6bff"],["#ffe3a0","#ff6fa5"]];
function add(type,x,y,o={}){ if(P.length>110)return; P.push(Object.assign({type,x,y,vx:R(-.3,.3),vy:-R(.4,1.1),a:R(0,6),va:R(-.03,.03),s:1,life:1,fade:.0012,ph:R(0,6)},o)); }
function ambient(){
  const r=Math.random(), x=R(0,W), y=H+30;
  if(r<.42) add("petal",x,y,{s:R(9,18),c:pick(PETALS),vy:-R(.5,1.1)});
  else if(r<.67) add("heart",x,y,{s:R(10,24),vy:-R(.6,1.3),fade:.001});
  else if(r<.9) add("bokeh",x,R(0,H),{s:R(20,60),vy:-.12,vx:R(-.1,.1),fade:.002,life:R(.4,1)});
  else add("fly",x,y,{s:R(14,22),c:pick(WINGS),vy:-R(.7,1.1),fade:.0009});
}
function burst(n=120){
  for(let i=0;i<n;i++){const k=i%6; const o={x:W/2,y:H*.55,vx:R(-8,8),vy:-R(3,14)};
    if(k<4)add("conf",o.x,o.y,{...o,s:R(5,9),c:pick(["#ff6fa5","#ffd98a","#c58bff","#fff","#7fd6ff"]),va:R(-.3,.3),fade:.007});
    else if(k==4)add("petal",o.x,o.y,{...o,vx:o.vx*.5,vy:o.vy*.6,s:R(9,16),c:pick(PETALS),fade:.004});
    else add("heart",o.x,o.y,{...o,vx:o.vx*.5,vy:o.vy*.6,s:R(10,18),fade:.004});}
}
function addPic(){ if(P.filter(p=>p.type=="pic").length>=9)return; const s=Math.min(52,Math.max(30,W*.08))*R(.8,1.15),x=Math.random()<.5?R(.06,.27)*W:R(.73,.94)*W;
  P.push({type:"pic",k:picK++%imgs.length,x,y:H+s*1.6,vx:R(-.15,.15),vy:-R(.55,.85),a:R(0,6),va:R(.01,.025),s,life:1,fade:.0006,ph:R(0,6),c:pick(WINGS)}); }
function draw(now){
  const dt=Math.min((now-last)/16.7||1,3);last=now;ctx.clearRect(0,0,W,H);
  if($("show").classList.contains("on")&&now-amb>260){amb=now;ambient();}
  if($("show").classList.contains("on")&&imgs.length&&now-picT>1300){picT=now;addPic();}
  P=P.filter(p=>p.life>0&&p.y>-80&&p.y<H+120);
  for(const p of P){
    p.life-=p.fade*dt;
    if(p.type=="conf"){p.vy+=.22*dt;p.vx*=.99}
    p.x+=p.vx*dt;p.y+=p.vy*dt;p.a+=p.va*dt;
    if(p.type=="petal"||p.type=="heart"||p.type=="pic")p.x+=Math.sin(p.a*1.5+p.ph)*.5*dt;
    const al=Math.max(0,Math.min(1,p.life*1.5));
    ctx.save();ctx.translate(p.x,p.y);ctx.globalAlpha=al;
    if(p.type=="bokeh"){ctx.globalCompositeOperation="lighter";const g=ctx.createRadialGradient(0,0,0,0,0,p.s);
      g.addColorStop(0,"rgba(255,170,210,.0)");g.addColorStop(.7,"rgba(255,160,205,.22)");g.addColorStop(1,"rgba(255,160,205,0)");ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,p.s,0,7);ctx.fill();}
    else if(p.type=="heart"){ctx.rotate(Math.sin(p.a)*.35);ctx.scale(p.s,p.s);ctx.shadowColor="rgba(255,60,120,.8)";ctx.shadowBlur=18;
      const g=ctx.createRadialGradient(-.25,-.3,.05,0,0,1);g.addColorStop(0,"#ffb3cc");g.addColorStop(.5,"#e8205f");g.addColorStop(1,"#7a0c3a");ctx.fillStyle=g;ctx.fill(HEART);
      ctx.shadowBlur=0;ctx.fillStyle="rgba(255,255,255,.45)";ctx.beginPath();ctx.ellipse(-.38,-.4,.17,.08,-.6,0,7);ctx.fill();}
    else if(p.type=="petal"){ctx.rotate(p.a);ctx.scale(p.s*.7,p.s*Math.cos(p.a*1.3));
      const g=ctx.createLinearGradient(0,-1,0,1);g.addColorStop(0,p.c[0]);g.addColorStop(1,p.c[1]);ctx.fillStyle=g;ctx.fill(PETAL);
      ctx.strokeStyle="rgba(255,255,255,.25)";ctx.lineWidth=.04;ctx.beginPath();ctx.moveTo(0,-.8);ctx.lineTo(0,.8);ctx.stroke();}
    else if(p.type=="pic"){const im=imgs[p.k];ctx.rotate(Math.sin(p.a)*.18);
      ctx.save();ctx.scale(p.s,p.s);ctx.shadowColor="rgba(255,110,185,.95)";ctx.shadowBlur=24;ctx.fillStyle="#fff";ctx.fill(HEART);ctx.restore();
      if(im&&im.complete&&im.naturalWidth){const c=cropRect(p.k,im);ctx.save();ctx.scale(p.s,p.s);ctx.clip(HEART);ctx.drawImage(im,c[0],c[1],c[2],c[3],-.78,-.78,1.56,1.68);ctx.restore();}
      ctx.save();ctx.scale(p.s,p.s);ctx.lineWidth=.06;ctx.strokeStyle="#fff";ctx.stroke(HEART);ctx.restore();
      const f=.25+.75*Math.abs(Math.sin(now/95+p.ph));ctx.translate(p.s*.72,-p.s*.78);ctx.rotate(.45);ctx.scale(p.s*.55,p.s*.55);ctx.shadowColor=p.c[1];ctx.shadowBlur=12;
      const g=ctx.createLinearGradient(0,-1,1.1,1);g.addColorStop(0,p.c[0]);g.addColorStop(1,p.c[1]);ctx.fillStyle=g;
      for(const m of[1,-1]){ctx.save();ctx.scale(m*f,1);ctx.fill(WING);ctx.restore();}
      ctx.shadowBlur=0;ctx.fillStyle="#3a1b52";ctx.beginPath();ctx.ellipse(0,.1,.07,.7,0,0,7);ctx.fill();}
    else if(p.type=="fly"){p.x+=Math.sin(p.y/35+p.ph)*1.1*dt;const f=.2+.8*Math.abs(Math.sin(now/110+p.ph));ctx.rotate(Math.sin(p.y/35+p.ph)*.25);ctx.scale(p.s,p.s);
      ctx.shadowColor=p.c[1];ctx.shadowBlur=14;const g=ctx.createLinearGradient(0,-1,1.1,1);g.addColorStop(0,p.c[0]);g.addColorStop(1,p.c[1]);ctx.fillStyle=g;
      for(const m of[1,-1]){ctx.save();ctx.scale(m*f,1);ctx.fill(WING);ctx.restore();}
      ctx.shadowBlur=0;ctx.fillStyle="#3a1b52";ctx.beginPath();ctx.ellipse(0,.1,.07,.7,0,0,7);ctx.fill();}
    else{ctx.rotate(p.a);ctx.fillStyle=p.c;ctx.fillRect(-p.s/2,-p.s/4,p.s,p.s/2*Math.abs(Math.cos(p.a*2))+1);}
    ctx.restore();
  }
  requestAnimationFrame(draw);
}
requestAnimationFrame(draw);

// Sparkle trail following mouse / touch
function sparkle(e){
  const t = e.touches ? e.touches[0] : e; if (!t) return;
  const s = document.createElement("span"); s.className = "sp";
  s.style.left = t.clientX + "px"; s.style.top = t.clientY + "px"; fx.appendChild(s); setTimeout(() => s.remove(), 800);
}
let lastSp = 0;
["pointermove","touchmove"].forEach(ev => addEventListener(ev, e => { const n = performance.now(); if (n - lastSp > 60){ lastSp = n; sparkle(e); } }, {passive:true}));


// ===== Ground of blooming roses (vector-drawn, high-res sprites) =====
const rc=$("roses"),rx=rc.getContext("2d");
const RPAL=[["#4a0010","#c1122f","#ff6a7c"],["#6e0e3c","#e0457f","#ffb6d0"],["#3a0010","#8f0a24","#e04a60"],["#8a5a6a","#f3cfdc","#ffffff"],["#7a4a00","#e8a317","#ffe27a"]];
const STAGES=12,SP=256;let sprites=[],ground=[],gStart=0,gDone=true;
function drawRose(c,s,b,p){ // s = size px, b = bloom 0..1
  c.save();c.translate(s/2,s*.58);
  const leaf=(a,l)=>{c.save();c.rotate(a);const g=c.createLinearGradient(0,0,0,-l);g.addColorStop(0,"#0b3d1c");g.addColorStop(1,"#3fae5a");c.fillStyle=g;
    c.beginPath();c.moveTo(0,0);c.quadraticCurveTo(l*.38,-l*.45,0,-l);c.quadraticCurveTo(-l*.38,-l*.45,0,0);c.fill();c.restore();};
  const lf=s*(.25+.2*b);[-1.9,-1.1,1.1,1.9,2.6,-2.6].forEach((a,i)=>leaf(a+Math.PI,lf*(i<4?.95:.7)));
  const L=[[7,1,0],[6,.82,.5],[5,.64,1.1],[5,.47,1.6],[4,.32,2.2],[3,.2,2.8]];
  L.forEach(([n,r,d],i)=>{
    const open=Math.max(0,Math.min(1,b*1.5-(L.length-1-i)*.07-.1)), R=s*.32*r*(.45+.55*open), dist=R*(.18+.55*open)*(1.1-.2*r), w=R*.62, h=R*.78;
    for(let k=0;k<n;k++){c.save();c.rotate(d+k*Math.PI*2/n);c.translate(0,-dist);c.rotate((1-open)*.0);
      const g=c.createRadialGradient(0,h*.55,h*.05,0,-h*.2,h*1.15);g.addColorStop(0,p[0]);g.addColorStop(.55,p[1]);g.addColorStop(1,p[2]);
      c.fillStyle=g;c.shadowColor="rgba(0,0,0,.45)";c.shadowBlur=s*.02;
      c.beginPath();c.moveTo(0,h*.6);c.bezierCurveTo(w*1.1,h*.35,w*1.05,-h*.85,w*.25,-h);c.quadraticCurveTo(0,-h*1.06,-w*.25,-h);c.bezierCurveTo(-w*1.05,-h*.85,-w*1.1,h*.35,0,h*.6);c.fill();
      c.shadowBlur=0;c.strokeStyle="rgba(255,255,255,.22)";c.lineWidth=s*.004;c.beginPath();c.moveTo(-w*.55,-h*.92);c.quadraticCurveTo(0,-h*1.1,w*.55,-h*.92);c.stroke();c.restore();}
  });
  c.restore();
}
function buildSprites(){sprites=RPAL.map(p=>Array.from({length:STAGES},(_,i)=>{const o=document.createElement("canvas");o.width=o.height=SP;drawRose(o.getContext("2d"),SP,(i+1)/STAGES,p);return o;}));}
function layoutGround(){
  const dpr=Math.min(devicePixelRatio||1,3),w=innerWidth,hc=Math.round(Math.min(innerHeight*.36,340));
  rc.width=w*dpr;rc.height=hc*dpr;rc.style.height=hc+"px";rx.setTransform(dpr,0,0,dpr,0,0);
  ground=[];const base=Math.max(86,Math.min(150,w*.14));
  [[.7,0,.62],[.85,.34,.4],[1,.58,.14]].forEach(([k,up,floor],row)=>{const s=base*k,step=s*.5;
    for(let x=-s*.2+(row%2)*step*.5;x<w+s*.3;x+=step*R(.8,1.1))ground.push({row,x,y:hc-s*floor-up*s*.22+R(-6,6),s:s*R(.92,1.1),pal:Math.random()*RPAL.length|0,d:R(0,3.4)+row*.5});});
  ground.sort((a,b)=>a.row-b.row||a.y-b.y);return hc;
}
function drawGround(t){
  const hc=parseFloat(rc.style.height),w=innerWidth;rx.clearRect(0,0,w,hc);
  const gr=rx.createLinearGradient(0,hc*.6,0,hc);gr.addColorStop(0,"rgba(8,30,12,0)");gr.addColorStop(1,"rgba(6,22,10,.85)");rx.fillStyle=gr;rx.fillRect(0,hc*.6,w,hc*.4);
  let done=true,row=0;
  for(const g of ground){
    if(g.row!==row){rx.globalCompositeOperation="source-atop";rx.fillStyle="rgba(25,0,12,.2)";rx.fillRect(0,0,w,hc);rx.globalCompositeOperation="source-over";row=g.row;}
    const b=Math.max(0,Math.min(1,(t-g.d)/2.4)); if(b<1)done=false; if(b<=0)continue;
    const e=1-Math.pow(1-b,3),i=Math.max(0,Math.min(STAGES-1,Math.round(e*STAGES)-1)),sz=g.s*(.5+.5*e);
    rx.drawImage(sprites[g.pal][i],g.x-sz/2,g.y-sz*.58+(1-e)*sz*.25,sz,sz);
  }
  return done;
}
function growRoses(){ if(!sprites.length)buildSprites(); layoutGround(); gStart=performance.now(); gDone=false;
  const f=n=>{if(gDone)return;gDone=drawGround((n-gStart)/1000);if(!gDone)requestAnimationFrame(f);else drawGround(99);};requestAnimationFrame(f);}
addEventListener("resize",()=>{if(sprites.length){layoutGround();drawGround(99);}});

// The ~30 second show
async function play(){
  const id = ++run; const ok = () => id === run;
  $("landing").classList.remove("on"); $("show").classList.add("on");
  $("replay").classList.remove("on"); $("final").classList.remove("on");
  growRoses(); scene("s0"); type($("introText"), CONFIG.introText, id, 70);
  await sleep(6200); if (!ok()) return;                              // roses bloom
  burst();
  scene("s1"); await sleep(4000); if (!ok()) return;                 // heart
  scene("s2"); burst(70); startSlides();
  await sleep(photos.length > 1 ? Math.min(22000, photos.length * 3200 + 600) : 4000); stopSlides(); if (!ok()) return;   // photo scene (longer with more photos)
  scene("s3"); burst(120); await sleep(5000); if (!ok()) return;     // 8–13s
  scene("s4");                                                       // 13–20s
  for (const [wi,w] of CONFIG.wishes.slice(0,4).entries()){ setPal(PAL.w[wi]); await type($("wish"), w, id, w.length > 60 ? 28 : 45); if (!ok()) return; await sleep(1100); }
  scene("s5"); burst(100);                                           // 20–25s+
  await type($("letter"), CONFIG.letter, id, 40); if (!ok()) return;
  $("wish").textContent = clean(CONFIG.wishes[4]);
  $("final").textContent = clean(CONFIG.final); $("final").classList.add("on"); $("replay").classList.add("on");
}

$("open").onclick = () => {
  music.volume = $("vol").value;
  music.play().catch(() => { $("musicNote").hidden = false; setTimeout(() => $("musicNote").hidden = true, 6000); });
  play();
};
music.addEventListener("error", () => { $("musicNote").hidden = false; setTimeout(() => $("musicNote").hidden = true, 6000); });
$("replay").onclick = () => { music.currentTime = 0; music.play().catch(() => {}); play(); };
$("mute").onclick = () => { music.muted = !music.muted; $("mute").textContent = music.muted ? "Muted" : "Sound"; };
$("vol").oninput = e => { music.volume = e.target.value; };
$("fs").onclick = () => document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen?.();

// ===== Watercolor-splash photo frame (original vector art, sharp at any size) =====
function buildFrame(){
  let s=11; const rnd=()=>{s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};
  const C=["#7b2fbf","#3a54c8","#ff8a1f","#ffc21a","#ff4f8b","#d6246e","#2aa6b8","#9b59d6"],W=300,H=400,per=2*(W+H),f=n=>n.toFixed(1);
  const at=t=>{t=((t%1)+1)%1*per; if(t<W)return[t,0,0,1]; t-=W; if(t<H)return[W,t,-1,0]; t-=H; if(t<W)return[W-t,H,0,-1]; t-=W; return[0,H-t,1,0];};
  const col=t=>C[Math.floor(((t*1.6+rnd()*.1)%1)*C.length)];
  let blobs="",dots="";
  const blob=(n,r0,r1,o0,o1,inw)=>{for(let i=0;i<n;i++){const t=i/n+rnd()*.01,[x,y,nx,ny]=at(t),d=rnd()*inw-8,cx=x+nx*d+(rnd()-.5)*10,cy=y+ny*d+(rnd()-.5)*10;
    blobs+=`<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(r0+rnd()*r1)}" ry="${f(r0*.8+rnd()*r1*.8)}" fill="${col(t)}" opacity="${(o0+rnd()*o1).toFixed(2)}" transform="rotate(${rnd()*180|0} ${f(cx)} ${f(cy)})"/>`;}};
  blob(72,12,26,.45,.4,14); blob(46,6,14,.55,.35,26);
  for(let i=0;i<54;i++){const t=rnd(),[x,y,nx,ny]=at(t),d=14+rnd()*52;dots+=`<circle cx="${f(x+nx*d+(rnd()-.5)*30)}" cy="${f(y+ny*d+(rnd()-.5)*30)}" r="${f(.8+rnd()*2.8)}" fill="${i%7==0?"#1b1530":col(t)}" opacity=".85"/>`;}
  for(let i=0;i<16;i++){const t=rnd(),[x,y,nx,ny]=at(t),L=14+rnd()*34,c=col(t);dots+=`<path d="M${f(x)} ${f(y)}L${f(x+nx*L)} ${f(y+ny*L)}" stroke="${c}" stroke-width="${f(.8+rnd()*1.2)}" stroke-linecap="round" opacity=".8"/><circle cx="${f(x+nx*L)}" cy="${f(y+ny*L)}" r="${f(1.5+rnd()*1.8)}" fill="${c}" opacity=".85"/>`;}
  const svg=`<svg class="wc" viewBox="-20 -20 340 440" aria-hidden="true"><defs><filter id="wcf" x="-20%" y="-20%" width="140%" height="140%"><feTurbulence type="fractalNoise" baseFrequency=".04" numOctaves="3" seed="3" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="16" xChannelSelector="R" yChannelSelector="G"/><feGaussianBlur stdDeviation=".5"/></filter></defs><rect x="7" y="7" width="286" height="386" fill="none" stroke="#d9b8ff" stroke-width=".8" opacity=".7"/><g filter="url(#wcf)">${blobs}</g>${dots}</svg>`;
  document.querySelector(".frame").insertAdjacentHTML("beforeend",svg);
}
buildFrame();
