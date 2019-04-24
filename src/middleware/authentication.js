'use strict'

const Token = require('jsonwebtoken')
const User = require('./../models/user')
const secret = 'T6Y8e7Ujk'

/**
 * Middleware that authenticate the user who is trying to perform critical actions. The middleware checks
 * the validity of the token set in the request header. If the authentication succeed, the request continue.
 * Else, 401 - Unauthorized is sent.
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
exports.auth = async (req, res, next) => {
    if (!req.header('token')) {
        res.status(401).send('Unauthorized')
        return
    }
    const token = req.header('token')
    const user = await User.get({token: token})
    if (!user) {
        res.status(401).send('Unauthorized')
        return
    }
    try {
        Token.verify(user.token, secret)
        req.user = user
    } catch (e) {
        res.status(401).send('Unauthorized')
        return
    }
    next()
}
