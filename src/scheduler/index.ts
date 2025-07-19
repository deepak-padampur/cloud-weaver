/**
 * 1. Queue First Design – Workloads should enter a queue if no immediate server is available.
 * 
   2. Resource Awareness – We’ll track CPU, memory, and region of servers.

   3. Job States – Every job needs a lifecycle state: PENDING | RUNNING | COMPLETED | FAILED

   4. Extensible for Priority Scheduling – Later we might add priority queues or round-robin vs. cost-aware algorithms.

   Can be re-written with [GO/RUST] for better performance
 */

import { MockProvider } from '../cloud/MockProvider';

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
      id: `job-${Date.now()}-${Math.random().toString(36)}`,
      region,
      type,
      state: 'PENDING',
      createdAt: Date.now(),
    };
    this.queue.push(job);
    console.log(`[Scheduler] Job queued: ${job.id}`);
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
      return true;
    }
    return false;
  }

  public listJob(): Job[] {
    return this.queue;
  }
}

export const scheduler = new Scheduler();
