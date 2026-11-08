// F-5M VRAD · envoltorio de escritorio. El simulador va cifrado en index.html (misma pantalla de acceso que la web).
const { app, BrowserWindow, Menu, shell } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1600, height: 1000, minWidth: 1024, minHeight: 700,
    backgroundColor: '#101413', title: 'F-5M VRAD', autoHideMenuBar: true,
    webPreferences: { contextIsolation: true, nodeIntegration: false, sandbox: true, spellcheck: false }
  });
  win.loadFile(path.join(__dirname, 'index.html'));
  win.webContents.setWindowOpenHandler(({ url }) => { if (/^https?:/.test(url)) shell.openExternal(url); return { action: 'deny' }; });
  win.webContents.on('will-navigate', (e, url) => { if (!url.startsWith('file:')) { e.preventDefault(); shell.openExternal(url); } });
}

const isMac = process.platform === 'darwin';
Menu.setApplicationMenu(Menu.buildFromTemplate([
  ...(isMac ? [{ role: 'appMenu' }] : []),
  { label: 'Ver', submenu: [
    { label: 'Pantalla completa', role: 'togglefullscreen', accelerator: isMac ? 'Ctrl+Cmd+F' : 'F11' },
    { label: 'Recargar', role: 'reload', accelerator: 'CmdOrCtrl+R' },
    { type: 'separator' },
    { label: 'Ampliar', role: 'zoomIn' }, { label: 'Reducir', role: 'zoomOut' }, { label: 'Tamaño real', role: 'resetZoom' }
  ]},
  { role: 'editMenu', label: 'Edición' },
  { role: 'windowMenu', label: 'Ventana' }
]));

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});
app.on('window-all-closed', () => { if (!isMac) app.quit(); });
