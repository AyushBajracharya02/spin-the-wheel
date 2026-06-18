import type { DetailedHTMLProps, HTMLAttributes } from "react";

export default function Bulb({
   className,
   ...props
}: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>) {
   return (
      <div
         className={`aspect-square bg-radial-[at_75%_25%] from-secondary-50 to-secondary-400 rounded-full shadow-bulb ${className}`}
         {...props}
      ></div>
   );
}
