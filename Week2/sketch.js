// Divide different frames into steps
let step = 0;

// Rectangle 1 height transition
let recH = 4;
let recH2 = 4;

//Rec 1 width
let recW = 1350;
let recW2 = 1350;

// Rect 2 height change
let rec_2H = 4;
let rec_2H2 = 4;

////Rec 2 width
let rec2W = 1200;
let rec2_W2 = 1200;

//Circle 1 diameter
let C1 = 1;
let C1_2 = 1;

//Circle 2 diameter
let C2 = 1;
let C2_2 = 1;

//Tri data in object; Cuz the formula is wayyyy too long;
let tri1;
let tri1_2;

let tri2;
let tri2_2;

function setup() {
  createCanvas(windowWidth, windowHeight);

  //Tri: out of screen (some math here)
  //Note: Before setup(), js cannot calculate, so we put it here
  tri1 = {
    x1: windowWidth/2, 
    x2: windowWidth / 2 - 175 * sqrt(3) / 2, 
    x3: windowWidth / 2 + 175 * sqrt(3) / 2, 
    y1: -10,
    y2: -10,
    y3: -10
  }

  tri1_2 = {
    y1: -10,
    y2: -10,
    y3: -10
  }

  tri2 = {
    x1: windowWidth/2 - 60, 
    x2: windowWidth/2 + 60, 
    x3: windowWidth/2, 
    y1: windowHeight + 10,
    y2: windowHeight + 10,
    y3: windowHeight + 10
  }
  
  tri2_2 = {
    y1: windowHeight + 10,
    y2: windowHeight + 10,
    y3: windowHeight + 10
  }

}

function draw() {
  background(10);

  stroke(0, 255, 0);
  strokeWeight(4);

  //Setting up shapes: putting in draw to make sure frames refresh for motion
  start();


}

function mousePressed(){
  //Opening shapes step by step, determine which step is it now 
  step += 1;
  //Overall 5 changes so 5 steps
   if (step > 5){
    step = 0;
   }

   // step 1 when mouse pressed
   step1();
   // step 2 when mouse pressed
   step2();
   //step 3
   step3();
   //step 4
   step4();
   //step 5
   step5();
   
}

