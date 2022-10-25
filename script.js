const canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const c = canvas.getContext("2d");

// c.fillStyle = 'rgba(0, 250, 0, 0.5)'
// c.fillRect(250, 250, 100, 100);

// c.beginPath();
// c.moveTo(100, 100);
// c.lineTo(100, 200);
// c.lineTo(200, 400);
// c.closePath();
// c.strokeStyle = "#ff0000";
// c.stroke();

// c.beginPath();
// c.arc(350, 350, 50, 0, Math.PI * 2, true);
// c.stroke();

// let x = Math.random() * innerWidth;
// let y = Math.random() * innerHeight;
// let radius = 50;
// let dx = 10;
// let dy = 20;
// function animate() {
//     requestAnimationFrame(animate);
//     c.clearRect(0, 0, innerWidth, innerHeight);

//     c.beginPath();
//     c.arc(x, y, radius, 0, Math.PI * 2, true);
//     c.stroke();

//     if (x + radius > innerWidth || x - radius < 0) {
//         dx *= -1;
//     }

//     if (y + radius > innerHeight || y - radius < 0) {
//       dy *= -1;
//     }

//     x += dx;
//     y += dy;
// }
// animate();

function Circle(x, y, radius, dx, dy) {
  this.x = x;
  this.y = y;
  this.dx = dx;
  this.dy = dy;
  this.radius = radius;

  this.draw = function () {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
    c.stroke();
  };

  this.update = function () {
    if (this.x + this.radius > innerWidth || this.x - this.radius < 0) {
      this.dx *= -1;
    }

    if (this.y + this.radius > innerHeight || this.y - this.radius < 0) {
      this.dy *= -1;
    }

    this.x += this.dx;
    this.y += this.dy;

    this.draw();
  };
}

let circleArray = [];

for (let i = 0; i < 100; i++) {
    let radius = 50;
    let x = Math.random() * (innerWidth - radius * 2) + radius;
    let y = Math.random() * (innerHeight - radius * 2) + radius;
    let dx = Math.random() - 0.5 * 10;
    let dy = Math.random() - 0.5 * 10;

    let circle = new Circle(x, y, radius, dx, dy);
    circleArray.push(circle);
}

console.log(circleArray);

function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, innerWidth, innerHeight); //clear whole screen

  for (let i = 0; i < circleArray.length; i++) {
      circleArray[i].update();    
  }
}

animate();
