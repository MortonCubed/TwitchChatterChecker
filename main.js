const { app, BrowserWindow, globalShortcut, ipcMain } = require("electron");
const { Menu } = require('electron');
Menu.setApplicationMenu(null);

let mainWindow;
let currentHotkey = null;   // Track currently registered hotkey

const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 900,
        height: 900,
        resizable: false,
        icon: __dirname + '/mort.ico',
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true,
        }
    });
    mainWindow.loadFile('index.html');
};

app.whenReady().then(() => {
    createWindow();

    ipcMain.on('register-hotkey', (event, newHotkey) => {
        // Unregister previous hotkey if any
        if (currentHotkey) {
            globalShortcut.unregister(currentHotkey);
            console.log(`Unregistered old hotkey: ${currentHotkey}`);
        }

        currentHotkey = newHotkey;

        const isRegistered = globalShortcut.register(newHotkey, () => {
            if (mainWindow && !mainWindow.isDestroyed()) {
                mainWindow.webContents.send('global-hotkey-pressed', newHotkey);
            }
        });

        if (isRegistered) {
            console.log(`✅ Hotkey "${newHotkey}" registered successfully`);
        } else {
            console.log(`❌ Failed to register hotkey "${newHotkey}"`);
        }
    });
});

// Clean up when app closes
app.on('will-quit', () => {
    globalShortcut.unregisterAll();
});