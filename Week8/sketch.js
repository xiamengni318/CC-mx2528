let capture; // object to hold the video grabber
let disp; // an offscreen canvas that hold an image to scale up

async function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  disp = createGraphics(640, 480); // start off screen video grabber
  capture = await createCapture(VIDEO);
  capture.size(640, 480);
  capture.hide(); // hide HTML video
}

function draw() {
  // create pixel array for the grabber
  capture.loadPixels();
  // do all the drawing in the offscreen graphics buffer
  disp.background(0,20,250,5);
  
  const stepSize = 10; // every 10 pixels = 1 step

  // loop through the video image
  for (let y = 0; y < capture.height; y += stepSize) {
    for (let x = 0; x < capture.width; x += stepSize) {

      // get the number in the pixel array
      const i = y * capture.width + x;

      // get the value of the pixel's brightness
      const darkness = (255 - (capture.pixels[i * 4] + capture.pixels[i * 4 + 1] + capture.pixels[i * 4 + 2]) /3) / 255;
      
      // the darker the bigger the circle is
      const w = stepSize * darkness;

      // draw out the effects
      disp.push();
      // translate to centre
      disp.translate(x + stepSize / 2, y + stepSize / 2);

      //dragging effect
      disp.push();
      disp.stroke(255, 0, 250, darkness * 180);
      disp.strokeWeight(darkness);
      disp.circle(0, 0, w);
      disp.pop();

      //fill color base on darkness, the darker the brighter the redness is
      disp.fill(darkness * 250, 0, 0);
      //color of the stroke, the darker the more solid the edge of the circle is
      disp.stroke(0, 255, 0, darkness * 255);
      //the darker the bolder the stroke is
      disp.strokeWeight(darkness * 2);
      // draw circles
      disp.circle(0, 0, w/1.3);
      disp.pop();
    }
  }
  // scale the disp to fit the entire canvas
  image(disp, 0, 0, width, height);
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