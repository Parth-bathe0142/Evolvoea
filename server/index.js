const express = require("express")
const path = require("path")
const { connectDB, closeDB } = require('./mongoClient.js')
require('dotenv').config()

const port = process.env.PORT
const CONNECTION_STRING = process.env.CONNECTION_STRING
const app = express()
let client;

app.use('/', express.static(path.join(__dirname, '../dist')))

app.use("/dev-tools", express.static(path.join(__dirname, '../DevTools')))
app.use("/dev-tools/scripts", express.static(path.join(__dirname, '../dist/script/DevTools')))
app.use(express.json())

app.get("/test", (_, res) => {
    res.json({ result: "success" })
})

app.get("/game", (_, res) => {
    const filePath = path.join(__dirname, "../dist/index.html")
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error("File sending error:", err.message)
            res.status(404).json({ error: "Could not load file: " + err.message })
        }
    })
})

app.post("/login_request", async (req, res) => {
    const { username, password } = req.body
    const accounts = client.db('game').collection('user_accounts')

    const match = await accounts.findOne({ username, password })
    if (match) {
        res.json({ result: "success" })
    } else {
        res.json({ result: "failure", reason: "Incorrect username/password" })
    }
})

app.listen(port, async () => {
    client = await connectDB()
    console.log(`Listening at http://localhost:${port}`)
    console.log(`Open game page at http://localhost:${port}/game`)
})

process.on('SIGINT', async () => {
    console.log("Shutting down the server...");
    if (client) {
        closeDB()
        console.log("Database connection closed.");
    }
    process.exit(0); // Exit the process cleanly
});

process.on('SIGTERM', async () => {
    console.log("Received termination signal...");
    if (client) {
        closeDB()
        console.log("Database connection closed.");
    }
    process.exit(0);
});