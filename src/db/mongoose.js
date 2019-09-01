const mongoose = require('mongoose')

const connectionURL = process.env.MONGODBURL

mongoose.connect(connectionURL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})



