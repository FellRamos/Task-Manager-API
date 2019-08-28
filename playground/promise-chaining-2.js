require('../src/db/mongoose')
const Task = require('../src/models/task')

// ID: 5d595a34ea15e828040fbf12

/**
 * Promise Chaining
 */

// Task.findByIdAndDelete('5d595a34ea15e828040fbf12', {
//     completed: true
// }).then((task) => {
//     console.log(task)
//     return Task.countDocuments({ completed: true })
// }).then((result) => {
//     console.log(result)
// }).catch(e => {
//     console.log(e)
// })

/**
 * Async / await
 */

const deleteTaskAndCount = async (id) => {
    const task = await Task.findByIdAndDelete(id)
    const count = await Task.countDocuments({ completed: false })
    return count
}

deleteTaskAndCount('5d599b7b7c0eca240c06b634').then(result => {
    console.log('Number of tasks incomplete: ' + result)
}).catch(e => {
    console.log(e)
})