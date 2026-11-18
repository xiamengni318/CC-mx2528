// ======================================================
// 3D AUDIO-REACTIVE VJ
// p5.js 2.3.4 + p5.sound 0.4.2
// ======================================================


// ------------------------------------------------------
// AUDIO VARIABLES
// ------------------------------------------------------

// Store the music file.
let song;

// Store the frequency analyzer.
let fft;

// Store the volume analyzer.
let amp;

// Store the current bass energy.
let bassLevel = 0;

// Store the current treble energy.
let trebleLevel = 0;

// Store the current overall volume.
let volumeLevel = 0;


// ------------------------------------------------------
// PARTICLE VARIABLES
// ------------------------------------------------------

// Store all particles in an array.
let particles = [];

// Set the number of particles.
const PARTICLE_COUNT = 80;


// ------------------------------------------------------
// VISUAL VARIABLES
// ------------------------------------------------------

// Store the current cube size.
let cubeSize = 90;

// Store the current background brightness.
let backgroundLevel = 0;


// ------------------------------------------------------
// TEMPO VARIABLES
// ------------------------------------------------------

// Store the previous bass value.
let previousBass = 0;

// Store the time of the previous detected beat.
let lastBeatTime = 0;

// Store the estimated music speed in BPM.
let estimatedBPM = 90;

// Store how confident the tempo estimate is.
let tempoConfidence = 0;


// ------------------------------------------------------
// BUTTON VARIABLES
// ------------------------------------------------------

let playButton;
let pauseButton;
let stopButton;
let audioStatus;


// ------------------------------------------------------
// PARAMETERS TO ADJUST
// ------------------------------------------------------

// Choose the bass frequency range in Hz.
const BASS_LOW_HZ = 35;
const BASS_HIGH_HZ = 180;

// Choose the treble frequency range in Hz.
const TREBLE_LOW_HZ = 2500;
const TREBLE_HIGH_HZ = 10000;

// Set the sound level that makes the cube reach maximum size.
// Lower value = more sensitive.
const VOLUME_FULL_SCALE = 0.18;

// Set the smallest cube size.
const CUBE_MIN_SIZE = 65;

// Set the largest cube size.
const CUBE_MAX_SIZE = 175;

// Set the minimum bass energy for detecting a beat.
const BEAT_MIN_LEVEL = 0.12;

// Set how much bass must suddenly increase to detect a beat.
const BEAT_RISE_THRESHOLD = 0.045;

// Set the minimum time between two detected beats, in milliseconds.
const BEAT_COOLDOWN = 260;

// Set the slow tempo reference in BPM.
const SLOW_BPM = 72;

// Set the fast tempo reference in BPM.
const FAST_BPM = 145;

// Set how smoothly the background changes.
// Smaller value = slower color transition.
const BACKGROUND_SMOOTHING = 0.025;


// ------------------------------------------------------
// SETUP
// ------------------------------------------------------

async function setup() {

  // Create a 3D canvas.
  createCanvas(640, 480, WEBGL);

  // Keep the pixel density low for better performance.
  pixelDensity(1);

  // Limit the frame rate to 30 FPS.
  frameRate(30);

  // Create the particle cloud.
  createParticles();

  // Create the music controls.
  createMusicButtons();

  // Load the music file.
  song = await loadSound("song.mp3");

  // Create an FFT analyzer with 512 frequency bands.
  fft = new p5.FFT(512);

  // Connect the music to the FFT analyzer.
  song.connect(fft);

  // Create an amplitude analyzer.
  amp = new p5.Amplitude(0.8);

  // Connect the music to the volume analyzer.
  song.connect(amp);

  // Show that the music is ready.
  audioStatus.html("Song loaded. Press PLAY.");

}


// ------------------------------------------------------
// MUSIC BUTTONS
// ------------------------------------------------------

function createMusicButtons() {

  // Create the Play button.
  playButton = createButton("PLAY");

  // Place the button below the canvas.
  playButton.position(10, 500);

  // Play the music when clicked.
  playButton.mousePressed(() => {
    if (song && !song.isPlaying()) {
      song.play();
    }
  });


  // Create the Pause button.
  pauseButton = createButton("PAUSE");

  // Place the button.
  pauseButton.position(70, 500);

  // Pause the music when clicked.
  pauseButton.mousePressed(() => {
    if (song && song.isPlaying()) {
      song.pause();
    }
  });


  // Create the Stop button.
  stopButton = createButton("STOP");

  // Place the button.
  stopButton.position(140, 500);

  // Stop the music when clicked.
  stopButton.mousePressed(() => {
    if (song) {
      song.stop();
    }
  });


  // Create a text label for the music status.
  audioStatus = createP("Loading song.mp3...");

  // Place the status text below the canvas.
  audioStatus.position(10, 520);

}


