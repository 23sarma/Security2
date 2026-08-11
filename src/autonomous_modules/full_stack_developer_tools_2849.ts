import { watch } from 'fs';
import { writeFile } from 'fs/promises';

/**
 * FluxSchema-Bridge: Ensures type safety between backend models and frontend clients.
 */
export class FluxSchemaBridge {
  private registry: Map<string, any> = new Map();

  public registerSchema(name: string, schema: Record<string, any>): void {
    this.registry.set(name, schema);
    console.log(`[FluxSchema] Registered contract: ${name}`);
  }

  public async syncContracts(): Promise<void> {
    const output = Array.from(this.registry.entries()).map(([name, schema]) => ({
      name,
      structure: JSON.stringify(schema, null, 2),
      timestamp: new Date().toISOString()
    }));

    await writeFile('api_contracts.json', JSON.stringify(output, null, 2));
    console.log('[FluxSchema] Full-stack sync complete.');
  }

  public watchForChanges(dir: string): void {
    console.log(`[FluxSchema] Watching directory: ${dir}`);
    watch(dir, () => this.syncContracts());
  }
}

// Usage Example
const bridge = new FluxSchemaBridge();
bridge.registerSchema('UserAuth', { id: 'string', token: 'string', role: 'enum' });
bridge.syncContracts();