import type { Scene } from "@/types/scene";

export class Slice implements Scene {
   #cx: number;
   #cy: number;
   #r: number;
   #color: string;
   #label: string;
   #startAngle: number;
   #endAngle: number;
   constructor(
      cx: number,
      cy: number,
      r: number,
      startAngle: number,
      endAngle: number,
      color: string,
      label: string,
   ) {
      this.#cx = cx;
      this.#cy = cy;
      this.#r = r;
      this.#startAngle = startAngle;
      this.#endAngle = endAngle;
      this.#color = color;
      this.#label = label;
   }
   draw(ctx: CanvasRenderingContext2D) {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, this.#r, this.#startAngle, this.#endAngle);
      ctx.closePath();
      ctx.fillStyle = this.#color;
      ctx.fill();
      ctx.strokeStyle = "black";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = "black";

      const midAngle = (this.#startAngle + this.#endAngle) / 2;
      const textX = Math.cos(midAngle) * (this.#r / 2);
      const textY = Math.sin(midAngle) * (this.#r / 2);
      ctx.save();
      ctx.translate(textX, textY);
      ctx.fillStyle = "black";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(this.#label, 0, 0);
      ctx.restore();
   }
}
