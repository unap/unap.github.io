// Most of the code by Daniel Shiffman
// https://github.com/CodingTrain/website/tree/master/CodingChallenges/CC_059_Steering_Text_Paths
//
// Modified by Panu Asikanius 2018

let font, width, height, textWidth, text, charWidth, fontSize, vehicleSize, textX, textY;
let vehicles = [];
let points;
let canvas;

function fontMiddle() {
  return fontSize * 0.3;
}

function debounce(callback, time) {
  let interval;
  return (...args) => {
    clearTimeout(interval);
    interval = setTimeout(() => {
      interval = null;
      callback(...args);
    }, time);
  };
}

let iter = 0;
function hsl(x, y) {
  const val = (x * 0.1 + iter + (y * 0.25 + iter)) % 360;

  return `hsl(${floor(val)}, 100%, 50%)`;
}
setInterval(function() {
  iter++;
}, 100);

function preload() {
  font = loadFont('Digitalt.otf');
}

function setup() {
  width = window.innerWidth;
  height = Math.max(window.innerHeight / 2, 300);

  textWidth = width * 0.8;
  text = 'Panu Asikanius';
  charWidth = textWidth / text.length;

  fontSize = charWidth * 2;
  vehicleSize = width / 250;

  textX = (width - textWidth) / 1.7;
  textY = height / 2 + fontMiddle();

  canvas = createCanvas(width, height);

  const sampleFactor = 20 / fontSize;

  points = font.textToPoints(text, textX, textY, fontSize, {
    sampleFactor: sampleFactor,
  });

  vehicles = [];
  for (let i = 0; i < points.length; i++) {
    const pt = points[i];
    const vehicle = new Vehicle(pt.x, pt.y, vehicleSize);
    vehicles.push(vehicle);
  }
  //vehicles.push(new Vehicle(width / 2, height / 2, 3));
}

const debouncedSetup = debounce(setup, 250);

window.addEventListener('resize', debouncedSetup);

function isPageVisible() {
  return !(document.hidden || document.msHidden || document.webkitHidden || document.mozHidden);
}

function randomTime() {
  return random(1500, 6000);
}

let timeouts = [];
function explosion() {
  if (timeouts.length > 500) {
    resetTimeouts();
    return;
  }
  const randomIndex = floor(random(0, points.length - 1));
  const pt = points[randomIndex];
  const y = textY - fontMiddle();

  const force = random(4, 13);
  if (isPageVisible()) {
    for (let i = 0; i < vehicles.length; i++) {
      const v = vehicles[i];
      v.explode(pt.x, y, force);
    }
  }
  //timeouts.push(setTimeout(explosion, randomTime()));
  timeouts.push(setTimeout(explosion, randomTime()));
}
timeouts.push(setTimeout(explosion, 2000));

function resetTimeouts() {
  for (var timeout of timeouts) {
    clearTimeout(timeout);
  }
  timeouts = [];
  timeouts.push(setTimeout(explosion, randomTime()));
}

function draw() {
  background(0);
  fill('white');
  for (let i = 0; i < vehicles.length; i++) {
    const v = vehicles[i];
    v.show();
    v.behaviors();
    v.update();
  }
}
