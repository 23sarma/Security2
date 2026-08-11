import { spawn, ChildProcess } from 'child_process';
import { EventEmitter } from 'events';

interface PipelineTask {
  id: string;
  scriptPath: string;
  args: string[];
  retries: number;
}

export class PyFlowOrchestrator extends EventEmitter {
  private taskQueue: PipelineTask[] = [];
  private activeProcesses: Map<string, ChildProcess> = new Map();

  public addTask(task: PipelineTask): void {
    this.taskQueue.push(task);
  }

  public async executePipeline(): Promise<void> {
    for (const task of this.taskQueue) {
      await this.runTaskWithRecovery(task);
    }
  }

  private async runTaskWithRecovery(task: PipelineTask, attempt = 0): Promise<void> {
    try {
      await this.spawnPythonProcess(task);
    } catch (error) {
      if (attempt < task.retries) {
        console.warn(`Task ${task.id} failed, retrying (${attempt + 1}/${task.retries})...`);
        return this.runTaskWithRecovery(task, attempt + 1);
      }
      throw new Error(`Task ${task.id} failed after ${task.retries} retries.`);
    }
  }

  private spawnPythonProcess(task: PipelineTask): Promise<void> {
    return new Promise((resolve, reject) => {
      const py = spawn('python3', [task.scriptPath, ...task.args]);
      this.activeProcesses.set(task.id, py);

      py.stdout?.on('data', (data) => console.log(`[${task.id}]: ${data}`));
      py.stderr?.on('data', (data) => console.error(`[${task.id} ERROR]: ${data}`));

      py.on('close', (code) => {
        this.activeProcesses.delete(task.id);
        code === 0 ? resolve() : reject(new Error(`Exit code ${code}`));
      });
    });
  }
}