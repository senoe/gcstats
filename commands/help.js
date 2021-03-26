require("dotenv").config();
const { Attachment } = require('discord.js')
const imageUtils     = require("../functions/image.js");

module.exports = {
    info: {
        name: "help",
        description: "Shows all commands",
        usage: "[command]",
        aliases: ["commands"]
    },

    run: async function(client, message, args){
        if(!args[0]) {
            var lines = ["§3GCStats Commands", ``];

            client.commands.forEach(cmd => {
                let cmdInfo = cmd.info
                if(cmdInfo.usage === "") var cmdDelim = "";
                else var cmdDelim = " "; cmdInfo.usage = "§3" + cmdInfo.usage;
                
                if(cmdInfo.name != "help") lines.push(`§b${process.env.prefix}${cmdInfo.name}${cmdDelim}${cmdInfo.usage} §7- ${cmdInfo.description}`);
                else lines.splice(2, 0, `§b${process.env.prefix}${cmdInfo.name}${cmdDelim}${cmdInfo.usage} §7- ${cmdInfo.description}`);
            })

            lines.push(``)
            lines.push(`§fFor more info, run ${process.env.prefix}help [command]`)

            imageUtils.drawItem(lines);

            const attachment = new Attachment(imageUtils.getCanvas().toBuffer(), "image.png");
            return message.channel.send(attachment)
        } else {
            let cmd = args[0]
            let command = client.commands.get(cmd)
            if(!command)command = client.commands.find(x => x.info.aliases.includes(cmd))

            if(!command) {
                imageUtils.drawError("Unknown command.");
                return message.channel.send(new Attachment(imageUtils.getCanvas().toBuffer(), "image.png"));
            }

            var lines = [
                `§3Command information §7- ${command.info.name}`, 
                ``, 
                `Name: §b${command.info.name}`,
                `Usage: §b${command.info.name} ${command.info.usage}`,
                `Aliases: §b${command.info.aliases.length != 0 ? command.info.aliases.join(", ") : "none"}`,
                `Description: §b${command.info.description}`
            ];
    
            imageUtils.drawItem(lines);

            const attachment = new Attachment(imageUtils.getCanvas().toBuffer(), "image.png");
            return message.channel.send(attachment)
        }
    }
}
