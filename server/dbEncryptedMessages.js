// import mongoose from 'mongoose'
const mongoose = require("mongoose")

//to change
const chatappSchema2=mongoose.Schema({
    iv: String,
    message: String,
    name: String,
    timestamp: String,
    received: Boolean,
});

const EncryptedMessages =  mongoose.model('encryptedmessagecontents', chatappSchema2)

module.exports = EncryptedMessages;