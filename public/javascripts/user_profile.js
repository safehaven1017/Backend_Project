// get id out of URL query parameters
const id = new URLSearchParams(location.search).get('id');

// converts milliseconds to formatted time
function msToTime(duration) {
    let milliseconds = Math.floor((duration % 1000)),
        seconds = Math.floor((duration / 1000) % 60),
        minutes = Math.floor((duration / (1000 * 60)) % 60)

    minutes = (minutes < 10) ? "0" + minutes : minutes;
    minutes = (minutes == 0) ? "00" : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return minutes + ":" + seconds;
}

// This function will render the questions and answers inside each history record modal
function renderQuestions(questions, answers, historyId) {
    questions.forEach((question, index) => {
        // this section generates the question and the correct answer
        document.querySelector(`#history${historyId}`).innerHTML += `<li class="list-group-item">
            <ol class="list-group list-group-flush" id="history${historyId}-question${index}">
                <h5>${(answers[index] == '') ? question.question + `<span style="color: red;">*</span>`: question.question}</h5>
                <li class="list-group-item list-group-item-success">${question.correct_answer}</li>
            </ol>
        </li>`;
        // this section generates the incorrect answers, if the user answered incorrectly it will highlight the incorrect answer
        const incorrectAnswersHTML = question.incorrect_answers.map(answer => {
            if (answer.toLowerCase() == answers[index].toLowerCase()) {
                return `<li class="list-group-item list-group-item-danger">${answer}</li>`;
            } else {
                return `<li class="list-group-item">${answer}</li>`
            }
        }).join('');
        document.querySelector(`#history${historyId}-question${index}`).innerHTML += incorrectAnswersHTML;
    })
}

function renderUserHistory(searchParams) {
    document.querySelector('#games-container').innerHTML = ''
    // fetching user by id
    axios.get(`/api/v1/users/${id}`)
    .then(user => {
        // display username
        document.querySelector('#username').innerHTML = `Account: ${user.data.username}`;
        // getting game history
        axios.get(`/api/v1/game_histories/${id}${searchParams}`)
        .then(histories => {
            histories.data.forEach(history => {
                const completeDate = new Date(history.createdAt);
                let htmlHistory = `<tr>
                <td>${history.score}</td>
                <td>${history.userFunRating || 'UNRATED'}</td>
                <td>${msToTime(history.userPlayTime)}</td>
                <td>${completeDate.toLocaleString()}</td>
                <td>${history.Game.name || 'UNNAMED'}</td>
                <td>${history.Game.category}</td>
                <!-- Button trigger modal -->
                <td><button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalGame${history.Game.id}">Questions and Answers</button></td>
                <td><a href="/newGame.html?id=${history.Game.id}"><button type="button" class="btn btn-primary">Play Again</button></td>
                </tr>`;
                // get the game data for each history. this will allow us to populate the questions and answers section
                // the questions and answers are displayed with a modal
                axios.get(`/api/v1/games/${history.Game.id}`)
                .then(game => {
                    htmlHistory += `
                    <div class="modal fade" id="modalGame${game.data.id}" tabindex="-1" aria-hidden="true">
                        <div class="modal-dialog modal-lg modal-dialog-scrollable">
                            <div class="modal-content">
                                <div class="modal-body">
                                    <h4>${game.data.name || 'UNNAMED'}</h4>
                                    <p>&quot;<span style="color: red;">*</span>&quot; means that the question was left unanswered.</p>
                                    <ol class="list-group list-group-numbered" id="history${history.id}"></ol>
                                </div>
                            </div>
                        </div>
                    </div>`
                    document.querySelector('#games-container').innerHTML += htmlHistory;
                    renderQuestions(game.data.questions, history.answers, history.id);
                }) 
            });
        })
    })
}

// fetch categories
axios.get('https://opentdb.com/api_category.php')
.then(res => {
    document.querySelector('#categories').innerHTML += res.data.trivia_categories.map(category =>
        `<option value="${category.name}">${category.name}</option>`).join('');
    })

// render based on latest histories
renderUserHistory('');

// render based on category
document.querySelector('#categories').addEventListener('change', (e) => {
    console.log(e.target.value);
    if (e.target.value == 'Any Category' || e.target.value == '') {
        renderUserHistory('');
    } else {
        renderUserHistory(`?category=${encodeURIComponent(e.target.value)}`);
    }
})