function start(){
  //Rec 1 motion and size setting
  rectMode(CENTER);
  //noFill();
  //Gradual transition of the rect's htight
  //Note: Addressing lerp() here to make sure it keep refreshing, not once every mouse pressed
  recH = lerp (recH, recH2, 0.1);
  recW = lerp (recW, recW2, 0.1);
  if (step === 5){
    fill (8, 186, 255);
    rect(windowWidth / 2, windowHeight / 2, recW, recH);
  } else {
    noFill();
    rect(windowWidth / 2, windowHeight / 2, recW, recH);
  }
  
  //Rec 2 motion and size setting
  rec_2H = lerp (rec_2H, rec_2H2, 0.1);
  rec2W = lerp (rec2W, rec2_W2, 0.1);
  rect(windowWidth / 2, windowHeight / 2, rec2W, rec_2H);

  //draw stripes behind the circle
  if (step === 5){
    noStroke();
    fill (255, 235, 150);
    triangle(windowWidth/2, windowHeight/2, 0, 80, 0, 280);
    triangle(windowWidth/2, windowHeight/2, 0, windowHeight - 80, 0, windowHeight - 280);
    triangle(windowWidth/2, windowHeight/2, windowWidth, 80, windowWidth, 280);
    triangle(windowWidth/2, windowHeight/2, windowWidth, windowHeight - 80, windowWidth, windowHeight - 280);
  }

  //circle 1
  C1 = lerp(C1, C1_2, 0.1);
  if(step === 5){
    fill (250, 250, 0);
    circle(windowWidth/2, windowHeight/2, C1);
  } else {
    noFill();
    circle(windowWidth/2, windowHeight/2, C1);
  }

  //circle 2
  C2 = lerp(C2, C2_2, 0.1);
  if (step === 5){
    fill (0, 0, 250);
    circle(windowWidth/2, windowHeight/2, C2);
  } else {
    noFill();
    circle(windowWidth/2, windowHeight/2, C2);
  }

  //tri 1
  //WHY CANT WE PUT THE ENTIRE OBJECT IN LERP AHHHHHH!

  //Moving all the y pos of tri 1
  tri1.y1 = lerp(tri1.y1, tri1_2.y1, 0.1);
  tri1.y2 = lerp(tri1.y2, tri1_2.y2, 0.1);
  tri1.y3 = lerp(tri1.y3, tri1_2.y3, 0.1);
  triangle(tri1.x1, tri1.y1, tri1.x2, tri1.y2, tri1.x3, tri1.y3);

  //tri 2
  tri2.y1 = lerp(tri2.y1, tri2_2.y1, 0.1);
  tri2.y2 = lerp(tri2.y2, tri2_2.y2, 0.1);
  tri2.y3 = lerp(tri2.y3, tri2_2.y3, 0.1);
  triangle(tri2.x1, tri2.y1, tri2.x2, tri2.y2, tri2.x3, tri2.y3);

  //draw star and cross in the center
  if (step === 5){
    fill (8, 186, 255);
    noStroke();
    quad(windowWidth/2, windowHeight/2 + 370, windowWidth/2 + 150, windowHeight/2, windowWidth/2, windowHeight/2 - 370, windowWidth/2 - 150, windowHeight/2);
    fill (0, 230, 255);
    quad(windowWidth/2, windowHeight/2 + 130, windowWidth/2 + 280, windowHeight/2, windowWidth/2, windowHeight/2 - 130, windowWidth/2 - 280, windowHeight/2);
    fill (255, 0, 0);
    rect(windowWidth/2, windowHeight/2, 25, 90);
    rect(windowWidth/2, windowHeight/2, 90, 25);
  }

}

// 1st step : rect1 open
function step1 (){
  noFill();
  if (step === 1) {
    if (recH2 === 4){
    recH2 = 700;
   }
  }
}

// 2nd step : rec 2 open
function step2 (){
  if (step === 2) {
    if (rec_2H2 === 4){
    rec_2H2 = 600;
   }
  }
}

// 3rd step : cir 1 & 2 open
function step3(){
  if (step === 3){
    if (C1_2 === 1 && C2_2 === 1){
      C1_2 = 450;  
      C2_2 = 350;  
    }
  }
}

function step4(){
  if(step === 4){
    if (tri1_2.y1 === -10 && tri1_2.y2 === -10 && tri1_2.y3 === -10){
      //some cosin and sin fomula
      tri1_2 = {
        y1: windowHeight/2-175,
        y2: windowHeight / 2 + 175 / 2,
        y3: windowHeight / 2 + 175 / 2
      }
    }
    if (tri2_2.y1 === windowHeight + 10 && tri2_2.y2 === windowHeight + 10 && tri2_2.y3 === windowHeight + 10){
      //some assumption of heights :)
      tri2_2 = {
        y1: windowHeight/2 + 40,
        y2: windowHeight/2 + 40,
        y3: windowHeight/2 + 175
      }

    }
  } else {
    tri1_2 = {
        y1: -10,
        y2: -10,
        y3: -10
      }

    tri2_2 = {
        y1: windowHeight + 10,
        y2: windowHeight + 10,
        y3: windowHeight + 10
      }
  }

}

function step5(){
  if(step === 5){

    if(recH2 === 700 && rec_2H2 === 600){
      recH2 = windowHeight + 10;
      rec_2H2 = windowHeight + 10;
    }
    if (recW2 === 1350 && rec2_W2 === 1200){
      recW2 = windowWidth + 10;
      rec2_W2 = windowWidth + 10;
    }
    if(C1_2 === 450 && C2_2 === 350){
      C1_2 = 800;
      C2_2 = 700;
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