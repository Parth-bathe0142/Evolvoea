const express = require("express")
const path = require("path")

const app = express()
const port = 4000

app.get("/test", (req, res) => {
    res.json({ result: "success" })
})

app.get("/home", (req, res) => {
    const filePath = path.join(__dirname, "/dist/html/index.html")
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error("File sending error:", err.message)
            res.status(404).json({ error: "Could not load file: " + err.message })
        }
    })
})

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
    console.log(`Open home page at http://localhost:${port}/home`)
})