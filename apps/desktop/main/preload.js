"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld('_global', {
    changeView: () => electron_1.ipcRenderer.invoke('changeView')
});
electron_1.contextBridge.exposeInMainWorld('electronAPI', {
    changeView: (currentTab) => electron_1.ipcRenderer.send('change-view', currentTab)
});
// Since we disabled nodeIntegration we can reintroduce
// needed node functionality here
// process.once('loaded', () => {
//   console.log("loaded,================================================================");
//   (global as any).ipcRenderer = ipcRenderer
// })
