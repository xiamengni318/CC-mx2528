function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(15);

  translate(windowWidth / 2, windowHeight / 2);
  //ploar fomula
  for (let angle = 0; angle < TWO_PI; angle += 0.3) {

    let r = 150;

    let x = r * cos(angle);
    let y = r * sin(angle);

    push();

    translate(x, y);
    rotate(angle);

    fill(0, 150, 200, 80);
    noStroke();

    ellipse(0, 0, 180, 80);

    fill(0, 100, 255, 60);
    ellipse(0, 0, 80, 80);

    fill(200, 100, 255, 60);
    ellipse(60, 180, 60, 200);

    fill(200, 0, 0, 80);
    ellipse(90, 200, 170, 30);

    fill(0, 250, 0, 20);
    rect(300, 0, 180, 80);

    fill(0, 0, 250, 100);
    rect(250, 100, 10, 80);

    fill(250, 250, 20, 80);
    rect(170, 200, 150, 60);

    pop();
  }
  
  // center
  fill(255, 0, 250);
  ellipse(0, 0, 80, 80);

  
}