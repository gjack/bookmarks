const {ipcRenderer} = require('electron')
const  items = require('./items.js')

// Show add modal
$('.open-add-modal').click(() => {
  $('#add-modal').addClass('is-active')
})

// Hide add modal
$('.close-add-modal').click(() => {
  $('#add-modal').removeClass('is-active')
})

// Handle submission in modal
$('#add-button').click(() => {
  let newItemURL = $('#item-input').val()
  if (newItemURL && validURL(newItemURL)) {
    $('#item-input').prop('disabled', true)
    $('#add-button').addClass('is-loading')
    $('.close-add-modal').addClass('is-disabled')
    // Send URL to main process via ipc
    ipcRenderer.send('new-item', newItemURL)
  }
})

ipcRenderer.on('new-item-success', (e, item) => {
  items.toreadItems.push(item)
  items.saveItems()
  items.addItem(item)

  $('#add-modal').removeClass('is-active')
  $('#item-input').prop('disabled', false).val('')
  $('#add-button').removeClass('is-loading')
  $('.close-add-modal').removeClass('is-disabled')
})

// Simulate click on Enter
$('#item-input').keyup((e) => {
  if(e.key === 'Enter') $('#add-button').click()
})

const validURL = (str) => {
  var pattern = new RegExp('^(https?:\\/\\/)?((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|((\\d{1,3}\\.){3}\\d{1,3}))(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*(\\?[;&a-z\\d%_.~+=-]*)?(\\#[-a-z\\d_]*)?$')
  if(!pattern.test(str)) {
    alert("Please enter a valid URL.")
    return false
  } else {
    return true
  }
}
if (items.toreadItems.length) {
  items.toreadItems.forEach(items.addItem)
}