// ------------------------------------------------------
// MAIN DRAW LOOP
// ------------------------------------------------------

function draw() {

  // Update the music information.
  updateAudio();

  // Draw the background according to the music tempo.
  drawAudioBackground();

  // Add soft ambient light.
  ambientLight(35);

  // Add a green light near the center.
  pointLight(100, 255, 150, 0, -100, 200);

  // Draw the irregular wave rings.
  drawWaveRings();

  // Draw the central particle cloud.
  drawParticles();

  // Draw the rotating transparent cube.
  drawVolumeCube();

  // Display the current audio values.
  drawDebugInfo();

}

// ------------------------------------------------------
// UPDATE AUDIO VALUES
// ------------------------------------------------------

function updateAudio() {

  // Check whether the music is ready and playing.
  if (!song || !song.isPlaying()) {

    // Slowly reduce the bass value.
    bassLevel = lerp(bassLevel, 0, 0.05);

    // Slowly reduce the treble value.
    trebleLevel = lerp(trebleLevel, 0, 0.05);

    // Slowly reduce the volume value.
    volumeLevel = lerp(volumeLevel, 0, 0.05);

    // Slowly return the background to black.
    backgroundLevel = lerp(backgroundLevel, 0, 0.025);

    // Slowly reduce tempo confidence.
    tempoConfidence = lerp(tempoConfidence, 0, 0.02);

    return;
  }

  // Read the current frequency spectrum.
  let spectrum = fft.analyze();

  // Measure the current bass energy.
  let bassRaw = getBandEnergy(
    spectrum,
    BASS_LOW_HZ,
    BASS_HIGH_HZ
  );

  // Measure the current treble energy.
  let trebleRaw = getBandEnergy(
    spectrum,
    TREBLE_LOW_HZ,
    TREBLE_HIGH_HZ
  );

  // Smooth the bass movement.
  bassLevel = lerp(bassLevel, bassRaw, 0.22);

  // Smooth the treble movement.
  trebleLevel = lerp(trebleLevel, trebleRaw, 0.20);

  // Read the current overall volume.
  let rawVolume = amp.getLevel();

  // Convert the volume into a value from 0 to 1.
  let volumeTarget = constrain(
    map(rawVolume, 0, VOLUME_FULL_SCALE, 0, 1),
    0,
    1
  );

  // Smooth the volume movement.
  volumeLevel = lerp(volumeLevel, volumeTarget, 0.18);

  // Detect the rhythm from sudden bass changes.
  updateTempo(bassRaw);

}


// ------------------------------------------------------
// DETECT THE MUSIC TEMPO
// ------------------------------------------------------

function updateTempo(currentBass) {

  // Get the current time in milliseconds.
  let now = millis();

  // Find how much the bass has increased.
  let bassRise = currentBass - previousBass;

  // Check if a strong bass hit has happened.
  if (
    bassRise > BEAT_RISE_THRESHOLD &&
    currentBass > BEAT_MIN_LEVEL &&
    now - lastBeatTime > BEAT_COOLDOWN
  ) {

    // Calculate the time between two detected hits.
    if (lastBeatTime > 0) {

      let beatInterval = now - lastBeatTime;

      // Accept only reasonable beat intervals.
      if (beatInterval >= 300 && beatInterval <= 1500) {

        // Convert the beat interval into BPM.
        let newBPM = 60000 / beatInterval;

        // Smooth the estimated BPM.
        estimatedBPM = lerp(estimatedBPM, newBPM, 0.25);

        // Increase confidence after detecting more beats.
        tempoConfidence = min(1, tempoConfidence + 0.3);

      }
    }

    // Save the current beat time.
    lastBeatTime = now;

  }

  // Save the current bass value for the next frame.
  previousBass = currentBass;

  // Check if the music has stopped producing clear beats.
  if (lastBeatTime > 0 && now - lastBeatTime > 2500) {

    // Slowly reduce the tempo confidence.
    tempoConfidence = lerp(tempoConfidence, 0, 0.025);

  }

  // Convert BPM into a background brightness value.
  let tempoBrightness = map(
    estimatedBPM,
    SLOW_BPM,
    FAST_BPM,
    0,
    1,
    true
  );

  // Reduce the brightness when tempo confidence is low.
  let targetBackground = tempoBrightness * tempoConfidence;

  // Smooth the background transition.
  backgroundLevel = lerp(
    backgroundLevel,
    targetBackground,
    BACKGROUND_SMOOTHING
  );

}


