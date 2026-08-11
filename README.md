# Sentinel-Flow
Autonomous behavioral threat detection utility. 

## Usage
typescript
const sentinel = new SentinelFlowDetector(0.7);
if (sentinel.registerEvent('192.168.1.1')) {
  console.warn('Anomaly Detected: Potential Bot Pattern');
}
