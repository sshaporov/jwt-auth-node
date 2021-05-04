const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth.controller')
const passport = require('passport')

router.post('/register', authController.register)
router.post('/login', authController.login)
router.post('/refresh-token', authController.refreshToken)
router.delete('/logout', authController.logout)

router.get('/google', passport.authenticate('google', {
    scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'],
    accessType: 'offline',
    approvalPrompt: 'force',
} ))
router.get('/google/callback', passport.authenticate('google'), (req, res) => {
    res.redirect('/test')
})

module.exports = router