'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.Types.ObjectId

const taskSchema = new Schema({
    title: String,
    owner: ObjectId,
    creationDate: {
        type: Date,
        default: Date.now
    },
    deadline: {
        type: Date
    },
    content: String,
    state: {
        type: String,
        default: 'pending'
    },
    priority: {
        type: String,
        default: 'medium'
    }
})

const Task = mongoose.model('Task', taskSchema)

exports.get = filter => Task.findOne(filter)
exports.getAll = () => Task.aggregate([
    {
        $lookup: {
            from: 'users',
            localField: 'owner',
            foreignField: '_id',
            as: 'owner_info'
        }
    },
    {
        $unwind: '$owner_info'
    },
    {
        $project: {
            title: 1,
            owner: '$owner_info.name',
            creationDate: 1,
            deadline: 1,
            content: 1,
            state: 1,
            priority: 1
        }
    },
    {
        $sort: {
            deadline: -1
        }
    }
])
exports.add = task => Task.create(task)
exports.update = task => Task.updateOne({_id: task._id}, task)
exports.delete = id => Task.deleteOne({_id: id})
