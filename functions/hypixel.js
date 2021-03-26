require("dotenv").config(); //Loading .env
const fs = require("fs");
const utils = require("../functions/general.js");
const imageUtils = require("../functions/image.js");
const colorUtils = require("../functions/color.js");

const cacheManager = require("cache-manager");
const cache = cacheManager.caching({ store: 'memory', max: 100, ttl: 10 });
const { Client: Hypixel, getPlayerRank, getNetworkLevel } = require("@zikeji/hypixel");
const hypixel = new Hypixel(process.env.HYPIXEL_API_KEY, { cache });

const getMultiplier = function (player) {
    let m = null;
    const MULTIPLIER=[{level:0,value:1},{level:5,value:1.5},{level:10,value:2},{level:15,value:2.5},{level:20,value:3},{level:25,value:3.5},{level:30,value:4},{level:40,value:4.5},{level:50,value:5},{level:100,value:5.5},{level:125,value:6},{level:150,value:6.5},{level:200,value:7},{level:250,value:8}],RANKMULTIPLIER={VIP:{value:2,name:"VIP"},VIP_PLUS:{value:3,name:"VIP+"},MVP:{value:4,name:"MVP"},MVP_PLUS:{value:5,name:"MVP+"},YOUTUBER:{value:7,name:"YouTuber"}};
    
    for (const {level, value} of MULTIPLIER.slice().reverse()) {
        if (getNetworkLevel(player).level >= level) {
            m = value;
            break;
        }
    }

    const playerRank = getPlayerRank(player).name
    if (player.eulaCoins || playerRank === 'YOUTUBER') {
        const { value, name } = RANKMULTIPLIER[playerRank] || {};
        if (Math.max(m, value) === value) {
            return value;
        }
    }

    return m;
}

const getGameType = function (rawName) {
    const gametypes = JSON.parse( fs.readFileSync(__dirname + "/../resources/gametypes.json") )
    return gametypes[rawName] ? gametypes[rawName]["name"] : rawName
}

const getGameTypeIcon = function (rawName) {
    const gametypes = JSON.parse( fs.readFileSync(__dirname + "/../resources/gametypes.json") )
    return (gametypes[rawName] && gametypes[rawName]["icon_url"] != "gametypes_icons/Unanounced-64.png") ? `${__dirname}/../resources/${gametypes[rawName]["icon_url"]}` : null
}

const getGameMode = function (rawName) {
    if(rawName === "LOBBY") return "Lobby"
    const mapsSkywars = JSON.parse( fs.readFileSync(__dirname + "/../resources/maps_sw.json") )
    const selectedMap = mapsSkywars.find(o => o.name === rawName);
    return mapsSkywars[selectedMap] ? mapsSkywars[selectedMap]["mode"] : rawName
}

const getMap = function (rawName) {
    if(rawName === "LOBBY") return { "name": "Lobby" }
    const mapsSkywars = JSON.parse( fs.readFileSync(__dirname + "/../resources/maps_sw.json") )
    return mapsSkywars.find(o => o.name.toString().toLowerCase() === rawName.toString().toLowerCase()) || null
}

module.exports = {
    getMultiplier, getGameType, getGameMode, getGameTypeIcon, getMap
}