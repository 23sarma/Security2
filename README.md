# PyFlow-Engine
An autonomous module for managing Python scripts in a TypeScript environment. 

## Usage
typescript
const engine = new PythonPipelineOrchestrator();
await engine.executeTask({ id: 'data_sync', scriptPath: 'sync.py', args: ['--force'], retries: 3 });
