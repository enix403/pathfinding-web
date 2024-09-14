import { VoidCallback } from "~/types/utility";
import { EventEmitter } from "eventemitter3";

export type AllowedEvents = Record<string, any>;
export type EventNames<T> = keyof T;
export type EventPayload<T, E extends EventNames<T>> = T[E];
export type EventListener<T, E extends EventNames<T>> = VoidCallback<
  EventPayload<T, E>
>;

type PickVoid<T> = {
  [K in keyof T as T[K] extends void ? K : never]: T[K];
};

type VoidEventNames<T> = keyof PickVoid<T>;

// type dawdwa = keyof PickVoid<{a: number, b: void}>;

type NativeEventsType<T> = {
  [E in EventNames<T>]: EventListener<T, E>;
};

// The built-in typings for EventEmitter are horribly broken. Here we implement
// a fresh and simple set of typings for it according to our needs.
// ...
// @ts-ignore
export class AppEmitter<
  T extends AllowedEvents = AllowedEvents
> extends EventEmitter<NativeEventsType<T>> {
  // @ts-ignore
  public on<E extends EventNames<T>>(
    event: E,
    fn: EventListener<T, E>,
    context?: any
  ): this {
    return (super.on as any)(event, fn, context);
  }

  // @ts-ignore
  public off<E extends EventNames<T>>(
    event: E,
    fn: EventListener<T, E>,
    context?: any,
    once?: boolean
  ): this {
    return (super.off as any)(event, fn, context, once);
  }

  // @ts-ignore
  public emit<E extends VoidEventNames<T>>(event: E): boolean;
  // @ts-ignore
  public emit<E extends EventNames<T>>(event: E, payload: T[E]): boolean;
  // @ts-ignore
  public emit<E extends EventNames<T>>(event: E, payload?: T[E]): boolean {
    return (super.emit as any)(event, payload);
  }
}

/* ============================================= */

export class SubscriptionSink {
  private handlers: VoidCallback[];

  public constructor() {
    this.handlers = [];
  }

  public static oneshot<T extends AllowedEvents, E extends EventNames<T>>(
    emitter: AppEmitter<T>,
    event: E,
    fn: EventListener<T, E>
  ) {
    emitter.on(event, fn);
    return () => {
      emitter.off(event, fn);
    };
  }

  public manual(unsubscribe: VoidCallback) {
    this.handlers.push(unsubscribe);
  }

  public event<T extends AllowedEvents, E extends EventNames<T>>(
    emitter: AppEmitter<T>,
    event: E,
    fn: EventListener<T, E>
  ) {
    this.handlers.push(SubscriptionSink.oneshot(emitter, event, fn));
  }

  public unsubscribeAll = () => {
    while (this.handlers.length) {
      this.handlers.pop()!();
    }
  };
}
