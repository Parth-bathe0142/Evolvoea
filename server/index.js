const express = require("express")
const path = require("path")
const bcrypt = require('bcrypt')
const bodyParser = require('body-parser')
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
app.use(express.urlencoded({ extended: true }))
//app.use(bodyParser)

app.get("/leaderboard-page", (_, res) => {
    res.sendFile(path.join(__dirname, "../dist/public/leaderboard.html"));
});


app.get("/test", (_, res) => {
    res.json({ result: "success" })
})

app.get("/game", (_, res) => {
    const filePath = path.join(__dirname, "../dist/public/index.html")
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error("File sending error:", err.message)
            res.status(404).json({ error: "Could not load file: " + err.message })
        }
    })
})

app.post("/signup_request", async (req, res) => {
    client = await connectDB()
    const { username, password, email } = req.body
    const accounts = client.db('game').collection('user_accounts')
    let randomnumber = Math.floor(Math.random() * (9000 + 1) + 1000)


    try {
        const match = await accounts.findOne({ username })
        if (match) {
            res.json({ result: "Failure", reason: "User already exist" })
        }
        else {
            // const saltRound = 10 //Higher number = More secure
            // const hashedPassword = await bcrypt.hash(password, saltRound) //Creates the hash of password 

            await accounts.insertOne({ username, password, email, randomnumber })

            res.cookie("username", username, { maxAge: 20 * 1000 })
            //res.json({ result: "Success" })
            res.redirect("/public/home.html")
        }
    } catch (error) {
        console.error("Signup error:", error)
        res.json({ result: "Failure", reason: "Internal server error" })
    }
})

app.post("/login_request", async (req, res) => {
    client = await connectDB()
    const { username, password } = req.body
    const accounts = client.db('game').collection('user_accounts')

    try {
        const user = await accounts.findOne({ username })
        if (!user) {
            return res.json({ result: "failure", reason: "User not found" })
        }
        const isMatch = (password == user.password)
        if (!isMatch) {
            return res.json({ result: "faliure", reason: "Incorrect username/password" })
        }

        res.cookie("username", username, { maxAge: 20 * 1000 })
        //res.json({ result: "Success" })
        res.redirect("/public/home.html")
    } catch (error) {
        console.log("Login error : ", error)
        res.json({ result: "faliure", reason: "Internal server error" })
    }
})

app.get("/leaderboard", async (req, res) => {
    client = await connectDB();
    const accounts = client.db('game').collection('user_accounts');

    try {
        const users = await accounts.find().sort({ randomnumber: -1 }).toArray();
        res.json(users);
    } catch (error) {
        console.error("Leaderboard fetch error:", error);
        res.status(500).json({ result: "Failure", reason: "Internal server error" });
    }
});

app.listen(port, async () => {
    console.log(`Listening at http://localhost:${port}/public/home.html`)
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