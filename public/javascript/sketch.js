

// Create connection to Node.JS Server
const socket = io();

let canvas;
let circles = [];

function setup() {
  canvas = createCanvas(windowWidth, windowHeight, WEBGL);
 noFill();
  createEasyCam();
  // Create initial circles
 for (let i = 0; i < 200; i++) {
  circles.push(new Circle(random(width), random(height), random(20, 50)));
}
 
}

function draw() {
  background(0);

    // Update and display circles
  for (let circle of circles) {
    circle.update();
    circle.display();
  }
}

class Circle {
  constructor(x, y, diameter) {
    this.x = x;
    this.y = y;
    this.diameter = diameter;
    this.strokeWeight = 1;
    this.speedX = random(-2, 2);
    this.speedY = random(-2, 2);
  }

  update() {
    // Move the circle
    this.x += this.speedX;
    this.y += this.speedY;

    // Bounce off the edges
    if (this.x < 0 || this.x > width) {
      this.speedX *= -1;
    }
    if (this.y < 0 || this.y > height) {
      this.speedY *= -1;
    }
  }

  display() {
    // Display the circle with multiple strokes
    for (let i = 0; i < 5; i++) {
      let alpha = map(i, 0, 4, 50, 150);
      stroke(150, 200, 250, alpha);
      strokeWeight(this.strokeWeight + i * 3);
      ellipse(this.x, this.y, this.diameter + i * 10);
    }
  }
}
//process the incoming OSC message and use them for our sketch
function unpackOSC(message){



  
          
    
    if (message.address == "/sensor/value") {
      // Update the circles' properties based on sensor values
      let sensorValue = message.args[0];
      for (let circle of circles) {
        // Map the sensor values to the range of size change (20 to 50)
        let newSize = map(sensorValue, 167, 174, 20, 50);
        circle.diameter = newSize;
  
        // Map the sensor values to the range of speed change (-2 to 2)
        let speedChange = map(sensorValue, 167, 174, -2, 2);
        circle.speedX += speedChange;
        circle.speedY += speedChange;
      }
    }
      }
  

//Events we are listening for
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// Connect to Node.JS Server
socket.on("connect", () => {
  console.log(socket.id);
});

// Callback function on the event we disconnect
socket.on("disconnect", () => {
  console.log(socket.id);
});

// Callback function to recieve message from Node.JS
socket.on("message", (_message) => {

  console.log(_message);

  unpackOSC(_message);

});