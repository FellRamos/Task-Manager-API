const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')

/**
 * User model:
 * 
 * Ver este ficheiro, tem exemplos bons para tratar os dados na base de dados (minlength, includes, etc..)
 * 
 */

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is not valid')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age cannot be a negative number!')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('You cannot set password to "password"')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
},
    {
        timestamps: true
    })


// Virtual Arguments! This reference is not stored in the db.. we are not storing in the User collection the tasks!
// This is a virtual field of User
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id', // User._id in relation to task.owner
    foreignField: 'owner' // Name of the other thing than User -> In this case is Task. So the relation is between Task.owner and _id of this thing!
})


// Mongoose Middleware

/**
 * JWT generation middleware - 'methods' objects are available on the instances!
 * 
 * NOTAS: generateAuthToken é um método criado por nos! sobre o methods! Aqui queremos usar este middleware para o user especifico, 
 * queremos atribuir um jwt especifico!
 * NAO PODEMOS usar Arrow Functions -> Nao fazem bind do 'this', e neste caso precisamos!
 * 
 */
userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
}

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, 'thisisagreatsecret')

    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}
/**
 * Checking email and password for login - 'statics' objects are available on the Models! 
 * 
 * NOTAS: findByCredentials é um método criado por nos! sobre o statics! Aqui queremos usar este middleware no model User (em geral!)
 * Por isso podemos usar Arrow Function que nao faz bind do 'this'
 * 
 */

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })

    if (!user) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Unable to login')
    }

    return user
}

// Hash the plain text password before save
userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

// Delete user tasks when user is deleted
userSchema.pre('remove', async function (next) {
    const user = this
    await Task.deleteMany({ owner: user._id })
    next()
})



const User = mongoose.model('User', userSchema)

module.exports = User