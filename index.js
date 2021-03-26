require("dotenv").config();
const fs = require("fs");
const { Collection, Client } = require("discord.js");

const client = new Client({ ws: { properties: { $browser: "Discord iOS", $device: "Discord iOS" } } });
client.commands = new Collection();

// Loading Events
fs.readdir(__dirname + "/events/", (err, files) => {
  if (err) return console.error(err);
  files.forEach((file) => {
    const event = require(__dirname + `/events/${file}`);
    let eventName = file.split(".")[0];
    client.on(eventName, event.bind(null, client));
    console.log(`[CLIENT] Loaded event   ${eventName.toUpperCase()}`)
  });
});

// Loading Commands
fs.readdir("./commands/", (err, files) => {
  if (err) return console.error(err);
  files.forEach((file) => {
    if (!file.endsWith(".js")) return;
    let props = require(`./commands/${file}`);
    let commandName = file.split(".")[0];
    client.commands.set(commandName, props);
    console.log(`[CLIENT] Loaded command ${commandName.toUpperCase()}`)
  });
});

client.login(process.env.TOKEN)