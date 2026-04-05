import { Circle } from "@/lib/circle";
import type { Scene } from "@/types/scene";
import type { Slice } from "./slice";
import { easeOut, lerp } from "@/utils";
import { DEGREE_360 } from "@/constants";
import type { Publisher as TPublisher } from "@/lib/pub-sub/types";
import type { Subscriber } from "@/lib/pub-sub/types";
import { Publisher } from "@/lib/pub-sub";

export class Wheel implements Scene, TPublisher<null> {
   #circle: Circle;
   #publisher: Publisher<null>;
   //rotated -90deg because pointer is at top
   #rotation = -DEGREE_360 / 4;
   #animation: "idle" | "spinning" = "idle";
   #slices: Slice[] = [];
   constructor(cx: number, cy: number, r: number, slices?: Slice[]) {
      this.#circle = new Circle(cx, cy, r);
      this.#publisher = new Publisher();
      if (slices) this.#slices = slices;
   }
   subscribe(s: Subscriber<null>) {
      this.#publisher.subscribe(s);
   }
   unsubscribe(s: Subscriber<null>) {
      this.#publisher.unsubscribe(s);
   }
   publish(newState: null) {
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
   spin(rotation: number, duration: number) {
      if (this.#animation === "spinning")
         return Promise.reject("Wheel is still spinning");

      this.#animation = "spinning";

      return new Promise<void>((resolve) => {
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
                  this.publish(null);
                  resolve();
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
