const timer = {
  pomodoro: 25,
  shortBreak: 5,
  longBreak: 15,
  longBreakInterval: 4,
};

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
