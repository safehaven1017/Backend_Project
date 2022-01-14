var express = require('express');
var router = express.Router();
const models = require('../../models')
const bcrypt = require('bcrypt')

/* POST /api/v1/users/register */
router.post('/register', function(req, res, next) {
  // check for all required fields
  if (!req.body.username || !req.body.password) {
    res.status(400).json({
      error: 'please include all required fields'
    })
    return
  }
  
  // check if user already exists
  models.User.findAll({
    where: {
      username: req.body.username
    }
  }).then(users => {
    // if there is an existing user
    if (users.length) {
      // send error response
      res.status(400).json({
        error: 'user already exists'
      })
    } else {
      // hash password
      bcrypt.hash(req.body.password, 10).then(hash => {
        // use hash to create a new user
        models.User.create({
          username: req.body.username,
          password: hash
        }).then(user => {
          // respond with success and user
          res.status(201).json(user)
        })
      })
    }
  })
});

// POST /api/v1/users/login
router.post('/login', (req, res) => {
  // Check for required fields
  if (!req.body.username || !req.body.password) {
    res.status(400).json({
      error: 'please include all required fields'
    })
    return
  }
  
  // check for user in database
  models.User.findOne({
    where: {
      username: req.body.username
    }
  }).then(user => {
    // if there is no existing user
    if (!user) {
      // send an error
      res.status(404).json({
        error: 'No user with that name found'
      })
      return
    }

    // check the password against the hash in the db
    bcrypt.compare(req.body.password, user.password)
      .then(match => {
        // if the password does not match
        if (!match) {
          // send error
          res.status(401).json({
            error: 'incorrect password'
          })
          return
        }

        // otherwise, set the user on the session
        req.session.user = user
        res.json(user)
      })
  })
})

router.get('/logout', (req, res) => {
  req.session.user = null;
  res.json({
    success: 'user logged out'
  })
})

// // get public user profile information
// router.get('/:userId/profile', (req, res) => {
//   // find user with if from route
//   models.User.findByPk(req.params.userId, {
//     attributes: ['username'], // only include name (ignore secure things, like password)
//     include: {
//       model: models.Review, // include reviews for this user
//       include: models.Restaurant // include restaurant for each review
//     }
//   })
//     .then(user => {
//       // if there is no user, send 404
//       if (!user) {
//         res.status(404).json({ error: 'could not find user with that id' })
//         return
//       }
//       // send back user information
//       res.json(user)
//     })
// })

module.exports = router;