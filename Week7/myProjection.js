let pMapper;
let umbrellaA;
let umbrellaB;
let tdCanvas; // 3d rendering canvas

let angle = 0; //ring spin
let dnaSpin = 0; //dna spin

function setup() {
    //default setup for mapping
    createCanvas(windowWidth, windowHeight, WEBGL);
    pMapper = createProjectionMapper(this);

    //create 2 graphs
    umbrellaA = pMapper.createBezierMap(8);
    umbrellaB = pMapper.createBezierMap(8); //bezier shape with 8 adjustable points
    //create that 3d canvas
    tdCanvas = createGraphics(1000, 1000, WEBGL);

}


function draw() {
    background(0);

    // call display function and show 2 graphs
    umbrellaA.displaySketch(rednWhite_2d);//the 2d function
    umbrellaB.displaySketch(DNA_3d);//the 3d function: a glowing edge

}

function rednWhite_2d(myS){
    let s = second();
    //glowing effect by using shadow
    myS.drawingContext.shadowBlur = 20;
    myS.drawingContext.shadowColor = color(100, 100, 255);
    //colors
    myS.background(255);
    myS.fill(200,0,0) //red part
    myS.strokeWeight(3);
    myS.stroke(0,25,250);
    myS.translate(umbrellaA.width/2, umbrellaA.height/2); //translate coordinate to the centre
    //rotate every second: using % to calculate ramainder, single or double num
    if(s%2 == 1){
        myS.rotate(QUARTER_PI);
    }
    //red arc every 45 degrees[quarter pi]
    for (let i = 1; i <= 4; i++){
        //start point:0,90,180,270; endpoint:start point+quarterPI
        myS.arc(0, 0, umbrellaA.width, umbrellaA.height, HALF_PI*(i-1), HALF_PI*(i-1) + QUARTER_PI, PIE);
    }
}

function DNA_3d(mySketch){
    tdCanvas.background(10,50,250);

    //dna
    let dnaRadius = 80; //radius of dna
    let dnaSpacing = 20; //vertical spacing
    let dnaTwist = 0.015; //twirl density

    tdCanvas.push();
    tdCanvas.rotateY(dnaSpin);
    tdCanvas.rotateX(0.3);

    for (let y = -300; y <= 300; y += dnaSpacing) {
    //twirl as height changing
        let dnaAngle = y * dnaTwist;
        //trigonometry, learned from online
        let x1 = dnaRadius * cos(dnaAngle);//chanin 1
        let z1 = dnaRadius * sin(dnaAngle);
        let x2 = dnaRadius * cos(dnaAngle + PI);//chain2: add with half round of difference to seperate from each other
        let z2 = dnaRadius * sin(dnaAngle + PI);
        tdCanvas.stroke(255,0,200,220);//connections
        tdCanvas.strokeWeight(15);
        tdCanvas.line(x1, y, z1, x2, y, z2);
    }
    dnaSpin += 0.02;

    tdCanvas.pop();

    //ring 1 : color
    tdCanvas.fill(255,255,0);
    tdCanvas.noStroke();
    
    tdCanvas.push();
    //spinning
    tdCanvas.rotateZ(-angle * 0.1);
    tdCanvas.rotateX(angle);   
    //create ring 
    tdCanvas.torus(480, 40, 50);
    tdCanvas.pop();

    tdCanvas.push();
    //ring 2 : newColor
    tdCanvas.fill(255,255,200);
    //spinning
    tdCanvas.rotateY(angle * 0.8);
    tdCanvas.rotateX(-angle);   
    //create ring 
    tdCanvas.torus(400, 10, 50);
    tdCanvas.torus(360, 5, 50);
    tdCanvas.pop();
    angle += 0.02;

    //

    //transferring the 3d into image
    mySketch.image(tdCanvas,0,0,umbrellaB.width,umbrellaB.height);



}

function keyPressed() {
    switch (key) {
        case "c":
            pMapper.toggleCalibration();
            break;
        case "f":
            let fs = fullscreen();
            fullscreen(!fs);
            break;
        case "l":
            pMapper.load("maps/map.json");
            break;
        case "s":
            pMapper.save("map.json");
            break;
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}