const express = require('express')
const authRoute = require('./routes/auth.route')
const cors = require('cors')
const authMiddleware = require('./middleware/auth.middleware')
require('dotenv').config()
require('./helpers/init-mongodb')

// for google
const passport = require('passport')
require('./config/passport')(passport)

const PORT = process.env.PORT || 3010
const app = express()

app.use(cors())
app.use(express.json())
app.use(passport.initialize())
app.use(passport.session())

app.use('/auth', authRoute)

app.get('/', authMiddleware,  async (req, res) => {
    res.send('hello from express')
})
app.get('/test', async (req, res) => {
    res.send('hello redirect from GOOGLE')
})

app.listen(PORT, () => {
    console.log(`Server started on ${PORT} port`)
})