axios.get('https://opentdb.com/api_category.php')
    .then(res => {
        document.querySelector('#categories').innerHTML += res.data.trivia_categories.map(category =>
            `<option value="${category.name}">${category.name}</option>`).join('');
    })

document.addEventListener('submit', event => {
    event.preventDefault();
    axios.post('/api/v1/histories', {
        category: document.querySelector('#categories').value,
        difficulty: document.querySelector('#difficulty').value,
    }).then(history => {
        window.location = `/newGame.html?id=${game.data.id}`;
    })
})