import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { CommandEvent, World } from '../common/types';
import { v4 as uuidv4 } from 'uuid';

export class LogLearner {
  parseHistory(): CommandEvent[] {
    const home = os.homedir();
    const bashHistory = path.join(home, '.bash_history');
    const zshHistory = path.join(home, '.zsh_history');

    let commands: CommandEvent[] = [];

    if (fs.existsSync(bashHistory)) {
      commands = commands.concat(this.parseBash(bashHistory));
    }

    if (fs.existsSync(zshHistory)) {
      commands = commands.concat(this.parseZsh(zshHistory));
    }

    return commands;
  }

  parseCorpus(corpusPath: string): CommandEvent[] {
    if (!fs.existsSync(corpusPath)) return [];

    const lines = fs.readFileSync(corpusPath, 'utf8').split('\n');
    const commands: CommandEvent[] = [];

    for (let line of lines) {
      // Look for lines starting with user@ubuntu:~$ or user@ubuntu:~/...$
      // and strip the prompt
      const match = line.match(/^[\w.]+@[\w.-]+:[~\w./-]*\$\s+(.+)$/);
      if (match) {
        const cmd = match[1].trim();
        if (cmd) {
          commands.push({
            id: uuidv4(),
            commandLine: cmd,
            argv: cmd.split(/\s+/),
            cwd: '',
            stdout: '',
            stderr: '',
            exitCode: 0,
            startedAt: Date.now(),
            finishedAt: Date.now(),
            duration: 0
          });
        }
      }
    }

    return commands;
  }

  private parseBash(filePath: string): CommandEvent[] {
    const lines = fs.readFileSync(filePath, 'utf8').split('\n');
    return lines.filter(l => l.trim() && !l.startsWith('#')).map(line => ({
      id: uuidv4(),
      commandLine: line,
      argv: line.split(/\s+/),
      cwd: '',
      stdout: '',
      stderr: '',
      exitCode: 0,
      startedAt: Date.now(),
      finishedAt: Date.now(),
      duration: 0
    }));
  }

  private parseZsh(filePath: string): CommandEvent[] {
    const lines = fs.readFileSync(filePath, 'utf8').split('\n');
    return lines.filter(l => l.trim()).map(line => {
      const parts = line.split(';');
      const cmd = parts.length > 1 ? parts.slice(1).join(';') : line;
      return {
        id: uuidv4(),
        commandLine: cmd,
        argv: cmd.split(/\s+/),
        cwd: '',
        stdout: '',
        stderr: '',
        exitCode: 0,
        startedAt: Date.now(),
        finishedAt: Date.now(),
        duration: 0
      };
    });
  }

  async learnCustomWorld(commands: CommandEvent[], baseWorld: World): Promise<World> {
    const learnedTensors = { ...baseWorld.tensors };
    // Future implementation: cluster commands and create new tensors
    return {
      ...baseWorld,
      id: `custom_world_${Date.now()}`,
      tensors: learnedTensors
    };
  }
}
