// reference
// https://freshman.tech/pomodoro-timer/

const timer = {
  pomodoro: 25,
  shortBreak: 5,
  longBreak: 15,
  longBreakInterval: 4,
  sessions: 0,
};

let userPomotime = prompt("Set time For Pomo in Minutes");
if (userPomotime) {
  timer.pomodoro = userPomotime;
}
let userBreaktime = prompt("Set the Short Break Time in minutes");
if (userBreaktime) {
  timer.shortBreak = userBreaktime;
}
let userLongBreaktime = prompt("Set the Long Break Time in minutes");
if (userLongBreaktime) {
  timer.longBreak = userLongBreaktime;
}

let interval;
let clock = document.getElementById("js-clock");
let min = document.getElementById("js-minutes");
let sec = document.getElementById("js-seconds");
let separator = document.getElementsByClassName("separator")[0];

// return me the time left
function getRemainingTime(endTime) {
  const currentTime = Date.parse(new Date());
  const difference = endTime - currentTime; //this will be mostly float num

  const total = Number.parseInt(difference / 1000, 10);
  const minutes = Number.parseInt((total / 60) % 60, 10);
  const seconds = Number.parseInt(total % 60, 10);

  return {
    total,
    minutes,
    seconds,
  };
}

function startTimer() {
  //js Object destructuring values => extract value of total from timer.remainingTime object
  let { total } = timer.remainingTime;
  const endTime = Date.parse(new Date()) + total * 1000; //milliseconds

  if (timer.mode === "pomodoro") timer.sessions++;

  mainButton.dataset.action = "stop";
  mainButton.textContent = "stop";
  mainButton.classList.add("active");

  separator.classList.add("blinking");

  interval = setInterval(function () {
    timer.remainingTime = getRemainingTime(endTime);

    updateClock();

    total = timer.remainingTime.total;

    if (total <= 0) {
      clearInterval(interval);
      switch (timer.mode) {
        case "pomodoro":
          if (timer.sessions % timer.longBreakInterval === 0) {
            switchMode("longBreak");
          } else {
            switchMode("shortBreak");
          }
          break;
        default:
          switchMode("pomodoro");
      }

      if (Notification.permission === "granted") {
        const text =
          timer.mode === "pomodoro" ? "Get back to work!" : "Take a break!";
        new Notification(text);
      }

      document.querySelector(`[data-sound="${timer.mode}"]`).play();
      startTimer();
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(interval);

  if (timer.remainingTime.minutes <= 5) {
    separator.classList.remove("blinking-danger");
  } else {
    separator.classList.remove("blinking");
  }

  mainButton.dataset.action = "start";
  mainButton.textContent = "start";
  mainButton.classList.remove("active");
}

function updateClock() {
  const { remainingTime } = timer;
  const minutes = `${remainingTime.minutes}`.padStart(2, "0"); //00
  const seconds = `${remainingTime.seconds}`.padStart(2, "0"); //00

  //global variable
  //textContent has better performance wrt innerHTML
  min.textContent = minutes;
  sec.textContent = seconds;

  if (minutes <= 2 && interval) {
    clock.style.color = "#bb0d0d";
    separator.classList.remove("blinking");
    separator.classList.add("blinking-danger");
  }

  const text =
    timer.mode === "pomodoro" ? "Get back to work!" : "Take a break!";
  document.title = `${minutes}:${seconds} — ${text}`;

  const progress = document.getElementById("js-progress");
  progress.value = timer[timer.mode] * 60 - timer.remainingTime.total;
}

function switchMode(mode) {
  if (interval) {
    stopTimer();
  }
  timer.mode = mode;
  timer.remainingTime = {
    total: timer[mode] * 60, // 25x60, 5x60, 15x60
    minutes: timer[mode], // 25, 5, 15
    seconds: 0, //always 0
  };

  document
    .querySelectorAll("button[data-mode]")
    .forEach((e) => e.classList.remove("active"));
  document.querySelector(`[data-mode="${mode}"]`).classList.add("active");
  document.body.style.backgroundColor = `var(--${mode})`;
  document
    .getElementById("js-progress")
    .setAttribute("max", timer.remainingTime.total);

  updateClock();
}

document.addEventListener("DOMContentLoaded", () => {
  // Let's check if the browser supports notifications
  if ("Notification" in window) {
    // If notification permissions have neither been granted or denied
    if (
      Notification.permission !== "granted" &&
      Notification.permission !== "denied"
    ) {
      // ask the user for permission
      Notification.requestPermission().then(function (permission) {
        // If permission is granted
        if (permission === "granted") {
          // Create a new notification
          new Notification(
            "Awesome! You will be notified at the start of each session"
          );
        }
      });
    }
  }

  switchMode("pomodoro");
});

const buttonSound = new Audio("/audios/button-sound.mp3");

const mainButton = document.getElementById("js-btn");
mainButton.addEventListener("click", () => {
  buttonSound.play();

  const { action } = mainButton.dataset;
  if (action === "start") {
    startTimer();
  } else {
    stopTimer();
  }
});

//event deligation
// https://javascript.info/event-delegation
const modeButtons = document.querySelector("#js-mode-buttons");
modeButtons.addEventListener("click", handleClickMode);

function handleClickMode(event) {
  //extract mode value from event
  // console.log(event.target.dataset);
  const { mode } = event.target.dataset; // pomodoro, shortBreak, longBreak

  if (!mode) return;

  switchMode(mode);
  stopTimer();
}

const body = document.querySelector("body");
body.addEventListener("keypress", handleKeyboardMode);

//keyboard event to handel start() and stop() timer
let spacePressed = false;
// keyboard event to handel switchMode()
// key code
// p=112 => pomodoro mode
// s=115 => short break mode
// l=108 => long break mode
function handleKeyboardMode(e) {
  if (e.keyCode == 32) {
    buttonSound.play();
    spacePressed = !spacePressed;
    if (spacePressed) {
      startTimer();
    } else {
      stopTimer();
    }
  } else if (e.keyCode == 112) {
    switchMode("pomodoro");
  } else if (e.keyCode == 115) {
    switchMode("shortBreak");
  } else if (e.keyCode == 108) {
    switchMode("longBreak");
  } else {
    return;
  }
}

//end event deligation
