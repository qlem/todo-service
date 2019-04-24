'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

/**
 * Schema that represents the user model
 */
const userSchema = new Schema({
    name: String,
    password: String,
    token: String
})

const User = mongoose.model('User', userSchema)

// query used for get a user according the the filter
exports.get = filter => User.findOne(filter)

// query used for get all users username
exports.getAllUsername = () => User.distinct('name')

// query used for insert a user
exports.add = user => User.create(user)

// query used for update a user
exports.update = user => User.updateOne({_id: user._id}, user)
