const express = require("express")
const mongoose = require("mongoose")
const Messages = require("./dbMessages")
const EncryptedMessages = require("./dbEncryptedMessages")
const Pusher = require('pusher');
const cors = require('cors')
const crypto = require("crypto")
const algorithm = 'aes-256-cbc'
const key = "adnan-tech-programming-computers" 

const app = express()
const port = process.env.PORT || 8000

const pusher = new Pusher({
    appId: "1248809",
    key: "4ff174e122389c3e4450",
    secret: "5ede18c56742bed31d99",
    cluster: "mt1",
    useTLS: true
});

app.use(express.json())
app.use(cors())

const connection_url = 'mongodb+srv://admin:password@cluster0.zvr9x.mongodb.net/chatappDatabase?retryWrites=true&w=majority';

mongoose.connect(connection_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection

db.once('open', ()=>{
    console.log("DB connected");

    const msgCollection = db.collection("encryptedmessagecontents");
    const changeStream = msgCollection.watch();

    changeStream.on("change", (change)=>{
        console.log("A Change occured", change);

        if (change.operationType === 'insert') {
            const messageDetails = change.fullDocument;
            const origionalData = Buffer.from(messageDetails.iv, 'base64') 
            const decipher = crypto.createDecipheriv(algorithm, key, origionalData);
            let decryptedData = decipher.update(messageDetails.message, "hex", "utf-8");
            decryptedData += decipher.final("utf8");
            pusher.trigger('messages', 'inserted',
                {
                    name: messageDetails.name,
                    message: decryptedData,
                    iv: messageDetails.iv,
                    timestamp: messageDetails.timestamp,
                    received: messageDetails.received,
                }
            );
        } else {
            console.log('Error triggering Pusher')
        }
    });
});

app.get('/',(req, res)=>res.status(200).send('hello world'));

app.get('/messages/sync', (req, res) => {

    Messages.find((err, data) => {
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(200).send(data)
        }
    })
})

app.post('/messages/new', (req, res) => {
    const dbMessage = req.body

    Messages.create(dbMessage, (err, data) => {
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(201).send(data)
        }
    })
})

app.post('/messages/newencrypted', (req, res) => {
    const dbMessage = req.body

    const message = dbMessage.message

    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encryptedData = cipher.update(message, "utf-8", "hex");
    encryptedData += cipher.final("hex");
    const base64data = Buffer.from(iv, 'binary').toString('base64');

    dbMessage.iv = base64data
    dbMessage.message = encryptedData

    EncryptedMessages.create(dbMessage, (err, data) => {
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(201).send(data)
        }
    })
})

app.get('/messages/encryptedsync', (req, res) => {

    EncryptedMessages.find((err, data) => {
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(200).send(data.map(e => {
                const origionalData = Buffer.from(e.iv, 'base64') 
                const decipher = crypto.createDecipheriv(algorithm, key, origionalData);
                let decryptedData = decipher.update(e.message, "hex", "utf-8");
                decryptedData += decipher.final("utf8");
                e.message = decryptedData
                return e
            }))
        }
    })
})

app.listen(port, ()=>console.log(`Listening on localhost:${port}`));