import type { Circle as TCircle } from "./types";

export class Circle implements TCircle {
   #x: number;
   #y: number;
   #r: number;
   #cx: number;
   #cy: number;
   #width: number;
   #height: number;

   constructor(cx: number, cy: number, r: number) {
      this.#r = r;
      this.#cx = cx;
      this.#cy = cy;
      this.#x = cx - r;
      this.#y = cy - r;
      this.#width = r * 2;
      this.#height = this.width;
   }

   get x() {
      return this.#x;
   }
   get y() {
      return this.#y;
   }
   get r() {
      return this.#r;
   }
   get cx() {
      return this.#cx;
   }
   get cy() {
      return this.#cy;
   }
   get width() {
      return this.#width;
   }
   get height() {
      return this.#height;
   }
   set r(r: number) {
      this.#r = r;
      this.#width = r * 2;
      this.#height = this.width;
      this.#x = this.#cx - r;
      this.#y = this.#cy - r;
   }
   set cx(cx: number) {
      this.#cx = cx;
      this.#x = cx - this.r;
   }
   set cy(cy: number) {
      this.#cy = cy;
      this.#y = cy - this.r;
   }
}
