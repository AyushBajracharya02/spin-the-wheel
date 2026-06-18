import "react";

declare module "react" {
   interface ButtonHTMLAttributes<T> extends HTMLAttributes<T> {
      command?: string;
      commandfor?: string;
   }
   interface CSSProperties {
      // This index signature allows any custom string key with a string or number value
      [key: string]: string | number | undefined;
   }
}
