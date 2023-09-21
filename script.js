"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const app = document.getElementById("app");
const greenLight = document.getElementById("light-0");
const redLight = document.getElementById("light-1");
const yellowLight = document.getElementById("light-2");
const blueLight = document.getElementById("light-3");
const lightList = [greenLight, redLight, yellowLight, blueLight];
const model = {
    memoryArray: [],
    currentIndex: 0,
    correctSequences: 0,
    maxWaitTimeInMs: 3500,
    allowPlayerClicks: false,
    timeouts: [],
};
function getRandomInt(min, max) {
    const x = Math.floor(min);
    const y = Math.floor(max);
    const randomNum = Math.floor(Math.random() * (y - x + 1) + x);
    /* if (randomNum === model.memoryArray[model.memoryArray.length - 1]) {
      return getRandomInt(x, y);
    } */
    return randomNum;
}
function extendSequence(sequence) {
    const randomNum = getRandomInt(0, 3);
    sequence.push(randomNum);
    console.log(sequence);
}
function delay(delayInMs) {
    return new Promise((resolve) => setTimeout(resolve, delayInMs));
}
function playBackSequence(sequence, delayInMs) {
    return __awaiter(this, void 0, void 0, function* () {
        model.allowPlayerClicks = false;
        console.log("model.allowPlayerClicks =", model.allowPlayerClicks);
        for (const lightIdx of sequence) {
            const element = lightList[lightIdx];
            yield delay(delayInMs / 2);
            element === null || element === void 0 ? void 0 : element.classList.add("on");
            yield delay(delayInMs);
            element === null || element === void 0 ? void 0 : element.classList.remove("on");
        }
        model.allowPlayerClicks = true;
    });
}
function handleClick(element, lightIdx, sequence) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!model.allowPlayerClicks)
            return;
        for (const light of lightList) {
            light === null || light === void 0 ? void 0 : light.classList.remove("on");
        }
        for (const id of model.timeouts) {
            clearTimeout(id);
        }
        console.log("Clicked", lightIdx);
        element.classList.add("on");
        model.timeouts.push(setTimeout(() => {
            element.classList.remove("on");
        }, 750));
        if (lightIdx === sequence[model.currentIndex]) {
            model.currentIndex++;
            if (model.currentIndex === sequence.length) {
                model.allowPlayerClicks = false;
                model.currentIndex = 0;
                yield delay(1000);
                extendSequence(sequence);
                playBackSequence(sequence, 750);
            }
        }
        else {
            if (app) {
                app.innerHTML = "GAME OVER";
                setTimeout(() => {
                    location.reload();
                }, 1000);
            }
        }
    });
}
function initApp() {
    return __awaiter(this, void 0, void 0, function* () {
        extendSequence(model.memoryArray);
        extendSequence(model.memoryArray);
        yield delay(750);
        playBackSequence(model.memoryArray, 750);
        lightList.forEach((element, i) => {
            element === null || element === void 0 ? void 0 : element.addEventListener("mousedown", () => {
                handleClick(element, i, model.memoryArray);
            });
        });
    });
}
document.addEventListener("DOMContentLoaded", initApp);
