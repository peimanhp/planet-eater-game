const canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const c = canvas.getContext("2d");

//modal grabbing
const modal = document.getElementById("modal_container");
const winner = document.getElementById("win_message");
const playAgain = document.getElementById("play_again");
const timer = document.getElementById("timer");
const timerRecord = document.getElementById("timer_record");

//stopwatch vaiables
let seconds = 00;
let tens = 00;
let appendTens = document.getElementById("tens");
let appendSeconds = document.getElementById("seconds");
let Interval;

//game decleration
let mouse = {
  x: undefined,
  y: undefined,
};
let maxRadius = 60;
let minRadius = 20;

let colorArray = ["#EC5A5A", "#55C2B6", "#3A6AA6", "#F2C16D", "#663232"];
let redCounter = 0;
let othersCounter = 0;
let endGame = false;
let displayedModal = false;

window.addEventListener("mousemove", (e) => {
  mouse.x = e.x;
  mouse.y = e.y;
});

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

function Circle(x, y, radius, dx, dy) {
  this.x = x;
  this.y = y;
  this.dx = dx;
  this.dy = dy;
  this.radius = radius;
  this.minRadius = radius;
  this.color = colorArray[Math.floor(Math.random() * colorArray.length)];

  this.draw = function () {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
    c.fillStyle = this.color;
    c.fill();
  };

  this.update = function () {
    this.inTheWindow();

    this.x += this.dx;
    this.y += this.dy;

    if (
      mouse.x - this.x < 150 &&
      mouse.x - this.x > -150 &&
      mouse.y - this.y < 150 &&
      mouse.y - this.y > -150
    ) {
      if (mouse.x - this.x > 0) {
        this.dx += 0.1;
      } else this.dx -= 0.1;

      if (mouse.y - this.y > 0) {
        this.dy += 0.1;
      } else this.dy -= 0.1;

      if (
        mouse.x - this.x < this.radius + 10 &&
        mouse.x - this.x > -this.radius + 10 &&
        mouse.y - this.y < this.radius + 10 &&
        mouse.y - this.y > -this.radius + 10
      ) {
        this.radius -= 2;
        if (this.radius < 5) {
          this.radius = 0;
        }
      }

      if (
        mouse.x - this.x < 5 &&
        mouse.x - this.x > -5 &&
        mouse.y - this.y < 5 &&
        mouse.y - this.y > -5
      ) {
        this.radius = 0;
      }
    }

    this.draw();
  };

  this.inTheWindow = function () {
    if (this.x + this.radius >= innerWidth || this.x - this.radius <= 0) {
      this.dx *= -1;
    }

    if (this.y + this.radius >= innerHeight || this.y - this.radius <= 0) {
      this.dy *= -1;
    }
  };

  this.gravity = function () {
    let bounce = 0.7;
    let gravity = 0.2;
    this.xFriction = this.radius / 2000;

    if (this.x + this.radius >= innerWidth || this.x - this.radius <= 0) {
      this.dx *= -1;
    }
    if (
      this.y + this.radius + this.dy >= innerHeight ||
      this.y + this.radius + this.dy <= this.radius * 2
    ) {
      this.dy *= -bounce;
      if (this.dy < 0 && this.dy > -0.04 * this.radius) this.dy = 0;
      if (Math.abs(this.dx) < this.xFriction) this.dx = 0;
    }

    this.x += this.dx;
    this.y += this.dy;
    this.dy += gravity * (this.radius / 20);

    this.XF();
    this.draw();

    if (displayedModal === false) {
      if (redCounter == 0) {
        setTimeout(() => {
          winner.innerHTML = `YOU WON!`;
          timerRecord.innerHTML = `Your Record: ${timer.innerText}`;
          modal.classList.add("show");
        }, 800);
      } else {
        setTimeout(() => {
          winner.innerHTML = `YOU LOST!`;          
          modal.classList.add("show");
        }, 800);
      }
      playAgain.addEventListener("click", () => {
        window.location.reload(true);
      });
    }
    displayedModal = true;
  };

  this.XF = function () {
    if (this.dx > 0) {
      this.dx = this.dx - this.xFriction;
    }
    if (this.dx < 0) {
      this.dx = this.dx + this.xFriction;
    }
  };
}

let circleArray = [];

for (let i = 0; i < 5; i++) {
  let radius = Math.random() * minRadius + 10;
  let x = Math.random() * (innerWidth - radius * 2) + radius;
  let y = Math.random() * (innerHeight - radius * 2) + radius;
  let dx = Math.random() - 0.5;
  let dy = Math.random() - 0.5;

  let circle = new Circle(x, y, radius, dx, dy);
  circleArray.push(circle);

  if (circle.color == "#EC5A5A") {
    redCounter++;
  }
}

function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, innerWidth, innerHeight); //clear whole screen

  for (let i = 0; i < circleArray.length; i++) {
    if (circleArray[i].radius == 0) {
      if (circleArray[i].color == "#EC5A5A") redCounter--;
      else othersCounter++;
      circleArray.splice(i, 1);
      console.log(circleArray[i], circleArray.length);

      if (redCounter == 0 && othersCounter < 5 && endGame === false) {
        endGame = true;
        clearInterval(Interval);
        console.log("you won");
      }
    } else if (othersCounter == 5 && redCounter != 0 && endGame === false) {
      endGame = true;
      clearInterval(Interval);
      console.log("you lost");
    }
    if (circleArray[i] !== undefined && endGame === false)
      circleArray[i].update();
    else if (endGame === true) circleArray[i].gravity();
  }
}

animate();

//stopwatch
window.onload = function () {
  clearInterval(Interval);
  Interval = setInterval(startTimer, 10);

  function startTimer() {
    tens++;

    if (tens <= 9) {
      appendTens.innerHTML = "0" + tens;
    }

    if (tens > 9) {
      appendTens.innerHTML = tens;
    }

    if (tens > 99) {
      console.log("seconds");
      seconds++;
      appendSeconds.innerHTML = "0" + seconds;
      tens = 0;
      appendTens.innerHTML = "0" + 0;
    }

    if (seconds > 9) {
      appendSeconds.innerHTML = seconds;
    }
  }
};
