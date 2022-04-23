// main.js
const update = document.querySelector('#update-button')
const deleteButton = document.querySelector('#delete-button')
const messageDiv = document.querySelector('#message')
var currentTime = new Date();

update.addEventListener('click', _ => {
  // logic for the replace button
  fetch('/classTracker', {
      method: 'put',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'Jesse Fulcher',
        className: '101',
        classDate: currentTime.toISOString().split('T')[0],
        classNotes: 'This was auto added.'
      })
    })
    //checks for response back from app.js
    .then(res => {
      if (res.ok) return res.json()
    })
    //logs response from server.js to console
    .then(response => {
      console.log(response)
      //upon click this will reload the page so it shows the latest data
      window.location.reload(true)
    })
})

//logic for delete button
deleteButton.addEventListener('click', _ => {
  fetch('/classTracker', {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'Darth Vadar'
      })
    })
    .then(res => {
      if (res.ok) return res.json()
    })
    .then(res => {
      if (res === 'No class record to delete') {
        messageDiv.textContent = 'No Darth Vadar class to delete'
      } else {
        window.location.reload(true)
      }
    })
})
