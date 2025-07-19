import { eventQueue } from "./EventQueue";
import { Event } from "./EventQueue";

eventQueue.subscribe((event: Event) => {
  console.log(`[LoggerSubscriber] Event received: ${event.type}`, event.payload);
});
