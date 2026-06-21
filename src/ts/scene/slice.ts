import type { Scene } from "../types/scene";

export class Slice implements Scene {
   #cx: number;
   #cy: number;
   #r: number;
   #color: string;
   #label: string;
   #startAngle: number;
   #endAngle: number;
   #imageSrc: string;
   #imageInstance: HTMLImageElement | null = null;
   constructor(
      cx: number,
      cy: number,
      r: number,
      startAngle: number,
      endAngle: number,
      color: string,
      label: string,
      image: string,
   ) {
      this.#cx = cx;
      this.#cy = cy;
      this.#r = r;
      this.#startAngle = startAngle;
      this.#endAngle = endAngle;
      this.#color = color;
      this.#label = label;
      this.#imageSrc = image;
      this.#imageInstance = new Image();
      this.#imageInstance.src = this.#imageSrc;
   }
   draw(ctx: CanvasRenderingContext2D) {
      this.#cx = ctx.canvas.width / 2;
      this.#cy = ctx.canvas.height / 2;
      this.#r = ctx.canvas.width / 2;

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, this.#r, this.#startAngle, this.#endAngle);
      ctx.closePath();
      ctx.fillStyle = this.#color;
      ctx.fill();
      ctx.strokeStyle = "black";
      ctx.lineWidth = 5;
      ctx.stroke();
      ctx.fillStyle = "black";

      const midAngle = (this.#startAngle + this.#endAngle) / 2;
      const textX = Math.cos(midAngle) * (this.#r * 0.85);
      const textY = Math.sin(midAngle) * (this.#r * 0.85);
      ctx.save();
      ctx.translate(textX, textY);
      ctx.rotate(midAngle + Math.PI / 2);
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      ctx.font = `bold ${Math.max(10, Math.min(28, ctx.canvas.width * 0.03))}px 'Baloo 2'`;
      ctx.fillText(this.#label, 0, 0);

      if (this.#imageInstance && this.#imageInstance.complete) {
         const imgW = 50;
         const imgH =
            (this.#imageInstance.height * imgW) / this.#imageInstance.width; // Adjusted to a square 50x50, or match your preferred aspect ratio

         const verticalGap = Math.max(14, Math.min(50, ctx.canvas.width * 0.05)); // Distance in pixels down from the text center line

         /* CRITICAL: 
           Canvas images anchor from their top-left corner by default.
           To center it underneath the text horizontally, offset X by -imgW / 2.
         */
         ctx.drawImage(
            this.#imageInstance,
            -imgW / 2, // Center horizontally relative to text
            verticalGap, // Push down below the text vertically
            imgW,
            imgH,
         );
      }

      ctx.restore();
   }
}
