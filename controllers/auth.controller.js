const User = require('../models/user.model')
const bcrypt = require('bcrypt')
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../helpers/jwt')

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

            res.json({ accessToken, refreshToken })
        } catch (err) {
            console.log(err)
            res.status(400).json({message: 'Registration error'})
        }
    },

    login: async (req, res) => {
        try{
            const {email, password} = req.body
            if(!email || !password) res.status(400).json({ message: 'Email or Password is empty' })

            const user = await User.findOne({email})
            if(!user) res.status(400).json({message: 'User is not registered'})

            const isValidPassword = bcrypt.compareSync(password, user.password)
            if(!isValidPassword) {
                return res.status(400).json({message: 'Invalid email or password'})
            }

            const accessToken = await generateAccessToken(user.id)
            const refreshToken = await generateRefreshToken(user.id)

            res.json({ accessToken, refreshToken })
        } catch (err) {
            console.log(err)
            res.status(400).json({ message: 'Login error' })
        }
    },

    refreshToken: async (req, res) => {
        try {
            const { refreshToken } = req.body
            if(!refreshToken) res.status(400).json({ message: 'Incorrect refresh token' })

            const userId = await verifyRefreshToken(refreshToken)
            console.log('userId in main', userId)
            if(!userId) res.status(400).json({ message: 'Refresh token is not go through verify' })

            const newAccessToken = await generateAccessToken(userId)
            const newRefreshToken1 = await generateRefreshToken(userId)

            res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken1 })
        } catch (err) {
            console.log(err)
            res.status(400).json({ message: 'Refresh token error' })
        }
    },

    logout: async (req, res) => {
        try {
            res.send('logout route OK')
        } catch (err) {
            console.log(err)
        }
    }
}