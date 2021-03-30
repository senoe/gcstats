require("dotenv").config();
const { Attachment } = require('discord.js')
const utils          = require("../functions/general.js");
const hypixelUtils   = require("../functions/hypixel.js");
const imageUtils     = require("../functions/image.js");
const colorUtils     = require("../functions/color.js");
const getUUID        = require('minecraft-uuid-cache');
const { loadImage }  = require('canvas')

const cacheManager = require("cache-manager");
const cache = cacheManager.caching({ store: 'memory', max: 100, ttl: 10 });
const { Client: Hypixel, getPlayerRank, getNetworkLevel } = require("@zikeji/hypixel");
const hypixel = new Hypixel(process.env.HYPIXEL_API_KEY, { cache });

module.exports = {
    info: {
        name: "player",
        description: "Lookup a player on Hypixel",
        usage: "[username/uuid]",
        aliases: ["p"]
    },

    run: async function(client, message, args){
        message.channel.startTyping()

        if(!args[0])args[0] = message.author.username

        try {
            var playerUUID = await getUUID(args[0])
        } catch (error) {
            message.channel.stopTyping()
            if(error == "That player might not exist." || error == "Could not find any cache or that player.") imageUtils.drawError("That player does not exist!");
            else imageUtils.drawError(`UUID fetch failed. Error: ${error}`);
            return message.channel.send(new Attachment(imageUtils.getCanvas().toBuffer(), "image.png"));
        }

        const player = await hypixel.player.uuid(playerUUID);

        // Bust: var playerSkinRender = await loadImage(`https://visage.surgeplay.com/full/176/${playerUUID}`)
        var playerSkinRender = await loadImage(`https://visage.surgeplay.com/full/256/${playerUUID}`)

        const playerRank = getPlayerRank(player);

        const playerGuild = await hypixel.guild.player(playerUUID);
        const playerGuildFormatted = `${colorUtils.getColorCode(playerGuild.tagColor) || ""}${playerGuild.name || "None"}`
        const playerGuildTagFormatted = `${colorUtils.getColorCode(playerGuild.tagColor) || ""}${playerGuild.tag ? '[' + playerGuild.tag + ']' : ''}`
        
        var playerNameColor = playerRank.colorCode;
        if(player.prefix)playerNameColor = player.prefix.toString().substring(0, 2);

        var playerPrefix = player.prefix || playerRank.prefix
        if(playerPrefix) {
            playerPrefix = playerPrefix
                            .toString()
                            .replace("§c++", `${colorUtils.getColorCode(player.rankPlusColor) || "§c"}++`)
                            .replace("§c+", `${colorUtils.getColorCode(player.rankPlusColor) || "§c"}+`)
        }

        if(playerRank.name == "SUPERSTAR" && playerPrefix.toString().substring(0, 2) == "§b") playerNameColor = "§b" // Blue MVP++ check

        const playerNameFormatted = `${playerPrefix || playerRank.prefix}${playerRank.cleanPrefix != "" ? " " : ""}${playerNameColor}${player.displayname} ${playerGuildTagFormatted}`;

        const playerStatus = await hypixel.status.uuid(playerUUID);

        var lastSeenString, lastOnlineString = "Unknown"
        if(player.lastLogout == null || player.lastLogin == 0) {} else {
            lastSeenString = utils.formatTimeFromNow(player.lastLogout) + " for " + utils.formatTimeDiff(player.lastLogout - player.lastLogin)
            lastSeenString = utils.toCapitalized(lastSeenString)
            if(lastSeenString == "a few seconds ago for a few seconds") lastSeenString = "A few seconds ago";
            lastOnlineString = utils.formatTime(player.lastLogout)

            if(playerStatus.online) { lastSeenString = "Currently online"; lastOnlineString = "Currently online"; }
        }

        var knownAliases = utils.chunkArray(player.knownAliases, 4);
        
        lines = utils.cleanArray([
            playerNameFormatted,
            ``,
            `Status: ${playerStatus.online ? '§aOnline' : '§cOffline'}`,
            `Level: §a${utils.fixed(getNetworkLevel(player).preciseLevel, 2)} (x${hypixelUtils.getMultiplier(player)})`, 
            `Karma: §d${utils.formatComma(player.karma || 0)}`,
            `Guild: §b${playerGuildFormatted}`,
            `AP: §e${utils.formatComma(player.achievementPoints || 0)}`,
            playerStatus && playerStatus.gameType ? `` : null,
            playerStatus && playerStatus.gameType ? `Game Type: §b${hypixelUtils.getGameType(playerStatus.gameType)}` : null,
            playerStatus && playerStatus.mode     ? `Game Mode: §3${hypixelUtils.getGameMode(playerStatus.mode)}` : null,
            playerStatus && playerStatus.map      ? `Game Map: §6${playerStatus.map}` : null,
            ``,
            `First Login: §9${utils.formatTime(player.firstLogin)}`,
            `Last Login: §9${utils.formatTime(player.lastLogin)}`,
            `Last Online: §9${lastOnlineString}`,
            `Last Seen: §9${lastSeenString}`,
            //``,
            player.socialMedia && player.socialMedia.links ? `` : null
            //`Known Aliases: §2${knownAliases[0].join(", ")}`,
            player.socialMedia && player.socialMedia.links && player.socialMedia.links.HYPIXEL   ? `Forums: §6${player.socialMedia.links.HYPIXEL}` : null,
            player.socialMedia && player.socialMedia.links && player.socialMedia.links.DISCORD   ? `Discord: §6${player.socialMedia.links.DISCORD}` : null,
            player.socialMedia && player.socialMedia.links && player.socialMedia.links.TWITTER   ? `Twitter: §6${player.socialMedia.links.TWITTER}` : null,
            player.socialMedia && player.socialMedia.links && player.socialMedia.links.INSTAGRAM ? `Instagram: §6${player.socialMedia.links.INSTAGRAM}` : null,
            player.socialMedia && player.socialMedia.links && player.socialMedia.links.YOUTUBE   ? `YouTube: §6${player.socialMedia.links.YOUTUBE}` : null,
            player.socialMedia && player.socialMedia.links && player.socialMedia.links.TWITCH    ? `Twitch: §6${player.socialMedia.links.TWITCH}` : null,
        ])

        if(knownAliases.length > 1) {
            for(var i = 1; i < knownAliases.length - 1; i++) {
                lines.splice(utils.containsIndexArray("Known Aliases: ", lines) + 1, 0, `§2${knownAliases[i].join(", ")}`);
            }
        }

        const size = 30;
        const padding = 8;
        const height = lines.length * size + padding * 2;
        const width = padding * 2 + Math.max(...lines.map(imageUtils.measureText)) + padding * 2;
        imageUtils.getCanvas().width = width;
        imageUtils.getCanvas().height = height;
        const ctx = imageUtils.getCanvas().getContext('2d');

        ctx.patternQuality = 'best';
        ctx.quality = 'best';

        // Bust: ctx.drawImage(playerSkinRender, width - 190, 25, 176, 176)
        ctx.drawImage(playerSkinRender, width - 150, 15, 158, 256)
    
        var gameTypePosition = { }
        lines.forEach((line, index) => {
            imageUtils.drawText(line, { x: padding, y: size * index + padding, size: (index == 0 ? 36: 30) });
            utils.contains(line, "Game Type:") ? gameTypePosition = { x: Math.floor(padding + imageUtils.measureText(line) + 25), y: size * index + padding } : null;
        });

        if(playerStatus && playerStatus.gameType && gameTypePosition != {}) {
            if(hypixelUtils.getGameTypeIcon(playerStatus.gameType) != null) {
                const playerGameTypeIcon = await loadImage( hypixelUtils.getGameTypeIcon(playerStatus.gameType) )
                ctx.drawImage(playerGameTypeIcon, gameTypePosition.x, gameTypePosition.y, 30, 30)
            }
        }

        const attachment = new Attachment(imageUtils.getCanvas().toBuffer(), "image.png");
        message.channel.stopTyping()
        message.channel.send(attachment);
    }
}
