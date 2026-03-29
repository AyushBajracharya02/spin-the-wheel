import type { Input } from "@/input";

export type Scene = {
   init?: (ctx: CanvasRenderingContext2D) => void;
   processInput?: (input: Input) => void;
   draw?: (ctx: CanvasRenderingContext2D) => void;
   update?: (deltaTime: number) => void;
};
