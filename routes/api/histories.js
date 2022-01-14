const express = require('express');
const router = express.Router();
const models = require('../../models');

router.post('/add_history', (req, res) => {
    models.History.create({
        score: req.body.score,
        answers: req.body.answers,
        userPlayTime: req.body.userPlayTime,
        GameId: req.body.GameId,
        UserId: req.session.user.id
    })
    .then(history => {
        res.json(history);
    })
})

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

router.get('/recent', (req, res) => {
    const page = req.query.page || 1;
    const limit = req.query.count || 1;
    const offset = (page - 1) * limit;
    // find all with search params
    models.History.findAll({
        order: [['createdAt', 'DESC']],
        limit,
        offset,
        // including 'Game' object model, with its own properties
        include: {
            model: models.Game,
            // to use exclude, must use an object as value
            attributes: {
                exclude: ['questions']
            }
        }
    }).then(histories => {
        res.json(histories);
    })
})


module.exports = router;