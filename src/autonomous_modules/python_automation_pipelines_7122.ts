import { spawn, execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

interface PipelineTask {
  name: string;
  script: string;
  dependencies: string[];
}

export class PythonPipelineOrchestrator {
  private venvPath: string;

  constructor(private projectRoot: string) {
    this.venvPath = path.join(projectRoot, '.venv');
  }

  async initializeEnv(): Promise<void> {
    if (!fs.existsSync(this.venvPath)) {
      execSync(`python3 -m venv ${this.venvPath}`);
    }
  }

  async executePipeline(tasks: PipelineTask[]): Promise<void> {
    const completedTasks = new Set<string>();

    for (const task of tasks) {
      if (task.dependencies.every(dep => completedTasks.has(dep))) {
        console.log(`[EXEC] Running task: ${task.name}`);
        await this.runTask(task);
        completedTasks.add(task.name);
      } else {
        throw new Error(`Dependency error for task ${task.name}`);
      }
    }
  }

  private runTask(task: PipelineTask): Promise<void> {
    return new Promise((resolve, reject) => {
      const pythonBin = process.platform === 'win32' 
        ? path.join(this.venvPath, 'Scripts', 'python.exe') 
        : path.join(this.venvPath, 'bin', 'python');
      
      const child = spawn(pythonBin, ['-c', task.script]);
      
      child.stdout.on('data', (d) => console.log(`[${task.name}] stdout: ${d}`));
      child.on('close', (code) => code === 0 ? resolve() : reject(`Task ${task.name} failed.`));
    });
  }
}