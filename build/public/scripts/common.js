export const headers = {'Content-Type': 'application/json;charset=utf-8'}

export const setHeaderAuthorization = (token) => {
    if (token) { headers['Authorization'] = `Bearer ${token}` }
}

export const KEY_USER_ID = 'sb-user-id'
const KEY_PAGE = 'sb-auth-mode'
export const PATHNAMES = {
    HOME: '/',
    AUTH: '/auth',
    EDIT: '/posts/edit/',
    CREATE: '/posts/create/'
}

export const PAGES = {
    login: 'login',
    register: 'register',
    editPost: 'editPost',
    createPost: 'createPost',
    index: 'index'
}
export const FORMS = {
    [PAGES.login]: {name: 'login', submitBtn: 'Войти', endpoint: './login', fields: ['login', 'password']},
    [PAGES.register]: {name: 'register', submitBtn: 'Зарегистрироваться', endpoint: './register', fields: ['login', 'password']},
    [PAGES.editPost]: {name: 'editPost', submitBtn: 'Сохранить', endpoint: './', fields: ['title', 'body']},
    [PAGES.createPost]: {name: 'createPost', submitBtn: 'Добавить', endpoint: '../', fields: ['title', 'body']}
}

export const initPage = (existForm = null) => {

    let page = PAGES.index
    if (window.location.pathname === PATHNAMES.AUTH) {
        page = page !== PAGES.register ? PAGES.login : PAGES.register
    }
    if (window.location.pathname === PATHNAMES.CREATE) {
        page = PAGES.createPost
    }
    const regExp = new RegExp(`^${PATHNAMES.EDIT}`)
    if (regExp.test(window.location.pathname)) {
        page = PAGES.editPost
    }

    window.localStorage.setItem(KEY_PAGE, page)

    if (existForm) {
        if (!existForm.name) {
            existForm.setAttribute('name', FORMS[page].name)
            existForm.submitBtn.firstElementChild.innerText = FORMS[page].submitBtn
        }
    }

    return page
}

export const togglePage = (page, elements) => {
    window.localStorage.setItem(KEY_PAGE, page)

    const {form, authLink} = elements

    form.setAttribute('name', FORMS[page].name)
    form.submitBtn.firstElementChild.innerText = FORMS[page].submitBtn

    if (authLink) {
        authLink.innerText = page === PAGES.login ? 'Регистрация' : 'Авторизация'
    }
}
