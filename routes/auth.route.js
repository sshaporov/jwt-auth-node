const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth.controller')
const passport = require('passport')
require('dotenv').config()
const authMiddleware = require('../middleware/auth.middleware')
const User = require('../models/user.model')

router.post('/register', authController.register)
router.post('/login', authController.login)
router.post('/refresh-token', authController.refreshToken)
router.delete('/logout', authController.logout)

router.get(
    '/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
)

router.get('/google/callback',
    passport.authenticate('google', {failureRedirect: 'http://localhost:3000/login'}),
    (req, res) => {
        res.redirect(`http://localhost:3000/login/success/${req.authInfo.accessToken}`)
    }
)

router.get('/user', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.userId
        console.log('userId', userId)

        const user = await User.findOne({userId})
        console.log('USER FROM DB', user)
        if (!user) res.status(400).json({message: 'Cannot get user data'})

        res.json({
            refreshToken: user.session.refreshToken,
            user: {
                firstName: user.firstName,
                lastName: user.lastName,
                userId: user.userId,
                email: user.email,
            }
        })
    } catch (err) {
        console.log(err)
        res.status(400).json({message: 'user getting data error'})
    }
})

module.exports = router