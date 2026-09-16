

function setup() {
  createCanvas(windowWidth, windowHeight);
  
}

function draw() {
  background(40);
  noFill();
  for (let i = 0; i <= 60; i++){
    stroke(0, 255, 5 * i);
    circle(mouseX, mouseY, i * 10);
    circle(windowWidth/2, windowHeight/2, i * 10);
  }
  
}
