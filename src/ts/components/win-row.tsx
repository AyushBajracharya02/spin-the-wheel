type WinRowProps = {
   name: string;
   time: string;
   prize: string;
};

export default function WinRow({ name, time, prize }: WinRowProps) {
   return (
      <div className="flex items-center gap-3 px-1 py-2 border-secondary-500/40 border-b">
         <div className="content-center border-2 border-white/18 rounded-full max-3xl:w-11.5 w-15 aspect-square font-extrabold max-xs:text-clamp-[var(--text-sm),3vw,var(--text-lg)] max-3xl:text-lg text-2xl text-center">
            {name[0]}
         </div>
         <div className="">
            <div className="font-bold max-xs:text-clamp-[var(--text-sm),3vw,var(--text-lg)] max-3xl:text-lg text-2xl">{name}</div>
            <div className="text-neutral-400 max-xs:text-clamp-[var(--text-xs),1.5vw,var(--text-base)] max-3xl:text-base text-lg">
               {time}
            </div>
         </div>
         <div className="ml-auto font-extrabold max-xs:text-clamp-[var(--text-sm),3vw,var(--text-lg)] max-3xl:text-lg text-xl">
            {prize}
         </div>
      </div>
   );
}
