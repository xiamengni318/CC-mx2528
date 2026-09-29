p5.disableFriendlyErrors = true; // keep warnings quiet
let bDoExportSvg = false; 

function setup() {
  createCanvas(576, 384);
}


function keyPressed(){
  if (key == 's'){ 
    bDoExportSvg = true; 
  }
}

function draw(){
  background(255); 
  if (bDoExportSvg){
    beginRecordSvg("myOutput.svg");
  }

  // Draw stuff here, such as:

  for (let i = 0; i < 4; i++){
    for(let v = 0; v < 8; v++){
    stroke(1);
    noFill();
    rectMode(CENTER);
    rect(50 + i * v * 60, 384 / 2, i * 10 - 25, i * 60 + 35);
    }
  }



  for (let x = 0; x < 5; x++) {
    for (let y = 0; y < 6; y++) {

      let eyeX = x * 110 + 60;
      let eyeY = y * 60 + 40;

      // distance from this eye to the center of the screen
      let d = dist(eyeX, eyeY, 576 / 2, 384 / 2);

      // farther from center = more transparent; mapping = keep the range within a certain number
      let alpha = map(d, 0, 576 / 2, 255, 20);
      // farther = smaller 
      let size = map(d, 0, 576 / 2, 160, 60);

      // eye
      noFill();
      strokeWeight(1);
      ellipse(eyeX, eyeY, size * 1.2, size * 0.5);

      // direction toward my mouse; atan2 = calculate the angle of 2 number
      let angle = atan2(mouseY - eyeY, mouseX - eyeX);

      // pupil position
      let pupilX = eyeX + cos(angle) * 25;
      let pupilY = eyeY + sin(angle) * 15;

      // pupil
      noFill();
      strokeWeight(1);
      ellipse(pupilX, pupilY, size / 3 , size / 3);
    }
  }

  if (bDoExportSvg){
    endRecordSvg();
    bDoExportSvg = false;
  }
}




    // push();
    // rectMode(CENTER);
    // translate(windowWidth / 2, windowHeight / 2);
    // rotate(0.1 * i);
    // rect(0, 0, i * 18, i * 10);
    // pop();