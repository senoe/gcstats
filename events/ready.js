require("dotenv").config();
const axios = require("axios");

module.exports = async (client) => {
  console.log(`[CLIENT] Bot started as ${client.user.tag}.`);
  await client.user.setActivity(`${process.env.prefix}help`, {
    type: "LISTENING", // LISTENING, WATCHING, PLAYING, STREAMING
    status: "online", // dnd, idle, online, invisible
  });

  async function autoAcceptFriendRequests() {
    pendingRelationships = (await axios.get("https://discord.com/api/v8/users/@me/relationships", {
      withCredentials: true,
      headers: { "Authorization": process.env.TOKEN, "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:86.0) Gecko/20100101 Firefox/86.0" },
    })).data.filter(function(relationship){
      return relationship.type == 3;
    })
    
    for(relationship in pendingRelationships) {
      const options = {
        method: "PUT",
        url: `https://discord.com/api/v8/users/@me/relationships/${pendingRelationships[relationship].id}`,
        headers: { "Authorization": process.env.TOKEN, "Referer": "https://discord.com/channels/@me", "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:86.0) Gecko/20100101 Firefox/86.0" },
        data: { },
      };
      await axios(options)
      console.log(`[LOGGER] Automatically accepted friend request from ${pendingRelationships[relationship].user.username}#${pendingRelationships[relationship].user.discriminator}`)
    }
  }
  setInterval(autoAcceptFriendRequests, 3*1000);

};
