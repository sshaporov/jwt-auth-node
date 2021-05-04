const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth.controller')
const passport = require('passport')


router.post('/register', authController.register)
router.post('/login', authController.login)
router.post('/refresh-token', authController.refreshToken)
router.delete('/logout', authController.logout)

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] } ))
router.get('/google/callback', passport.authenticate('google'), (req, res) => {
    res.redirect('/test')
})

// router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }),
//     (req, res) => {
//         // res.redirect('/log')
//         console.log(res)
//     }
// )
// router.get('/logout', (req, res) => {
//     req.logout()
//     res.redirect('/')
// })

module.exports = router