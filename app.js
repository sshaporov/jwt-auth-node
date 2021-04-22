const express = require('express')
const authRoute = require('./routes/auth.route')
require('dotenv').config()

const PORT = process.env.PORT || 3010
const app = express()

app.use(express.json())
app.use('/auth', authRoute)
app.get('/', (req, res) => {
    res.json({ message: 'request success' })
})

app.listen(PORT, () => {
    console.log(`Server started on ${PORT} port`)
})