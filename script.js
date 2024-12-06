const tagSectors = [
    {color:"#020b36", label:"Damian   "},
    {color:"#ff9900", label:"Jay  "},
    {color:"#e3e3ff", label:"Phil  "},
    {color:"#d6gggb", label:"Rosie  "},
    {color:"#b3e3f4", label:"Tim  "},
    {color:"#038060", label:"Devon  "},
    {color:"#230745", label:"Adam   "},
    {color:"#e4e4ff", label:"Mykola  "},
    {color:"#d6gggb", label:"Nick  "},
  ];

wheelFunction(tagSectors, "#spin1", "#wheel1");

function wheelFunction(sectors, buttonId, canvasId)	{
  // Generate random float in range min-max:
  const rand = (m, M) => Math.random() * (M - m) + m;

  const tot = sectors.length;
  const elSpin = document.querySelector(buttonId);
  const ctx = document.querySelector(canvasId).getContext`2d`;
  const dia = ctx.canvas.width;
  const rad = dia / 2;
  const PI = Math.PI;
  const TAU = 2 * PI;
  const arc = TAU / tot;
  const friction = 0.991;  // 0.995=soft, 0.99=mid, 0.98=hard
  const angVelMin = 0.002; // Below that number will be treated as a stop
  let angVelMax = 0; // Random ang.vel. to accelerate to 
  let angVel = 0;    // Current angular velocity
  let ang = 0;       // Angle rotation in radians
  let isSpinning = false;
  let isAccelerating = false;
  let animFrame = null; // Engine's requestAnimationFrame

  //* Get index of current sector */
  const getIndex = () => Math.floor(tot - ang / TAU * tot) % tot;
  
  //* Draw sectors and prizes texts to canvas */
  const drawSector = (sector, i) => {
    const ang = arc * i;
    ctx.save();
    // COLOR
    ctx.beginPath();
    ctx.fillStyle = sector.color;
    ctx.moveTo(rad, rad);
    ctx.arc(rad, rad, rad, ang, ang + arc);
    ctx.lineTo(rad, rad);
    ctx.fill();
    // TEXT
    ctx.translate(rad, rad);
    ctx.rotate(ang + arc / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "#fff";
    ctx.font = "bold 30px sans-serif";
    ctx.fillText(sector.label, rad - 10, 10);
    //
    ctx.restore();
  };
  
  //* CSS rotate CANVAS Element */
  const rotate = () => {
    const sector = sectors[getIndex()];
    ctx.canvas.style.transform = `rotate(${ang - PI / 2}rad)`;
    elSpin.textContent = !angVel ? "SPIN" : sector.label;
    elSpin.style.background = sector.color;
  };

  const frame = () => {

    if (!isSpinning) return;

    if (angVel >= angVelMax) isAccelerating = false;

    // Accelerate
    if (isAccelerating) {
      angVel ||= angVelMin; // Initial velocity kick
      angVel *= 1.06; // Accelerate
    }
    
    // Decelerate
    else {
      isAccelerating = false;
      angVel *= friction; // Decelerate by friction  

      // SPIN END:
      if (angVel < angVelMin) {
        isSpinning = false;
        angVel = 0;
        cancelAnimationFrame(animFrame);
      }
    }

    ang += angVel; // Update angle
    ang %= TAU;    // Normalize angle
    rotate();      // CSS rotate!
  };

  const engine = () => {
    frame();
    animFrame = requestAnimationFrame(engine)
  };

  elSpin.addEventListener("click", () => {
    if (isSpinning) return;
    isSpinning = true;
    isAccelerating = true;
    angVelMax = rand(0.25, 0.40);
    engine(); // Start engine!
  });

  // INIT!
  sectors.forEach(drawSector);
  rotate(); // Initial rotation
}


//Fireworks below ----------------------------------------------------

window.human = false;

var canvasEl = document.querySelector('.fireworks');
var ctx = canvasEl.getContext('2d');
var numberOfParticules = 30;
var pointerX = 0;
var pointerY = 0;
var tap = ('ontouchstart' in window || navigator.msMaxTouchPoints) ? 'touchstart' : 'mousedown';
var colors = ['#FF1461', '#18FF92', '#5A87FF', '#FBF38C'];

function setCanvasSize() {
  canvasEl.width = window.innerWidth * 2;
  canvasEl.height = window.innerHeight * 2;
  canvasEl.style.width = window.innerWidth + 'px';
  canvasEl.style.height = window.innerHeight + 'px';
  canvasEl.getContext('2d').scale(2, 2);
}

function updateCoords(e) {
  pointerX = e.clientX || e.touches[0].clientX;
  pointerY = e.clientY || e.touches[0].clientY;
}

function setParticuleDirection(p) {
  var angle = anime.random(0, 360) * Math.PI / 180;
  var value = anime.random(50, 180);
  var radius = [-1, 1][anime.random(0, 1)] * value;
  return {
    x: p.x + radius * Math.cos(angle),
    y: p.y + radius * Math.sin(angle)
  }
}

function createParticule(x,y) {
  var p = {};
  p.x = x;
  p.y = y;
  p.color = colors[anime.random(0, colors.length - 1)];
  p.radius = anime.random(16, 32);
  p.endPos = setParticuleDirection(p);
  p.draw = function() {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI, true);
    ctx.fillStyle = p.color;
    ctx.fill();
  }
  return p;
}

function createCircle(x,y) {
  var p = {};
  p.x = x;
  p.y = y;
  p.color = '#FFF';
  p.radius = 0.1;
  p.alpha = .5;
  p.lineWidth = 6;
  p.draw = function() {
    ctx.globalAlpha = p.alpha;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI, true);
    ctx.lineWidth = p.lineWidth;
    ctx.strokeStyle = p.color;
    ctx.stroke();
    ctx.globalAlpha = 1;
  }
  return p;
}

function renderParticule(anim) {
  for (var i = 0; i < anim.animatables.length; i++) {
    anim.animatables[i].target.draw();
  }
}

function animateParticules(x, y) {
  var circle = createCircle(x, y);
  var particules = [];
  for (var i = 0; i < numberOfParticules; i++) {
    particules.push(createParticule(x, y));
  }
  anime.timeline().add({
    targets: particules,
    x: function(p) { return p.endPos.x; },
    y: function(p) { return p.endPos.y; },
    radius: 0.1,
    duration: anime.random(1200, 1800),
    easing: 'easeOutExpo',
    update: renderParticule
  })
    .add({
    targets: circle,
    radius: anime.random(80, 160),
    lineWidth: 0,
    alpha: {
      value: 0,
      easing: 'linear',
      duration: anime.random(600, 800),  
    },
    duration: anime.random(1200, 1800),
    easing: 'easeOutExpo',
    update: renderParticule,
    offset: 0
  });
}

var render = anime({
  duration: Infinity,
  update: function() {
    ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
  }
});



document.getElementById("wheel1").addEventListener("click",function(e){
  window.human = true;
  render.play();
  updateCoords(e);
  animateParticules(pointerX, pointerY);
}, false);

document.getElementById("wheel1").addEventListener("click",function(e){
  window.human = true;
  render.play();
  updateCoords(e);
  animateParticules(pointerX, pointerY);
}, false);

var centerX = window.innerWidth / 2;
var centerY = window.innerHeight / 2;


setCanvasSize();
window.addEventListener('resize', setCanvasSize, false);

//FIREWORKS END ---------------------------------------------------

// Audio

document.getElementById("spin1").addEventListener("click", function() {
  var audio = document.getElementById("myAudio");
  audio.volume = 1.0; // Set volume to 100%
  audio.play(); // Play the audio file
});

