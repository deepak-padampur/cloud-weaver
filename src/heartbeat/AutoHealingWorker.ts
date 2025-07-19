import { heartbeatService } from "./HeartBeatService";
import { scheduler } from "../scheduler";
import { MockProvider } from "../cloud/MockProvider";

const cloudProvider = new MockProvider();


export class AutoHealingWorker {
  public async run(intervalMs = 5000): Promise<void> {
    setInterval(async () => {
      const unhealthy = heartbeatService.getUnhealthyInstances();
      if (unhealthy.length > 0) {
        console.log(`[AutoHeal] Found unhealthy instances: ${unhealthy.join(", ")}`);
        for (const instanceId of unhealthy) {
          // Remove old instance
          await cloudProvider.destroyInstance(instanceId);

          // Start a replacement
          console.log(`[AutoHeal] Replacing ${instanceId}`);
          scheduler.addJob("us-east", "standard");
          scheduler.scheduleNext();
        }
      }
    }, intervalMs);
  }
}

export const autoHealingWorker = new AutoHealingWorker();