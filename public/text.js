var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var cw = canvas.width = window.innerWidth,
  cx = cw / 2;
var ch = canvas.height = window.innerHeight,
  cy = ch / 2;
ctx.strokeStyle = "#fff";

var requestId = null;
var rad = Math.PI / 180;

var colors = ["#6A0000", "#900000", "#902B2B", "#A63232", "#A62626", "#FD5039", "#C12F2A", "#FF6540", "#f93801"];
//var colors = ["#66C2FF", "#48819C", "#205487", "#1DA7D1", "#1FC3FF"];

var spring = 1 / 10;
var friction = .85;
var explosions = [];

function Particle(o) {
  this.decay = .95; //randomIntFromInterval(80, 95)/100;//
  this.r = randomIntFromInterval(10, 70);
  this.R = 100 - this.r;
  this.angle = Math.random() * 2 * Math.PI;
  this.center = o; //{x:cx,y:cy} 
  this.pos = {};
  this.pos.x = this.center.x + this.r * Math.cos(this.angle);
  this.pos.y = this.center.y + this.r * Math.sin(this.angle);
  this.dest = {};
  this.dest.x = this.center.x + this.R * Math.cos(this.angle);
  this.dest.y = this.center.y + this.R * Math.sin(this.angle);
  this.color = colors[~~(Math.random() * colors.length)];
  this.vel = {
    x: 0,
    y: 0
  };
  this.acc = {
    x: 0,
    y: 0
  };

  this.update = function() {
    var dx = (this.dest.x - this.pos.x);
    var dy = (this.dest.y - this.pos.y);

    this.acc.x = dx * spring;
    this.acc.y = dy * spring;
    this.vel.x += this.acc.x;
    this.vel.y += this.acc.y;

    this.vel.x *= friction;
    this.vel.y *= friction;

    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;

    if (this.r > 0) this.r *= this.decay;
  }

  this.draw = function() {

    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, this.r, 0, 2 * Math.PI);
    ctx.fill();

  }

}

function Explosion() {

  this.pos = {
    x: Math.random() * cw,
    y: Math.random() * ch
  };
  this.particles = [];
  for (var i = 0; i < 50; i++) {
    this.particles.push(new Particle(this.pos));
  }

  this.update = function() {
    for (var i = 0; i < this.particles.length; i++) {
      this.particles[i].update();
      if (this.particles[i].r < .5) {
        this.particles.splice(i, 1)
      }
    }

  }

  this.draw = function() {
    for (var i = 0; i < this.particles.length; i++) {
      this.particles[i].draw();
    }
  }
}

function Draw() {
  requestId = window.requestAnimationFrame(Draw);
  ctx.clearRect(0, 0, cw, ch);
  ctx.globalCompositeOperation = "lighter";
  if (Math.random() < .1) {
    explosions.push(new Explosion());
  }

  for (var j = 0; j < explosions.length; j++) {

    explosions[j].update();
    explosions[j].draw();

  }

}
var Init = function() {
  if (requestId) {
    window.cancelAnimationFrame(requestId);
    requestId = null;
  }
  cw = canvas.width = window.innerWidth,
    cx = cw / 2;
  ch = canvas.height = window.innerHeight,
    cy = ch / 2;

  Draw();
}

window.setTimeout(function() {
  Init();
  window.addEventListener('resize', Init, false);
}, 15);

function randomIntFromInterval(mn, mx) {
  return Math.floor(Math.random() * (mx - mn + 1) + mn);
}
