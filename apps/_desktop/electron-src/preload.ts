import { contextBridge, ipcRenderer, IpcRenderer } from 'electron'

declare global {
  namespace NodeJS {
    interface Global {
      ipcRenderer: IpcRenderer;
    }
  }
}

contextBridge.exposeInMainWorld('_global', {
  changeView: () => ipcRenderer.invoke('changeView')
})

contextBridge.exposeInMainWorld('electronAPI', {
  changeView: (currentTab: string) => ipcRenderer.send('change-view', currentTab)
})


// Since we disabled nodeIntegration we can reintroduce
// needed node functionality here
// process.once('loaded', () => {
//   console.log("loaded,================================================================");
//   (global as any).ipcRenderer = ipcRenderer
// })
