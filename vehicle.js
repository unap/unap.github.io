
const maxOffset = 75;

function Vehicle(x, y, r) {
  this.pos = createVector(x + random(-maxOffset, maxOffset), y + random(-maxOffset, maxOffset));
  this.target = createVector(x, y);
  this.vel = p5.Vector.random2D();
  this.acc = createVector();
  this.r = r;
  this.maxspeed = 7;
  this.maxforce = 2;  
}

Vehicle.prototype.behaviors = function() {
  var arrive = this.arrive(this.target);
  var mouse = createVector(mouseX, mouseY);
  var flee = this.flee(mouse);

  arrive.mult(1);
  flee.mult(1.5);

  this.applyForce(arrive);
  this.applyForce(flee);
}

Vehicle.prototype.explode = function(x, y, force) {
  var arrive = this.arrive(this.target);
  var source = createVector(x, y);
  var flee = this.flee(source);

  arrive.mult(1);
  flee.mult(force);

  this.applyForce(arrive);
  this.applyForce(flee);
}

Vehicle.prototype.applyForce = function(f) {
  this.acc.add(f);
}

Vehicle.prototype.update = function() {
  this.pos.add(this.vel);
  this.vel.add(this.acc);
  this.acc.mult(0);
}

Vehicle.prototype.show = function() {
  stroke(hsl(this.pos.x, this.pos.y));
  strokeWeight(this.r);
  point(this.pos.x, this.pos.y);
}

Vehicle.prototype.arrive = function(target) {
  var desired = p5.Vector.sub(target, this.pos);
  var d = desired.mag();
  var speed = this.maxspeed;
  if (d < 100) {
    speed = map(d, 0, 100, 0, this.maxspeed);
  }
  desired.setMag(speed);
  var steer = p5.Vector.sub(desired, this.vel);
  steer.limit(this.maxforce);
  return steer;
}

Vehicle.prototype.flee = function(target) {
  var desired = p5.Vector.sub(target, this.pos);
  var d = desired.mag();
  if (d < 50) {
    desired.setMag(this.maxspeed);
    desired.mult(-1);
    var steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxforce);
    return steer;
  } else {
    return createVector(0, 0);
  }
}