const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()


router.post('/users', async (req, res) => {
    const user = new User(req.body)

    // user.save().then(user => {
    //     res.status(201).send(user)
    // }).catch(error => {
    //     res.status(400).send(error.message)
    // })

    /**
     * Async / await
     */

    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send(e.message)
    }

})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (e) {
        res.status(400).send()
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send('Logged out successfully!')
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send('Logged out from all accounts!')
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/users/me', auth, async (req, res) => {
    /**
     * Added auth as middleware
     */
    res.send(req.user) // req.user is received from the auth middleware!
})


router.patch('/users/me', auth, async (req, res) => {

    const updates = Object.keys(req.body) // transforming the object keys in an array!
    const allowedUpdates = ['name', 'email', 'age', 'password']
    const isValidOperation = updates.every(update => allowedUpdates.includes(update)) // Returns true if all are true!

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        /**
         *  NOTE: Esta linha ja n da certo com o middleware de mongoose de pre-save, pois esta linha nao faz save!
         *  No model de mongoose, temos agr algo para fazer hash da password em pre-save.
         *  Por isso é que nesta linha, temos a opcao runValidators: true, pois como n faz save normal do user, nao sabe que tem validators! 
         */
        // const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

        /**
         * Nova maneira tb é simples (e acho que ja tinha usado assim!)
         */


        updates.forEach(update => req.user[update] = req.body[update]) // exemplo: se encontrar age -> user.age = req.body.age -> de forma dinamica!
        await req.user.save() // Ca esta o save normal! entao vai ter acesso ao middleware de presave no model!
        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }

})

router.delete('/users/me', auth, async (req, res) => {

    try {
        await req.user.remove()
        res.send(req.user)
    } catch (e) {
        res.status(500).send(e.message)
    }

})

module.exports = router