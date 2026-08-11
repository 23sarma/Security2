/**
 * Sentinel-Flow: Autonomous Behavioral Anomaly Detector
 * Monitors request entropy to detect non-human, automated patterns.
 */

interface RequestMetric {
  timestamp: number;
  entropy: number;
  originIp: string;
}

export class SentinelFlowDetector {
  private windowSize: number = 5000; // ms
  private threshold: number = 0.85;
  private requestHistory: RequestMetric[] = [];

  constructor(private sensitivity: number = 0.5) {}

  public registerEvent(ip: string): boolean {
    const now = Date.now();
    const metric: RequestMetric = {
      timestamp: now,
      entropy: Math.random(), // Simulated entropy calculation based on inter-arrival time variance
      originIp: ip
    };

    this.requestHistory.push(metric);
    this.cleanup(now);

    return this.analyzeTrafficPattern(ip);
  }

  private cleanup(now: number): void {
    this.requestHistory = this.requestHistory.filter(m => now - m.timestamp < this.windowSize);
  }

  private analyzeTrafficPattern(ip: string): boolean {
    const ipEvents = this.requestHistory.filter(m => m.originIp === ip);
    if (ipEvents.length < 10) return false;

    const avgEntropy = ipEvents.reduce((acc, curr) => acc + curr.entropy, 0) / ipEvents.length;
    
    // If entropy is suspiciously low, traffic is likely automated (repetitive)
    return avgEntropy < (this.threshold - (this.sensitivity * 0.1));
  }
}