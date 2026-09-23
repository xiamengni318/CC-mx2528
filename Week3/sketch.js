function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(15);

  for (let x = 0; x < 9; x++) {
    for (let y = 0; y < 9; y++) {

      let eyeX = x * 160 + 80;
      let eyeY = y * 100 + 50;

      // distance from this eye to the center of the screen
      let d = dist(eyeX, eyeY, windowWidth / 2, windowHeight / 2);

      // farther from center = more transparent; mapping = keep the range within a certain number
      let alpha = map(d, 0, windowWidth / 2, 255, 20);
      // farther = smaller 
      let size = map(d, 0, windowWidth / 2, 160, 60);

      // eye
      fill(255, alpha);
      noStroke();
      strokeWeight(1);
      ellipse(eyeX, eyeY, size, size * 0.5);

      // direction toward my mouse; atan2 = calculate the angle of 2 number
      let angle = atan2(mouseY - eyeY, mouseX - eyeX);

      // pupil position
      let pupilX = eyeX + cos(angle) * 25;
      let pupilY = eyeY + sin(angle) * 15;

      // pupil
      fill(0);
      noStroke();
      ellipse(pupilX, pupilY, size / 3 , size / 3);
    }
  }
}