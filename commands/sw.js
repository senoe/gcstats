require("dotenv").config();
const { Attachment } = require('discord.js')
const utils          = require("../functions/general.js");
const hypixelUtils   = require("../functions/hypixel.js");
const imageUtils     = require("../functions/image.js");
const colorUtils     = require("../functions/color.js");
const getUUID        = require('minecraft-uuid-cache');

const cacheManager = require("cache-manager");
const cache = cacheManager.caching({ store: 'memory', max: 100, ttl: 10 });
const { Client: Hypixel, getPlayerRank } = require("@zikeji/hypixel");
const hypixel = new Hypixel(process.env.HYPIXEL_API_KEY, { cache });

module.exports = {
    info: {
        name: "sw",
        description: "Lookup a player's SkyWars stats",
        usage: "[username/uuid]",
        aliases: []
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

        const playerRank = getPlayerRank(player);
        
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

        const stats = player.stats.SkyWars

        if(!stats) { imageUtils.drawError(`${playerPrefix || playerRank.prefix}${playerRank.cleanPrefix != "" ? " " : ""}${playerNameColor}${player.displayname} §chas no SkyWars stats.`); return message.channel.send(new Attachment(imageUtils.getCanvas().toBuffer(), "image.png")); }

        const playerNameFormatted = `${stats.levelFormatted.toString().substring(0, 2)}[${stats.levelFormatted}${stats.levelFormatted.toString().substring(0, 2)}] §7${playerPrefix || playerRank.prefix}${playerRank.cleanPrefix != "" ? " " : ""}${playerNameColor}${player.displayname}`;
        
        lines = utils.cleanArray([
            playerNameFormatted,
            ``,
            `Prestige: §dSomething  §7Progress: §exxx/xxxx (xx%)`,
            `Required Experience: §axxxx  §7Level Hidden: ${stats.hide_skywars_level ? "§aTrue" : "§cFalse"}`,
            `Coins: §6${utils.formatComma(stats.coins)}   §7Souls: §b${utils.formatComma(stats.souls)}   §7Tokens: §2${utils.formatComma(stats.cosmetic_tokens)}`,
            `Kills: §6${utils.formatComma(stats.kills)}   §7Wins: §b${utils.formatComma(stats.wins)}   §7K/D: §b${utils.ratio(stats.kills, stats.deaths)}   §7W/L: §b${utils.ratio(stats.wins, stats.losses)}`,
            ``,
            `§l§eRANKED`,
            `SAMELINE::Kills: §6${utils.formatComma(stats.kills_ranked)}`,
            `Wins: §b${utils.formatComma(stats.wins_ranked)}`,
            `SAMELINE::K/D: §b${utils.ratio(stats.kills_ranked, stats.deaths_ranked)}`,
            `W/L: §b${utils.ratio(stats.wins_ranked, stats.losses_ranked)}`,
            ``,
            `§l§eSOLO NORMAL`,
            `SAMELINE::Kills: §6${utils.formatComma(stats.kills_solo_normal)}`,
            `Wins: §b${utils.formatComma(stats.wins_solo_normal)}`,
            `SAMELINE::K/D: §b${utils.ratio(stats.kills_solo_normal, stats.deaths_solo_normal)}`,
            `W/L: §b${utils.ratio(stats.wins_solo_normal, stats.losses_solo_normal)}`,
            ``,
            `§l§eSOLO INSANE`,
            `SAMELINE::Kills: §6${utils.formatComma(stats.kills_solo_insane)}`,
            `Wins: §b${utils.formatComma(stats.wins_solo_insane)}`,
            `SAMELINE::K/D: §b${utils.ratio(stats.kills_solo_insane, stats.deaths_solo_insane)}`,
            `W/L: §b${utils.ratio(stats.wins_solo_insane, stats.losses_solo_insane)}`,
            ``,
            `§l§eTEAMS NORMAL`,
            `SAMELINE::Kills: §6${utils.formatComma(stats.kills_team_normal)}`,
            `Wins: §b${utils.formatComma(stats.wins_team_normal)}`,
            `SAMELINE::K/D: §b${utils.ratio(stats.kills_team_normal, stats.deaths_team_normal)}`,
            `W/L: §b${utils.ratio(stats.wins_team_normal, stats.losses_team_normal)}`,
            ``,
            `§l§eTEAMS INSANE`,
            `SAMELINE::Kills: §6${utils.formatComma(stats.kills_team_insane)}`,
            `Wins: §b${utils.formatComma(stats.wins_team_insane)}`,
            `SAMELINE::K/D: §b${utils.ratio(stats.kills_team_insane, stats.deaths_team_insane)}`,
            `W/L: §b${utils.ratio(stats.wins_team_insane, stats.losses_team_insane)}`,
            ``,
            `§l§eMEGA`,
            `SAMELINE::Kills: §6${utils.formatComma(stats.kills_mega_normal)}`,
            `Wins: §b${utils.formatComma(stats.wins_mega_normal)}`,
            `SAMELINE::K/D: §b${utils.ratio(stats.kills_mega_normal, stats.deaths_mega_normal)}`,
            `W/L: §b${utils.ratio(stats.wins_mega_normal, stats.losses_mega_normal)}`,
            ``,
            `§l§eMEGA DOUBLES`,
            `SAMELINE::Kills: §6${utils.formatComma(stats.kills_mega_doubles)}`,
            `Wins: §b${utils.formatComma(stats.wins_mega_doubles)}`,
            `SAMELINE::K/D: §b${utils.ratio(stats.kills_mega_doubles, stats.deaths_mega_doubles)}`,
            `W/L: §b${utils.ratio(stats.wins_mega_doubles, stats.losses_mega_doubles)}`,
        ])

        sameline = lines.filter(i => utils.contains(i, "SAMELINE::") || ( lines.indexOf(i) ? utils.contains(lines[lines.indexOf(i)-1], "SAMELINE::") : false) );

        var linesForSameline = lines;
        linesForSameline = linesForSameline.filter( function( el ) {
            return sameline.indexOf( el ) < 0;
        });

        sameline = sameline.map(function(d) { return d.replace("SAMELINE::", ""); });

        for(let i = 0; i < sameline.length; i+=2){
            linesForSameline.push(`${sameline[i]}    ${sameline[i+1]}`);
        }

        const size = 30;
        const padding = 8;
        const height = linesForSameline.length * size + padding * 2;
        const width = padding * 2 + Math.max(...linesForSameline.map(imageUtils.measureText)) + padding * 2 + 10;
        imageUtils.getCanvas().width = width;
        imageUtils.getCanvas().height = height;
        const ctx = imageUtils.getCanvas().getContext('2d');

        ctx.patternQuality = 'best';
        ctx.quality = 'best';
    
        var lastX = Math.floor(width * 0.5) + 5;
        var nextXTitle = 0;
        var killsCounter = 0;
        var KDCounter = 0;
        lines.forEach((line, index) => {
            if(line.startsWith("SAMELINE::")) {
                line = line.replace("SAMELINE::", "")

                if(line.startsWith("Kills:")) {
                    console.log(line)
                    if([1, 3, 5].includes(killsCounter)) {
                        imageUtils.drawText(line, { x: Math.floor(width * 0.5) + 5, y: size * (index-(killsCounter != 1 ? 8 : 4)) + padding, size: (index == 0 ? 36: 30) });
                        imageUtils.drawText(lines[index + 1], { x: 200 + Math.floor(width * 0.5) + 5, y: size * (index-(killsCounter != 1 ? 8 : 4)) + padding, size: (index == 0 ? 36: 30) });
                        lastX = Math.floor(width * 0.5) + 5;
                    } else {
                        imageUtils.drawText(line, { x: padding, y: size * (utils.contains(lines[index-1], "RANKED") ? index : index-4) + padding, size: (index == 0 ? 36: 30) });
                        imageUtils.drawText(lines[index + 1], { x: padding + 200, y: size * (utils.contains(lines[index-1], "RANKED") ? index : index-4) + padding, size: (index == 0 ? 36: 30) });
                    }
                    killsCounter++;
                } else if(line.startsWith("K/D:")) {
                    if(utils.isOdd(KDCounter) || [1, 3, 5].includes(KDCounter)) {
                        imageUtils.drawText(line, { x: Math.floor(width * 0.5) + 5, y: size * (utils.contains(lines[index-2], "RANKED") ? index : index-(KDCounter != 1 ? 8 : 4)) + padding, size: (index == 0 ? 36: 30) });
                        imageUtils.drawText(lines[index + 1], { x: 200 + Math.floor(width * 0.5) + 5, y: size * (utils.contains(lines[index-2], "RANKED") ? index : index-(KDCounter != 1 ? 8 : 4)) + padding, size: (index == 0 ? 36: 30) });
                    } else {
                        imageUtils.drawText(line, { x: padding, y: size * (utils.contains(lines[index-2], "RANKED") ? index : index-4) + padding, size: (index == 0 ? 36: 30) });
                        imageUtils.drawText(lines[index + 1], { x: padding + 200, y: size * (utils.contains(lines[index-2], "RANKED") ? index : index-4) + padding, size: (index == 0 ? 36: 30) });
                    }
                    KDCounter++;
                } else {
                    imageUtils.drawText(line, { x: padding, y: size * index + padding, size: (index == 0 ? 36: 30) });
                    imageUtils.drawText(lines[index + 1], { x: padding + 200, y: size * index + padding, size: (index == 0 ? 36: 30) });
                    lastX = padding;
                }
                lines.splice(index + 1, 1);
            }

            else if(line.startsWith("§l§e")) {
                if(nextXTitle == 2) {
                    imageUtils.drawText(line, { x: Math.floor(width * 0.5) + 5, y: size * (utils.contains(line, "RANKED") ? index : index-4) + padding, size: (index == 0 ? 36: 30) });
                    nextXTitle = 0;
                } else {
                    imageUtils.drawText(line, { x: padding, y: size * (utils.contains(line, "RANKED") ? index : index-4) + padding, size: (index == 0 ? 36: 30) });
                    nextXTitle = 2;
                }
            }

            else {
                imageUtils.drawText(line, { x: padding, y: size * index + padding, size: (index == 0 ? 36: 30) });
            }
        });
        const attachment = new Attachment(imageUtils.getCanvas().toBuffer(), "image.png");
        message.channel.stopTyping()
        message.channel.send(attachment);
    }
}