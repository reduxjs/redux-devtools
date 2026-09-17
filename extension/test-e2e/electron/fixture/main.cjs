// Electron host for the extension e2e tests. Loads the built extension from
// `extension/dist`, opens the shared http fixture page (see
// `test-e2e/fixture/index.html`) in one window and `devpanel.html` in another.
// The test attaches over `--remote-debugging-port`, which the launcher in
// `test-e2e/helpers/electron.ts` passes on the command line.
const path = require('node:path');
const { app, BrowserWindow, session } = require('electron');

const fixtureUrl = process.env.E2E_FIXTURE_URL;
if (!fixtureUrl) {
  throw new Error('E2E_FIXTURE_URL is required');
}

app.on('window-all-closed', () => app.quit());

void app.whenReady().then(async () => {
  const extension = await session.defaultSession.loadExtension(
    path.join(__dirname, '../../../dist'),
  );

  const pageWindow = new BrowserWindow({ width: 400, height: 300 });
  await pageWindow.loadURL(fixtureUrl);

  const panelWindow = new BrowserWindow({ width: 900, height: 600 });
  await panelWindow.loadURL(`chrome-extension://${extension.id}/devpanel.html`);
});
