import type { DetailedHTMLProps, HTMLAttributes } from "react";

export default function Bulb({
   className,
   ...props
}: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>) {
   return (
      <div
         className={`aspect-square bulb-element rounded-full shadow-bulb ${className}`}
         {...props}
      ></div>
   );
}
