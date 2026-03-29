import bezier from "bezier-easing";

/**
 * Linear interpolation between two values.
 * @param start - The starting value (t=0)
 * @param end - The ending value (t=1)
 * @param t - Progress between 0 and 1
 */
export const lerp = (start: number, end: number, t: number) =>
   start + (end - start) * t;

export const ease = bezier(0.17, 0.67, 0.83, 0.67);

export const linear = bezier(0, 0, 1, 1);

export const easeIn = bezier(0.42, 0, 1, 1);

export const easeOut = bezier(0, 0, 0.58, 1);

export const easeInOut = bezier(0.42, 0, 0.58, 1);

export const weightedRandom = (weights: number[]) => {
   const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
   let random = Math.random() * totalWeight;
   for (let i = 0; i < weights.length; i++) {
      random -= weights[i];
      if (random <= 0) {
         return i;
      }
   }
   return weights.reduce(
      (maxIndex, weight, i) => (weight > weights[maxIndex] ? i : maxIndex),
      0,
   );
};
