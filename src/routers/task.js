const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/tasks', auth, async (req, res) => {
    // const task = new Task(req.body)

    const task = new Task({
        ...req.body, // Ver melhor spread operator!
        owner: req.user._id // Nao esquece: Este req.user vem do auth! é la que user é adicionado ao objeto req!
    })

    try {
        await task.save()
        res.send(task)
    } catch (e) {
        res.status(400).send(e.message)
    }

})

router.get('/tasks', auth, async (req, res) => {

    try {

        // const tasks = await Task.find({ owner: req.user._id }) // Aqui procuramos só pelo owner!
        // res.send(tasks)

        /**
         *  Outra maneira de fazer o que esta acima:
         */

        await req.user.populate('tasks').execPopulate() // Usando o atributo Virtual do User model!
        res.send(req.user.tasks)

    } catch (error) {
        res.status(500).send(error.message)
    }

})

router.get('/tasks/:id', auth, async (req, res) => {

    const _id = req.params.id

    try {
        const task = await Task.findOne({ _id, owner: req.user._id }) // Here we search also with the owner id!

        if (!task) {
            return res.status(404).send('Task not found')
        }
        res.send(task)
    } catch (e) {
        res.status(500).send(e.message)
    }
})

router.patch('/tasks/:id', auth, async (req, res) => {

    const updates = Object.keys(req.body) // Getting the keys of the req.body object, to transform into array
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every(update => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }) // Mudar para save() como no user

        // const task = await Task.findById (req.params.id) // findById ja nao da, apenas usa ID
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })

        if (!task) {
            return res.status(404).send('Task not found')
        }

        updates.forEach(update => task[update] = req.body[update])
        await task.save()

        res.send(task)
    } catch (e) {
        res.status(400).send(e.message)
    }
})

router.delete('/tasks/:id', auth, async (req, res) => {

    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id }) // findByIdAndDelete ja n da (so usa o id..)
        if (!task) {
            return res.status(404).send('Task not found')
        }
        res.send(task)
    } catch (e) {
        res.status(500).send(e.message)
    }

})

module.exports = router