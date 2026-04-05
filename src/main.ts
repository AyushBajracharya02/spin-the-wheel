import { Game } from "@/scene/game";
import type { Input } from "@/types/input";
import { Wheel } from "./scene/wheel";
import { Slice } from "./scene/slice";
import { DEGREE_360, SLICED_PRIZES } from "./constants";
import SpinWheelAudioSrc from "/assets/audio/spinning-wheel.mp3";

const SpinWheelAudio = new Audio(SpinWheelAudioSrc);

const canvas = document.querySelector<HTMLCanvasElement>("#wheel");
if (!canvas) {
   throw new Error(`Canvas with id #wheel not found`);
}

const ctx = canvas.getContext("2d");

if (!ctx) {
   throw new Error(`Could not get canvas's context`);
}

const resizeCanvas = () => {
   canvas.width = canvas.parentElement?.clientWidth ?? canvas.width;
   canvas.height = canvas.parentElement?.clientHeight ?? canvas.height;
   // ctx.scale(canvas.width / canvas.height, canvas.width / canvas.height);
};

let Input: Input = {};

canvas.addEventListener("mousedown", (e) => {
   const { offsetX: x, offsetY: y } = e;
   if (e.button === 0) {
      Input.leftClick = {
         x,
         y,
      };
   }
});

resizeCanvas();

window.addEventListener("resize", resizeCanvas);

const cx = canvas.width / 2;
const cy = canvas.height / 2;
const r = canvas.width / 2;

const wheel = new Wheel(
   cx,
   cy,
   r,
   SLICED_PRIZES.map(
      (prize, i) =>
         new Slice(
            cx,
            cy,
            r,
            i * (DEGREE_360 / SLICED_PRIZES.length),
            (i + 1) * (DEGREE_360 / SLICED_PRIZES.length),
            prize.color,
            prize.name,
         ),
   ),
);

Game.scenes.push(wheel);
Game.init?.(ctx);

let lastTime = 0;

const render: FrameRequestCallback = (timestamp) => {
   const deltaTime = timestamp - lastTime;
   lastTime = timestamp;
   Game.processInput?.(Input);
   Input = {};
   Game.update?.(deltaTime);
   Game.draw?.(ctx);
   requestAnimationFrame(render);
};

requestAnimationFrame(render);

const spinButton = document.querySelector<HTMLButtonElement>("#spin-button");

if (!spinButton) {
   throw new Error(`spin button with id #spin-button not found`);
}

const prizeDialog = document.querySelector<HTMLDialogElement>("#prize-dialog");

if (!prizeDialog) {
   throw new Error(`Dialog with id #prize-dialog not found`);
}

spinButton.addEventListener("click", async () => {
   if (wheel.animation === "spinning") return;

   // const selectedPrizeIndex = weightedRandom(
   //    SLICED_PRIZES.map((prize) => prize.weight),
   // );

   // console.log(SLICED_PRIZES[selectedPrizeIndex]);

   // const anglePerSlice = DEGREE_360 / SLICED_PRIZES.length;

   // const degreeOfSlice = anglePerSlice * selectedPrizeIndex;
   // const midAngle = degreeOfSlice + anglePerSlice / 2;
   // const targetRotation = -DEGREE_360 / 4 - midAngle;
   // const currentRotation = wheel.rotation % DEGREE_360;
   // const extraSpins = DEGREE_360 * 25;

   // // target relative to current rotation, not absolute 0
   // const rotation = targetRotation - currentRotation - extraSpins;

   SpinWheelAudio.play();
   const prize = await wheel.spin(9000);
   document.querySelector<HTMLImageElement>("#prize-image")!.src = prize.image;
   document.querySelector<HTMLParagraphElement>("#prize-message")!.innerText =
      prize.message;

   prizeDialog.showModal();
});

document
   .querySelector<HTMLButtonElement>("#prize-dialog-close")
   ?.addEventListener("click", () => {
      prizeDialog.close();
   });
