type WinRowProps = {
   name: string;
   time: string;
   prize: string;
};

export default function WinRow({ name, time, prize }: WinRowProps) {
   return (
      <div className="flex items-center gap-3 px-1 py-2 border-secondary-500/40 border-b">
         <div className="content-center border-2 border-white/18 rounded-full w-15 aspect-square font-extrabold text-2xl text-center">
            {name[0]}
         </div>
         <div className="">
            <div className="font-bold text-2xl">{name}</div>
            <div className="text-neutral-400 text-lg">{time}</div>
         </div>
         <div className="ml-auto font-extrabold text-xl">{prize}</div>
      </div>
   );
}
