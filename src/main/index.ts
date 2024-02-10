import * as path from "path";
const { app, shell, BrowserWindow, ipcMain } = require('electron')
const { join } = require('path')
const { electronApp, optimizer, is } = require('@electron-toolkit/utils')
import icon from '../../resources/icon.png?asset'
import { Minecraft } from './Minecraft';
import {resolve} from "path";
const {autoUpdater} = require("electron-updater")
const jdk_utils = require("jdk-utils");
const os = require('os');
const storage = require('electron-json-storage');
storage.setDataPath(os.tmpdir());

let mainWindow;
let minecraft;
function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    },
    frame: false
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
  ipcMain.on('minimize', () => mainWindow.minimize())
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC
  ipcMain.on('ping', () => console.log('pong'))
  ipcMain.on('exit', () => app.exit(0))
  ipcMain.on('launch', (event, args) => {
    if (minecraft == null) {
      if (args.nickname == null) {
        return;
      }
      if (args.nickname.length < 3 || args.nickname.length > 16) {
        return;
      }
      storage.set('nickname', { nickname: args.nickname },  function(error) {
        if (error) throw error;
      })
      minecraft = new Minecraft(args.nickname, "tehnomagic", "1.18.2", {
        forge: true,
        packLink: "https://s3.timeweb.cloud/38b3c5cc-e00247ee-d830-403a-94a7-a3ce494ed498/FTPack1.zip",
        downloads: [
          {
            "url": "https://s3.timeweb.cloud/38b3c5cc-e00247ee-d830-403a-94a7-a3ce494ed498/forge-1.18.2-40.2.17-installer.jar",
            "to": path.join("forge", "1.18.2"),
            "name": "installer.jar"
          },
          {
            "url": "https://s3.timeweb.cloud/38b3c5cc-e00247ee-d830-403a-94a7-a3ce494ed498/FTMods1.zip",
            "to": path.join("mods"),
            "name": "mods.zip",
            "unzip": true
          }
        ]
      });
      setInterval(() => {
        mainWindow.webContents.send("downloadLog", minecraft.loadData)
        mainWindow.webContents.send("loadStatus", minecraft.loadStatus)
      }, 10)
      minecraft.launch();
    }
  })

  ipcMain.on('update', (event, args) => {
    if (minecraft == null) {
      minecraft = new Minecraft(args.nickname,"tehnomagic", "1.18.2", {
        forge: true,
        packLink: "https://s3.timeweb.cloud/38b3c5cc-e00247ee-d830-403a-94a7-a3ce494ed498/FTPack1.zip",
        downloads: [
          {
            "url": "https://s3.timeweb.cloud/38b3c5cc-e00247ee-d830-403a-94a7-a3ce494ed498/forge-1.18.2-40.2.17-installer.jar",
            "to": path.join("forge", "1.18.2"),
            "name": "installer.jar"
          },
          {
            "url": "https://s3.timeweb.cloud/38b3c5cc-e00247ee-d830-403a-94a7-a3ce494ed498/FTMods1.zip",
            "to": path.join("mods"),
            "name": "mods.zip",
            "unzip": true
          }
        ],
        forgeForceUpdate: true
      });
      setInterval(() => {
        mainWindow.webContents.send("downloadLog", minecraft.loadData)
        mainWindow.webContents.send("loadStatus", minecraft.loadStatus)
      }, 10)
      minecraft.launch();
    }
  })

  createWindow()
  setTimeout(() => {
    storage.get('nickname', (error, data) => {
      if (error) throw error;
      mainWindow.webContents.send("loadNickname", data.nickname)
    })
    jdk_utils.findRuntimes().then((data) => {
      mainWindow.webContents.send("javaList", data.filter(runtime => runtime.homedir.includes("17")))
    })
  }, 1000)

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
  autoUpdater.checkForUpdates();
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

autoUpdater.on("update-available", () => {
  console.log()
})
autoUpdater.on("checking-for-update", () => {
  console.log()
})
autoUpdater.on("download-progress", () => {
  console.log()
})
autoUpdater.on("update-downloaded", () => {
  console.log()
})