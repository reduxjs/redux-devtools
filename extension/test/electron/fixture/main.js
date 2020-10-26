const path = require('path');
const { app, BrowserWindow } = require('electron');

app.setPath('userData', path.join(__dirname, '../tmp'));

app.on('window-all-closed', app.quit);
app.on('ready', () => {
  BrowserWindow.addDevToolsExtension(
    path.join(__dirname, '../../../build/extension')
  );

  const mainWindow = new BrowserWindow({
    width: 150,
    height: 100
  });
  mainWindow.loadURL(`file://${__dirname}/index.html`);
  mainWindow.openDevTools({ detach: true });
});
