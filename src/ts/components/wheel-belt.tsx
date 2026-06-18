import type { DetailedHTMLProps, HTMLAttributes } from "react";

export default function WheelBelt({
   children,
   className,
   ...props
}: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>) {
   return (
      <div
         className={`bg-conic-(--metallic-gold) aspect-square rounded-full border-3 border-secondary-200 ${className}`}
         {...props}
      >
         <div className="border-3 border-secondary-200 rounded-full aspect-square">{children}</div>
      </div>
   );
}
