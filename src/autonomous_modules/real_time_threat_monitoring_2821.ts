export interface ThreatEvent {
  sourceIp: string;
  action: string;
  severity: number;
  timestamp: number;
}

export class AegisSentinel {
  private eventWindow: ThreatEvent[] = [];
  private readonly THRESHOLD = 5;
  private readonly TIME_WINDOW_MS = 60000;

  constructor(private alertCallback: (report: any) => void) {}

  public processEvent(event: ThreatEvent): void {
    this.eventWindow.push(event);
    this.pruneOldEvents();
    this.analyzeBehavior(event.sourceIp);
  }

  private pruneOldEvents(): void {
    const now = Date.now();
    this.eventWindow = this.eventWindow.filter(e => now - e.timestamp < this.TIME_WINDOW_MS);
  }

  private analyzeBehavior(sourceIp: string): void {
    const eventsBySource = this.eventWindow.filter(e => e.sourceIp === sourceIp);
    
    if (eventsBySource.length >= this.THRESHOLD) {
      this.alertCallback({
        type: 'SECURITY_ALERT',
        severity: 'CRITICAL',
        source: sourceIp,
        message: `High frequency threat patterns detected from ${sourceIp}`,
        threatCount: eventsBySource.length,
        timestamp: new Date().toISOString()
      });
    }
  }
}