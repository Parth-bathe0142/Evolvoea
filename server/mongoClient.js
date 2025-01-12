const { MongoClient } = require('mongodb')
console.log(require('dotenv').config())
const client = new MongoClient(process.env.CONNECTION_STRING);


(async () => {
    try {
        await client.connect()
        const accounts = client.db('game').collection('user_accounts');
        const acc = await accounts.insertOne({ username: "suryansh", password: "12345678" })
        console.log(acc)
        
    } catch (error) {
        console.error(error);
    } finally {
        client.close()
    }
})()