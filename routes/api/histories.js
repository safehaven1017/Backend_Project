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

// fetch recent games
router.get('/recent', (req, res) => {
    const page = req.query.page || 1;
    const limit = req.query.count || 20;
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
                attributes: ['score', 'userFunRating']
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
            let difficultySum = 0;
            let funSum = 0;
            history.Game.Histories.forEach(hist => {
                difficultySum += hist.score;
                funSum += hist.userFunRating || 0;
                console.log(hist);
            }) 
            history.Game.difficulty = Math.round(difficultySum/history.Game.Histories.length);  
            history.Game.avgFunRating = Math.round(funSum/history.Game.Histories.length);  
            return history
        })
        res.json(historyData);
    })
})

// fetch leaderboard games
router.get('/leaderboard', (req, res) => {
    const page = req.query.page || 1;
    const limit = req.query.count || 20;
    const offset = (page - 1) * limit;
    // find all with search params
    models.History.findAll({
        order: [['score', 'DESC'],['userPlayTime', 'ASC']],
        limit,
        offset,
        // group: ["History.GameId", "History.id", "Game.id"],
        // including 'Game' object model, with its own properties
        include: {
            include: {
                model: models.History,
                attributes: ['score', 'userFunRating']
            },
            // group: ["History.GameId"],
            model: models.Game,
            // to use exclude, must use an object as value
            attributes: {
                // include: [[Sequelize.fn('avg', Sequelize.col('History.score')), 'difficulty']],
                exclude: ['questions']
            },
            order: [models.Game, 'category', 'DESC']
        }
    }).then(histories => {
        const historyData = histories.map(history => {
            history = history.get({ plain: true })
            let difficultySum = 0;
            let funSum = 0;
            history.Game.Histories.forEach(hist => {
                difficultySum += hist.score;
                funSum += hist.userFunRating || 0;
            }) 
            history.Game.difficulty = Math.round(difficultySum/history.Game.Histories.length);  
            history.Game.avgFunRating = Math.round(funSum/history.Game.Histories.length);  
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