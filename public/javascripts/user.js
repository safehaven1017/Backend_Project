// check if the user is logged in
// get user info out of localStorage
const user = JSON.parse(window.localStorage.getItem('user'))
// if true
if (user) {
  // find all '.logged-in-only' elements
  const loggedInElements = document.querySelectorAll('.logged-in-only')
  // display them
  for (const element of loggedInElements) {
    element.classList.remove('d-none')
  }
} else {
  // find all '.logged-in-only' elements
  const loggedOutElements = document.querySelectorAll('.logged-out-only')
  // display them
  for (const element of loggedOutElements) {
    element.classList.remove('d-none')
  }
}

// listen to all document events
document.addEventListener('click', e => {
  // if the click happened on a .logout-button
  if (e.target.classList.contains('logout-button')) {
    // tell the backend to logout
    axios.get('/api/v1/users/logout')
    .then(() => {
        // remove the user information
        window.localStorage.removeItem('user')
        // and reload the page
        window.location.reload()
      })
  }
})