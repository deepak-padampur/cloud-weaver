import { ICloudProvider, Instance, InstanceConfig } from './ICloudProvider';

export class MockProvider implements ICloudProvider {
  private instances: Instance[] = [];

  async provisionInstance(config: InstanceConfig): Promise<Instance> {
    const instance: Instance = {
      id: `mock-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      region: config.region,
      status: 'running',
    };
    this.instances.push(instance);
    console.log(`[MockProvider] Provisioned instance: ${instance.id}`);
    return instance;
  }

  async destroyInstance(instanceId: string): Promise<boolean> {
    const index = this.instances.findIndex((i) => i.id === instanceId);
    if (index > -1) {
      console.log(`[MockProvider] Destroyed instance: ${instanceId}`);
      this.instances.splice(index, 1);
      return true;
    }
    return false;
  }

  async getInstanceStatus(instanceId: string): Promise<Instance | null> {
    return this.instances.find((i) => i.id === instanceId) || null;
  }

  async listInstances(): Promise<Instance[]> {
    return this.instances;
  }
}
