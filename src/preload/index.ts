import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
const { ipcRenderer } = require('electron')

// Custom APIs for renderer
const api = {
  onDownloadLog: (callback) => ipcRenderer.on("downloadLog", (event, args) => {
    callback(args)
  }),
  onLoadStatus: (callback) => ipcRenderer.on("loadStatus", (event, args) => {
    callback(args)
  }),
  onLoadNickname: (callback) => ipcRenderer.on("loadNickname", (event, args) => {
    callback(args)
  })
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}