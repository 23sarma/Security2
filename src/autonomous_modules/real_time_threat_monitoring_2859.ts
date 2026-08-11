interface TelemetryPoint {
  timestamp: number;
  entropy: number;
  cpuUsage: number;
  memUsage: number;
  signature: string;
}

export class ThreatSentinel {
  private window: TelemetryPoint[] = [];
  private readonly THRESHOLD = 0.85;
  private readonly WINDOW_SIZE = 100;

  public processTelemetry(data: TelemetryPoint): boolean {
    this.window.push(data);
    if (this.window.length > this.WINDOW_SIZE) this.window.shift();

    return this.analyze();
  }

  private analyze(): boolean {
    if (this.window.length < 10) return false;

    const avgEntropy = this.window.reduce((acc, p) => acc + p.entropy, 0) / this.window.length;
    const spikeDetected = this.window[this.window.length - 1].cpuUsage > 95;

    // Heuristic: High entropy + High CPU indicates potential obfuscated payload execution
    if (avgEntropy > 0.75 && spikeDetected) {
      this.triggerAlert('CRITICAL_THREAT_DETECTED: Obfuscated Execution Pattern');
      return true;
    }
    return false;
  }

  private triggerAlert(msg: string): void {
    console.error(`[AEGIS_SENTINEL] ${new Date().toISOString()} - ${msg}`);
  }
}