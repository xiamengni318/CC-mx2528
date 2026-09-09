// change the quotes in this array. Be mindful of the quotation marks!
// this is the only part of the file you need to edit!

const quotes = [
  { text: "where order becomes ENERGYYY", source: "Mengni" },
  { text: "creating things in the process", source: "Greenberg" },
  { text: "a new interdisciplinary art form that bridges the gap between\ntechnologists and artists", source: "Moussa" },
  { text: "a process, based on exploration, iteration, reflection and discovery", source: "Mitchell & Bown" },
  { text: "conceptualizing abstract thinking and makes it a visual result through coding", source: "Kim" },
  { text: "a creative dialogue with the computer", source: "Rodenbroker" },
  { text: "a practice and attitude toward programming that treats code as\na material for exploration and expression", source: "Stig" },
  { text: "making art with code", source: "Bryant" }
];
// no need to edit anything below this line! 
// if you have made an error, you can check your history to see what might have gone wrong

// a variable that holds the current quote
let current = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Seed with millis() so each page load gives a different quote.
  randomSeed(millis());
  textSize(32);
  fill(10, 255, 10);
  // calls the function to pick a quote
  pickQuote();
}

function pickQuote() {
  // take a random number and use that to identify what quote to use
  current = quotes[floor(random(quotes.length))];
}

function draw() {
  background(255, 20, 250); // set the background color
  drawQuote();  // draw the quote on screen
}

function drawQuote() {   // draw text
  textAlign(CENTER, CENTER);
  text("Creative Coding is.....", width / 2, height / 2 - 48);
  textStyle(BOLD);
  text("'" + current.text + "'", width / 2, height / 2);
  textAlign(RIGHT, CENTER);
  text("-" + current.source, width - 100, height - 100);

}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function newQuote() {
  pickQuote();
  redraw();
}

function mousePressed() {
  newQuote();
}
