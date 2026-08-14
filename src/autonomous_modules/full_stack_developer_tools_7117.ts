import { Project, PropertySignature, InterfaceDeclaration } from 'ts-morph';

interface SchemaDiff {
  interfaceName: string;
  fields: { name: string; type: string }[];
}

export class FluxSchemaOrchestrator {
  private project: Project;

  constructor(tsconfigPath: string) {
    this.project = new Project({ tsConfigFilePath: tsconfigPath });
  }

  public extractSchemas(filePath: string): SchemaDiff[] {
    const sourceFile = this.project.getSourceFileOrThrow(filePath);
    return sourceFile.getInterfaces().map(intf => ({
      interfaceName: intf.getName(),
      fields: intf.getProperties().map(prop => ({
        name: prop.getName(),
        type: prop.getType().getText()
      }))
    }));
  }

  public generatePostgresMigration(schemas: SchemaDiff[]): string {
    return schemas.map(s => `
      CREATE TABLE IF NOT EXISTS ${s.interfaceName.toLowerCase()} (
        ${s.fields.map(f => `${f.name} ${this.mapTsToSql(f.type)}`).join(',\n        ')}
      );`).join('\n');
  }

  private mapTsToSql(tsType: string): string {
    const map: Record<string, string> = { 'string': 'TEXT', 'number': 'INTEGER', 'boolean': 'BOOLEAN', 'Date': 'TIMESTAMP' };
    return map[tsType] || 'TEXT';
  }
}