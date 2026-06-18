import {
   Coin,
   Coin100,
   Coin25,
   Coin250,
   ExtraSpin,
   GiftCard,
   iphone17,
   NoPrize,
} from "./assets";

export const PRIZES = [
   {
      name: "iPhone 17 Pro Max",
      weight: 0,
      color: "#0C0C0A",
      image: iphone17,
      message: "Jackpot! You’ve won the grand prize 🎉",
   },
   {
      name: "1x Extra Spin",
      weight: 150,
      color: "#E49812",
      image: ExtraSpin,
      message: "Nice! You’ve earned another spin 🔄",
   },
   {
      name: "100 coins",
      weight: 50,
      color: "#96090A",
      image: Coin100,
      message: "Great win! 100 coins added to your balance 💰",
   },
   {
      name: "No Prize",
      weight: 250,
      color: "#0C0C0A",
      image: NoPrize,
      message: "No luck this time—give it another shot!",
   },
   {
      name: "25 coins",
      weight: 200,
      color: "#E49812",
      image: Coin25,
      message: "You got 25 coins—solid pick 👍",
   },
   {
      name: "250 coins",
      weight: 20,
      color: "#96090A",
      image: Coin250,
      message: "Big win! 250 coins are yours 💰",
   },
   {
      name: "Gift Card",
      weight: 10,
      color: "#0C0C0A",
      image: GiftCard,
      message: "Awesome! You’ve unlocked a gift card 🎁",
   },
   {
      name: "10 coins",
      weight: 225,
      color: "#E49812",
      image: Coin,
      message: "You earned 10 coins—nice!",
   },
];

export type Prize = {
   name: string;
   message: string;
   image: string;
};
