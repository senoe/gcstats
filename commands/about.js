const { Attachment } = require('discord.js')
const imageUtils = require("../functions/image.js");
const moment = require('moment-timezone');
const os = require('os');

module.exports = {
    info: {
        name: "about",
        description: "About this bot",
        usage: "",
        aliases: []
    },

    run: async function(client, message, args){

        image = imageUtils.drawItem([
            "§3Information", 
            "", 
            "Owner: §bsenoe",
            `API Latency: §b${Math.round(client.ping)}ms`,
            `Uptime: §b${moment.duration(client.uptime).humanize()}`,
            `System: §b${os.type()} ${os.release()}`,
        ]);
        
        const attachment = new Attachment(image.toBuffer(), "image.png");
        message.channel.send(attachment);
    }
}