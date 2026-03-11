import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  sendTerminalInput: (data: string) => ipcRenderer.send('terminal-input', data),
  onTerminalData: (callback: (data: string) => void) =>
    ipcRenderer.on('terminal-data', (_event, data) => callback(data)),
  onCommandCaptured: (callback: (event: any) => void) =>
    ipcRenderer.on('command-captured', (_event, data) => callback(data)),
  resizeTerminal: (cols: number, rows: number) => ipcRenderer.send('terminal-resize', { cols, rows })
});
