const Discord = require("discord.js");
const client = new Discord.Client();
client.commands = new Discord.Collection();

const discordApi = require("./apis/discord.js");
const studyStart = require("./commands/studyStart.js");
const studyEnd = require("./commands/studyEnd.js");
const studyReport = require("./commands/studyReport.js");

// ログイン時イベント
client.once("ready", async () => {
  // コマンドセット
  discordApi.setCommands(client);

  console.log("ready");

  // スラッシュコマンド受信時イベント
  client.ws.on("INTERACTION_CREATE", async (interaction) => {
    const command = interaction.data.name.toLowerCase();
    if (command === "ss") {
      return studyStart.handle(client, interaction);
    } else if (command === "sb" || command === "se") {
      const type = command === "sb" ? "end" : "endAndReport";
      return studyEnd.handle(client, interaction, type);
    } else if (command === "sr") {
      return studyReport.handle(client, interaction);
    }
  });
});

client.login(process.env.TOKEN);
