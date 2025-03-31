const express = require("express")
const session = require('express-session')
const path = require("path")
const bcrypt = require('bcrypt')
const bodyParser = require('body-parser')
const { connectDB, closeDB } = require('./mongoClient.js')
const { ObjectId } = require('mongodb')
require('dotenv').config()

const port = process.env.PORT
const CONNECTION_STRING = process.env.CONNECTION_STRING
const app = express()
let client;

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

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

            req.session.username = username;
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

        req.session.username = username;
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
        const users = await accounts.find().sort({ score: -1 }).toArray();
        res.json(users);
    } catch (error) {
        console.error("Leaderboard fetch error:", error);
        res.status(500).json({ result: "Failure", reason: "Internal server error" });
    }
});

app.post("/add-score", async (req, res) => {
    if(!req.session.username) {
        return res.status(403).json({ result: "failure", reason: "Not logged in" })
    }
    
    const score = req.body.score
    const username = req.session.username
    client = await connectDB();
    const accounts = client.db('game').collection('user_accounts');
    
    try {
        const user = await accounts.findOneAndUpdate(
            { username },
            { $inc: { score } },
            { returnDocument: "after" }
        );

        if(!user.value) {
            return res.json({ result: "failure", reason: "user not found"})
        }
        res.json({ result: "success", newscore: user.value.score });
    } catch (error) {
        console.error("Leaderboard fetch error:", error);
        res.status(500).json({ result: "Failure", reason: "Internal server error" });
    }

})









app.get("/pageload", (req, res) => {
    if (req.session.username) {
        res.json({ result: "success", username: req.session.username })
    } else {
        res.json({ result: "failure", reason: "not logged in" })
    }
})

app.get("/forum-list", async (_, res) => {
    try {
        client = await connectDB()

        const collection = client.db('game').collection('forum_data')
        const documents = collection.find({})

        let str = ""
        let count = 0;
        for await (const doc of documents) {
            str += `<div id="${doc._id}" class="forum-item">
            <h3 class="forum-name">${doc.name}</h3>
            <h4 class="forum-owner">Started by: ${doc.owner}</h4>
            </div>`
            count++
        }

        if (count == 0) {
            str = `<div class="no-forums">No forums exist</div>`
        }

        return res.json({ result: "success", count, elements: str })

    } catch (error) {
        res.json({ result: "failure", reason: error })
    }
})

app.get("/forum/:id", async (req, res) => {
    try {
        client = await connectDB()

        const collection = client.db('game').collection('posts')
        const documents = collection.find({ forumId: req.params.id }).sort("timestamp")

        let str = ""
        let count = 0;
        for await (const doc of documents) {
            console.log(doc);

            str += `<div id="${doc.forumId}" class="post-item">
            <h3 class="post-poster">${doc.poster}</h3>
            <h4 class="post-message">${doc.message}</h4>
            </div>`
            count++
        }

        if (count == 0) {
            str = `<div class="no-post">No posts here</div>`
        }

        return res.json({ result: "success", count, elements: str })

    } catch (error) {
        res.json({ result: "failure", reason: error })
    }

}) 



app.post("/new-forum", async (req, res) => {
    client = await connectDB()

    const name = req.body.name
    const { username, userId } = req.session
    if (!name || !username) {
        return res.json({ result: "failure", reason: "empty name" })
    }
    const forums = client.db("game").collection("forum_data")

    let match = await forums.findOne({ name })
    if (match) {
        return res.json({ result: "failure", reason: "already exists" })
    }
    forums.insertOne({ name, owner: username, ownerId: userId })

    return res.json({ result: "success" })
})


app.post("/new-post", async (req, res) => {
    client = await connectDB()

    const { message, forum } = req.body
    const { username, userId } = req.session
    if (!message || !forum || !username) {
        return res.json({ result: "failure", reason: "Invalid input" })
    }

    const forums = client.db("game").collection("forum_data")
    const posts = client.db("game").collection("posts")

    const forumExists = await forums.findOne({ _id: new ObjectId(forum) })
    if (!forumExists) {
        return res.json({ result: "failure", reason: "Forum does not exist" })
    }

    await posts.insertOne({ message, poster: username, posterId: userId, forumId: forum })

    return res.json({ result: "success" });
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