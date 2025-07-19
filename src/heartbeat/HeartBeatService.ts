/**
 * @Author Chhanda Charan Suna <deepak-padampur>
 * @Date 20-07-2025
 */
interface HeartbeatRecord {
  instanceId: string;
  lastSeen: number;
}

export class HeartBeatService {
  private heartbeats: Map<string, HeartbeatRecord> = new Map();

  public recordHeartbeat(instanceId: string): void {
    this.heartbeats.set(instanceId, { instanceId, lastSeen: Date.now() });
    console.log(`[Heartbeat] Received from ${instanceId}`);
  }

  public getUnhealthyInstances(timeoutMs = 15000): string[] {
    const now = Date.now();
    const unhealthy: string[] = [];
    this.heartbeats.forEach((hb) => {
      if (now - hb.lastSeen > timeoutMs) {
        unhealthy.push(hb.instanceId);
      }
    });
    return unhealthy;
  }
}
