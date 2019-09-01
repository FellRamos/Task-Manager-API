const express = require('express')
const chalk = require('chalk')
require('./db/mongoose') // To ensure mongoose connects to DB. not needed to store it in a var.

// Routers
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

// Initializing Express and setting the PORT
const app = express()
const port = process.env.PORT || 3000

// Handling Routers
app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

// Listening to PORT
app.listen(port, () => {
    console.log(chalk.green('Success: ') + 'Server listening on port ' + port)
})
