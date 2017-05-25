const {app, ipcMain} = require('electron')
const mainWindow = require('./mainWindow.js')
const readItem = require('./readItem.js')

const path = require('path')
const url = require('url')

require('electron-reload')(__dirname)

ipcMain.on('new-item', (e, itemURL) => {

  readItem(itemURL, (item) => {
    e.sender.send('new-item-success', item)
  })
})

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
