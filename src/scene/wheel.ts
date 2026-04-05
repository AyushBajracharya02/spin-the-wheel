import { Circle } from "@/lib/circle";
import type { Scene } from "@/types/scene";
import type { Slice } from "./slice";
import { easeOut, lerp } from "@/utils";
import { DEGREE_360 } from "@/constants";

export class Wheel extends Circle implements Scene {
   //rotated -90deg because pointer is at top
   #rotation = -DEGREE_360 / 4;
   #animation: "idle" | "spinning" = "idle";
   #slices: Slice[] = [];
   constructor(cx: number, cy: number, r: number, slices?: Slice[]) {
      super(cx, cy, r);
      if (slices) this.#slices = slices;
   }
   init(ctx: CanvasRenderingContext2D) {
      this.cx = ctx.canvas.width / 2;
      this.cy = ctx.canvas.height / 2;
      this.r = ctx.canvas.width / 2;
   }
   draw(ctx: CanvasRenderingContext2D) {
      ctx.save();
      ctx.translate(this.cx, this.cy);
      ctx.rotate(this.#rotation);
      this.#slices.forEach((slice) => {
         slice.draw(ctx);
      });
      ctx.restore();
   }
   update?: ((deltaTime: number) => void) | undefined;
   spin(rotation: number, duration: number = 5000) {
      if (this.#animation === "spinning") return;
      this.#animation = "spinning";
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
            }
         };
      })();
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
