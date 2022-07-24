const express = require("express")
const path  = require('path')

const {checkHeaderAuthorization, checkSession} = require('../services/auth')
const {getPosts, getPost, setPost, deletePost, updatePost} = require('../services/posts')

const router = express.Router()

/**
 * @apiDefine PostParam
 * @apiParam {String} author Id user
 * @apiParam {String} title
 * @apiParam {Text} body innerHTML
 * @apiParam {Timestamp} created_at
 */

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
    res.sendFile(path.resolve('public/views/formPost.html'))
})

router.get('/edit/:postId', async (req, res) => {
    res.sendFile(path.resolve('public/views/formPost.html'))
})

/**
 * @api {post} /posts/:id set post
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer token"
 *     }
 * @apiName Create
 * @apiGroup Posts
 * @apiUse PostParam
 */
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

/**
 * @api {put} /posts/edit/:id edit post
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer token"
 *     }
 * @apiName Edit
 * @apiGroup Posts
 * @apiUse PostParam
 */
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

/**
 * @api {get} /posts/:id get post
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer token"
 *     }
 * @apiName Post data
 * @apiGroup Posts
 *
 * @apiSuccess {String} id post id
 * @apiSuccess {String} author user id
 * @apiSuccess {String} title
 * @apiSuccess {Text} body innerHTML
 * @apiSuccess {Timestamp} created_at
 */
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

/**
 * @api {get} /posts/ get posts
 * @apiName List
 * @apiGroup Posts
 *
 * @apiSuccess {Array} posts
 */
router.get('/', async (req, res) => {
    try {
        const posts = await getPosts()
        res.status(200).json({posts})
    } catch(e) {
        console.log(e)
        res.status(400).json({message: e.message})
    }
})

/**
 * @api {delete} /posts/:id delete post
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer token"
 *     }
 * @apiName Delete
 * @apiGroup Posts
 */
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
