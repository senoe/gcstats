require("dotenv").config()

module.exports = async (client, message) => {
  if (message.author.bot) return;
  //if (message.guild != null)return
  
  //Prefixes also have mention match
  const prefixMention = new RegExp(`^<@!?${client.user.id}> `);
  const prefix = message.content.match(prefixMention) ? message.content.match(prefixMention)[0] : process.env.prefix;

  if (message.content.indexOf(prefix) !== 0) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  //Making the command lowerCase because our file name will be in lowerCase
  const command = args.shift().toLowerCase();

  //Searching a command
  const cmd = client.commands.get(command);
  //Searching a command aliases
  const aliases = client.commands.find(x => x.info.aliases.includes(command))

  //if(message.channel.type === "dm")return message.channel.send("None of the commands work in DMs. So please use commands in server!")

  //Executing the codes when we get the command or aliases
  if(cmd) {
    console.log(`[LOGGER] Command ${cmd.info.name.toUpperCase()} ran in ${message.channel.id} by ${message.author.username}#${message.author.discriminator}`)
    cmd.run(client, message, args);
  } else if(aliases) {
    console.log(`[LOGGER] Command ${aliases.info.name.toUpperCase()} ran in ${message.channel.id} by ${message.author.username}#${message.author.discriminator}`)
    aliases.run(client, message, args);
  } else return
};
