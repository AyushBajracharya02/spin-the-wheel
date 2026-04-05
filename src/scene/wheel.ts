import { Circle } from "@/lib/circle";
import type { Scene } from "@/types/scene";
import type { Slice } from "./slice";
import { easeOut, lerp, weightedRandom } from "@/utils";
import { DEGREE_360, SLICED_PRIZES } from "@/constants";
import type { Publisher as TPublisher } from "@/lib/pub-sub/types";
import type { Prize } from "@/config";
import type { Subscriber } from "@/lib/pub-sub/types";
import { Publisher } from "@/lib/pub-sub";

export class Wheel implements Scene, TPublisher<Prize> {
   #circle: Circle;
   #publisher: Publisher<Prize>;
   //rotated -90deg because pointer is at top
   #rotation = -DEGREE_360 / 4;
   #animation: "idle" | "spinning" = "idle";
   #slices: Slice[] = [];
   constructor(cx: number, cy: number, r: number, slices?: Slice[]) {
      this.#circle = new Circle(cx, cy, r);
      this.#publisher = new Publisher();
      if (slices) this.#slices = slices;
   }
   subscribe(s: Subscriber<Prize>) {
      this.#publisher.subscribe(s);
   }
   unsubscribe(s: Subscriber<Prize>) {
      this.#publisher.unsubscribe(s);
   }
   publish(newState: Prize) {
      this.#publisher.publish(newState);
   }
   init(ctx: CanvasRenderingContext2D) {
      this.#circle.cx = ctx.canvas.width / 2;
      this.#circle.cy = ctx.canvas.height / 2;
      this.#circle.r = ctx.canvas.width / 2;
   }
   draw(ctx: CanvasRenderingContext2D) {
      ctx.save();
      ctx.translate(this.#circle.cx, this.#circle.cy);
      ctx.rotate(this.#rotation);
      this.#slices.forEach((slice) => {
         slice.draw(ctx);
      });
      ctx.restore();
   }
   update?: ((deltaTime: number) => void) | undefined;
   spin(duration: number): Promise<Prize> {
      if (this.#animation === "spinning")
         return Promise.reject("Wheel is still spinning");

      const selectedPrizeIndex = weightedRandom(
         SLICED_PRIZES.map((prize) => prize.weight),
      );

      const anglePerSlice = DEGREE_360 / SLICED_PRIZES.length;

      const degreeOfSlice = anglePerSlice * selectedPrizeIndex;
      const midAngle = degreeOfSlice + anglePerSlice / 2;
      const targetRotation = -DEGREE_360 / 4 - midAngle;
      const currentRotation = this.rotation % DEGREE_360;
      const extraSpins = DEGREE_360 * 25;

      // target relative to current rotation, not absolute 0
      const rotation = targetRotation - currentRotation - extraSpins;
      this.#animation = "spinning";

      return new Promise((resolve) => {
         this.update = (() => {
            let progress = 0;
            const startRotation = this.#rotation;
            return (deltaTime) => {
               progress = Math.min(progress + deltaTime / duration, 1);
               this.rotation = lerp(
                  startRotation,
                  startRotation + rotation,
                  easeOut(progress),
               );
               if (progress === 1) {
                  this.#animation = "idle";
                  this.update = undefined;
                  this.publish(SLICED_PRIZES[selectedPrizeIndex]);
                  resolve(SLICED_PRIZES[selectedPrizeIndex]);
               }
            };
         })();
      });
   }
   get animation() {
      return this.#animation;
   }
   set rotation(value: number) {
      this.#rotation = value;
   }
   get rotation() {
      return this.#rotation;
   }
}
