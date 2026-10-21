// second: heart beat map : beat / s; height = ? random?
// min: eye blink / min; eye height = 500 ?
// hours: eye shrink 'x'px/h; if after 10pm? eye closed & 'x' set to 500 again;
// day & night: background color change, morning = yellow, eye = dark blue; night = dark blue, eye = yellow.

//Morning eye object
let eyeMo;
let puplMo;

//Night eye object
let eyeNi;
let puplNi;
let eyeNiWi = 340; //width
let eyeNiHi = 140; //height

//heartbeat
let heart;

//Set a comparitive variable to check whenever minute changes
let lastMin;
let blinkStart = -1000; //avoid trigger blink at start
let blink; //blinkTime length


function setup(){
  createCanvas(windowWidth, windowHeight);
  //noCursor();
  lastMin = minute();//let last minute have the curent minute first

  eyeMo = {
    x: windowWidth/2,
    y: windowHeight/4,
    w: 340,
    h: 140
  }
   puplMo = {
    x: eyeMo.x,
    y: eyeMo.y,
    d: eyeMo.h
  }


  eyeNi = {
    x1: windowWidth/2 - eyeNiWi/2,
    y1: windowHeight * 3/4,
    x2: windowWidth/2,
    y2: windowHeight * 3/4 - eyeNiHi/2,
    x3: windowWidth/2 + eyeNiWi/2,
    y3: windowHeight * 3/4,
    x4: windowWidth/2,
    y4: windowHeight * 3/4 + eyeNiHi/2
  }
  puplNi = {
    x: eyeNi.x2,
    y: eyeNi.y1,
    d: eyeNiHi/4
  }

}

function draw(){
  background(20,90,200);//20,20,200；240,240,0
  
  strokeWeight(15);
  stroke(20,20,200);
  noFill();

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
  line(puplNi.x - eyeNiWi/6, puplNi.y + eyeNiHi/3, puplNi.x - eyeNiWi/4, puplNi.y + eyeNiHi/1.5);
  line(puplNi.x - 2 * (eyeNiWi/6), puplNi.y + eyeNiHi/5, puplNi.x - 2 * (eyeNiWi/4), puplNi.y + eyeNiHi/2);
  line(puplNi.x + eyeNiWi/6, puplNi.y + eyeNiHi/3, puplNi.x + eyeNiWi/4, puplNi.y + eyeNiHi/1.5);
  line(puplNi.x + 2 * (eyeNiWi/6), puplNi.y + eyeNiHi/5, puplNi.x + 2 * (eyeNiWi/4), puplNi.y + eyeNiHi/2);



  //heart
  strokeWeight(0.4);
  line(0, windowHeight/2, windowWidth, windowHeight/2);

  //test minute changes in real-time
  if(lastMin != minute()){
    lerp(eyeMo.h, 0, 0.2);
    lastMin = minute();
    
  }
  


  if (elapsed < 150) {
    // 前 150 毫秒：高度从 100 变成 0
    let progress = elapsed / 150;
    eyeHeight = lerp(100, 0, progress);

  } else if (elapsed < 300) {
    // 后 150 毫秒：高度从 0 变成 100
    let progress = (elapsed - 150) / 150;
    eyeHeight = lerp(0, 100, progress);
  }

}

function drawEye(){

}