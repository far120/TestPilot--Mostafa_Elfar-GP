import { app, BrowserWindow } from 'electron'
import { existsSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { dirname, join } from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const DEV_URL = process.env.ELECTRON_START_URL || 'http://localhost:5173/?electron=1'
const DIST_INDEX_PATH = join(__dirname, '..', 'dist', 'index.html')

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1440,
    height: 960,
    minWidth: 1180,
    minHeight: 760,
    backgroundColor: '#f8fafc',
    title: 'TestPilot',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  })

  const startUrl = process.env.ELECTRON_FORCE_DEV === '1' || !existsSync(DIST_INDEX_PATH)
    ? DEV_URL
    : `${pathToFileURL(DIST_INDEX_PATH).toString()}?electron=1`

  void mainWindow.loadURL(startUrl)
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})