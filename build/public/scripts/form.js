import {headers,setHeaderAuthorization, FORMS, PATHNAMES, PAGES, KEY_USER_ID, initPage, togglePage} from './common.js'
import {getToken, saveToken, clearToken} from "./token.js"

window.onload = () => {
    let token = getToken()
    setHeaderAuthorization(token)

    const currentForm = document.querySelector('form')
    let page = initPage(currentForm)

    const authLink = document.getElementById('toggleAuthForm')
    if (authLink) {
        authLink.addEventListener('click', (ev) => {
            ev.preventDefault()
            page = page === PAGES.login ? PAGES.register : PAGES.login
            togglePage(page, {form: currentForm, authLink})
        })
    }

    let postId
    if (page === PAGES.editPost) {
        postId = window.location.pathname.slice(PATHNAMES.EDIT.length)

        fetch(`/posts/${postId}`).then((data) => data.json()).then((data) => {
            if (data.title) {currentForm.title.setAttribute('value', data.title)}
            if (data.body) {currentForm.body.innerHTML =`${data.body}`}
        })
    }

    currentForm.submitBtn.addEventListener('click', async (ev) => {
        ev.preventDefault()

        const fields = {}
        FORMS[page].fields.forEach(key => fields[key] = currentForm[key]?.value)

        let endpoint = FORMS[page].endpoint
        if (page === PAGES.editPost) {
            endpoint += postId
        }
        await fetch(endpoint, {
            method: page !== PAGES.editPost ? 'POST' : 'PUT',
            body: JSON.stringify(fields),
            headers
        })
            .then(res => {
                if (res.status === 403) {
                    clearToken()
                    window.localStorage.removeItem(KEY_USER_ID)
                    window.location = '/auth'
                }
                return res.json()
            })
            .then( (data) => {
                if (data) {
                    if (page === PAGES.login || page === PAGES.register) {
                        if (data.token) {
                            window.localStorage.setItem(KEY_USER_ID, data.userId)
                            saveToken(data.token)
                        }
                    }
                    if (data.message) {
                        alert(data.message)
                    } else {
                        window.location = '/'
                    }
                }
            }).catch(e => {
                console.log(e)
            })
    })
}
