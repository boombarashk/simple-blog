const {getData, setData, deleteData, updateData} = require('../db')

const {isValid, format} = require('date-fns')

const getPost = async (id) => {
    const post = await getData('posts', id)
    return post
}

const getPosts = async () => {
    const data = await getData('posts')
    data.sort((post, postNext) => postNext.created_at - post.created_at)

    const authors = await Promise.all(data.map((post) => getData('users', post.author)))
        .then(users => {
           return users.map(user => user.login)
        })

    const posts = data.map((post, ind) => {
        const date = new Date(post.created_at)
        return {
            ...post,
            authorName: authors?.[ind],
            created_at: isValid(date) ? format(date, 'dd.MM.yyyy') : ''
        }
    })
    return posts
}

const setPost = async (post) => {
    await setData('posts', post)
    return post
}

const deletePost = async (postId) => {
    await deleteData('posts', postId)
}

const updatePost = async (postId, data) => {
    await updateData('posts', postId, data)
}

module.exports = {getPost, getPosts, setPost, deletePost, updatePost}
