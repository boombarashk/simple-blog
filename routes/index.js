const express = require('express')

const authRoutes = require('./auth')
const postRoutes = require('./posts')

const router = express.Router()

router.use('/', authRoutes)
router.use('/posts', postRoutes)

router.get('/', (req, res) => {
    res.sendFile('public/views/index.html')
})

module.exports = router
