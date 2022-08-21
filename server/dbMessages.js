// import mongoose from 'mongoose'
const mongoose = require("mongoose")

//to change
const chatappSchema=mongoose.Schema({
    message: String,
    name: String,
    timestamp: String,
    received: Boolean,
});

const Messages =  mongoose.model('messagecontents', chatappSchema)

module.exports = Messages;