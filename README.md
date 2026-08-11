# AegisSentinel

A real-time threat monitoring utility. 

## Usage:
`const sentinel = new AegisSentinel((alert) => console.log(alert));`
`sentinel.processEvent({ sourceIp: '192.168.1.1', action: 'LOGIN_FAILURE', severity: 1, timestamp: Date.now() });`