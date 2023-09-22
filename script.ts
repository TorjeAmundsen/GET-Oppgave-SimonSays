const app = document.getElementById("app");
const greenLight = document.getElementById("light-0");
const redLight = document.getElementById("light-1");
const yellowLight = document.getElementById("light-2");
const blueLight = document.getElementById("light-3");
const score = document.getElementById("score");
const startButton = document.getElementById("start-game");

const lightList = [greenLight, redLight, yellowLight, blueLight];

const model = {
  memoryArray: <number[]>[],
  currentIndex: 0,
  correctSequences: 0,
  maxWaitTimeInMs: 3500,
  allowPlayerClicks: false,
  timeouts: <number[]>[],
  score: 0,
};

function getRandomInt(min: number, max: number): number {
  const x: number = Math.floor(min);
  const y: number = Math.floor(max);
  const randomNum = Math.floor(Math.random() * (y - x + 1) + x);
  return randomNum;
}

function extendSequence(sequence: number[]) {
  const randomNum = getRandomInt(0, 3);
  sequence.push(randomNum);
}

function delay(delayInMs: number) {
  return new Promise((resolve) => setTimeout(resolve, delayInMs));
}

async function playBackSequence(sequence: number[], delayInMs: number) {
  model.allowPlayerClicks = false;
  for (const light of lightList) {
    light?.classList.remove("allow-click");
  }
  for (const lightIdx of sequence) {
    const element = lightList[lightIdx];
    await delay(delayInMs / 2);
    element?.classList.add("on");
    await delay(delayInMs);
    element?.classList.remove("on");
  }
  model.allowPlayerClicks = true;
  for (const light of lightList) {
    light?.classList.add("allow-click");
  }
}

async function handleClick(element: HTMLElement, lightIdx: number, sequence: number[]) {
  if (!model.allowPlayerClicks) return;
  for (const light of lightList) {
    light?.classList.remove("on");
  }
  for (const id of model.timeouts) {
    clearTimeout(id);
  }
  element.classList.add("on");
  model.timeouts.push(
    setTimeout(() => {
      element.classList.remove("on");
    }, 750)
  );
  if (lightIdx === sequence[model.currentIndex]) {
    model.currentIndex++;
    if (model.currentIndex === sequence.length) {
      model.allowPlayerClicks = false;

      model.currentIndex = 0;
      model.score++;
      if (score) score.innerText = model.score + "";
      await delay(300);
      for (const light of lightList) {
        light?.classList.remove("allow-click");
      }
      await delay(700);
      extendSequence(sequence);
      playBackSequence(sequence, 750);
    }
  } else {
    if (app) {
      app.innerHTML = "GAME OVER";
      setTimeout(() => {
        location.reload();
      }, 1000);
    }
  }
}

async function initApp() {
  extendSequence(model.memoryArray);
  extendSequence(model.memoryArray);
  await delay(150);
  startButton?.classList.add("fade-out");
  startButton?.removeEventListener("mousedown", initApp);
  await delay(600);
  startButton?.classList.add("none");
  playBackSequence(model.memoryArray, 750);
  lightList.forEach((element, i) => {
    element?.addEventListener("mousedown", () => {
      handleClick(element, i, model.memoryArray);
    });
  });
}

startButton?.addEventListener("mousedown", initApp);
