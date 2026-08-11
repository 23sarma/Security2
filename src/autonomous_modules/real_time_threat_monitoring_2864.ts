export interface ThreatEvent {
  sourceIp: string;
  action: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  timestamp: number;
}

export class ThreatSentinel {
  private eventLog: ThreatEvent[] = [];
  private readonly THRESHOLD = 5;
  private readonly WINDOW_MS = 60000; // 1 minute

  public ingest(event: ThreatEvent): void {
    this.eventLog.push(event);
    this.pruneOldEvents();
    this.analyzeThreats(event.sourceIp);
  }

  private pruneOldEvents(): void {
    const now = Date.now();
    this.eventLog = this.eventLog.filter(e => now - e.timestamp < this.WINDOW_MS);
  }

  private analyzeThreats(sourceIp: string): void {
    const count = this.eventLog.filter(e => e.sourceIp === sourceIp).length;
    if (count >= this.THRESHOLD) {
      this.triggerMitigation(sourceIp, count);
    }
  }

  private triggerMitigation(ip: string, severityCount: number): void {
    console.warn(`[AEGIS-ALERT] Threat detected from ${ip}. Activity count: ${severityCount}. Initiating firewall containment...`);
    // In production, interface with iptables or cloud security groups here.
  }
}
