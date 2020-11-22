const timer = {
  pomodoro: 25,
  shortBreak: 5,
  longBreak: 15,
  longBreakInterval: 4,
};

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
