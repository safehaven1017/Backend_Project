const gameList = document.querySelector('#categories');


axios.get('https://opentdb.com/api_category.php')
    .then(res => {
        gameList.innerHTML = `<option>Any Category</option>` + res.data.trivia_categories.map(category => {
            return `
            <option>${category.name}</option>`
        }).join('')
    })

    


const choices = [Easy, Medium, Hard]
const difficulty = document.querySelector('#difficulty');

difficulty.innerHTML = `<option>${choice}`





// document.addEventListener('click', e => {
//     // if the click happened on a .logout-button
//     if (e.target.classList.contains('newGame')) {
//       // tell the backend to logout
//       axios.get('/new_game')
//       .then(() => {


//         })
//     }
//   })

// one event listener, if the correct answer includes class of ".correctAnswer" then move to next question