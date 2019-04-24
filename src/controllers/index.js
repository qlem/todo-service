'use strict'

const express = require('express')
const router = express.Router()
const account = require('./account')
const todo = require('./todo')

/**
 * This is the index of the router.
 */

router.use('/account', account)
router.use('/todo', todo)

module.exports = router
