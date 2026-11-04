let capture; // object to hold the video grabber
let rot = 0.0; // rotation
let disp; // hold an image to scale up

async function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  disp = createGraphics(640, 480);
  // start video grabber
  capture = await createCapture(VIDEO);
  capture.size(640, 480);
  capture.hide(); // hide HTML video
  noFill();
  background(25);
}

function draw() {
  // create pixel array for the grabber
  capture.loadPixels();
  // do all the drawing in the offscreen graphics buffer
  disp.background(0,0,250,20);
  
  const stepSize = 10; // every 20 pixels
  // loop through the video image
  for (let y = 0; y < capture.height; y += stepSize) {
    for (let x = 0; x < capture.width; x += stepSize) {
      // magic algo to get the number in the pixel array
      const i = y * capture.width + x;
      // get the value of the pixel's brightness
      // r+g+b/3 will give us a general sense of brightness
      const darkness =
        (255 - (capture.pixels[i * 4] + capture.pixels[i * 4 + 1] + capture.pixels[i * 4 + 2]) /3) / 255;
      // determine width of the rect to draw
      const w = stepSize * darkness;

      // all the following happens offscreen
      // draw the rects
      disp.push();
      // move the translation
      disp.translate(x + stepSize / 2, y + stepSize / 2);
      disp.fill(darkness * 250, 50, 50);
      // set the color
      disp.stroke(0, 255, 0, darkness * 255);
      //disp.rectMode(CENTER);
      disp.rotate(rot);
      disp.strokeWeight(darkness * 2);
      // draw it
      disp.circle(0, 0, w);
      disp.pop();
    }
  }
  // draw the offscreen image to scale across the
  // entire canvas
  image(disp, 0, 0, width, height);
  rot += 0.02;
}

// redraw when viewport is resized
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// fullscreen
function keyPressed() {
  switch (key) {
    case "f":
      let fs = fullscreen();
      // if we are currently in fs, go back
      // if not, go big
      fullscreen(!fs);
      break;
  }
}