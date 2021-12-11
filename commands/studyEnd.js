const handle = async (client, interaction) => {
  const spreadSheetApis = require("../apis/spreadSheet.js");
  const discord = require("../apis/discord.js");
  const dayjs = require("dayjs");
  dayjs.extend(require("dayjs/plugin/timezone"));
  dayjs.extend(require("dayjs/plugin/utc"));
  dayjs.tz.setDefault("Asia/Tokyo");
  const at = dayjs.tz().format("YYYY/MM/DD HH:mm:ss");
  const userId = interaction.member.user.id;
  const userName = interaction.member.user.username;
  const ssUrl = process.env.SS_URL;

  spreadSheetApis.studyEnd(at, userId, userName, ssUrl);

  return discord.responseInteraction(
    client,
    interaction,
    `自習終了の処理を受け付けました！`
  );
};

exports.handle = handle;
