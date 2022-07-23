const jwt = require('jsonwebtoken');
const md5 = require('md5')
const { v4: uuidv4 } = require('uuid');
const config = require('../config.js')
const {getData, setData, deleteData} = require('../db.js')

const checkHeaderAuthorization = (headers) =>{
    const {authorization} = headers
    if (authorization) {
        const [Bearer, token]= authorization.split(" ")
        if (Bearer === 'Bearer') {
            return token
        }
    }

    return false
}

const checkSession = async (token) => {
    const decodeJWT =jwt.decode(token)
    if (!decodeJWT) {
        return false
    }

    const [userId,sessionUuid] = decodeJWT?.split(';')

    const sessions = await getData('sessions')
    const session = sessions.filter(session => session.session_uuid === sessionUuid && session.user_id === userId)
    if (session.length === 0) {
        return false
    }
    const availableSession = session[0]
    if (availableSession) {
        const timestamp = new Date().getTime()
        if (timestamp - availableSession.created_at > 86400) {
            await deleteData('sessions', availableSession.id)
            return false
        }
    }
    return userId
}

const generateAccessToken = async (userId) => {
    const sessionUuid = uuidv4()
    //fixme update session
    await setData('sessions', {session_uuid: sessionUuid, user_id: userId})

    const token = jwt.sign(`${userId};${sessionUuid}`, config.jwtSecret);
    return {token, userId}
}

const login = async ({login, password}) => {
    if (login && password) {
        const users = await getData('users')
        const candidates = users.filter(user => user.login === login)
        const candidate = candidates[0]

        if (candidate && candidate.password === md5(password)) {
            return generateAccessToken(candidate.id)
        }
    }
    return null
}

const register = async ({login, password}) => {
    const user = await setData('users', {login,password: md5(password)})
    return generateAccessToken(user.id)
}

module.exports = { login, register, checkHeaderAuthorization, checkSession }
