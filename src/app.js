'use strict'

const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const logger = require('morgan')
const cors = require('cors')
const router  = require('./controllers/index')
const tools = require('./tools/tools')

// database uri
const uri = 'mongodb://root:tsi966YGU@localhost:27017/admin'

// app will listen on port 3000
const port = 3000

// CORS origin enabled for http://localhost:8080
const origin = 'http://localhost:8080'

// init express
const app = express()

// init CORS middleware
app.use(cors({
    origin: origin,
    optionsSuccessStatus: 200,
}))

// init logger middleware
app.use(logger('common'))

// init JSON body parser middleware
app.use(bodyParser.json())

// init router middleware
app.use(router)

/**
 * Tries to connect to the database then listens on desired port. Retries every 3 seconds if any error occurs.
 * @returns {Promise<void>}
 */
async function run() {
    try {
        await mongoose.connect(uri, {useNewUrlParser: true, dbName: 'todo'})
        app.listen(port, () => console.log(`Service listening on port ${port}`))
    } catch (e) {
        console.error("Cannot run service")
        if (e.stack)
            console.error(e.stack)
        await tools.timeout(3000)
        await run()
    }
}

// run the app
run().catch(() => console.error('Cannot run service'))
