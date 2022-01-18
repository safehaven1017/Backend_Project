// get id out of URL query parameters
const id = new URLSearchParams(location.search).get('id');

// display first question & give next question
let questionNumber = 0;
const DEFAULT_SECONDS = 15;
const userAnswers = [];
const startDate = new Date();
var myModal = new bootstrap.Modal(document.querySelector(".modal"));




function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}



function displayQuestion(question, correct_answer, incorrect_answers) {
    const answers = incorrect_answers;
    answers.push(correct_answer);
    const shuffledAnswers = shuffleArray(answers);
    document.querySelector('#displayQuestion').innerHTML = question;
    document.querySelector('#answers').innerHTML = shuffledAnswers.map(answer => {
        if (answer == correct_answer) {
            return `<button class="answer correct">${answer}</button>`
        } else {
            return `<button class="answer incorrect">${answer}</button>`
        }
    }).join('');
}

let time = DEFAULT_SECONDS;
axios.get(`/api/v1/games/${id}`)

    .then(game => {
        function updateQuestion() {
            if (questionNumber < game.data.questions.length) {
                let currentQuestion = game.data.questions[questionNumber].question;
                let currentCorrect = game.data.questions[questionNumber].correct_answer;
                let currentIncorrect = game.data.questions[questionNumber].incorrect_answers;
                displayQuestion(currentQuestion, currentCorrect, currentIncorrect)
            } else {
                console.log("finished game")
            }
        }
        function timer() {
            if (time == 0) {
                questionNumber++;
                updateQuestion();
                time = DEFAULT_SECONDS;
                return
            } else if (questionNumber > game.data.questions.length - 1) {
                clearInterval(interval);
                document.querySelector("#timer").innerHTML = 0;
                return
            }
            document.querySelector("#timer").innerHTML = time;
            time--;
        }
        updateQuestion();
        let interval = setInterval(() => { timer() }, 1000);

        document.addEventListener("click", (e) => {
            if (e.target.classList.contains("answer")) {
                questionNumber++;
                if (questionNumber < game.data.questions.length) {
                    updateQuestion();
                    clearInterval(interval);
                    time = DEFAULT_SECONDS;
                    interval = setInterval(() => { timer() }, 1000);
                }
                if (questionNumber <= game.data.questions.length) {
                    userAnswers.push(e.target.innerHTML);
                }
                if (questionNumber >= game.data.questions.length) {
                    
                    let score = 0;
                    const endDate = new Date();
                    console.log(endDate.getTime());
                    const gameTime = endDate.getTime() - startDate.getTime();
                    console.log(gameTime);
                    game.data.questions.forEach((question, index) => {
                        if (question.correct_answer == userAnswers[index]) {
                            score++;
                            console.log(question.correct_answer)
                        }
                    });
                    document.querySelector("#staticBackdropLabel").innerHTML = `score: ${score}/${game.data.questions.length}`;
                    myModal.toggle();
                    console.log(userAnswers, score)
                }
            }
        })
        // console.log(game.data)
    })








