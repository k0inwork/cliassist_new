import { v4 as uuidv4 } from 'uuid';
import { CommandEvent } from '../common/types';

export class CommandTracker {
  private currentBuffer = '';

  handleInput(data: string): CommandEvent | null {
    if (data === '\r' || data === '\n') {
      const command = this.currentBuffer.trim();
      this.currentBuffer = '';
      if (command) {
        return {
          id: uuidv4(),
          commandLine: command,
          argv: command.split(/\s+/),
          cwd: process.cwd(),
          stdout: '',
          stderr: '',
          exitCode: 0,
          startedAt: Date.now(),
          finishedAt: Date.now(),
          duration: 0
        };
      }
    } else if (data === '\u007f') { // Backspace
      this.currentBuffer = this.currentBuffer.slice(0, -1);
    } else {
      // Very simple: only collect printable chars for now
      if (data.length === 1 && data >= ' ') {
        this.currentBuffer += data;
      }
    }
    return null;
  }
}
