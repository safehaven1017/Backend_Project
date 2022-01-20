const express = require('express');
const router = express.Router();
const models = require('../../models');
const Sequelize = require('sequelize');

// add history of game user just completed
router.post('/add_history', (req, res) => {
    models.History.create({
        score: req.body.score,
        userFunRating: req.body.userFunRating,
        answers: req.body.answers,
        userPlayTime: req.body.userPlayTime,
        GameId: req.body.GameId,
        UserId: req.session.user.id
    })
        .then(history => {
            res.json(history);
        })
})

// rate a game after game has already been completed
router.patch('/rate_game/:id', (req, res) => {
    models.History.update(
        {
            userFunRating: req.body.userFunRating
        },
        {
            where: { id: req.params.id }
        })
        .then(result => {
            if (result == 1) {
                res.send(`Successfully rated game.`)
            } else {
                res.status(400).json({
                    error: 'Unable to rate game / game does not exit.'
                })
            }
        })
})

// fetch games
router.get('/recent', (req, res) => {
    const page = req.query.page || 1;
    const limit = req.query.count || 1;
    const offset = (page - 1) * limit;
    // find all with search params
    models.History.findAll({
        order: [['createdAt', 'DESC']],
        limit,
        offset,
        // group: ["History.GameId", "History.id", "Game.id"],
        // including 'Game' object model, with its own properties
        include: {
            include: {
                model: models.History,
                attributes: ['score']
            },
            // group: ["History.GameId"],
            model: models.Game,
            // to use exclude, must use an object as value
            attributes: {
                // include: [[Sequelize.fn('avg', Sequelize.col('History.score')), 'difficulty']],
                exclude: ['questions']
            }
        }
    }).then(histories => {
        const historyData = histories.map(history => {
            history = history.get({ plain: true })
            let sum = 0
            history.Game.Histories.forEach(hist => {
                sum += hist.score;
            }) 
            history.Game.difficulty = Math.round(sum/history.Game.Histories.length);  
            return history
        })
        res.json(historyData);
    })
})

// fetch all games associated with user id
router.get('/:id', (req, res) => {
    models.History.findAll({
        order: [['createdAt', 'DESC']],
        include: {
            model: models.Game,
            // to use exclude, must use an object as value
            attributes: {
                exclude: ['questions']
            }
        },
        where: { UserId: req.params.id }
    })
        .then(histories => {
            res.json(histories);
        })
})


module.exports = router;