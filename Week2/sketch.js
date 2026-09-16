// Divide different frames into steps
let step = 0;

// Rectangle 1 height transition
let recH = 4;
let recH2 = 4;

// Rect 2 height change
let rec_2H = 4;
let rec_2H2 = 4;

function setup() {
  createCanvas(windowWidth, windowHeight);
  
}

function draw() {
  background(10);

  stroke(0, 255, 0);
  strokeWeight(4);
  noFill();

  step0();


}

function mousePressed(){
   step += 1;

   if (step > 5){
    step = 0;
   }
   step1();
   step2();
   // step 1 when mouse pressed
   
}

function step0(){
  rectMode(CENTER);
  recH = lerp (recH, recH2, 0.1);
  rect(windowWidth / 2, windowHeight / 2, 1350, recH);
  
  rec_2H = lerp (rec_2H, rec_2H2, 0.1);
  rect(windowWidth / 2, windowHeight / 2, 1200, rec_2H);


}


// 1st step : rect1 open
function step1 (){
  if (step === 1) {
    if (recH2 === 4){
    recH2 = 700;
   }
  }
}

// 2nd step : 
function step2 (){
  if (step === 2) {
    if (rec_2H2 === 4){
    rec_2H2 = 500;
   }
  }
}


// translate() - the origin points
// noStroke() 
// strokeWeight
//colorMode(mode, max1, max2, max3, maxA) - RGB / HSB
// rotate() - rotate by origin
// angleMode(DEGREES);
// push(); & pop();
// console.log("XPos:"+ xPos...);
// mousepPressed();
// random(min,max);