axios.get('https://opentdb.com/api.php?amount=12')
.then(res => {
    console.log(res.data.results);
    document.querySelector('#cards-container').innerHTML = res.data.results.map(question => {
        return `<div class="flip-card">
        <div class="flip-card-inner">
          <div class="flip-card-front">
            <h5 class="h5-question">${question.question}</h5>
          </div>
          <div class="flip-card-back">
            <h5 class="h5-question">${question.correct_answer}</h5>
          </div>
        </div>
      </div>`
    }).join('');
})