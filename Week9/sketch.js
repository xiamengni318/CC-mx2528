// Define a variable "video" to store the webcam video.
let video;
// Define a variable to store the HandPose model.
let handPose;
// Define a variable "hands" to store the detected hands as an array.
let hands = [];

async function setup() {
  createCanvas(1280, 960);
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
  // Loop through the "hands" array to fetch each detected hand.
  for (let i = 0; i < hands.length; i++) {
    // Iterate through all the keypoints of the current hand.
    let hand = hands[i];
    for (let j = 0; j < hand.keypoints.length; j++) {
      let keypoint = hand.keypoints[j];
      // Finally, draw a green circle at the location of the keypoint.
      fill(0, 255, 0);
      noStroke();
      circle(keypoint.x, keypoint.y, 10);
    }
  }
}


// Callback function for when handPose outputs data
function gotHands(results) {


  // Save the output to the hands variable
  hands = results;
}
