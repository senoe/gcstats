// All the code here is taken and refactored from
// https://github.com/PitPanda/PitPandaProduction/blob/master/utils/ImageHelpers.js

const { createCanvas, registerFont } = require('canvas')

registerFont(__dirname + "/fonts/Unicode.ttf", { family: "Unicode" })
registerFont(__dirname + "/fonts/Minecraftia.otf", { family: "Minecraftia" })
registerFont(__dirname + "/fonts/Minecraft-Regular.otf", {family: 'Minecraft'});
registerFont(__dirname + "/fonts/Minecraft-Bold.otf", {family: 'Minecraft', weight:'bold'});
registerFont(__dirname + "/fonts/Minecraft-Bold-Italic.otf", {family: 'Minecraft', weight:'bold', style:'italic'});
registerFont(__dirname + "/fonts/Minecraft-Italic.otf", {family: 'Minecraft', style:'italic'});

const THE_CANVAS = createCanvas(parseInt(500), parseInt(500));
const colors = {
    '0': { color: '000000', textshadow: '000000' },
    '1': { color: '0000AA', textshadow: '00002A' },
    '2': { color: '00AA00', textshadow: '002A00' },
    '3': { color: '00AAAA', textshadow: '002A2A' },
    '4': { color: 'AA0000', textshadow: '2A0000' },
    '5': { color: 'AA00AA', textshadow: '2A002A' },
    '6': { color: 'FFAA00', textshadow: '2A2A00' },
    '7': { color: 'AAAAAA', textshadow: '2A2A00' },
    '8': { color: '555555', textshadow: '151515' },
    '9': { color: '5555FF', textshadow: '15153F' },
    'a': { color: '55FF55', textshadow: '153F15' },
    'b': { color: '55FFFF', textshadow: '153F3F' },
    'c': { color: 'FF5555', textshadow: '3F1515' },
    'd': { color: 'FF55FF', textshadow: '3F153F' },
    'e': { color: 'FFFF55', textshadow: '3F3F15' },
    'f': { color: 'FFFFFF', textshadow: '3F3F3F' }
};

const getCanvas = function () {
    return THE_CANVAS;
}

const drawError = function (message) {
    drawItem([`§4❌ §c${message}`]);
}

const drawSuccess = function (message) {
    drawItem([`§2✔️ §a${message}`]);
}

const drawItem = function (lines, { background = null } = {}) {
    const size = 30;
    const padding = 8;
    const height = lines.length * size + padding * 2;
    const width = padding * 2 + Math.max(...lines.map(measureText)) + padding * 2;
    THE_CANVAS.width = width;
    THE_CANVAS.height = height;
    const ctx = THE_CANVAS.getContext('2d');

    ctx.patternQuality = 'best';
    ctx.quality = 'best';

    if (background) {
        ctx.fillStyle = background;
        ctx.fillRect(0, 0, width, height);
    }

    lines.forEach((line, index) => {
        drawText(line, { x: padding, y: size * index + padding });
    });

    return THE_CANVAS
}

const measureText = function (text, { size = 30, font = "Minecraft" } = {}) {
    if(text == null)return;
    text = text.toString()
    
    const ctx = THE_CANVAS.getContext('2d');

    ctx.patternQuality = 'best';
    ctx.quality = 'best';

    var bold = false;
    var length = size * 0.05;

    const parts = text.split('§');
    for (const part of parts) {
        const key = part.charAt(0);

        if (key === 'l') {
            bold = true;
        } else if (key === 'r') {
            bold = false;
        }

        ctx.font = `${bold ? 'bold' : ''} ${size}px ${font}, Unicode`;
        length += ctx.measureText(part.substring(1)).width;
    }

    return length;
}

const drawText = function (text, { x = 0, y = 0, size = 30, font = "Minecraft" } = {}) {
    if(text == null)return;
    text = text.toString()
    
    if (!text.startsWith('§')) {
        text = `§7${text}`;
    }

    const ctx = THE_CANVAS.getContext('2d');

    ctx.patternQuality = 'best';
    ctx.quality = 'best';
    ctx.fillStyle = "#ffffff";

    const offset = Math.max(1, size * 0.02);
    const adjustedY = y + size * (5 / 6);
    var position = size * 0.05;

    var color = colors['7'];
    var bold = false;
    var italic = false;

    const parts = text.split('§');
    
    for(const part of parts) {
        const key = part.charAt(0);
        color = colors[key] || color;

        if (key === 'l')      bold   = true;
        else if (key === 'n') italic = true;
        else if (key === 'r') { italic = false; bold = false; }

        ctx.font = `${bold ? 'bold' : ''} ${italic ? 'italic' : ''} ${size}px ${font}, Unicode`;

        // Draw Text Shadow
        ctx.fillStyle = `#${color.textshadow}`;
        ctx.fillText(part.substring(1), Math.floor(x + position ) + 2, Math.floor(adjustedY ) + 2);

        // Draw Text
        ctx.fillStyle = `#${color.color}`;
        ctx.fillText(part.substring(1), Math.floor(x + position), Math.floor(adjustedY));
        position += ctx.measureText(part.substring(1)).width;
    }
}

module.exports = {
    getCanvas, drawError, drawSuccess, drawItem, measureText, drawText
}