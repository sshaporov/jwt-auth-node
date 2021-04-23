const express = require('express')
const authRoute = require('./routes/auth.route')
require('dotenv').config()
require('./helpers/init-mongodb')

const PORT = process.env.PORT || 3010
const app = express()

app.use(express.json())
app.use('/auth', authRoute)

app.listen(PORT, () => {
    console.log(`Server started on ${PORT} port`)
})