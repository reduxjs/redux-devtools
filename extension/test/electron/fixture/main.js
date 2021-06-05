const path = require('path');
const { app, BrowserWindow } = require('electron');

app.on('window-all-closed', app.quit);
app.on('ready', () => {
  BrowserWindow.addDevToolsExtension(
    path.join(__dirname, '../../../build/extension')
  );

  const mainWindow = new BrowserWindow({
    width: 150,
    height: 100,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  mainWindow.loadFile('index.html');
  mainWindow.webContents.openDevTools({ mode: 'detach' });
});
