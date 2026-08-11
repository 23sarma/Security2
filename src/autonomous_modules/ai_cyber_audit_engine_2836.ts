/**
 * AegisSentinel - AI Cyber Audit Engine
 * Analyzes source code for structural security vulnerabilities using heuristic pattern matching.
 */

export interface AuditResult {
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  issue: string;
  line: number;
  snippet: string;
}

export class AegisAuditEngine {
  private static VULNERABILITY_PATTERNS = [
    { regex: /eval\(/g, desc: 'Unsafe code execution: eval() detected.', severity: 'CRITICAL' },
    { regex: /new\s+Function\(/g, desc: 'Unsafe code execution: new Function() detected.', severity: 'HIGH' },
    { regex: /process\.env\.[A-Z0-9_]+\s*=\s*/g, desc: 'Hardcoded environment modification.', severity: 'MEDIUM' },
    { regex: /\/\/\s*TODO:\s*disable\s*auth/gi, desc: 'Potential security bypass back-door.', severity: 'CRITICAL' }
  ];

  public static scan(code: string): AuditResult[] {
    const lines = code.split('\n');
    const results: AuditResult[] = [];

    lines.forEach((lineText, index) => {
      this.VULNERABILITY_PATTERNS.forEach(pattern => {
        if (pattern.regex.test(lineText)) {
          results.push({
            severity: pattern.severity as any,
            issue: pattern.desc,
            line: index + 1,
            snippet: lineText.trim()
          });
        }
      });
    });

    return results;
  }
}

// Execution Hook
const engineSample = "const x = eval('console.log(1)'); // TODO: disable auth";
console.table(AegisAuditEngine.scan(engineSample));