import type { Rectangle } from "./types";

export function isPointInside(
   rect: Rectangle,
   { x, y }: { x: number; y: number },
): boolean {
   if (x < rect.x || x > rect.x + rect.width) return false;
   if (y < rect.y || y > rect.y + rect.height) return false;
   return true;
}