// ------------------------------------------------------
// DRAW THE AUDIO-REACTIVE BACKGROUND
// ------------------------------------------------------

function drawAudioBackground() {

  // Create a black-to-neon-green color transition.
  let red = 40 * backgroundLevel;

  let green = 255 * backgroundLevel;

  let blue = 20 * backgroundLevel;

  // Draw the new background color.
  background(red, green, blue);

}

// ------------------------------------------------------
// CREATE PARTICLES
// ------------------------------------------------------

function createParticles() {

  // Use a fixed random seed.
  randomSeed(12);

  // Create particles one by one.
  for (let i = 0; i < PARTICLE_COUNT; i++) {

    // Give each particle a random position on a sphere.
    let theta = random(TWO_PI);

    let phi = random(PI);

    // Give each particle a different distance from the center.
    let radius = random(35, 115);

    // Give each particle a different original size.
    let baseSize = random(1.5, 3.5);

    // Give each particle a different movement phase.
    let phase = random(TWO_PI);

    // Save the particle information.
    particles.push({
      theta: theta,
      phi: phi,
      radius: radius,
      baseSize: baseSize,
      phase: phase
    });

  }

}


// ------------------------------------------------------
// DRAW PARTICLES
// ------------------------------------------------------

function drawParticles() {

  // Get the current time in seconds.
  let t = millis() / 1000;

  // Make all particles slightly bigger when bass is stronger.
  let bassScale = map(bassLevel, 0, 1, 0.8, 2.6);

  // Rotate the whole particle cloud slowly.
  push();

  rotateY(t * 0.15);
  rotateX(t * 0.07);

  // Draw each particle.
  for (let p of particles) {

    // Add a little movement to the particle distance.
    let movingRadius = p.radius + sin(t + p.phase) * 5;

    // Calculate the 3D particle position.
    let x = cos(p.theta + t * 0.08) *
            sin(p.phi) * movingRadius;

    let y = cos(p.phi) * movingRadius;

    let z = sin(p.theta + t * 0.08) *
            sin(p.phi) * movingRadius;

    // Calculate the current particle size.
    let particleSize = p.baseSize * bassScale;

    // Move to the particle position.
    push();

    translate(x, y, z);

    // Remove the particle outline.
    noStroke();

    // Give the particle a glowing green material.
    emissiveMaterial(120, 255, 175);

    // Draw a small 3D sphere.
    sphere(particleSize, 5, 4);

    pop();

  }

  pop();

}

// ------------------------------------------------------
// DRAW IRREGULAR WAVE RINGS
// ------------------------------------------------------

function drawWaveRings() {

  // Get the current time.
  let t = millis() / 1000;

  // Make the wave movement stronger with higher treble.
  let waveAmplitude = map(trebleLevel, 0, 1, 4, 38);

  // Draw three different circular rings.
  for (let ring = 0; ring < 3; ring++) {

    // Save the current drawing settings.
    push();

    // Give each ring a different 3D rotation.
    rotateX(0.45 + ring * 0.35);

    rotateY(t * 0.12 + ring * 0.5);

    rotateZ(ring * 0.65);

    // Draw only the curve outline.
    noFill();

    // Use different green and cyan colors.
    stroke(
      80 + ring * 40,
      255,
      170 + ring * 25,
      210
    );

    // Set the curve thickness.
    strokeWeight(1.5);

    // Start drawing the curved line.
    beginShape();

    // Use 140 points to create a smooth circle.
    for (let i = 0; i < 140; i++) {

      // Convert the current position into an angle.
      let angle = TWO_PI * i / 140;

      // Create the first wave movement.
      let wave1 = sin(
        angle * (5 + ring) + t * (1.2 + trebleLevel * 2)
      ) * waveAmplitude;

      // Create the second wave movement.
      let wave2 = sin(
        angle * 9 - t * 1.5 + ring
      ) * waveAmplitude * 0.35;

      // Change the radius with the two waves.
      let radius = 135 + ring * 28 + wave1 + wave2;

      // Add movement along the Z axis.
      let z = sin(
        angle * 4 + t * 1.5 + ring
      ) * (5 + trebleLevel * 28);

      // Calculate the 3D position of this point.
      let x = cos(angle) * radius;

      let y = sin(angle) * radius;

      // Add the point to the curve.
      vertex(x, y, z);

    }

    // Connect the last point to the first point.
    endShape(CLOSE);

    // Restore the drawing settings.
    pop();

  }

}

