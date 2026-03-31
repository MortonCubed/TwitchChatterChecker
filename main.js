const { app,BrowserWindow,globalShortcut,ipcMain } = require("electron");
let mainWindow;
let win = null;

const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 900,
        height: 700,
        resizable: true,
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true,
        }
    });
    mainWindow.loadFile('index.html');
};
app.whenReady().then(() => {
    createWindow();

    const hotkey = '8';   // ←←← Change this to your preferred hotkey

    const isRegistered = globalShortcut.register(hotkey, () => {
        console.log(`🔥 Global hotkey "${hotkey}" pressed!`);

        if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.webContents.send('global-hotkey-pressed', hotkey);
            console.log('✅ Message sent to renderer');
        } else {
            console.log('⚠️ Main window not ready yet');
        }
    });

    if (isRegistered) {
        console.log(`✅ Hotkey "${hotkey}" registered successfully`);
    } else {
        console.log(`❌ Failed to register hotkey "${hotkey}"`);
    }
});

