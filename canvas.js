const canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const c = canvas.getContext("2d");

//modal grabbing
const modal = document.getElementById("modal_container");
const winner = document.getElementById("win_message");
const playAgain = document.getElementById("play_again");
const timerOnTop = document.getElementById("timer");
const timerRecord = document.getElementById("timer_record");
const untilVictory = document.getElementById("red_countdown");
const untilDefeat = document.getElementById("others_countdown");
const startMessage = document.getElementById("start_message");
const plusOne = document.getElementById("plus_one");
const minusOne = document.getElementById("minus_one");
let hue = 0;

//stopwatch vaiables
let minute = 00;
let second = 00;
let count = 00;
let timer = false;

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
let circleArray = [];
let circleNumbers = 50;
let redCircleNumbers = circleNumbers / 5;
let othersToLoose = Math.ceil(circleNumbers / 10);
let toDefeat = othersToLoose;
let speedDown = false;
let reverseGravity = false;
let stopMovement = false;

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

  //setting 1/5 of circles to red color
  if (redCircleNumbers > 0) this.color = colorArray[0];
  else
    this.color = colorArray[Math.ceil(Math.random() * (colorArray.length - 1))];

  this.draw = function () {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
    c.fillStyle = this.color;
    c.fill();
    c.closePath();
  };

  this.update = function () {
    this.inTheWindow();
    this.moveCircles();
    this.mouseGravity();
    this.eatingCircles();
    this.draw();
  };

  this.powerUpSlow = function () {
    if (toDefeat <= Math.ceil(circleNumbers / 20)) {
      this.moveCircles();
    }
    this.color = "hsl(" + hue + ",100%,50%)";

    //eating circle
    if (
      mouse.x - this.x < 20 &&
      mouse.x - this.x > -20 &&
      mouse.y - this.y < 20 &&
      mouse.y - this.y > -20
    ) {
      this.radius -= 2;
      if (this.radius <= 0) {
        speedDown = true;
        setTimeout(() => {
          speedDown = false;
        }, 7000);
      }
    }
    this.draw();
  };

  this.powerUpAntiG = function () {
    if (redCounter <= Math.ceil(circleNumbers / 10)) {
      this.moveCircles();
    }
    this.color = "hsl(" + hue + ",100%,50%)";
    if (
      mouse.x - this.x < 20 &&
      mouse.x - this.x > -20 &&
      mouse.y - this.y < 20 &&
      mouse.y - this.y > -20
    ) {
      this.radius -= 2;
      if (this.radius <= 0) {
        reverseGravity = true;
        stopMovement = true;
        setTimeout(() => {
          reverseGravity = false;
        }, 7000);
      }
    }

    this.draw();
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
          timerRecord.innerHTML = `Your Record: ${timerOnTop.innerText}`;
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

  // function & animations on show and hide +1 -1
  this.plusMinusOneFunc = function () {
    if (this.color == colorArray[0]) {
      plusOne.style.left = `${this.x}px`;
      plusOne.style.top = `${this.y}px`;
      plusOne.classList.add("show");
      let animation = anime.timeline({});
      animation
        .add({
          targets: "#plus_one",
          scale: 2,
          rotate: "1turn",
        })
        .add({
          targets: "#plus_one",
          scale: 0,
          rotate: 0,
          duration: 500,
        });
      setTimeout(() => {
        plusOne.classList.remove("show");
      }, 1000);
    } else {
      minusOne.style.left = `${this.x}px`;
      minusOne.style.top = `${this.y}px`;
      minusOne.classList.add("show");
      let animation = anime.timeline({});
      animation
        .add({
          targets: "#minus_one",
          scale: 2,
          rotate: "1turn",
        })
        .add({
          targets: "#minus_one",
          scale: 0,
          rotate: 0,
          duration: 500,
        });
      setTimeout(() => {
        minusOne.classList.remove("show");
      }, 1000);
    }
  };

  this.inTheWindow = function () {
    if (
      this.x + this.radius + this.dx >= innerWidth ||
      this.x + this.dx - this.radius <= 0
    ) {
      this.dx *= -1;
    }

    if (
      this.y + this.radius + this.dy >= innerHeight ||
      this.y + this.dy - this.radius <= 0
    ) {
      this.dy *= -1;
    }
  };

  this.moveCircles = function () {
    if (speedDown === true) {
      this.x += this.dx / 5;
      this.y += this.dy / 5;
    }
    // else if (stopMovement === true) {
    //   this.dx *= -1;
    //   this.dy *= -1;
    // }
    else {
      this.x += this.dx;
      this.y += this.dy;
    }
  };

  this.mouseGravity = function () {
    if (
      mouse.x - this.x < 170 &&
      mouse.x - this.x > -170 &&
      mouse.y - this.y < 170 &&
      mouse.y - this.y > -170
    ) {
      if (reverseGravity === false) {
        if (mouse.x - this.x > 0) {
          this.dx += 0.1;
        } else this.dx -= 0.1;

        if (mouse.y - this.y > 0) {
          this.dy += 0.1;
        } else this.dy -= 0.1;
      }
      // else {
      //     this.dx *= -1;
      //     this.dy *= -1;
      // }
    }
  };

  this.eatingCircles = function () {
    if (
      mouse.x - this.x < this.radius + 10 &&
      mouse.x - this.x > -this.radius + 10 &&
      mouse.y - this.y < this.radius + 10 &&
      mouse.y - this.y > -this.radius + 10
    ) {
      this.radius -= 2;
      if (this.radius < 5) {
        this.radius = 0;
        this.plusMinusOneFunc();
      }
    }

    if (
      mouse.x - this.x < 5 &&
      mouse.x - this.x > -5 &&
      mouse.y - this.y < 5 &&
      mouse.y - this.y > -5
    ) {
      this.radius = 0;
      this.plusMinusOneFunc();
    }
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

for (let i = 0; i < circleNumbers; i++) {
  let radius = Math.random() * minRadius + 10;
  let x = Math.random() * (innerWidth - radius * 2) + radius;
  let y = Math.random() * (innerHeight - radius * 2) + radius;
  let dx = Math.random() * 10 - 5;
  let dy = Math.random() * 10 - 5;

  let circle = new Circle(x, y, radius, dx, dy);
  circleArray.push(circle);
  if (redCircleNumbers > 0) redCircleNumbers--;

  if (circle.color == colorArray[0]) {
    redCounter++;
  }
}
let slowMotion = new Circle(-30, -30, 20, 4, 2.2);
// let antiGravity = new Circle(-30, -30, 20, 4, 2.2);

untilVictory.innerText = `Until Victory: ${redCounter}`;
untilDefeat.innerText = `Until Defeat: ${toDefeat}`;

function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, innerWidth, innerHeight); //clear whole screen

  for (let i = 0; i < circleArray.length; i++) {
    if (circleArray[i].radius == 0) {
      function reduceCircle() {
        if (circleArray[i].color == colorArray[0]) {
          redCounter--;
          untilVictory.innerText = `Until Victory: ${redCounter}`;
        } else othersCounter++;
        toDefeat = othersToLoose - othersCounter;
        untilDefeat.innerText = `Until Defeat: ${toDefeat}`;
        circleArray.splice(i, 1);
      }
      reduceCircle();

      // select winner
      if (
        redCounter == 0 &&
        othersCounter < othersToLoose &&
        endGame === false
      ) {
        endGame = true;
        timer = false;
      }
    } else if (
      othersCounter == othersToLoose &&
      redCounter != 0 &&
      endGame === false
    ) {
      endGame = true;
      timer = false;
    }

    // if (reverseGravity === true) {
    //   let xDistance = antiGravity.x - circleArray[i].x;
    //   let yDistance = antiGravity.y - circleArray[i].y;
    //   let distance = Math.sqrt(xDistance * xDistance + yDistance * yDistance)
    //   if (distance < 250 ) {
    //     stopMovement = true;
    //     circleArray[i].x = circleArray[i].radius + antiGravity.radius + 1;
    //     circleArray[i].dx *= -1;
    //     circleArray[i].y = circleArray[i].radius + antiGravity.radius + 1;
    //     circleArray[i].dy *= -1;
    //   }
    // }

    // lines between slow moition and circles
    // let xDistance = slowMotion.x - circleArray[i].x;
    // let yDistance = slowMotion.y - circleArray[i].y;
    // let distance = Math.sqrt(xDistance * xDistance + yDistance * yDistance)
    // if (distance < 250) {
    //   c.beginPath();
    //   c.moveTo(slowMotion.x, slowMotion.y);
    //   c.lineWidth = 2;
    //   c.lineTo(circleArray[i].x, circleArray[i].y);
    //   c.strokeStyle = slowMotion.color;
    //   c.stroke();
    // }

    hue += 0.1;
    if (circleArray[i] !== undefined && endGame === false)
      circleArray[i].update();
    else if (endGame === true) circleArray[i].gravity();
  }
  slowMotion.powerUpSlow();
  // antiGravity.powerUpAntiG();
}

animate();

//stopwatch
window.onload = function () {
  timer = true;
  stopWatch();
  startMessage.classList.add("show");
  setTimeout(() => {
    startMessage.classList.remove("show");
  }, 2000);
};

function stopWatch() {
  if (timer) {
    count++;

    if (count == 100) {
      second++;
      count = 0;
    }

    if (second == 60) {
      minute++;
      second = 0;
    }

    if (minute == 60) {
      minute = 0;
      second = 0;
    }

    let minString = minute;
    let secString = second;
    let countString = count;

    if (minute < 10) {
      minString = "0" + minString;
    }

    if (second < 10) {
      secString = "0" + secString;
    }

    if (count < 10) {
      countString = "0" + countString;
    }

    document.getElementById("min").innerHTML = minString;
    document.getElementById("sec").innerHTML = secString;
    document.getElementById("count").innerHTML = countString;
    setTimeout(stopWatch, 10);
  }
}
