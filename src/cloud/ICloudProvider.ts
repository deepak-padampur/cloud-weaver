export type InstanceStatus = 'pending' | 'running' | 'stopped' | 'error';

export interface InstanceConfig {
  region: string;
  type: string;
  image?: string;
}

export interface Instance {
  id: string;
  region: string;
  status: InstanceStatus;
}

export interface ICloudProvider {
  provisionInstance(config: InstanceConfig): Promise<Instance>;
  destroyInstance(instanceId: string): Promise<boolean>;
  getInstanceStatus(instanceId: string): Promise<Instance | null>;
  listInstances(): Promise<Instance[]>;
}
