const gameList = document.querySelector('#categories');


axios.get('https://opentdb.com/api_category.php')
    .then(res => {
        gameList.innerHTML = `<option>Any Category</option>` + res.data.trivia_categories.map(category => {
            return `
            <option>${category.name}</option>`
        }).join('')
    })




const difficulty = document.querySelector('#difficulty');


const main = document.querySelector('.main')
const categories = document.querySelector("#categories")

document.addEventListener('click', e => {
    // if the click happened on a .logout-button
    if (e.target.classList.contains('newGame')) {
      // tell the backend to logout
      console.log(document.querySelector('#categories').value, document.querySelector('#difficulty').value)
      axios.post(`/api/v1/games/new_game`, {
        category: document.querySelector('#categories').value,
        difficulty: document.querySelector('#difficulty').value,
    })
      .then((game) => {
        window.location = `/newGame.html?${game.data.id}`
        })
    }
  })

  
// one event listener, if the correct answer includes class of ".correctAnswer" then move to next question