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

// if user is logged in, change href in user profile nav button
if (user) {
  document.querySelector('#profile-button').setAttribute('href', `user_profile.html?id=${user.id}`);
}

// logout functionality
document.querySelector('#logout-button').addEventListener('click', (event) => {
  event.preventDefault();
  if (event.target.id == 'logout-button') {
      axios.get('/api/v1/users/logout')
      .then(() => {
          window.localStorage.removeItem('user');
          alert('Successfully Logged Out');
          window.location.reload();
      })
  }
})

// if not logged in, play button will redirect to login, else will go to gamepage
document.querySelector('#home-play-button').addEventListener('click', () => {
  if (user) {
    window.location = '/gamepage.html';
  } else {
    window.location = '/login.html';
  }
})

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