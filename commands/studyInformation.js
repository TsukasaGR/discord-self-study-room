const handle = async (client, interaction) => {
  const discord = require("../apis/discord.js");
  const ssSheetUrl = process.env.SS_SHEET_URL;
  const questPageUrl = process.env.QUEST_PAGE_URL;

  const message = `いつも自習室をご利用頂きありがとうございます🙇\n自習室関連の情報です😚\n\n対象のスプレッドシート: ${ssSheetUrl}\n\nNotionのクエストページ: ${questPageUrl}`;

  return discord.responseInteraction(client, interaction, message);
};

exports.handle = handle;
