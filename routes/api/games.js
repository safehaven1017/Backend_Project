const express = require('express');
const router = express.Router();
const models = require('../../models');
const axios = require('axios');
const res = require('express/lib/response');

// route to get all games
router.get('/all_games', (req, res) => {
    models.Game.findAll()
    .then(games => {
        res.json(games);
    })
})

// route for when user picks category and difficulty from Open Trivia API then starts a new game
router.post('/new_game', (req, res) => {
    axios.get('https://opentdb.com/api_category.php')
    .then(categories => {

    })
    
        axios.get('https://opentdb.com/api.php?amount=10')
        .then(questions => {
            models.Game.create({
                name: null,
                category: req.body.category,
                questions: questions.data.results
            }).then(game => {
                res.json(game);
            })    
        })
})

// get game by id
router.get('/:id', (req, res) => {
    models.Game.findByPk(req.params.id)
    .then(game => {
        res.json(game);
    })
})



module.exports = router;