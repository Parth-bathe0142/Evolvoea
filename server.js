const express = require("express")
const path = require("path")

const port = 4000
const app = express()

app.use('/', express.static(path.join(__dirname, 'dist')))

app.get("/test", (_, res) => {
    res.json({ result: "success" })
})

app.get("/game", (_, res) => {
    const filePath = path.join(__dirname, "/dist/index.html")
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error("File sending error:", err.message)
            res.status(404).json({ error: "Could not load file: " + err.message })
        }
    })
})

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
    console.log(`Open game page at http://localhost:${port}/game`)
})