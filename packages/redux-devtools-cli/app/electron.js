// Based on https://github.com/electron/electron-quick-start

const { app, BrowserWindow } = require('electron');
const argv = require('minimist')(process.argv.slice(2));

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
  });

  mainWindow.loadURL('http://localhost:' + (argv.port ? argv.port : 8000));
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
