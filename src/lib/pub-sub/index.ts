import type { Subscriber, Publisher as TPublisher } from "./types";

export class Publisher<T> implements TPublisher<T> {
   private _subscribers: Subscriber<T>[] = [];
   subscribe(subcriber: Subscriber<T>) {
      this._subscribers.push(subcriber);
   }
   unsubscribe(unsubscriber: Subscriber<T>) {
      this._subscribers = this._subscribers.filter(
         (sub) => sub !== unsubscriber,
      );
   }
   publish(newState: T) {
      this._subscribers.forEach((subscriber) => {
         subscriber(newState);
      });
   }
}
