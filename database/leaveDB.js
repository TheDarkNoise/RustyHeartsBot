const { model, Schema } = require('mongoose')
 
let leaveschema = new Schema({

    Guild: String,
    Channel: String
    
})
 
module.exports = model('leave', leaveschema);