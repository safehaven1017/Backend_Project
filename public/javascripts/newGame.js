// get id out of URL query parameters
const id = new URLSearchParams(location.search).get('id');

// set initial variables: questionNumber to track game progress, DEFAULT_SECONDS to determine length of timer,
// userAnswers to track answers, startDate to track game duration
let questionNumber = 0;
const DEFAULT_SECONDS = 15;
const userAnswers = [];
const startDate = new Date();

// create var for modal DOM object so that we can toggle it when game is over
var myModal = new bootstrap.Modal(document.querySelector(".modal"));

// function shuffles answers so that correct answer doesn't show up in the same location
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        // we will now switch the locations of two indices
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

// function responsible for generating question/answer html
function displayQuestion(question, correct_answer, incorrect_answers) {
    const answers = incorrect_answers;
    answers.push(correct_answer);
    const shuffledAnswers = shuffleArray(answers);
    document.querySelector('#displayQuestion').innerHTML = question;
    document.querySelector('#answers').innerHTML = shuffledAnswers.map(answer => {
        if (answer == correct_answer) {
            return `<hr style="height:4px; color:rgb(0, 112, 163); width:100%; margin-left: -56px; margin-right: 100px;">
            <button class="answer correct">${answer}</button>`
        } else {
            return `        <hr style="height:4px; color:rgb(0, 112, 163); width:100%; margin-left: -56px; margin-right: -56px;">
            <button class="answer incorrect">${answer}</button>`
        }
    }).join('');
}

// setting timer default duration
let time = DEFAULT_SECONDS;

// fetching game from database
axios.get(`/api/v1/games/${id}`)
    .then(game => {

        // function used to display different question each time user answers question or timer runs out
        function updateQuestion() {
            if (questionNumber < game.data.questions.length) {
                let currentQuestion = game.data.questions[questionNumber].question;
                let currentCorrect = game.data.questions[questionNumber].correct_answer;
                let currentIncorrect = game.data.questions[questionNumber].incorrect_answers;
                displayQuestion(currentQuestion, currentCorrect, currentIncorrect)
            }
        }

        // function responsible for triggering events based on time
        function timer() {
            // if time is 0, push an incorrect answer, trigger click event, and move on to next question
            if (time == 0) {
                questionNumber++;
                userAnswers.push(null);
                document.querySelector('#timer-click').click();
                updateQuestion();
                time = DEFAULT_SECONDS;
                return
                // stop timer if game is finished
            } else if (questionNumber > game.data.questions.length - 1) {
                clearInterval(interval);
                document.querySelector("#timer").innerHTML = 0;
                return
            }
            document.querySelector("#timer").innerHTML = time;
            time--;
        }

        // display first question and start timer.
        updateQuestion();
        let interval = setInterval(() => { timer() }, 1000);

        // event listener for clicking answers
        document.addEventListener("click", (e) => {
            if (e.target.classList.contains("answer")) {
                questionNumber++;
                // if game is not finished, move on to the next question
                if (questionNumber < game.data.questions.length) {
                    updateQuestion();
                    clearInterval(interval);
                    time = DEFAULT_SECONDS;
                    interval = setInterval(() => { timer() }, 1000);
                }
                // if all the questions are not answered, push player's answer into the answers array
                if (questionNumber <= game.data.questions.length) {
                    userAnswers.push(e.target.innerHTML);
                }
                // conditions for end of the game
                if (questionNumber >= game.data.questions.length) {
                    // clear timer interval
                    clearInterval(interval);
                    // calculate game duration
                    const endDate = new Date();
                    const gameTime = endDate.getTime() - startDate.getTime();
                    // calculate score by comparing user answers to question array correct_answers
                    let score = 0;
                    game.data.questions.forEach((question, index) => {
                        if (question.correct_answer == userAnswers[index]) {
                            score++;
                            console.log(question.correct_answer)
                        }
                    });
                    // put score on modal, and display modal
                    document.querySelector("#staticBackdropLabel").innerHTML = `score: ${score}/${game.data.questions.length}`;
                    myModal.toggle();
                    // link to restart game
                    document.querySelector('.again').addEventListener('click', () => {
                        window.location = `/newGame.html?id=${id}`;
                    })
                    // link to make new game
                    document.querySelector('.new').addEventListener('click', () => {
                        window.location = `/gamepage.html`;
                    })
                    // link to finish game and return to home page
                    document.querySelector('.finish').addEventListener('click', () => {
                        window.location = `/index.html`;
                    })
                }
            }
        })
    })








