import type { Scene } from "@/types/scene";

export const Game: Scene & { scenes: Scene[] } = {
   scenes: [],
   init(ctx) {
      this.scenes.forEach((element) => {
         element.init?.(ctx);
      });
   },
   draw(ctx) {
      this.scenes.forEach((element) => {
         element.draw?.(ctx);
      });
   },
   update(deltaTime) {
      this.scenes.forEach((element) => {
         element.update?.(deltaTime);
      });
   },
   processInput(input) {
      this.scenes.forEach((element) => {
         element.processInput?.(input);
      });
   },
};
