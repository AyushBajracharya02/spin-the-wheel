import { Game } from "@/scene/game";
import type { Input } from "@/types/input";
import { Wheel } from "./scene/wheel";
import { Slice } from "./scene/slice";
import { PRIZES } from "./config";
import { weightedRandom } from "./utils";

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

const NO_OF_SLICES = Math.min(
   Math.max(
      3,
      parseInt(
         new URLSearchParams(window.location.search).get("slices") || "3",
      ),
   ),
   PRIZES.length,
);

const SLICED_PRIZES = PRIZES.slice(0, NO_OF_SLICES);

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
            i * ((Math.PI * 2) / SLICED_PRIZES.length),
            (i + 1) * ((Math.PI * 2) / SLICED_PRIZES.length),
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

spinButton.addEventListener("click", () => {
   if (wheel.animation === "spinning") return;
   const selectedPrizeIndex = weightedRandom(
      SLICED_PRIZES.map((prize) => prize.weight),
   );

   const degree360 = Math.PI * 2;
   const degreePerSlice = degree360 / SLICED_PRIZES.length;
   const midAngle = degreePerSlice * selectedPrizeIndex + degreePerSlice / 2;
   const extraSpins = degree360 * 5;

   // target relative to current rotation, not absolute 0
   const rotation = wheel.rotation - midAngle - Math.PI / 2 - extraSpins;

   wheel.spin(rotation);
});
