const colors={"BLACK":{code:"§0",c:"#000000",s:"#000000"},"DARK_BLUE":{code:"§1",c:"#0000AA",s:"#00002A"},"DARK_GREEN":{code:"§2",c:"#00AA00",s:"#002A00"},"DARK_AQUA":{code:"§3",c:"#00AAAA",s:"#002A2A"},"DARK_RED":{code:"§4",c:"#AA0000",s:"#2A0000"},"DARK_PURPLE":{code:"§5",c:"#AA00AA",s:"#2A002A"},"GOLD":{code:"§6",c:"#FFAA00",s:"#2A2A00"},"GRAY":{code:"§7",c:"#AAAAAA",s:"#2A2A2A"},"DARK_GRAY":{code:"§8",c:"#555555",s:"#151515"},"BLUE":{code:"§9",c:"#5555FF",s:"#15153F"},"GREEN":{code:"§a",c:"#55FF55",s:"#153F15"},"AQUA":{code:"§b",c:"#55FFFF",s:"#153F3F"},"RED":{code:"§c",c:"#FF5555",s:"#3F1515"},"LIGHT_PURPLE":{code:"§d",c:"#FF55FF",s:"#3F153F"},"YELLOW":{code:"§e",c:"#FFFF55",s:"#3F3F15"},"WHITE":{code:"§f",c:"#FFFFFF",s:"#3F3F3F"}};

const getColorCode = function (color_name) {
    if(!colors[color_name]) {
        return null;
    }
    return colors[color_name].code;
}

module.exports = {
    getColorCode
}