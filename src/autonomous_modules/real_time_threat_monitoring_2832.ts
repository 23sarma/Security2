export interface SystemEvent {
  id: string;
  timestamp: number;
  type: 'AUTH_FAILURE' | 'RESOURCE_EXHAUSTION' | 'UNAUTHORIZED_ACCESS';
  severity: number;
  sourceIp: string;
}

export class AEGIS_Sentinel {
  private eventLog: SystemEvent[] = [];
  private readonly THRESHOLD = 5;
  private readonly WINDOW_MS = 60000;

  constructor(private mitigationCallback: (ip: string) => void) {}

  public processEvent(event: SystemEvent): void {
    this.eventLog.push(event);
    this.pruneOldEvents();
    this.analyzeThreats(event.sourceIp);
  }

  private pruneOldEvents(): void {
    const now = Date.now();
    this.eventLog = this.eventLog.filter(e => now - e.timestamp < this.WINDOW_MS);
  }

  private analyzeThreats(ip: string): void {
    const recentThreats = this.eventLog.filter(e => e.sourceIp === ip);
    if (recentThreats.length >= this.THRESHOLD) {
      this.mitigationCallback(ip);
      this.eventLog = this.eventLog.filter(e => e.sourceIp !== ip);
    }
  }

  public getSystemHealth(): number {
    return 1 - (this.eventLog.length / 100);
  }
}