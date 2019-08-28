require('../src/db/mongoose')
const User = require('../src/models/user')

// userID: 5d59550ac59abf38e0e6f5f1

/**
 * Promise Chaining
 */

// User.findByIdAndUpdate('5d59550ac59abf38e0e6f5f1', {
//     age: 99
// }).then((user) => {
//     console.log(user)
//     return User.countDocuments({ age: 99 })
// }).then((result) => {
//     console.log(result)
// }).catch(e => {
//     console.log(e)
// })

/**
 * Async / await
 */

const updateAgeAndCount = async (id, age) => {
    const user = await User.findByIdAndUpdate(id, { age })
    const count = await User.countDocuments({ age })
    return count
}

updateAgeAndCount('5d59550ac59abf38e0e6f5f1', 10).then(count => {
    console.log(count)
}).catch(e => {
    console.log(e)
})


