/**
 * 1. Queue First Design – Workloads should enter a queue if no immediate server is available.
 * 
   2. Resource Awareness – We’ll track CPU, memory, and region of servers.

   3. Job States – Every job needs a lifecycle state: PENDING | RUNNING | COMPLETED | FAILED

   4. Extensible for Priority Scheduling – Later we might add priority queues or round-robin vs. cost-aware algorithms.

   Can be re-written with [GO/RUST] for better performance
 */

import { MockProvider } from '../cloud/MockProvider';
import { EVENT_TYPES, eventQueue } from '../events/EventQueue';
import { resourceTracker } from './ResourceTracker';

export type JobState = 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';

export interface Job {
  id: string;
  region: string;
  type: string;
  state: JobState;
  createdAt: number;
}

const cloudProvider = new MockProvider();

export class Scheduler {
  private queue: Job[] = [];

  public addJob(region: string, type: string): Job {
    const job: Job = {
      id: `job-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      region,
      type,
      state: 'PENDING',
      createdAt: Date.now(),
    };
    this.queue.push(job);
    console.log(`[Scheduler] Job queued: ${job.id}`);

    eventQueue.publish(EVENT_TYPES.JOB_SCHEDULED, job);

    return job;
  }

  public async scheduleNext(): Promise<Job | null> {
    const job = this.queue.find((j) => j.state === 'PENDING');
    if (job) {
      job.state = 'RUNNING';
      const instance = await cloudProvider.provisionInstance({
        region: job.region,
        type: job.type,
      });
      console.log(
        `[Scheduler] Allocated instance ${instance.id} for job ${job.id}`,
      );
      return job;
    }
    return null;
  }

  public completeJob(jobId: string): boolean {
    const job = this.queue.find((j) => j.id === jobId);
    if (job) {
      job.state = 'COMPLETED';
      console.log(`[Scheduler] Job completed: ${job.id}`);
      eventQueue.publish(EVENT_TYPES.JOB_COMPLETED, { jobId });
      return true;
    }
    return false;
  }

  public listJob(): Job[] {
    return this.queue;
  }
}

export class SmartScheduler {
  // Add job with resource requirements
  public async scheduleJob(region: string, type: string, cpu = 1, memory = 512): Promise<any> {
    console.log(`[SmartScheduler] Attempting to schedule job in ${region}`);

    // Step 1: Check existing servers
    const server = resourceTracker.getAvailableServer(region, cpu, memory);
    if (server) {
      resourceTracker.allocateResources(server.id, cpu, memory);
      console.log(`[SmartScheduler] Job scheduled on server ${server.id}`);
      eventQueue.publish(EVENT_TYPES.JOB_SCHEDULED, { region, type, serverId: server.id });
      return { status: "scheduled", serverId: server.id };
    }

    // Step 2: Provision new server if none available
    const instance = await cloudProvider.provisionInstance({ region, type });
    resourceTracker.addServer({
      id: instance.id,
      region: instance.region,
      costPerHour: 0.10, // mock cost
      totalCPU: 4,
      usedCPU: cpu,
      totalMemory: 4096,
      usedMemory: memory,
    });

    console.log(`[SmartScheduler] New server provisioned: ${instance.id}`);
    eventQueue.publish(EVENT_TYPES.JOB_SCHEDULED, { region, type, serverId: instance.id });
    return { status: "scheduled", serverId: instance.id };
  }
}

export const smartScheduler = new SmartScheduler();
export const scheduler = new Scheduler();

