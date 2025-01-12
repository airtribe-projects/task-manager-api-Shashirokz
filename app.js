require("dotenv").config()

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const tasksRouter = require('./routes/tasks.js')

const PORT = process.env.PORT || 3000

app.use(bodyParser.json())
app.use(express.json())

const logger = (req, res, next) => {
    console.log(`${req.method}: Request Received On ${req.url}`)
    next()
}

app.use(logger)
app.use(tasksRouter)

module.exports = app

if (require.main === module) {
    app.listen(PORT, () => {
        console.log('Server running on port:', PORT)
    })
}
