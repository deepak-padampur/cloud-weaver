import { heartbeatService } from './HeartBeatService';
import { scheduler } from '../scheduler';
import { MockProvider } from '../cloud/MockProvider';
import { eventQueue, EVENT_TYPES } from '../events/EventQueue';

const cloudProvider = new MockProvider();

export class AutoHealingWorker {
  public async run(intervalMs = 5000): Promise<void> {
    setInterval(async () => {
      const unhealthy = heartbeatService.getUnhealthyInstances();
      if (unhealthy.length > 0) {
        console.log(
          `[AutoHeal] Found unhealthy instances: ${unhealthy.join(', ')}`,
        );

        for (const instanceId of unhealthy) {
          eventQueue.publish(EVENT_TYPES.INSTANCE_FAILED, { instanceId });
          // Remove old instance
          await cloudProvider.destroyInstance(instanceId);

          // Start a replacement
          console.log(`[AutoHeal] Replacing ${instanceId}`);
          
          scheduler.addJob('us-east', 'standard');
          scheduler.scheduleNext();
          eventQueue.publish(EVENT_TYPES.INSTANCE_REPLACED, { oldInstance: instanceId });
        }
      }
    }, intervalMs);
  }
}

export const autoHealingWorker = new AutoHealingWorker();
