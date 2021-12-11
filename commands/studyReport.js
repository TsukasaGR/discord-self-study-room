const handle = async (client, interaction) => {
  const spreadSheetApis = require("../apis/spreadSheet.js");
  const discord = require("../apis/discord.js");
  const userId = interaction.member.user.id;
  const ssUrl = process.env.SS_URL;

  spreadSheetApis.studyReport(userId, ssUrl);

  return discord.responseInteraction(
    client,
    interaction,
    `自習レポートの処理を受け取りました！`
  );
};

exports.handle = handle;
