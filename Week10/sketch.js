// Store the current average bass energy.
let bassLevel = 0;

// Store the bass energy from the previous frame.
let previousBassLevel = 0;

// Store the strength of the visual pulse.
let bassPulse = 0;

// Set the lowest frequency to analyze, in Hz.
const BASS_LOW_HZ = 35;

// Set the highest frequency to analyze, in Hz.
const BASS_HIGH_HZ = 160;

// Minimum bass energy needed to detect a hit.
// Increase this number to ignore weaker sounds.
const BASS_HIT_MIN_LEVEL = 0.10;

// Minimum sudden increase needed to detect a hit.
// Increase this number to detect fewer hits.
const BASS_HIT_RISE = 0.035;

// Control how fast the visual pulse disappears.
// Smaller number = faster fade.
// Bigger number = slower fade.
const BASS_PULSE_FADE = 0.86;

// Maximum size multiplier for normal bass changes.
const BASS_SIZE_MAX = 1.4;

// Maximum size multiplier when a strong hit happens.
const HIT_SIZE_MAX = 2.5;

//Store 3 type of frequency for VJ background effect 
let bassEnergy = 0;
let midEnergy = 0;
let trebleEnergy = 0;

// Store the previous mid energy.
let previousMidEnergy = 0;

// Store all the white circles.
let midCircles = [];

// Minimum energy to detect a clap.
const CLAP_MIN_LEVEL = 0.3;

// Minimum sudden increase to detect a clap.
const CLAP_RISE = 0.003;

// Circle display time in frames.
const CIRCLE_LIFE = 10;

// Store the yellow background mode.
let yellowMode = false;

// Store the yellow mode button.
let yellowButton;

let songSelect;

async function setup() {
  createCanvas(640, 480);
  pixelDensity(1);

  // Create a dropdown menu for songs.
  songSelect = createSelect();

  songSelect.position(400, 500);

  // Add song options.
  songSelect.option("Original Song", "song.mp3");
  songSelect.option("Am I Dreaming", "Am I Dreaming.mp3");
  songSelect.option("Self Love", "SelfLove.mp3");

  // Set the default song.
  songSelect.selected("song.mp3");

  // Change song when an option is selected.
  songSelect.changed(changeSong);

  // Create a button to switch the yellow background.
  yellowButton = createButton("YELLOW MODE");

  // Place the button below the canvas.
  yellowButton.position(200, 500);

  // Switch between normal mode and yellow mode.
  yellowButton.mousePressed(() => {
    yellowMode = !yellowMode;
  });

  // Access the webcam video, resize it to fit the canvas, and hide it from the display.
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();
  // Wait until the HandPose model is fully loaded.
  handPose = await ml5.handPose();
  // Start detecting hands from the webcam video.
  handPose.detectStart(video, gotHands);

  // Load the music file.
  song = await loadSound("song.mp3");
  // Create an FFT analyzer with 512 frequency bands.
  fft = new p5.FFT(2048);
  // Connect the music to the FFT analyzer.
  song.connect(fft);
  // Create a Play button.
  playButton = createButton("PLAY");
  // Start the music when the button is clicked.
  playButton.mousePressed(() => {
    if (!song.isPlaying()) {
      song.play();
    }
  });

  // Create a Pause button.
  pauseButton = createButton("PAUSE");
  // Pause the music when the button is clicked.
  pauseButton.mousePressed(() => {
    if (song.isPlaying()) {
      song.pause();
    }
  });

  // Create a Stop button.
  stopButton = createButton("STOP");

  // Stop the music and return to the beginning.
  stopButton.mousePressed(() => {
    song.stop();
  });
}

