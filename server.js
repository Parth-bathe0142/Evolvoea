const express = require("express")
const path = require("path")

const port = 4000
const app = express()

app.use('/styles', express.static(path.join(__dirname, 'dist/styles')))
app.use('/script', express.static(path.join(__dirname, 'dist/script')))
app.use('/assets', express.static(path.join(__dirname, 'dist/assets')))

app.get("/test", (_, res) => {
    res.json({ result: "success" })
})

app.get("/home", (_, res) => {
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
    console.log(`Open home page at http://localhost:${port}/home`)
})