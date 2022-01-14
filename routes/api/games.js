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

// get game by id
router.get('/:id', (req, res) => {
    models.Game.findByPk(req.params.id)
    .then(game => {
        if (!game) {
            res.status(404).json({
                error: 'game does not exist.'
            });
            return;
        }
        res.json(game);
    })
})

// route for when user picks category and difficulty from Open Trivia API then starts a new game
router.post('/new_game', (req, res) => {
    axios.get('https://opentdb.com/api_category.php')
    .then(categories => {
        let categoryID = '';
        let difficulty = '';

        // if the user wants to choose a specific category, will fetch category object from database
        if (req.body.category.toLowerCase() != 'any category') {
            const category = categories.data.trivia_categories.find((currentValue, index) => {
                if (currentValue.name.toLowerCase() == req.body.category.toLowerCase()) {
                    return currentValue
                }
            })
            categoryID = `&category=${category.id}`;
        }

        // if the user wants to choose a specific difficulty, will set difficulty
        if (req.body.difficulty.toLowerCase() != 'any difficulty'){
            difficulty = `&difficulty=${req.body.difficulty.toLowerCase()}`;
        }

        // fetch Open Trivia API questions and create new database entry
        axios.get(`https://opentdb.com/api.php?amount=10${categoryID}${difficulty}`)
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
})

// update game to give it a name after completing game. will simply use game id
router.patch('/:id', (req, res) => {
    models.Game.update(
    {
        name: req.body.name
    },
    {
        where: { id: req.params.id }
    })
    .then(result => {
        if (result == 1) {
            res.send(`Successfully updated game name to ${req.body.name}.`)
        } else {
            res.status(400).json({
                error: 'Unable to update game name'
            })
        }
    })
})

module.exports = router;