function draw() {

  // Read the music spectrum.
  let spectrum = fft.analyze();

  // Analyze three frequency ranges.
  bassEnergy = getBandEnergy(spectrum, 0, 300);
  midEnergy = getBandEnergy(spectrum, 300, 6000);
  trebleEnergy = getBandEnergy(spectrum, 4000, 12000);

  // Update the bass hit detection.
  updateBassLevel(spectrum);

  // Draw the camera or yellow background.
  if (yellowMode) {
    background(255, 230, 0,80);
  } else {
    image(video, 0, 0);
  }

  // MID VISUAL
  // Detect claps.
  updateMidClaps();


  // TREBLE VISUAL
  if (yellowMode) {
    drawBassBox(bassEnergy);
    drawTrebleRings(trebleEnergy);
    drawMidCircles();
  }

  // 2 hands deteted
  if (hands.length >= 2) {
    let hand1 = hands[0];
    let hand2 = hands[1];

    //thumb, index and middle finger of hand1
    let t1 = hand1.thumb_tip;
    let i1 = hand1.index_finger_tip;
    let m1 = hand1.middle_finger_tip;

    //thumb, index and middle finger of hand2
    let t2 = hand2.thumb_tip;
    let i2 = hand2.index_finger_tip;
    let m2 = hand2.middle_finger_tip;

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

      // Keep the original blue background in normal mode.
      if (!yellowMode) {
        noStroke();
        fill(0, 20, 250);
        rect(0, 0, width, height);
      }

      // code from last week
      let stepSize = 16;

      for (let y = 0; y < video.height; y += stepSize) {
        for (let x = 0; x < video.width; x += stepSize) {
          let pixelIndex = (y * video.width + x) * 4;

          let r = video.pixels[pixelIndex];
          let g = video.pixels[pixelIndex + 1];
          let b = video.pixels[pixelIndex + 2];

          // Calculate the darkness of the current camera pixel.
          let darkness = (255 - (r + g + b) / 3) / 255;

          // Change the dot size with the overall bass energy.
          // 1 = original size, 1.4 = 40% bigger.
          let bassScale = map(
            bassLevel,
            0, 1,
            1, BASS_SIZE_MAX
          );

          // Make the dots grow when a strong bass hit happens.
          // The pulse changes from 0 to 1.
          let hitScale = map(
            bassPulse,
            0, 1,
            1, HIT_SIZE_MAX
          );

          // Calculate the final dot size.
          // Image darkness, normal bass, and strong hits all affect the size.
          let w = stepSize * darkness * bassScale * hitScale;

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

    // thumb and middle quad
    fill(0, 255, 0, 120);
    quad(t1.x, t1.y, m1.x, m1.y, m2.x, m2.y, t2.x, t2.y); 

    // index and middle quad
    fill(0, 0, 255, 120);
    quad(i1.x, i1.y, m1.x, m1.y, m2.x, m2.y, i2.x, i2.y); 

  }

}


// Callback function for when handPose outputs data
function gotHands(results) {

  // Save the output to the hands variable
  hands = results;
}

// Calculate the average energy in a frequency range.
// spectrum = all frequency data from the music.
// lowHz = the starting frequency in Hz.
// highHz = the ending frequency in Hz.
function getBandEnergy(spectrum, lowHz, highHz) {

  // Get the highest frequency that can be analyzed.
  // The sample rate is divided by 2.
  let nyquist = getAudioContext().sampleRate / 2;

  // Find the array position for the starting frequency.
  // floor() rounds the position down.
  let lo = floor(
    lowHz / nyquist * spectrum.length
  );

  // Find the array position for the ending frequency.
  // ceil() rounds the position up.
  let hi = min(
    spectrum.length - 1,
    ceil(highHz / nyquist * spectrum.length)
  );

  // Start with zero total energy.
  let sum = 0;

  // Add the energy from all selected frequency bands.
  for (let i = lo; i <= hi; i++) {
    sum += spectrum[i];
  }

  // Calculate the average energy of these bands.
  let avg = sum / (hi - lo + 1);

  // Convert the average energy into decibels.
  // Add a very small number to avoid log10(0).
  let db = 20 * Math.log10(avg + 0.000001);

  // Convert the dB value into a number from 0 to 1.
  // -100 = very quiet, -10 = very loud.
  // constrain() keeps the result between 0 and 1.
  return constrain(
    map(db, -100, -10, 0, 1),
    0,
    1
  );
}

// Analyze the music and detect strong bass hits.
function updateBassLevel(spectrum) {

  // Check if the music and FFT analyzer are ready.
  if (!song || !fft || !song.isPlaying()) {

    // Slowly return the bass energy to zero.
    bassLevel = lerp(bassLevel, 0, 0.1);

    // Save the current value as the previous value.
    previousBassLevel = bassLevel;

    // Let the visual pulse fade out.
    bassPulse *= BASS_PULSE_FADE;

    return;
  }

  // Measure the energy in the selected bass range.
  let currentBass = getBandEnergy(
    spectrum,
    BASS_LOW_HZ,
    BASS_HIGH_HZ
  );

  // Find how much the bass has increased since the last frame.
  let bassRise = currentBass - previousBassLevel;

  // Let the previous visual pulse fade a little.
  bassPulse *= BASS_PULSE_FADE;

  // Check if the bass is strong and rises quickly.
  if (
    currentBass > BASS_HIT_MIN_LEVEL &&
    bassRise > BASS_HIT_RISE
  ) {

    // Trigger a strong visual pulse.
    bassPulse = 1;
  }

  // Smooth the overall bass movement.
  // Bigger number = faster response.
  bassLevel = lerp(bassLevel, currentBass, 0.35);

  // Save the current bass value for the next frame.
  previousBassLevel = currentBass;
}

// Draw 20 circles controlled by treble energy.
function drawTrebleRings(treble) {

  push();
  translate(width / 2, height / 2);

  noFill();
  strokeWeight(2);

  // Draw 20 circles from inside to outside.
  for (let i = 0; i < 15; i++) {

    // Calculate the radius of each circle.
    let baseRadius = i * (height / 2) / 20;

    // Change from light to dark.
    stroke(255, 0, 200 /  2 * i, 255 - i * 9);

    beginShape();

    // Draw the circle with many points.
    for (let a = 0; a < TWO_PI; a += 0.06) {

      // Use noise to create an irregular edge.
      let n = noise(
        2 + cos(a) * 0.8,
        2 + sin(a) * 0.8,
        frameCount * 0.025 + i * 0.08
      );

      // Treble controls how much the circle changes.
      let distortion = (n - 0.9) * 400 * treble;

      // Calculate the final radius.
      let r = baseRadius + distortion;

      // Draw each point.
      let x = cos(a) * r;
      let y = sin(a) * r;

      vertex(x, y);
    }

    endShape(CLOSE);
  }
  pop();
}

// Draw a rectangle controlled by bass energy.
function drawBassBox(bass) {

  push();

  // Move to the center of the canvas.
  translate(width / 2, height / 2);

  // Calculate the rectangle size.
  let boxSize = 450 + bass * 250;

  // the outline.
  stroke(100,0,250);
  strokeWeight(80);
  noFill();

  // Draw the rectangle.
  rectMode(CENTER);
  rect(0, 0, boxSize, boxSize * 0.75);

  pop();
}

// Detect sudden mid frequency changes.
function updateMidClaps() {

  // Check if the mid energy suddenly increases.
  let midRise = midEnergy - previousMidEnergy;

  if (
    midEnergy > CLAP_MIN_LEVEL &&
    midRise > CLAP_RISE
  ) {

    // Create a circle at a random position.
    let newCircle = {
      x: random(width),
      y: random(height),
      size: random(20, 100),
      life: CIRCLE_LIFE
    };

    // Add the circle to the array.
    midCircles.push(newCircle);
  }

  // Save the current mid energy.
  previousMidEnergy = midEnergy;
}


// Draw and remove the circles.
function drawMidCircles() {

  noStroke();
  fill(255,255,255,200);

  // Go through all circles.
  for (let i = midCircles.length - 1; i >= 0; i--) {

    let c = midCircles[i];

    // Draw the white circle.
    circle(c.x, c.y, c.size);

    // Reduce its remaining display time.
    c.life--;

    // Remove the circle when its time is over.
    if (c.life <= 0) {
      midCircles.splice(i, 1);
    }
  }
}

// Change the current song.
function changeSong() {
  // Get the selected song file.
  let fileName = songSelect.value();

  // Check if the current song is playing.
  let wasPlaying = song && song.isPlaying();

  // Stop the current song.
  if (song) {
    song.stop();
  }

  // Load the new song.
  let newSong = loadSound(fileName, () => {
    // Play the new song if the previous song was playing.
    if (wasPlaying) {
      newSong.play();
    }
  });

  song = newSong;
}