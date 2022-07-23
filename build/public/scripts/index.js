import {headers, setHeaderAuthorization, initPage, KEY_USER_ID} from './common.js'
import {getToken} from "./token.js";

const postTMPL = (post, userId = null) => `
<div class="post">
    <div class="post__date">${post.created_at}</div>
    <div class="post__content">
        <div class="post__content-title">${post.title}</div>
        <div class="post__content-author">${post.authorName || ''}</div>
        <div class="post__content-body"">${post.body}</div>
    </div>

    <div class="post__actions">${userId && userId === post.author ? `
        <a class="link" data-id="${post.id}" data-action="editPost">Редактировать</a>
        <a class="link" data-id="${post.id}" data-action="deletePost">Удалить</a>
    ` : ''}</div>
</div>`

window.onload = async () => {
    let userId = window.localStorage.getItem(KEY_USER_ID)
    let token = getToken()
    setHeaderAuthorization(token)

    const main = document.querySelector('main')
    initPage()

    await fetch('./posts', {method: 'GET', headers}).then(res => res.json()).then( ({posts}) => {
        posts.forEach(post => {
            main.insertAdjacentHTML('beforeEnd', postTMPL(post, !!token && userId))
        })
    })

    Array.from(document.querySelectorAll('a')).forEach(link => {
        const {id, action} = link.dataset
        if (id && action) {
            if (action === 'deletePost') {
                link.addEventListener('click', async () => {
                    await fetch(`./posts/${id}`, {method: 'DELETE', headers}).then(({status}) => {
                        if(status === 200){
                            link.closest('.post').remove()
                        }
                    })
                })
            }
            if (action === 'editPost') {
                link.addEventListener('click',  () => {window.location.pathname = `./posts/edit/${id}`})
            }
        }
    })

    document.getElementById(userId ? 'createPost' : 'authLink').classList.remove('nodisplay')
}
