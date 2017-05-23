const {app} = require('electron')
const mainWindow = require('./mainWindow.js')

const path = require('path')
const url = require('url')

require('electron-reload')(__dirname)

app.on('ready', mainWindow.createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    mainWindow.createWindow()
  }
})
