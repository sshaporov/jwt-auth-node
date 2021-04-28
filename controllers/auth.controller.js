const User = require('../models/user.model')
const bcrypt = require('bcrypt')
const {generateAccessToken, generateRefreshToken, verifyRefreshToken} = require('../helpers/jwt')
const {createSession} = require('../helpers/user-session')

module.exports = {
    register: async (req, res) => {
        try {
            const {email, password} = req.body
            if (!email || !password) res.status(400).json({message: 'Email or Password is empty'})

            const candidate = await User.findOne({email})
            if (candidate) res.status(400).json({message: 'User is already exist'})

            const hashPassword = bcrypt.hashSync(password, 10)

            const user = new User({email, password: hashPassword})
            const savedUser = await user.save()

            const accessToken = generateAccessToken(savedUser.id)
            const refreshToken = generateRefreshToken(savedUser.id)

            // todo: нужно сгенерить юзер айди черех uuid.v4 а затем уже сетить юзера в базу сразу с сессией
            const session = createSession(refreshToken)
            await User.findOneAndUpdate({email}, { $set: {session}})

            res.json({accessToken, refreshToken})
        } catch (err) {
            console.log(err)
            res.status(400).json({message: 'Registration error'})
        }
    },

    login: async (req, res) => {
        try {
            const {email, password} = req.body
            // todo: добавить более норм валидацию на max/min и т.д.
            if (!email || !password) res.status(400).json({message: 'Email or Password is empty'})

            const user = await User.findOne({email})
            if (!user) res.status(400).json({message: 'User is not registered'})

            const isValidPassword = bcrypt.compareSync(password, user.password)
            if (!isValidPassword) {
                // todo: обновить текст сообщения тк не безопасно
                return res.status(400).json({message: 'Invalid password -> upd message'})
            }

            const accessToken = generateAccessToken(user.id)
            const refreshToken = generateRefreshToken(user.id)

            const session = createSession(refreshToken)
            await User.findOneAndUpdate({email}, { $set: {session}})

            res.json({ accessToken, refreshToken })
        } catch (err) {
            console.log(err)
            res.status(400).json({message: 'Login error'})
        }
    },

    refreshToken: async (req, res) => {
        try {
            const {refreshToken} = req.body
            if (!refreshToken) res.status(400).json({message: 'Incorrect refresh token'})

            // если успех верифая, то возвращаем userId, в противном случае - ничего т.е. undefined
            const userId = await verifyRefreshToken(refreshToken)
            if (!userId) res.status(400).json({message: 'Refresh tokens dont match between request <-> db'})

            const newAccessToken = await generateAccessToken(userId)
            const newRefreshToken = await generateRefreshToken(userId)

            const session = createSession(newRefreshToken)
            await User.findOneAndUpdate({_id: userId}, { $set: {session}})

            res.json({accessToken: newAccessToken, refreshToken: newRefreshToken})
        } catch (err) {
            console.log(err)
            res.status(400).json({message: 'Refresh token error'})
        }
    },

    logout: async (req, res) => {
        try {
            res.send('logout route OK')
        } catch (err) {
            console.log(err)
        }
    },
}