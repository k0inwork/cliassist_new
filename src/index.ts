import { app, BrowserWindow, ipcMain } from 'electron';
import * as pty from 'node-pty';
import * as os from 'os';
import { CommandTracker } from './engine/CommandTracker';

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

if (require('electron-squirrel-startup')) {
  app.quit();
}

let mainWindow: BrowserWindow;
const tracker = new CommandTracker();

const createWindow = (): void => {
  mainWindow = new BrowserWindow({
    height: 768,
    width: 1024,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

const shell = process.platform === 'win32' ? 'powershell.exe' : 'bash';
const ptyProcess = pty.spawn(shell, [], {
  name: 'xterm-color',
  cols: 80,
  rows: 24,
  cwd: os.homedir(),
  env: process.env as Record<string, string>
});

ptyProcess.onData((data) => {
  mainWindow?.webContents.send('terminal-data', data);
});

ipcMain.on('terminal-input', (event, data) => {
  ptyProcess.write(data);
  const commandEvent = tracker.handleInput(data);
  if (commandEvent) {
    mainWindow?.webContents.send('command-captured', commandEvent);
  }
});

ipcMain.on('terminal-resize', (event, { cols, rows }) => {
  ptyProcess.resize(cols, rows);
});
