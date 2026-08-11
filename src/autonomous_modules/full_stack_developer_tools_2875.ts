import { EventEmitter } from 'events';

interface SchemaChange {
  tableName: string;
  columns: Record<string, string>;
  timestamp: number;
}

/**
 * FluxSchema-Sync Engine: Auto-generates type-safe interfaces based on live DB metadata.
 */
export class FluxSchemaEngine extends EventEmitter {
  private registry: Map<string, string> = new Map();

  constructor(private config: { watchDir: string; outputDir: string }) {
    super();
  }

  public async sync(payload: SchemaChange): Promise<void> {
    const interfaceDef = this.generateInterface(payload.tableName, payload.columns);
    this.registry.set(payload.tableName, interfaceDef);
    this.emit('schema_updated', { table: payload.tableName, interface: interfaceDef });
  }

  private generateInterface(name: string, schema: Record<string, string>): string {
    const fields = Object.entries(schema)
      .map(([col, type]) => `  ${col}: ${type};`)
      .join('\n');
    return `export interface I${name.charAt(0).toUpperCase() + name.slice(1)} {\n${fields}\n}`;
  }

  public getRegistrySnapshot(): Record<string, string> {
    return Object.fromEntries(this.registry);
  }
}