const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth.controller')
const passport = require('passport')
require('dotenv').config()

router.post('/register', authController.register)
router.post('/login', authController.login)
router.post('/refresh-token', authController.refreshToken)
router.delete('/logout', authController.logout)

router.get(
    '/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
)

router.get('/google/callback',
    passport.authenticate('google', {
        failureMessage: 'Cannot login to Google, pls try again later',
        successRedirect: 'http://localhost:3000/login/success',
        // failureRedirect: 'http://localhost:3000/login/error',
    }),
    (req, res) => {
        // res.json({
        //     accessToken: req.authInfo.accessToken,
        //     refreshToken: req.authInfo.refreshToken
        // })
        console.log('user req', req.user)
        res.send('Thanks for signing in!')
    }
)

module.exports = router