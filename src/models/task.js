'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.Types.ObjectId

/**
 * Schema that represents the task model
 */
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

// query used for get a task according the the filter
exports.get = filter => Task.findOne(filter)

// query used for get all tasks sorted by state and by deadline
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
            deadline: 1
        }
    },
    {
        $group : {
            _id : "$state",
            tasks: {
                $push: "$$ROOT"
            }
        }
    }
])

// query used for insert a task
exports.add = task => Task.create(task)

// query used for update a task
exports.update = task => Task.updateOne({_id: task._id}, task)

// query used for delete a task
exports.delete = id => Task.deleteOne({_id: id})
