let pMapper;
let upQuad;
let balls = [];
let numBalls = 60;

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    pMapper = createProjectionMapper(this);
    
    // create 1 quad
    upQuad = pMapper.createQuadMap(400, 400);
    // create array of circles
    for (let i = 0; i < numBalls; i++) {
        let oneBall = {
            x: random(upQuad.width),
            y: random(upQuad.height),
            d: random(10, 30),
            vy:random(-5, 5)
        };
        balls.push(oneBall);
    }
}


function draw() {
    background(0);

    // each quad runs its own function
    upQuad.displaySketch(dots);
}

function dots(mySketch) {
  mySketch.background(0,0,250);  
  mySketch.noStroke();
  mySketch.fill(250,0,20,180);
  for (let i = 0; i < numBalls; i++) {
    let ball = balls[i];
    ball.y += ball.vy;
    let r = ball.d / 2;
    if (ball.y > mySketch.width - r) {
      //ball.x = mySketch.width - r;
      ball.vy *= -1;
    }
    if (ball.y < r) {
      //ball.y = r;
      ball.vy *= -1;
    }
    mySketch.ellipse(ball.x, ball.y, ball.d, ball.d);
  }
}

// function rings(myRing){
//   myRing.noFill();
//   myRing.strokeWeight(1);
//   myRing.stroke(0,250,250);
//   //relative amount of circles
//   for(let i = 0; i <= 10; i++){
//     //seperate cicles from others
//     //push();
//     myRing.rotateY(frameCount * 0.01 + i * 1);
//     myRing.circle(upQuad.width / 2, upQuad.height / 2, i * 15);
//   }
//     //pop();
// }


function keyPressed() {
    switch (key) {
        case "c":
            pMapper.toggleCalibration();
            break;
        case "f":
            let fs = fullscreen();
            fullscreen(!fs);
            break;
        case "l":
            pMapper.load("maps/map.json");
            break;
        case "s":
            pMapper.save("map.json");
            break;
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

  // pMapper = createProjectionMapper(this);
  // polyMap = pMapper.createPolyMap(5); // how many sides?
  // triMap = pMapper.createTriMap(300, 300); // dimensions
  // quadMap = pMapper.createQuadMap(400, 400); // dimensions
  // lineMap = pMapper.createLineMap(); // just a line!
  // bezMap = pMapper.createBezierMap(); // curves, can take an argument