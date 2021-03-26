require("dotenv").config();
const axios = require("axios");
const { Attachment } = require('discord.js')
const utils          = require("../functions/general.js");
const hypixelUtils   = require("../functions/hypixel.js");
const imageUtils     = require("../functions/image.js");
const colorUtils     = require("../functions/color.js");
const { loadImage }  = require('canvas');

const usersOnCooldown = new Set();
const cachedSuggestions = new Set();

module.exports = {
    info: {
        name: "map",
        description: "Lookup a SkyWars map",
        usage: "[name]",
        aliases: ["wtfsmap"]
    },

    run: async function(client, message, args){
        message.channel.startTyping()

        if(!args[0]) {
            imageUtils.drawError(`Please specify a map name.`);
            message.channel.stopTyping()
            return message.channel.send(new Attachment(imageUtils.getCanvas().toBuffer(), "image.png"));
        } else if(args[0].toLowerCase() == "suggest" && args[1]) {
            if(usersOnCooldown.has(message.author.id)) {
                message.channel.stopTyping()
                return message.channel.send("Please wait a few seconds before sending another suggestion.");
            } else if(cachedSuggestions.has(args.slice(1).join(" ").toLowerCase())) {
                message.channel.stopTyping()
                return message.channel.send("Somebody has already submitted this suggestion in the past 30 minutes.");
            }

            const suggestionChannel = client.channels.get("821487858275057674");
            suggestionChannel.send("```ini\n[Suggestion] " + message.author.username + "#" + message.author.discriminator + "(" + message.author.id + ")\n" + args.slice(1).join(" ") + "```")

            imageUtils.drawSuccess(`Map suggestion sent.`);
            message.channel.stopTyping()
            message.channel.send(new Attachment(imageUtils.getCanvas().toBuffer(), "image.png"));

            cachedSuggestions.add(args.slice(1).join(" ").toLowerCase());
            setTimeout(() => { cachedSuggestions.delete(args.slice(1).join(" ").toLowerCase()); }, 1800*1000);

            usersOnCooldown.add(message.author.id);
            setTimeout(() => { usersOnCooldown.delete(message.author.id); }, 5*1000);

            return;
        }

        var map = await hypixelUtils.getMap(args.join(" "))
        if(!map) {
            imageUtils.drawError(`A map with the name "${args.join(" ")}" could not found.`);
            message.channel.stopTyping()
            return message.channel.send(new Attachment(imageUtils.getCanvas().toBuffer(), "image.png"));
        }

        var mapString = `:map: **${map.name}**`

        var attachment = null;

        if(map["mode"]) mapString += ` - ${map["mode"]}`
        if(map["image_url"]) {
            const map_image = await axios.get(map["image_url"], {
                headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:86.0) Gecko/20100101 Firefox/86.0" },
                responseType: "arraybuffer"
            })
            
            attachment = new Attachment(map_image.data, "image.png");
        }
        
        message.channel.stopTyping()
        message.channel.send(mapString, attachment);
    }
}