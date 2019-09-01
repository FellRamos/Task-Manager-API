const express = require('express')
const chalk = require('chalk')
require('./db/mongoose') // To ensure mongoose connects to DB. not needed to store it in a var.
// Routers
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT || 3000

// Adding middleware
// app.use((req, res, next) => {
//     // Maintenance middleware
//     res.status(503).send('The site is in maintenance. Please try later.')
//     // As I send the response, I don't need to use next()
// })


// Testing Multer
const multer = require('multer')

// Here we can configure molter
// FileSize - In bytes
const upload = multer({
    dest: 'images',
    limits: {
        fileSize: 1000000,
    },
    fileFilter(req, file, cb) {

        //if (!file.originalname.endsWith('.pdf')) {
        // With Regular Expressions:
        if (!file.originalname.match(/\.(doc|docx)$/)) {
            // If something is wrong, the first argument, error, is called
            return cb(new Error('File must be a PDF'))
        }

        // If is ok, the first argument, error, is undefined (or null?)
        cb(undefined, true)


    }
})

app.post('/upload', upload.single('uploadFile'), (req, res) => {
    res.send()
})

// Handling Routers
app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log(chalk.green('Success: ') + 'Server listening on port ' + port)
})
