function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(255, 255, 80);

  for(let i = 0; i < 100; i++){
    stroke(250 - i * 2.5, 80, 250, i + 155);
    strokeWeight(i / 7);
    noFill();

    push();
    rectMode(CENTER);
    translate(windowWidth / 2, windowHeight / 2);
    rotate(0.1 * i);
    rect(0, 0, i * 18, i * 10);
    pop();

  }
  
}