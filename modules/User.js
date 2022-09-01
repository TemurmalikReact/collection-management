const { Schema, model } = require('mongoose')

const schema = new Schema({
    userName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isBlocked: { type: Boolean, required: true },
    role: { type: [String],  required: true}
})

module.exports = model('User', schema)
