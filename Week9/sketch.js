// Define a variable "video" to store the webcam video.
let video;
// Define a variable to store the HandPose model.
let handPose;
// Define a variable "hands" to store the detected hands as an array.
let hands = [];

async function setup() {
  createCanvas(640, 480);
  pixelDensity(1);

  // Access the webcam video, resize it to fit the canvas, and hide it from the display.
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();
  // Wait until the HandPose model is fully loaded.
  handPose = await ml5.handPose();
  // Start detecting hands from the webcam video.
  handPose.detectStart(video, gotHands);
}

function draw() {
  background(220);
  image(video, 0, 0);

  // 2 hands deteted
  if (hands.length >= 2) {
    let hand1 = hands[0];
    let hand2 = hands[1];

    //thumb, index and middle finger of hand1
    let t1 = hand1.thumb_tip;
    let i1 = hand1.index_finger_tip;
    let m1 = hand1.middle_finger_tip;
    let r1 = hand1.ring_finger_tip;

    //thumb, index and middle finger of hand2
    let t2 = hand2.thumb_tip;
    let i2 = hand2.index_finger_tip;
    let m2 = hand2.middle_finger_tip;
    let r2 = hand2.ring_finger_tip;

    video.loadPixels();
    if (video.pixels.length > 0) {
      
      // save the current frame, using save and restore here to avoid image glitch, 
      // because it will run too many time of clipping
      drawingContext.save();

      // draw the shape by using finger position
      drawingContext.beginPath();
      drawingContext.moveTo(t1.x, t1.y);
      drawingContext.lineTo(i1.x, i1.y);
      drawingContext.lineTo(i2.x, i2.y);
      drawingContext.lineTo(t2.x, t2.y);
      drawingContext.closePath();

      //start clipping, restrict the drawing within this shape
      drawingContext.clip();

      // add a layer of solid color before drawing dots, so it covers the camera
      noStroke();
      fill(0,20,250);
      rect(0, 0, width, height);

      // code from last week
      let stepSize = 16;

      for (let y = 0; y < video.height; y += stepSize) {
        for (let x = 0; x < video.width; x += stepSize) {
          let pixelIndex = (y * video.width + x) * 4;

          let r = video.pixels[pixelIndex];
          let g = video.pixels[pixelIndex + 1];
          let b = video.pixels[pixelIndex + 2];

          // find the darkness
          let darkness = (255 - (r + g + b) / 3) / 255;
          let w = stepSize * darkness;

          push();
          translate(x + stepSize / 2, y + stepSize / 2);

          // dots
          fill(darkness * 250, 0, 0);
          stroke(0, 255, 0, darkness * 255);
          strokeWeight(darkness * 2);
          circle(0, 0, w / 1.3);

          pop();
        }
      }

      // clear the canvas state, avoid infinite clipping, 
      // also! not influencing the codes after this
      drawingContext.restore();
    }

    // other fingers
    stroke(255);
    strokeWeight(1);

    // // index and thumb quad
    // fill(255, 0, 0, 120);
    // quad(t1.x, t1.y, i1.x, i1.y, i2.x, i2.y, t2.x, t2.y);

    // thumb and middle quad
    fill(0, 255, 0, 120);
    quad(t1.x, t1.y, m1.x, m1.y, m2.x, m2.y, t2.x, t2.y); 

    // index and middle quad
    fill(0, 0, 255, 120);
    quad(i1.x, i1.y, m1.x, m1.y, m2.x, m2.y, i2.x, i2.y); 

    // ring and middle quad
    fill(0, 255, 255, 150);
    quad(r1.x, r1.y, m1.x, m1.y, m2.x, m2.y, r2.x, r2.y);

  }

}


// Callback function for when handPose outputs data
function gotHands(results) {


  // Save the output to the hands variable
  hands = results;
}
