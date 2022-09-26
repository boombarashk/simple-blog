const express = require("express")
const path  = require('path')

const {login, register} = require('../services/auth')

const router = express.Router()

router.get('/auth', async (req, res) => {
    res.sendFile(path.resolve('public/views/formAuth.html'))
})
/**
 * @apiDefine AuthParam
 * @apiParam {String} login
 * @apiParam {String} password
 */

/**
 * @api {post} /login authorization
 * @apiName Login
 * @apiGroup Auth
 * @apiUse AuthParam
 *
 * @apiSuccess {String} token
 */
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

/**
 * @api {post} /register registration
 * @apiName Register
 * @apiGroup Auth
 * @apiUse AuthParam
 *
 * @apiSuccess {String} token
 */
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
