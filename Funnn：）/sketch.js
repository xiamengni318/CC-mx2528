
let x = 0;
let incX = 0.01;

let y = 0;
let incY = 0.008;

function setup() {
  createCanvas(windowWidth, windowHeight);
  
}

function draw() {
  background(30,20);
  noFill();
  for (let i = 0; i <= 60; i++){
    stroke(0, 255, 5 * i);
    strokeWeight(1);
    circle(mouseX, mouseY, i * 10);
    circle(windowWidth/2, windowHeight/2, i * 10);
  }
  
  //sin fomula?
  let xPos = ((sin(x) + 1) /2) * width;
  let yPos = ((sin(y) + 1) /2) * height;

  fill (100, 200, 200);
  strokeWeight(0.5);
  stroke(0,255, 0);
  ellipse(xPos, yPos, 50);

  x += incX;
  y += incY;
}
