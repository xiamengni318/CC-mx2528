// Map area on the canvas
let mapLeft;
let mapRight;
let mapTop = 120;
let mapBottom = 710;

// Geographic boundaries
let mapBounds = {
  minLon: -74.26,
  maxLon: -73.70,
  minLat: 40.49,
  maxLat: 40.92
};

// NYC map data
let boroughMap = null;

// Squirrel observation data
let squirrelObservations = [];
let squirrelLoadFailed = false;
let squirrelLoaded = false;


function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont("monospace");
  // Keep the real geographic proportions
  let middleLat = (mapBounds.minLat + mapBounds.maxLat) / 2;
  let geoRatio = (mapBounds.maxLon - mapBounds.minLon) * cos(radians(middleLat)) / (mapBounds.maxLat - mapBounds.minLat);
  let mapWidth = (mapBottom - mapTop) * geoRatio;
  mapLeft = (width - mapWidth) / 2;
  mapRight = mapLeft + mapWidth;

  // Load NYC borough boundaries
  let mapURL = "https://data.cityofnewyork.us/api/v3/views/gthc-hcne/query.geojson?accessType=DOWNLOAD";
  //Call back function: same as async, run after finishing downloading the map
  loadJSON(mapURL,loadMap);
  loadSquirrelData();

}

function loadMap (link) {
  boroughMap = link;
}


function draw() {
  background(5);
  drawHeader();
  drawGrid();
  drawBoroughBoundaries();
  drawSquirrelPoints();
  //drawTestPoint();
  drawFooter();

}

// Get today's date
function getTodayDate() {
  let now = new Date();
  let year = now.getFullYear();
  let month = String(now.getMonth() + 1).padStart(2, "0");
  //new function here padStart: put 0 before the number if there aren't '2' digits, e.g. 4 -> 04
  let day = String(now.getDate()).padStart(2, "0");
  return year + "-" + month + "-" + day;
}

// Load squirrel observations from NEW iNaturalist API
function loadSquirrelData() {
  let today = getTodayDate();
  let url = "https://api.inaturalist.org/v1/observations?" +
    //species
    "taxon_id=46017" +
    //has geometri position
    "&geo=true" +
    // Today's observation date
    //"&d1=" + today +
    //"&d2=" + today +
    //south
    "&swlat=" + mapBounds.minLat +
    //west
    "&swlng=" + mapBounds.minLon +
    //north
    "&nelat=" + mapBounds.maxLat +
    //east
    "&nelng=" + mapBounds.maxLon +
    //max 100
    "&per_page=100" +
    //order in time
    "&order_by=observed_on" +
    //from new to old
    "&order=desc";

  console.log("Requesting squirrel data:", url);
  loadJSON(url,squirrelDataLoaded,squirrelDataFailed);
}

// If data loads successfully
function squirrelDataLoaded(data) {
  console.log("API response:", data);
  console.log("Total results:", data.total_results);
  // Get the actual observation array
  squirrelObservations = data.results;
  console.log("Squirrel observations:",squirrelObservations.length);

  // Check the first observation

  let firstSquirrel = squirrelObservations[0];

  console.log("First squirrel:", firstSquirrel);

  console.log("Latitude:", firstSquirrel.latitude);

  console.log("Longitude:", firstSquirrel.longitude);
}

function drawHeader() {
  noStroke();
  fill(255);
  textSize(22);
  text("SQUIRREL WATCH", 240, 48);
  fill(130);
  textSize(10);
  text("/ NEW YORK OBSERVATION MAP /", 220, 70);
  textAlign(LEFT);

}

