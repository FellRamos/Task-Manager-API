const mongoose = require('mongoose')
const validator = require('validator')

/**
 * We can create directly a model like here:
 */

// const Task = mongoose.model('Task', {
//     description: {
//         type: String,
//         required: true,
//         trim: true,
//     },
//     completed: {
//         type: Boolean,
//         default: false
//     },
//     owner: {
//         type: mongoose.Schema.Types.ObjectId,
//         required: true,
//         ref: 'User'
//     }
// })

/**
 *  But usually we create the Schema first, and then use it in the second argument when creating the model:
 */

// const taskSchema = new mongoose.Schema({}, {})  --> Exemplo para ver melhor: O Schema leva dois objetos:
//  - o primeiro e o Schema definitions - Que é o que ja utilizamos varias vezes
//  - o segundo e o Schema options - Nunca usado, apenas agora para criar o timestamp automatico do Mongoose!

const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true,
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
        timestamps: true
    })

const Task = mongoose.model('Task', taskSchema)

module.exports = Task