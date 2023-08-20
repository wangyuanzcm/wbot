// Native
import { join } from "path";
import { format } from "url";
// Packages
import { BrowserWindow,BrowserView, app, ipcMain, IpcMainEvent } from "electron";
import isDev from "electron-is-dev";

// Prepare the renderer once the app is ready
app.on("ready", async () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: false,
      preload: join(__dirname, "preload.js"),
    },
  });
  const view = new BrowserView()
  mainWindow.setBrowserView(view)
  view.setAutoResize({  width: true, height: true })
  view.webContents.loadURL('https://poe.com/')

  const url = isDev
    ? "http://localhost:3000/"
    : format({
        pathname: join(__dirname, "../renderer/out/index.html"),
        protocol: "file:",
        slashes: true,
      });

  mainWindow.loadURL(url);
});

// Quit the app once all windows are closed
app.on("window-all-closed", app.quit);

// listen the channel `message` and resend the received message to the renderer process
ipcMain.on("message", (event: IpcMainEvent, message: any) => {
  console.log(message);
  setTimeout(() => event.sender.send("message", "hi from electron"), 500);
});
// tabs切换，多标签页切换
//https://blog.csdn.net/m0_72713573/article/details/130037609
ipcMain.on('change-view', (event, viewName) => {
  const view = views[viewName]
  if (view) {
    // don't remove tabbar
    win?.removeBrowserView(views.default)
    win?.removeBrowserView(views.internet)
    win?.addBrowserView(view)
  }
