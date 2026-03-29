export type Publisher<T> = {
   subscribe: (subcriber: Subscriber<T>) => void;
   unsubscribe: (subcriber: Subscriber<T>) => void;
   publish: (newState: T) => void;
};

export type Subscriber<T> = (newState: T) => void;
