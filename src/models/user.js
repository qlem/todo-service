'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    name: String,
    password: String,
    token: String
})

const User = mongoose.model('User', userSchema)

exports.get = filter => User.findOne(filter)
exports.add = user => User.create(user)
exports.update = user => User.updateOne({_id: user._id}, user)
