// ----------------- PARTICLE SYSTEM -----------------
const options = {
  drag: 1,
  gravity: 0,
  lifespan: 161,
  maxParticles: 500,
  particleColors: [
    "155, 89, 182",
    "142, 68, 173",
    "216, 184, 255"
  ],
  particlesPerPress: 400,
  jitter: 0,
  randomness: 1,
  size: 10,
  sizeRange: 10,
  shrinkSpeed: 0.1
};

class Particle {
  constructor(opts) {
    this.lifespan = options.lifespan;
    this.color = options.particleColors[Math.floor(Math.random() * options.particleColors.length)];
    this.size = options.size + Math.random() * options.sizeRange - options.sizeRange / 2;
    this.x = opts.x;
    this.y = opts.y;

    const velXMin = -opts.leftSpread / (this.lifespan / 10);
    const velXMax = opts.rightSpread / (this.lifespan / 10);
    const velYMin = -opts.topSpread / (this.lifespan / 10);
    const velYMax = opts.bottomSpread / (this.lifespan / 10);

    const velXRange = velXMax - velXMin;
    const velYRange = velYMax - velYMin;
    const originLeftPercent = opts.leftSpread / (opts.leftSpread + opts.rightSpread);
    const originTopPercent = opts.topSpread / (opts.topSpread + opts.bottomSpread);

    this.velX = Math.random() * velXRange - velXRange * originLeftPercent;
    this.velY = Math.random() * velYRange - velYRange * originTopPercent;

    this.xOff = Math.random() * 6400;
    this.yOff = Math.random() * 6400;
    this.opacity = 1;
    this.gravity = options.gravity;
    this.drag = options.drag;
  }

  update() {
    this.velY += this.gravity;
    const randomX = noise.simplex2(this.xOff, 0);
    const randomY = noise.simplex2(this.yOff, 0);
    this.velX += randomX / (10 / options.randomness);
    this.velY += randomY / (10 / options.randomness);
    this.xOff += options.jitter;
    this.yOff += options.jitter;

    this.velX *= this.drag;
    this.velY *= this.drag;
    this.x += this.velX;
    this.y += this.velY;

    this.opacity = this.lifespan / 100;
    this.size -= options.shrinkSpeed;
    this.size = Math.max(0, this.size);
    this.lifespan -= 1;
    if (this.size <= 0.1 || this.opacity <= 0.01) this.lifespan = 0;
  }

  draw(ctx) {
    ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  }
}

class ParticleSystem {
  constructor() {
    this.particles = [];
  }

  addParticle(opts) {
    for (let i = 0; i < opts.numToAdd; i++) this.particles.push(new Particle(opts));
    while (this.particles.length > options.maxParticles) this.particles.shift();
  }

  update() { this.particles.forEach(p => p.lifespan > 0 && p.update()); }
  draw(ctx) { this.particles.forEach(p => p.draw(ctx)); }
}

// ----------------- CANVAS -----------------
let canvas = document.createElement("canvas");
let context = canvas.getContext("2d");
$(".shaker").append(canvas);

let screenWidth = window.innerWidth;
let screenHeight = window.innerHeight;

function updateCanvas() {
  screenWidth = window.innerWidth;
  screenHeight = window.innerHeight;
  canvas.width = screenWidth;
  canvas.height = screenHeight;
}
updateCanvas();
$(window).on("resize", updateCanvas);

const ps = new ParticleSystem();
function loop() {
  context.clearRect(0, 0, screenWidth, screenHeight);
  ps.update();
  ps.draw(context);
  requestAnimationFrame(loop);
}
loop();

function explode(el, x, y) {
  const rect = el.getBoundingClientRect();
  ps.addParticle({
    numToAdd: options.particlesPerPress,
    x, y,
    leftSpread: x - rect.left,
    rightSpread: rect.right - x,
    topSpread: y - rect.top,
    bottomSpread: rect.bottom - y
  });
}

// ----------------- AUDIO + LYRICS -----------------
const song = document.getElementById("song");
const lyricsPanel = document.createElement("div");
lyricsPanel.id = "lyrics-panel";

// Style the lyrics panel
lyricsPanel.style.position = "absolute";
lyricsPanel.style.bottom = "50px";       // adjust vertical position
lyricsPanel.style.width = "100%";
lyricsPanel.style.textAlign = "center";
lyricsPanel.style.color = "white";
lyricsPanel.style.fontSize = "18px";
lyricsPanel.style.fontFamily = "sans-serif";
lyricsPanel.style.pointerEvents = "none";
lyricsPanel.style.lineHeight = "1.5";
lyricsPanel.style.zIndex = "1000";       // make sure it appears on top

