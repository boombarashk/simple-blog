const KEY_TOKEN = 'sb-token'

export const saveToken = (value) => {
    window.localStorage.setItem(KEY_TOKEN, value)
}

export const getToken = () => {
    return window.localStorage.getItem(KEY_TOKEN)
}

export const clearToken = () => {
    window.localStorage.removeItem(KEY_TOKEN)
}
