const { Attachment } = require('discord.js')
const imageUtils = require("../functions/image.js");

module.exports = {
    info: {
        name: "draw",
        description: "Draw a color coded text image",
        usage: "[text]",
        aliases: []
    },

    run: async function(client, message, args){

        if(!args[0])return message.channel.send("Missing arguments!")

        image = imageUtils.drawItem( args.join(" ").split("\\n") );
        
        const attachment = new Attachment(image.toBuffer(), "image.png");
        message.channel.send(attachment);
    }
}
