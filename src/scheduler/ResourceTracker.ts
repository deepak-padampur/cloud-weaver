export interface Server {
  id: string;
  region: string;
  costPerHour: number;
  totalCPU: number;
  usedCPU: number;
  totalMemory: number;
  usedMemory: number;
}

export class ResourceTracker {
  private servers: Server[] = [];

  public addServer(server: Server): void {
    this.servers.push(server);
  }

  public getAvailableServer(region: string, cpu: number, memory: number): Server | null {
    // Find server in the same region with enough resources
    return this.servers.find(s =>
      s.region === region &&
      s.totalCPU - s.usedCPU >= cpu &&
      s.totalMemory - s.usedMemory >= memory
    ) || null;
  }

  public allocateResources(serverId: string, cpu: number, memory: number): boolean {
    const server = this.servers.find(s => s.id === serverId);
    if (server && server.totalCPU - server.usedCPU >= cpu && server.totalMemory - server.usedMemory >= memory) {
      server.usedCPU += cpu;
      server.usedMemory += memory;
      return true;
    }
    return false;
  }

  public listServers(): Server[] {
    return this.servers;
  }
}

export const resourceTracker = new ResourceTracker();
