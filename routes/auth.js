const express = require("express")
const path  = require('path')

const {login, register} = require('../services/auth')

const router = express.Router()

router.get('/auth', async (req, res) => {
    res.sendFile('public/views/formAuth.html', {root: path.dirname(__dirname)})
})

router.post('/login', async (req, res) => {
    try {
        const response = await login(req.body)
        if (!(response && response.token)) {
            throw Error('Unauthorized')
        }
        res.status(200).json(response)
    } catch(e) {
        console.log(e)
        res.status(401).json({message: 'Ошибка авторизации'})
    }
})

router.post('/register', async (req, res) => {
    try {
        const item = await register(req.body)
        res.status(200).json(item)
    } catch(e) {
        console.log(e)
        res.status(400).json({message: 'Ошибка регистрации'})
    }
})

module.exports = router
