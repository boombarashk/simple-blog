const express = require("express")
const path  = require('path')

const {checkHeaderAuthorization, checkSession} = require('../services/auth')
const {getPosts, getPost, setPost, deletePost, updatePost} = require('../services/posts')

const router = express.Router()

const isAuth = async (req, res, next) => {
    try {
        const token = checkHeaderAuthorization(req.headers)
        if (!token) {
            throw Error('Unauthorized')
        }
        const userId = await checkSession(token)
        if (userId){
            req.userId = userId
            next()
        } else {
            throw Error('Forbidden')
        }
    } catch (e) {
        return res.status(e.message === 'Forbidden' ? 403 : 401).json({message: e.message})
    }
}

router.get('/create', async (req, res) => {
    res.sendFile('public/views/formPost.html', {root: path.dirname(__dirname)})
})

router.get('/edit/:postId', async (req, res) => {
    res.sendFile('public/views/formPost.html', {root: path.dirname(__dirname)})
})

router.post('/', isAuth, async (req, res) => {
    try {
        const {title, body} = req.body
        const post = {title, body, author: req.userId}
        await setPost(post)
        res.status(200).json( post )
    } catch(e) {
        console.log(e)
        res.status(400).json({message: e.message})
    }
})

router.put('/edit/:postId', isAuth, async (req, res) => {
    try {
        const {postId} = req.params
        await updatePost(postId, req.body)
        res.status(200).json({ok: true})
    } catch(e) {
        console.log(e)
        res.status(400).json({message: e.message})
    }
})


router.get('/:id', async (req, res) => {
    try {
        const postId = req.params.id
        const post = await getPost(postId)
        res.status(200).json(post)
    } catch(e) {
        console.log(e)
        res.status(400).json({message: e.message})
    }
})

router.get('/', async (req, res) => {
    try {
        const posts = await getPosts()
        res.status(200).json({posts})
    } catch(e) {
        console.log(e)
        res.status(400).json({message: e.message})
    }
})

router.delete('/:id', isAuth, async (req, res) => {
    try {
        const postId = req.params.id
        await deletePost(postId)
        res.status(200).end()
    } catch (e) {
        console.log(e)
        res.status(400).json({message: e.message})
    }
})

module.exports = router
