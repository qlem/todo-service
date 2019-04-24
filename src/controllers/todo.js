'use strict'

const express = require('express')
const Task = require('./../models/task')
const router = express.Router()
const User = require('./../models/user')
const Auth = require('./../middleware/authentication')

/**
 * GET request - full path: /todo/
 * Route that allows to the client to fetch all available tasks. Only if the user is authenticated.
 */
router.get('/', Auth.auth, async  (req, res) => {
    try {
        let tasks
        tasks = await Task.getAll()
        res.send(tasks)
    } catch (e) {
        res.status(500).send('Internal error')
        console.error("Cannot get tasks")
        if (e.stack)
            console.error(e.stack)
    }
})

/**
 * POST request - full path: /todo/
 * Route that allows to the client to add a new task. Only if the user is authenticated.
 */
router.post('/', Auth.auth, async (req, res) => {
    try {
        if (!req.body.data || !req.body.data.title || !req.body.data.content
        || !req.body.data.deadline) {
            res.status(400).send('Wrong or empty body')
            return
        }
        let task = req.body.data
        // TODO fix deadline time zone
        if (!task.owner) {
            task.owner = req.user._id
        } else {
            const owner = await User.get({name: task.owner})
            if (!owner) {
                res.status(400).send('Task owner does not exist')
                return
            }
            task.owner = owner._id
        }
        const doc = await Task.add(task)
        res.send(doc)
    } catch (e) {
        res.status(500).send('Internal error')
        console.error("Cannot create a new task")
        if (e.stack)
            console.error(e.stack)
    }
})

/**
 * PUT request - full path: /todo/
 * Route that allows to the client to update a task. Only if the user is authenticated.
 */
router.put('/', Auth.auth, async (req, res) => {
    try {
        if (!req.body.data || !req.body.data._id) {
            res.status(400).send('Wrong or empty body')
            return
        }
        const task = req.body.data
        if (task.owner) {
            const owner = await User.get({name: task.owner})
            if (!owner) {
                res.status(400).send('Given owner does not exist')
                return
            }
            task.owner = owner._id
        }
        const wr = await Task.update(task)
        if (wr.n !== 1) {
            res.status(400).send('Wrong task id')
            return
        }
        res.send(task)
    } catch (e) {
        res.status(500).send('Internal error')
        console.error("Cannot update task")
        if (e.stack)
            console.error(e.stack)
    }
})

/**
 * DELETE request - full path: /todo/
 * Route that allows to the client to delete a task. Only if the user is authenticated.
 */
router.delete('/', Auth.auth, async (req, res) => {
   try {
       if (!req.query.id) {
           res.status(400).send('Missing task id in query params')
           return
       }
       const wr = await Task.delete(req.query.id)
       if (wr.n !== 1) {
           res.status(400).send('Wrong task id')
           return
       }
       res.send({})
   } catch (e) {
       res.status(500).send('Internal error')
       console.error("Cannot delete task")
       if (e.stack)
           console.error(e.stack)
   }
})

module.exports = router
