import { PRIZES } from "@/config";

export const DEGREE_360 = Math.PI * 2;

const NO_OF_SLICES = Math.min(
   Math.max(
      3,
      parseInt(
         new URLSearchParams(window.location.search).get("slices") || "3",
      ),
   ),
   PRIZES.length,
);

export const SLICED_PRIZES = PRIZES.slice(0, NO_OF_SLICES);
