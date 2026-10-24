let pMapper;
let leftQuad;
let rightQuad;
let three_dee; // 3d rendering instance
let angle = 0.01; // angle to rotate

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    pMapper = createProjectionMapper(this);

    // create two quads
    leftQuad = pMapper.createQuadMap(400, 400);
    rightQuad = pMapper.createQuadMap(400, 400);

    // create an off screen drawing context for the 3d surface
    three_dee = createGraphics(400, 400, WEBGL);
}


function draw() {
    background(0);

    // each quad runs its own function
    rightQuad.displaySketch(stripes);
    leftQuad.displaySketch(itsABox);
}


function itsABox(mySketch) {
    // we do all the drawing to the 3d canvas
    three_dee.background(0);
    three_dee.rotateX(angle);
    three_dee.rotateY(-angle);
    three_dee.box();
    // and write it as an image in the 
    // sketch that gets rendered to the surface
    mySketch.image(three_dee, 0, 0);
}

function stripes(yourSketch) {
    yourSketch.background("orange");
    yourSketch.stroke(255);
    yourSketch.strokeWeight(5);
    for (let i = 0; i < 400; i += 40) {
        yourSketch.line(i, 0, i, 400);
    }
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