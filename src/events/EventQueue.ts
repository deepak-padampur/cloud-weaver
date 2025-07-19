export interface Event {
  id: string;
  type: string;         // e.g., JOB_SCHEDULED, INSTANCE_FAILED
  payload: any;
  timestamp: number;
}

type EventHandler = (event: Event) => void | Promise<void>;

export const EVENT_TYPES = {
  JOB_SCHEDULED: "JOB_SCHEDULED",
  JOB_COMPLETED: "JOB_COMPLETED",
  INSTANCE_FAILED: "INSTANCE_FAILED",
  INSTANCE_REPLACED: "INSTANCE_REPLACED",
};


export class EventQueue {
  private queue: Event[] = [];
  private handlers: EventHandler[] = [];

  public publish(type: string, payload: any): void {
    const event: Event = {
      id: `evt-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      type,
      payload,
      timestamp: Date.now(),
    };
    this.queue.push(event);
    console.log(`[EventQueue] Published event: ${event.type}`);
    this.notifyHandlers(event);
  }

  public subscribe(handler: EventHandler): void {
    this.handlers.push(handler);
  }

  private notifyHandlers(event: Event): void {
    for (const handler of this.handlers) {
      try {
        handler(event);
      } catch (err) {
        console.error(`[EventQueue] Error handling event: ${err}`);
      }
    }
  }

  public listEvents(): Event[] {
    return this.queue;
  }
}

export const eventQueue = new EventQueue();
