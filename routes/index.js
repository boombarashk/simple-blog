const express = require('express')
const path  = require('path')
const authRoutes = require('./auth')
const postRoutes = require('./posts')

const router = express.Router()

router.use('/', authRoutes)
router.use('/posts', postRoutes)

router.get('/', (req, res) => {
    res.sendFile(path.resolve('views/index.html'))
})

router.get('/doc', (req, res) => {
    res.sendFile(path.resolve('doc/index.html'))
})

module.exports = router
