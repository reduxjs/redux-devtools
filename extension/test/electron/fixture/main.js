const path = require('path');
const { app, BrowserWindow, session } = require('electron');

app.on('window-all-closed', app.quit);
app.whenReady().then(async () => {
  await session.defaultSession.loadExtension(
    path.join(__dirname, '../../../dist'),
    { allowFileAccess: true },
  );

  const mainWindow = new BrowserWindow({
    width: 150,
    height: 100,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  mainWindow.loadFile('index.html');
  mainWindow.webContents.openDevTools({ mode: 'detach' });
});
