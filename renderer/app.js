const {ipcRenderer} = require('electron')
const  items = require('./items.js')

// Navigate items with up and down arrow keys
$(document).keydown((e) => {
  switch(e.key) {
    case 'ArrowUp':
      items.changeItem('up')
      break;
    case 'ArrowDown':
      items.changeItem('down')
      break;
  }
})


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

  // If first item being added, select it
  if(items.toreadItems.length === 1) {
    $('.read-item:first()').addClass('is-active')
  }
})

// Simulate click on Enter
$('#item-input').keyup((e) => {
  if(e.key === 'Enter') $('#add-button').click()
})

// Filter items by title
$('#search').keyup((e) => {
  let filter = $(e.currentTarget).val()

  $('.read-item').each((i, el) => {
    $(el).text().toLowerCase().includes(filter) ? $(el).show() : $(el).hide()
  })
})

const validURL = (str) => {
  var pattern = new RegExp('^(https?:\\/\\/)?((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|((\\d{1,3}\\.){3}\\d{1,3}))(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*(\\?[;&a-z\\d%_.~+=-]*)?(\\#[-a-z\\d_]*)?$')
  if(!pattern.test(str)) {
    ipcRenderer.send('invalid-url', 'Please enter a valid URL')
    $('#item-input').val('')
    return false
  } else {
    return true
  }
}
if (items.toreadItems.length) {
  items.toreadItems.forEach(items.addItem)
  $('.read-item:first()').addClass('is-active')
}
