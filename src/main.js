const timer = {
  pomodoro: 25,
  shortBreak: 5,
  longBreak: 15,
  longBreakInterval: 4,
};

let interval;

function getRemainingTime(endTime) {
  const currentTime = Date.parse(new Date());
  const difference = endTime - currentTime;

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
  let { total } = timer.remainingTime;
  const endTime = Date.parse(new Date()) + total * 1000;

  interval = setInterval(function () {
    timer.remainingTime = getRemainingTime(endTime);
    updateClock();

    total = timer.remainingTime.total;
    if (total <= 0) {
      clearInterval(interval);
    }
  }, 1000);
}

function updateClock() {
  const { remainingTime } = timer;
  const minutes = `${remainingTime.minutes}`.padStart(2, "0"); //00
  const seconds = `${remainingTime.seconds}`.padStart(2, "0"); //00

  const min = document.getElementById("js-minutes");
  const sec = document.getElementById("js-seconds");
  min.textContent = minutes;
  sec.textContent = seconds;
}

function switchMode(mode) {
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

  updateClock();
}

const mainButton = document.getElementById("js-btn");
mainButton.addEventListener("click", () => {
  const { action } = mainButton.dataset;
  if (action === "start") {
    startTimer();
  }
});

//event deligation
// https://javascript.info/event-delegation
const modeButtons = document.querySelector("#js-mode-buttons");
modeButtons.addEventListener("click", handleMode);

function handleMode(event) {
  //extract mode value from event
  console.log(event.target.dataset);
  const { mode } = event.target.dataset; // pomodoro, shortBreak, longBreak

  if (!mode) return;

  switchMode(mode);
}
//end event deligation
