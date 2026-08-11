# FluxSchema-Sync Engine

## Usage
typescript
const engine = new FluxSchemaEngine({ watchDir: './db', outputDir: './types' });
engine.sync({ tableName: 'users', columns: { id: 'number', name: 'string' }, timestamp: Date.now() });

Provides runtime generation of TypeScript definitions to bridge database schema changes with frontend type-safety.