// Add purple outline for better visibility
lyricsPanel.style.textShadow = "1px 1px #8e44ad, -1px 1px #8e44ad, 1px -1px #8e44ad, -1px -1px #8e44ad";



// Append outside the message box
$(".shaker").append(lyricsPanel);

let currentLine = 0;

// ----------------- LYRICS -----------------
// Shifted all timestamps by +12 seconds for sync
const lyrics = [
  { time: 12, text: "My lungs are black, my heart is pure" },
  { time: 17, text: "My hands are scarred from nights before" },
  { time: 24, text: "And my hair is thin and falling out of all the wrong places" },
  { time: 30, text: "I am a little insecure" },
  { time: 35, text: "My eyes are crossed, but they're still blue" },
  { time: 40, text: "I bite my nails and tell the truth" },
  { time: 47, text: "I go from thin to overweight, day to day, I fluctuate" },
  { time: 53, text: "My skin is ink, but faded, too" },
  { time: 58, text: "But she loves me, she loves me" },
  { time: 63, text: "Why the hell she love me" },
  { time: 66, text: "When she could have anyone else?" },
  { time: 71, text: "Oh, you love me, you love me" },
  { time: 74, text: "Why the hell do you love me?" },
  { time: 77, text: "'Cause I don't even love myself" },
  { time: 82, text: "Baby, the best part of me is you" },
  { time: 93, text: "And lately, everything's making sense too" },
  { time: 101, text: "Oh, baby, I'm so in love with you" },
  { time: 116, text: "I overthink and still forgive" },
  { time: 122, text: "I lose my phone and place my bits" },
  { time: 127, text: "And I never catch the train on time" },
  { time: 131, text: "Always 30 minutes behind" },
  { time: 134, text: "Your worries ain't seen nothin' yet" },
  { time: 139, text: "But you love me, you love me" },
  { time: 142, text: "Why the hell you love me so" },
  { time: 146, text: "When you could have anyone else?" },
  { time: 150, text: "Yeah, yeah, he loves me, he loves me" },
  { time: 154, text: "And I bet he never lets me go" },
  { time: 158, text: "And shows me how to love myself" },
  { time: 162, text: "'Cause, baby, the best part of me is you (woah-oh-oh-oh)" },
  { time: 175, text: "Lately, everything's making sense too" },
  { time: 183, text: "Baby, I'm so in love with you" },
  { time: 186, text: "With you" },
  { time: 194, text: "Da-dum, da-dum, da-dum, da-dum" },
  { time: 197, text: "Baby, the best part of me is you (woah-oh-oh-oh)" },
  { time: 209, text: "Lately, everything's making sense too" },
  { time: 217, text: "Oh, baby, I'm so in love with you (oh-ooh)" },
  { time: 224, text: "Baby, I'm so in love with you (yeah, yeah)" },
  { time: 230, text: "Oh, baby, I'm so in love with you" }
];

// ----------------- SYNC LYRICS -----------------
function syncLyrics() {
  if (currentLine >= lyrics.length) return;

  const currentTime = song.currentTime;
  if (currentTime >= lyrics[currentLine].time) {
    // Replace previous line instead of appending
    lyricsPanel.innerHTML = `<p>${lyrics[currentLine].text}</p>`;
    currentLine++;
  }
  requestAnimationFrame(syncLyrics);
}

// ----------------- BUTTON HANDLERS -----------------
$("#stamp-envelope").on("click", function(e) {
  const dialog = document.querySelector(".dialog");
  explode(dialog, e.pageX, e.pageY);

  $(".dialog").hide();
  $(".message").fadeIn(2000);

  // Start song immediately
  song.currentTime = 0;
  song.play();

  // Reset lyrics
  currentLine = 0;
  lyricsPanel.innerHTML = "";

  // Start syncing lyrics after 12 seconds
  setTimeout(syncLyrics, 12000);
});

$("#stamp-footer").on("click", function() {
  $(".message").hide();
  $(".dialog").show();

  // Stop the song and reset lyrics
  song.pause();
  song.currentTime = 0;
  currentLine = 0;
  lyricsPanel.innerHTML = "";
});
