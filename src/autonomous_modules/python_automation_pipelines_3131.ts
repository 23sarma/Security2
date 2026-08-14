import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs/promises';

const execAsync = promisify(exec);

interface PipelineTask {
  id: string;
  scriptPath: string;
  args: string[];
  retries: number;
}

export class PythonPipelineOrchestrator {
  private stateDir: string = './.pipeline_state';

  constructor() {
    this.init();
  }

  private async init() {
    await fs.mkdir(this.stateDir, { recursive: true });
  }

  async executeTask(task: PipelineTask): Promise<boolean> {
    let attempts = 0;
    while (attempts <= task.retries) {
      try {
        console.log(`Executing ${task.id} (Attempt ${attempts + 1})...`);
        const cmd = `python3 ${task.scriptPath} ${task.args.join(' ')}`;
        const { stdout, stderr } = await execAsync(cmd);
        
        await fs.writeFile(`${this.stateDir}/${task.id}.log`, stdout);
        return true;
      } catch (error) {
        attempts++;
        if (attempts > task.retries) {
          console.error(`Task ${task.id} failed after ${task.retries} retries.`);
          return false;
        }
      }
    }
    return false;
  }

  async batchProcess(tasks: PipelineTask[]) {
    const results = await Promise.all(tasks.map(t => this.executeTask(t)));
    return results.every(r => r === true);
  }
}