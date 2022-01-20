function msToTime(duration) {
    let milliseconds = Math.floor((duration % 1000)),
        seconds = Math.floor((duration / 1000) % 60),
        minutes = Math.floor((duration / (1000 * 60)) % 60)

    minutes = (minutes < 10) ? "0" + minutes : minutes;
    minutes = (minutes == 0) ? "00" : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return minutes + ":" + seconds;
}

function uniqueArray(array) {
    let seen = {};
    return array.filter(function(item) {
        return seen.hasOwnProperty(item) ? false : (seen[item] = true);
    });
}

// fetch categories
axios.get('https://opentdb.com/api_category.php')
  .then(res => {
    document.querySelector('#categories').innerHTML += res.data.trivia_categories.map(category =>
      `<option value="${category.name}">${category.name}</option>`).join('');
  })

// fetch most recent games
axios.get('/api/v1/game_histories/leaderboard')
    .then(histories => {
        console.log(histories);
        histories.data.forEach(history => {
            let htmlString = `<div class="divTableRow">
            <div class="divTableCell">${history.Game.name}</div>
            <div class="divTableCell category">${history.Game.category}</div>
            <div class="divTableCell">${history.Game.difficulty}</div>
            <div class="divTableCell">${history.score}</div>
            <div class="divTableCell">${history.Game.avgFunRating}</div>
            <div class="divTableCell">${msToTime(history.userPlayTime)}</div>
            `;
            axios.get(`/api/v1/users/${history.UserId}`)
                .then(user => {
                    htmlString += `<div class="divTableCell"><a href="/user_profile.html?id=${history.UserId}">${user.data.username}</a></div>
                    <div class="divTableCell play-button"><a href="/newGame.html?id=${history.Game.id}"><button type="button" class="btn btn-primary">Play Again</button></div>
                    </div>`;
                    document.querySelector('.divTableBody').innerHTML += htmlString;
                })
        })
    })


    


