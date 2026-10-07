let myButton;
let myInput;
let myText;
let stuff;
let bgColor;


function setup() {

  myButton = createButton('submit');

  myInput = createInput('type a color');

  myInput.position(20,20);

  myButton.position(myInput.position + 80, 20);

}


function draw(){
  bgColor = color(myInput.value());


}

function typing(){
  stuff = this.value();
}

//Html, sliders, input, buttons, colors, css