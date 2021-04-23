const User = require('../models/user.model')
const bcrypt = require('bcrypt')
const { generateAccessToken, generateRefreshToken } = require('../helpers/jwt')

module.exports = {
    register: async (req, res) => {
        try {
            const {email, password} = req.body
            if(!email || !password) res.status(400).json({ message: 'Email or Password is empty' })

            const candidate = await User.findOne({email})
            if(candidate) res.status(400).json({ message: 'User is already exist' })

            const hashPassword = bcrypt.hashSync(password, 10)
            const user = new User({ email, password: hashPassword})
            const savedUser = await user.save()
            const accessToken = generateAccessToken(savedUser.id)
            const refreshToken = generateRefreshToken(savedUser.id)

            res.send({ accessToken, refreshToken })

        } catch (err) {
            console.log(err)
            res.status(400).json({message: 'Registration error'})
        }
    },

    login: async (req, res, next) => {
        try {
            res.send('login route OK')
        } catch (err) {
            console.log(err)
        }
    },

    refreshToken: async (req, res, next) => {
        try {
            res.send('refresh token route OK')
        } catch (err) {
            console.log(err)
        }
    },

    logout: async (req, res, next) => {
        try {
            res.send('logout route OK')
        } catch (err) {
            console.log(err)
        }
    }
}