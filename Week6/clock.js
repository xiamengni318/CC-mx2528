// second: heart beat map : beat / s; height = ? random? 60 beats on a line
// min: eye blink / min; eye height = 500 ? 60 rotating circles?
// hours: 5am - 5pm, 12 color blocks.
// day & night: background color change, morning = yellow, eye = dark blue; night = dark blue, eye = yellow.

//Morning eye object
let eyeMo;
let puplMo;

//Night eye object
let eyeNi;
let puplNi;

//In general
let eyeWi = 340; //width
let eyeHi = 140; //height

//control the lerp of eye closing
let eyeClo = 140;

//heartbeat
let beatHeights = [];
let lastBeatSecond = -1;

//Set a comparitive variable to check whenever minute changes
let lastMin;

function setup(){
  createCanvas(windowWidth, windowHeight,WEBGL);
  //noCursor();
  lastMin = minute();//let last minute have the curent minute first

}

function draw(){
  background(240,240,0);//20,20,200；240,240,0

  //WEBGL mode's origin is at the centre
  translate(-width / 2, -height / 2);

  //============================
  //Hour color block transition
  //the night color
  fill(20,20,200);
  noStroke();
  //Color cover the screen 1/12 more every hour, all bright on 12 pm, all dark on 12pm
  //12 hour reading: from 0-12pm count yellow level for time, from 12pm-0am count blue level
  rect(0, 0, windowWidth, windowHeight/12 * abs((hour()-12)));
  //clear the depth of rect so it doesn't affect my circles
  drawingContext.clear(drawingContext.DEPTH_BUFFER_BIT);

  //=======
  //heart
  drawHeart();

  //===============
  //Minute circles
  noFill();
  strokeWeight(1);
  //relative amount of circles
  for(let i = 0; i <= minute(); i++){
    //seperate cicles from others
    push();
    //translate the rotate origin to center
    translate(width / 2, height / 2);
    rotateY(frameCount * 0.01 + i * 0.5);
    //the outest circle is solid
    if(i == minute()){
      stroke(0,250,250,255);
      circle(0,0, i * 15);
    }else{
      //others keep certain transparency
      stroke(0,250,250,i*2);
      circle(0, 0, i * 15);
    }
    pop();
  }
  //clear depth of circles
  drawingContext.clear(drawingContext.DEPTH_BUFFER_BIT);

  //=======
  //EYES
  strokeWeight(15);
  stroke(20,20,200);
  //eye objects data here, keep changing the values so must be in draw
  createEye();
  //draw eyes
  drawEye();
  //blink once every minute
  blink();
}


//organized functions

function createEye(){
  eyeMo = {
    x: windowWidth/2,
    y: windowHeight/4,
    w: eyeWi,
    h: eyeHi
  }
   puplMo = {
    x: eyeMo.x,
    y: eyeMo.y,
    d: eyeMo.h
  }

  eyeNi = {
    x1: windowWidth/2 - eyeWi/2,
    y1: windowHeight * 3/4,
    x2: windowWidth/2,
    y2: windowHeight * 3/4 - eyeHi/2,
    x3: windowWidth/2 + eyeWi/2,
    y3: windowHeight * 3/4,
    x4: windowWidth/2,
    y4: windowHeight * 3/4 + eyeHi/2
  }
  puplNi = {
    x: eyeNi.x2,
    y: eyeNi.y1,
    d: eyeHi/4
  }

}

function drawEye(){
  //Morning eye opened
  ellipse(eyeMo.x, eyeMo.y, eyeMo.w, eyeMo.h);
  circle(puplMo.x,puplMo.y,puplMo.d);
  //cross in the eye and morning eye's eyelash
  line(puplMo.x - 2.2*(puplMo.d/3), puplMo.y - 2.2*(puplMo.d/3), puplMo.x + puplMo.d/3, puplMo.y + puplMo.d/3);
  line(puplMo.x + 2.2*(puplMo.d/3), puplMo.y - 2.2*(puplMo.d/3), puplMo.x - puplMo.d/3, puplMo.y + puplMo.d/3);
  line(puplMo.x, puplMo.y - puplMo.d, puplMo.x, puplMo.y - puplMo.d/2);

  //Night eye
  stroke(240,240,0);
  quad(eyeNi.x1, eyeNi.y1, eyeNi.x2, eyeNi.y2, eyeNi.x3, eyeNi.y3, eyeNi.x4, eyeNi.y4);
  fill(240,240,0);
  circle(puplNi.x, puplNi.y, puplNi.d);
  //eyelash
  line(puplNi.x - eyeWi/6, puplNi.y + eyeHi/3, puplNi.x - eyeWi/4, puplNi.y + eyeHi/1.5);
  line(puplNi.x - 2 * (eyeWi/6), puplNi.y + eyeHi/5, puplNi.x - 2 * (eyeWi/4), puplNi.y + eyeHi/2);
  line(puplNi.x + eyeWi/6, puplNi.y + eyeHi/3, puplNi.x + eyeWi/4, puplNi.y + eyeHi/1.5);
  line(puplNi.x + 2 * (eyeWi/6), puplNi.y + eyeHi/5, puplNi.x + 2 * (eyeWi/4), puplNi.y + eyeHi/2);

}

function blink(){
  //blink animation
  eyeHi = lerp(eyeHi, eyeClo, 0.1);

  //test minute changes in real-time and close eyes
  if (lastMin !== minute()) {
    eyeClo = 0;
    lastMin = minute();
  }
  //open eyes after eye almost closed
  if (eyeHi < 1){
    eyeClo = 140;
  }
}

function drawHeart() {

  let y = windowHeight / 2;
  let spacing = windowWidth / 60; // divide the width into 60 pieces
  let beats = second() + 1; // beat per second

  noFill();
  strokeWeight(1);
  stroke(250, 0, 200);

  //draw the beats
  for (let i = 0; i < beats; i++) {
    let x = i * spacing;

    beginShape();
    vertex(x, y);
    vertex(x + spacing * 0.3, y);
    vertex(x + spacing * 0.4, y + 8);
    vertex(x + spacing * 0.5, y - 30);
    vertex(x + spacing * 0.6, y + 15);
    vertex(x + spacing * 0.75, y);
    vertex(x + spacing, y);
    endShape();
  }
}