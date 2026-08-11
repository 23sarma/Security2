interface ThreatEvent {
  sourceIp: string;
  action: 'login' | 'request' | 'upload';
  severity: number;
  timestamp: number;
}

export class AegisSentinel {
  private registry: Map<string, ThreatEvent[]> = new Map();
  private readonly WINDOW_MS = 60000;
  private readonly THRESHOLD = 5;

  public processEvent(event: ThreatEvent): { isThreat: boolean; score: number } {
    const now = Date.now();
    const history = (this.registry.get(event.sourceIp) || []).filter(e => now - e.timestamp < this.WINDOW_MS);
    
    history.push(event);
    this.registry.set(event.sourceIp, history);

    const totalScore = history.reduce((acc, curr) => acc + curr.severity, 0);
    
    if (history.length > this.THRESHOLD || totalScore > 10) {
      this.triggerIsolationProtocol(event.sourceIp);
      return { isThreat: true, score: totalScore };
    }

    return { isThreat: false, score: totalScore };
  }

  private triggerIsolationProtocol(ip: string): void {
    console.warn(`[AEGIS_CRITICAL] Isolation triggered for node: ${ip}`);
    // Integration hook for firewall/WAF API would go here
  }
}