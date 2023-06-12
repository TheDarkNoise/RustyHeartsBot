const { model, Schema } = require('mongoose')
 
let RHLegendDB  = new Schema({

    guildId: { type: String, required: true },
    logStoreChannelId: { type: String, required: true },
    
})
 
module.exports = model('RHLegendLogs', RHLegendDB );