// ------------------------------------------------------
// DRAW THE VOLUME-REACTIVE CUBE
// ------------------------------------------------------

function drawVolumeCube() {

  // Convert the current volume into a cube size.
  let targetSize = map(
    volumeLevel,
    0,
    1,
    CUBE_MIN_SIZE,
    CUBE_MAX_SIZE
  );

  // Smooth the size change.
  cubeSize = lerp(cubeSize, targetSize, 0.14);

  // Get the current time.
  let t = millis() / 1000;

  // Start drawing the cube.
  push();

  // Rotate the cube around three axes.
  rotateX(t * 0.45);

  rotateY(t * 0.65);

  rotateZ(t * 0.25);

  // Draw the transparent cube surface.
  noStroke();

  // Use low transparency for the cube.
  fill(70, 255, 110, 35);

  // Create the cube.
  box(cubeSize);

  // Draw bright green cube edges.
  noFill();

  stroke(160, 255, 180, 220);

  strokeWeight(1.5);

  // Draw the cube wireframe.
  drawCubeEdges(cubeSize * 1.01);

  // Finish drawing the cube.
  pop();

}


// ------------------------------------------------------
// DRAW THE 12 EDGES OF THE CUBE
// ------------------------------------------------------

function drawCubeEdges(size) {

  // Calculate half of the cube size.
  let s = size / 2;

  // Store the eight cube corners.
  let corners = [
    [-s, -s, -s],
    [ s, -s, -s],
    [ s,  s, -s],
    [-s,  s, -s],
    [-s, -s,  s],
    [ s, -s,  s],
    [ s,  s,  s],
    [-s,  s,  s]
  ];

  // Store the connections between the corners.
  let edges = [
    [0, 1], [1, 2], [2, 3], [3, 0],
    [4, 5], [5, 6], [6, 7], [7, 4],
    [0, 4], [1, 5], [2, 6], [3, 7]
  ];

  // Draw each edge.
  for (let edge of edges) {

    // Get the starting corner.
    let a = corners[edge[0]];

    // Get the ending corner.
    let b = corners[edge[1]];

    // Connect the two corners with a line.
    line(
      a[0], a[1], a[2],
      b[0], b[1], b[2]
    );

  }

}

// ------------------------------------------------------
// CALCULATE FREQUENCY ENERGY
// ------------------------------------------------------

function getBandEnergy(spectrum, lowHz, highHz) {

  // Get the highest frequency that can be analyzed.
  let nyquist = getAudioContext().sampleRate / 2;

  // Find the first array position for the selected frequency.
  let lo = floor(
    lowHz / nyquist * spectrum.length
  );

  // Find the last array position for the selected frequency.
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

  // Calculate the average energy.
  let avg = sum / (hi - lo + 1);

  // Convert the average into decibels.
  let db = 20 * Math.log10(avg + 0.000001);

  // Convert the result into a value from 0 to 1.
  return constrain(
    map(db, -100, -10, 0, 1),
    0,
    1
  );

}


// ------------------------------------------------------
// SHOW AUDIO VALUES ON THE SCREEN
// ------------------------------------------------------

function drawDebugInfo() {

  // Save the current drawing settings.
  push();

  // Reset the 3D transformations for the text.
  resetMatrix();

  // Move the text to the upper-left corner.
  translate(-width / 2 + 14, -height / 2 + 14, 0);

  // Use white text.
  fill(255);

  // Remove the text outline.
  noStroke();

  // Set the text size.
  textSize(12);

  // Align the text to the left.
  textAlign(LEFT, TOP);

  // Display the current bass energy.
  text("BASS: " + bassLevel.toFixed(2), 0, 0);

  // Display the current treble energy.
  text("TREBLE: " + trebleLevel.toFixed(2), 0, 18);

  // Display the current overall volume.
  text("VOLUME: " + volumeLevel.toFixed(2), 0, 36);

  // Display the estimated music tempo.
  text("BPM: " + Math.round(estimatedBPM), 0, 54);

  // Display the current background brightness.
  text("BACKGROUND: " + backgroundLevel.toFixed(2), 0, 72);

  // Restore the drawing settings.
  pop();

}