function drawGrid() {
  let columns = 20;
  let rows = 20;
  strokeWeight(1);

  // Vertical lines
  for (let i = 0; i <= columns; i++) {
    let x = map(i,0,columns,mapLeft,mapRight);
    stroke(255, 35);
    line(x,mapTop,x,mapBottom);

    // Longitude labels
    let longitude = map(i,0,columns,mapBounds.minLon,mapBounds.maxLon);
    noStroke();
    fill(130);
    textSize(10);
    text(longitude.toFixed(2),x - 18,mapBottom + 22);//toFixed(2):keep 2 digits after point

  }

  // Horizontal lines
  for (let i = 0; i <= rows; i++) {
    let y = map(i,0,rows,mapTop,mapBottom);
    stroke(255, 35);
    line(mapLeft,y,mapRight,y);

    // Latitude labels
    let latitude = map(i,0,rows,mapBounds.maxLat,mapBounds.minLat);
    noStroke();
    fill(130);
    textAlign(RIGHT);
    textSize(10);
    text(latitude.toFixed(2),mapLeft - 12,y + 3);
    textAlign(LEFT);

  }

  // Outer map border
  noFill();
  stroke(255, 90);
  rect(mapLeft,mapTop,mapRight - mapLeft,mapBottom - mapTop);

}

function drawBoroughBoundaries() {
  // Wait until the API data arrives
  if (boroughMap === null) {
    return;
  }
  noFill();
  stroke(255, 180);
  strokeWeight(1.2);

  // Read every borough, note: type here are strings from the data
  for (let i = 0; i < boroughMap.features.length; i++) {
    let geometry = boroughMap.features[i].geometry;
    // A borough can be a Polygon
    if (geometry.type === "Polygon") {
      drawPolygon(geometry.coordinates);
    }
    // Or a MultiPolygon
    else if (geometry.type === "MultiPolygon") {
      //note here: multiple polyons create this shape so we need a for loop to run through them seperately
      for (let j = 0; j < geometry.coordinates.length; j++) {
        drawPolygon(geometry.coordinates[j]);
      }
    }
  }
}

function drawPolygon(rings) {
  // Each ring contains geographic coordinates
  for (let i = 0; i < rings.length; i++) {
    let ring = rings[i];
    beginShape();
    for (let j = 0; j < ring.length; j++) {
      let longitude = ring[j][0];
      let latitude = ring[j][1];
      // Convert geographic coordinates into canvas coordinates
      let x = lonToX(longitude);
      let y = latToY(latitude);
      vertex(x, y);
    }
    endShape(CLOSE);
  }
}

function drawSquirrelPoints() {
  // Read every squirrel observation
  for (let i = 0; i < squirrelObservations.length; i++) {
    let observation = squirrelObservations[i];
    // Get geographic coordinates
    let longitude = Number(observation.geojson.coordinates[0]);
    let latitude = Number(observation.geojson.coordinates[1]);

    // Convert geographic coordinates into canvas coordinates
    let x = lonToX(longitude);
    let y = latToY(latitude);

    // Draw a small white glowing point
    noStroke();
    fill(255, 35);
    circle(x, y, 12);
    fill(255);
    circle(x, y, 3);
  }
}

// If data fails to load
function squirrelDataFailed(error) {
  squirrelLoadFailed = true;
  console.error("Could not load squirrel data:", error);
}

//The Toy
// function drawTestPoint() {
//   // Approximate Central Park coordinate
//   let longitude = -73.9654;
//   let latitude = 40.7829;
//   let x = lonToX(longitude);
//   let y = latToY(latitude);

//   // Crosshair
//   stroke(255, 100);
//   line(x - 12, y, x + 12, y);
//   line(x, y - 12, x, y + 12);

//   // center point
//   noStroke();
//   fill(0,255,0);
//   circle(x, y, 5);

//   // Label
//   fill(180);
//   textSize(10);
//   text("CENTRAL PARK / TEST POINT",x + 14,y - 10);

// }

// Mapping the Longitude to canvas's X position
function lonToX(longitude) {
  return map(longitude,mapBounds.minLon,mapBounds.maxLon,mapLeft,mapRight);

}

// same thing, mapping the Latitude -> Y position, but notice here canvas and map are opposite in its direction, easy mistake
function latToY(latitude) {
  return map(latitude,mapBounds.minLat,mapBounds.maxLat,mapBottom,mapTop);

}

function drawFooter() {
  noStroke();
  fill(110);
  textSize(10);
  textAlign(RIGHT);

  if (squirrelLoadFailed) {
    text("SQUIRREL DATA: ERROR", width - 40, height - 30);
  } else {
    text("SQUIRRELS: " + squirrelObservations.length, width - 40,height - 30);
  }
}