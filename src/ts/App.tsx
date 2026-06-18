import { useCallback, useEffect, useId, useRef, useState } from "react";
import WinRow from "./components/win-row";
import { Game } from "./scene/game";
import type { Input } from "./types/input";
import { DEGREE_360, SLICED_PRIZES } from "./constants";
import { Wheel } from "./scene/wheel";
import { Slice } from "./scene/slice";
import { weightedRandom } from "./utils";
import { SpinWheelAudioSrc } from "./config/assets";
import Bulb from "./components/bulb";
import WheelBelt from "./components/wheel-belt";
import type { Prize } from "./config";

const resizeCanvas = (canvas: HTMLCanvasElement) => {
   canvas.width = canvas.parentElement?.clientWidth ?? canvas.width;
   canvas.height = canvas.parentElement?.clientHeight ?? canvas.height;
};

export default function App() {
   const [activeTab, setActiveTab] = useState<"live-wins" | "user-wins">(
      "live-wins",
   );

   const canvasRef = useRef<HTMLCanvasElement>(null);
   const ctxRef = useRef<CanvasRenderingContext2D>(null);
   const wheelRef = useRef<Wheel>(null);
   const prizeDialogRef = useRef<HTMLDialogElement>(null);
   const spinWheelAudioRef = useRef(new Audio(SpinWheelAudioSrc));
   const inputRef = useRef<Input>({});

   const [wonPrize, setWonPrize] = useState<Prize | null>(null);

   const handleSpinButtonPress = useCallback(async () => {
      const wheel = wheelRef.current;
      if (!wheel || wheel.animation === "spinning") return;

      const selectedPrizeIndex = weightedRandom(
         SLICED_PRIZES.map((prize) => prize.weight),
      );

      const prize = SLICED_PRIZES[selectedPrizeIndex];

      setWonPrize(prize);

      const anglePerSlice = DEGREE_360 / SLICED_PRIZES.length;

      const degreeOfSlice = anglePerSlice * selectedPrizeIndex;
      const midAngle = degreeOfSlice + anglePerSlice / 2;
      const targetRotation = -DEGREE_360 / 4 - midAngle;
      const currentRotation = wheel.rotation % DEGREE_360;
      const extraSpins = DEGREE_360 * 25;

      // target relative to current rotation, not absolute 0
      const rotation = targetRotation - currentRotation - extraSpins;

      spinWheelAudioRef.current.play();
      await wheel.spin(rotation, 18000);
      prizeDialogRef.current?.showModal();
   }, []);

   useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const resize = () => {
         resizeCanvas(canvas);
      };
      window.addEventListener("resize", resize);
      resize();
      return () => {
         window.removeEventListener("resize", resize);
      };
   }, []);

   useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      ctxRef.current = canvas.getContext("2d");
   }, []);

   useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const handleMouseDown = (e: MouseEvent) => {
         const { offsetX: x, offsetY: y } = e;
         if (e.button === 0) {
            inputRef.current.leftClick = {
               x,
               y,
            };
         }
      };
      canvas.addEventListener("mousedown", handleMouseDown);
      return () => {
         canvas.removeEventListener("mousedown", handleMouseDown);
      };
   }, []);

   useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const r = canvas.width / 2;

      const wheel = new Wheel(
         cx,
         cy,
         r,
         SLICED_PRIZES.map(
            (prize, i) =>
               new Slice(
                  cx,
                  cy,
                  r,
                  i * (DEGREE_360 / SLICED_PRIZES.length),
                  (i + 1) * (DEGREE_360 / SLICED_PRIZES.length),
                  prize.color,
                  prize.name,
                  prize.image,
               ),
         ),
      );

      wheelRef.current = wheel;

      Game.scenes.push(wheel);

      if (ctxRef.current) {
         Game.init?.(ctxRef.current);

         let lastTime = 0;

         const render: FrameRequestCallback = (timestamp) => {
            const deltaTime = timestamp - lastTime;
            lastTime = timestamp;
            Game.processInput?.(inputRef.current);
            inputRef.current = {};
            Game.update?.(deltaTime);

            if (ctxRef.current) {
               Game.draw?.(ctxRef.current);
            }
            requestAnimationFrame(render);
         };

         const animationFrameId = requestAnimationFrame(render);
         return () => {
            cancelAnimationFrame(animationFrameId);
         };
      }
   }, []);

   const ticketsDialogId = useId();

   return (
      <>
         <div className="min-h-dvh flex flex-col">
            <header className="py-3">
               <div className="container">
                  <nav className="flex gap-5 items-center">
                     <a
                        href="./"
                        className="mr-auto w-28/100"
                        aria-label="home"
                     >
                        <img src="/images/logo-transparent.png" alt="" />
                     </a>
                     <div className="bg-conic-(--metallic-gold) p-0.75 rounded-2xl">
                        <div className="flex items-center gap-3 py-3.25 px-5.75 bg-black rounded-xl">
                           <div className="w-8">
                              <img
                                 className="w-full"
                                 src="/images/ticket.svg"
                                 alt=""
                              />
                           </div>
                           <div className="font-extrabold text-gold-200 text-2xl leading-none">
                              8
                           </div>
                        </div>
                     </div>
                     <button
                        className="btn btn-primary"
                        command="show-modal"
                        commandfor={ticketsDialogId}
                     >
                        + Buy Tickets
                     </button>
                  </nav>
               </div>
            </header>
            <main className="grow grid">
               <div className="container grid">
                  <div className="grid grid-cols-19 items-start">
                     <div className="max-2xl:col-span-4 col-span-3">
                        <div className="relative">
                           <div className="border-10 rounded-[28px] border-primary-700 w-fit relative">
                              <div className="absolute left-1/2 -translate-x-1/2 bottom-full ">
                                 <img src="/images/crown.png" alt="" />
                              </div>
                              <div className="bg-primary-900/50 px-4 py-5 backdrop-blur-sm rounded-[18px]">
                                 <div className="text-center text-2xl font-bold">
                                    <p>SPIN TO</p>
                                 </div>
                                 <div className="text-center text-5xl font-extrabold drop-shadow drop-shadow-primary-500 bg-linear-180 from-secondary-200 to-secondary-400 bg-clip-text text-transparent mt-2">
                                    <p>WIN BIG</p>
                                 </div>
                                 <div className="text-center text-2xl font-bold mt-3">
                                    <p>
                                       LUCK IS ON
                                       <br />
                                       YOUR SIDE!
                                    </p>
                                 </div>
                              </div>
                           </div>
                           <div className="absolute inset-0 grid grid-cols-[repeat(auto-fill,10px)] grid-rows-[repeat(auto-fill,10px)] justify-between content-between">
                              {/* {getRoundedRectPointsTopLeft(284, 224, 28, 20).map(
                                 ({ x, y }) => (
                                    <Bulb
                                       className="w-2 absolute top-(--top) left-(--left)"
                                       style={{
                                          "--left": `${x}px`,
                                          "--top": `${y}px`,
                                       }}
                                    />
                                 ),
                              )} */}
                           </div>
                        </div>
                        <div className="mt-9 -ml-7 drop-shadow-lg drop-shadow-primary-900">
                           <img src="/images/chips-and-cards-2.png" alt="" />
                        </div>
                     </div>
                     <div className="col-span-7 -mt-10">
                        <WheelBelt className="p-7 relative @container">
                           <div className="absolute-center w-[125dvw] h-screen -z-1 overflow-hidden">
                              <div className="bg-(image:--repeating-conic-gradient-1) mask-radial-(--radial-mask-1) animate-rotate w-[125dvw] aspect-square absolute-center"></div>
                           </div>
                           {Array.from({ length: 20 }).map((_, i, arr) => (
                              <Bulb
                                 className="w-4.5 absolute left-1/2 top-3 -translate-1/2 origin-[center_calc(50cqw+23px)] rotate-(--angle)"
                                 style={{
                                    "--angle": `${(360 / arr.length) * i + 360 / arr.length / 2}deg`,
                                 }}
                                 key={i}
                              />
                           ))}
                           <div className="absolute w-1/10 -top-4 left-1/2 -translate-x-1/2 drop-shadow-[var(--color-primary-950)_0px_4px_5px]/60">
                              <img src="/images/pointer.png" alt="" />
                           </div>
                           <div className="bg-neutral-950 aspect-square rounded-full p-0.5">
                              <canvas
                                 className="w-full h-full"
                                 ref={canvasRef}
                              ></canvas>
                           </div>
                           <WheelBelt className="absolute-center p-3 w-3/10 @container">
                              {Array.from({ length: 12 }).map((_, i, arr) => (
                                 <Bulb
                                    className="w-2.5 absolute left-1/2 -translate-x-1/2 top-1 -translate-y-1 origin-[center_calc(50cqw+11px)] rotate-(--angle)"
                                    style={{
                                       "--angle": `${(360 / arr.length) * i + 360 / arr.length / 2}deg`,
                                    }}
                                    key={i}
                                 />
                              ))}
                              <div className="aspect-square bg-radial-(--radial-gradient-4) rounded-full border-2 border-gold-800 content-center">
                                 <div className="font-extrabold text-center text-gold-100 text-[clamp(18px,6vw,26px)] text-shadow-(--text-shadow-1)">
                                    <p>SPIN</p>
                                 </div>
                              </div>
                           </WheelBelt>
                        </WheelBelt>
                        <div className="grid mt-6">
                           <button
                              className="btn btn-xl btn-primary"
                              onClick={handleSpinButtonPress}
                           >
                              SPIN NOW!
                           </button>
                        </div>
                        <div className="text-sm text-center text-neutral-400 font-semibold mt-3">
                           <p>
                              1 ticket per spin · 8 &nbsp;
                              <img
                                 className="inline"
                                 src="/images/ticket.svg"
                                 alt=""
                              />
                              &nbsp; in your balance.
                           </p>
                        </div>
                     </div>
                     <div className="-col-start-8 col-span-7 bg-primary-900/50 backdrop-blur-sm shadow-[var(--color-neutral-950)_0px_20px_50px] py-6.5 px-9 border-2 border-secondary-500 rounded-3xl">
                        <div className="mb-2.5 p-px bg-conic-(--metallic-gold) rounded-2xl">
                           <div
                              className="p-0.5 bg-primary-900 flex gap-1.5 rounded-2xl"
                              role="tablist"
                           >
                              <button
                                 role="tab"
                                 aria-selected={activeTab === "live-wins"}
                                 className="z-1 not-aria-selected:text-white/40 transition-all duration-300 btn grow aria-selected:btn-primary flex items-center justify-center"
                                 onClick={() => setActiveTab("live-wins")}
                              >
                                 Live Wins
                                 <div className="inline-block relative ml-2">
                                    <div className="absolute inset-0 bg-green-400 rounded-full w-2 aspect-square animate-ping"></div>
                                    <div className="bg-green-400 shadow-[var(--color-green-400)_0px_0px_8px] rounded-full w-2 aspect-square"></div>
                                 </div>
                              </button>
                              <button
                                 role="tab"
                                 aria-selected={activeTab === "user-wins"}
                                 className="z-1 not-aria-selected:text-white/40 transition-all duration-300 btn grow aria-selected:btn-primary"
                                 onClick={() => setActiveTab("user-wins")}
                              >
                                 My Wins
                              </button>
                           </div>
                        </div>
                        <div className="" hidden={activeTab !== "live-wins"}>
                           <WinRow
                              name="Manju"
                              time="Just Now"
                              prize={"Apple Air Pods"}
                           />
                           <WinRow
                              name="Manju"
                              time="Just Now"
                              prize={"Apple Air Pods"}
                           />
                           <WinRow
                              name="Manju"
                              time="Just Now"
                              prize={"Apple Air Pods"}
                           />
                           <WinRow
                              name="Manju"
                              time="Just Now"
                              prize={"Apple Air Pods"}
                           />
                           <WinRow
                              name="Manju"
                              time="Just Now"
                              prize={"Apple Air Pods"}
                           />
                        </div>
                        <div className="" hidden={activeTab !== "user-wins"}>
                           <WinRow
                              name="You"
                              time="1 min ago"
                              prize={"Apple Air Pods"}
                           />
                        </div>
                     </div>
                  </div>
               </div>
            </main>
         </div>
         <dialog
            id="prize-dialog"
            ref={prizeDialogRef}
            className="dialog-center dialog"
         >
            <button
               className="dialog-close"
               command="close"
               commandfor="prize-dialog"
            ></button>
            <div className="text-secondary-300 font-extrabold text-center text-3xl text-shadow-1 text-shadow-secondary-100">
               <p>
                  {wonPrize?.name !== "No Prize"
                     ? "★ You Won ★"
                     : "Better Luck Next Time!"}
               </p>
            </div>
            <div className="mt-6">
               <img src={wonPrize?.image} alt="" />
            </div>
            <div className="text-white text-center font-extrabold mt-6 text-2xl">
               <p>{wonPrize?.name}</p>
            </div>
            <div className="text-white/60 text-center mt-1">
               <p>{wonPrize?.message}</p>
            </div>
            <div className="grid mt-6 gap-3">
               <button className="btn btn-pink">COLLECT PRIZE</button>
               <button className="btn btn-primary">
                  Spin Again · 1{" "}
                  <img className="inline" src="/images/ticket.svg" alt="" />{" "}
                  Ticket
               </button>
            </div>
         </dialog>
         <dialog id={ticketsDialogId} className="dialog-center dialog">
            <button
               className="dialog-close"
               command="close"
               commandfor={ticketsDialogId}
            ></button>
            <div className="text-pink-300 font-extrabold text-center text-xs">
               <p>THE CASHIER</p>
            </div>
            <div className="text-white font-extrabold text-center text-[28px] mt-1.5">
               <p>Buy Tickets</p>
            </div>
            <div className="flex items-center gap-2 mt-2.5 py-1.5 px-3.5 border border-white/12 bg-white/6 rounded-full mx-auto w-fit">
               <div className="">
                  <img src="/images/ticket.svg" alt="" />
               </div>
               <span className="text-sm text-gold-200 font-semibold leading-none">
                  6 in balance
               </span>
            </div>
            <div className="grid grid-cols-2 mt-5.5 gap-3">
               <div className="px-3 pt-4.5 pb-3.5 border border-primary-500/28 rounded-2xl grid grid-rows-subgrid row-span-5 gap-0">
                  <div className="">
                     <img
                        className="w-8.5 mx-auto"
                        src="/images/ticket.svg"
                        alt=""
                     />
                  </div>
                  <div className="text-white text-[26px] font-extrabold text-center mt-1.5">
                     <p>5</p>
                  </div>
                  <div className="text-neutral-300 text-xs mt-1 font-bold text-center">
                     <p>TICKETS</p>
                  </div>
                  <div className="grid mt-3 -row-start-1">
                     <button className="btn btn-primary btn-lg">Rs. 499</button>
                  </div>
               </div>
               <div className="px-3 pt-4.5 pb-3.5 border border-primary-500/28 rounded-2xl grid grid-rows-subgrid row-span-5 gap-0">
                  <div className="">
                     <img
                        className="w-8.5 mx-auto"
                        src="/images/ticket.svg"
                        alt=""
                     />
                  </div>
                  <div className="text-white text-[26px] font-extrabold text-center mt-1.5">
                     <p>5</p>
                  </div>
                  <div className="text-neutral-300 text-xs mt-1 font-bold text-center">
                     <p>TICKETS</p>
                  </div>
                  <div className="text-xs mt-1.5 font-bold text-green-400 text-center">
                     <p>+2 free</p>
                  </div>
                  <div className="grid mt-3 -row-start-1">
                     <button className="btn btn-primary btn-lg">
                        Rs. 1000
                     </button>
                  </div>
               </div>
            </div>
            <div className="mt-4.5 text-center text-xs font-semibold text-neutral-400">
               <p>🔒 Secure checkout · 1 ticket = 1 spin · 18+</p>
            </div>
         </dialog>
      </>
   );
}
