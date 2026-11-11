// Define a variable "video" to store the webcam video.
let video;
// Define a variable to store the HandPose model.
let handPose;
// Define a variable "hands" to store the detected hands as an array.
let hands = [];

async function setup() {
  createCanvas(1280, 960);
  pixelDensity(1);
  
  // Access the webcam video, resize it to fit the canvas, and hide it from the display.
  video = createCapture(VIDEO);
  video.size(1280, 960);
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

    stroke(255);
    strokeWeight(1);

    // index and thumb quad
    fill(255, 0, 0, 120);
    quad(t1.x, t1.y, i1.x, i1.y, i2.x, i2.y, t2.x, t2.y);

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
