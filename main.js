const { app, BrowserWindow, ipcMain } = require('electron');
const ioHook = require('iohook');

let win;
app.disableHardwareAcceleration();

function eventHandler(event) {
    win.webContents.send('mousemove', event);
  }

function createWindow() {
    win = new BrowserWindow({
        useContentSize: true,
        webPreferences: {
            nodeIntegration: true
        },
        transparent: true,
        autoHideMenuBar: true,
        resizable: false,
        // frame: false,
        opacity: 0.1
    });
    win.loadFile("index.html");

    ioHook.start();
    ioHook.on("mousemove", eventHandler);
}

app.on("ready", () => {
    setTimeout(createWindow, 100);
});

app.on("closed",() => win = null );

app.on("before-quit", () => {
    ioHook.unload();
    ioHook.stop();
});