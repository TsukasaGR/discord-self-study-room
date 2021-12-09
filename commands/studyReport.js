const handle = async (client, interaction) => {
  const spreadSheetApis = require("../apis/spreadSheet.js");
  const discord = require("../apis/discord.js");
  const userId = interaction.member.user.id;
  const ssUrl = process.env.SS_URL;

  const res = await spreadSheetApis.studyReport(userId, ssUrl).catch((e) => {
    return discord.responseInteraction(
      client,
      interaction,
      `Whoops...\nバグってるので関口まで連絡ください...`
    );
  });
  if (res.status === "error") {
    if (res.errorType === "UnregisteredUser") {
      return discord.responseInteraction(
        client,
        interaction,
        `ユーザー登録されていないようです。\n以下スプシの「ユーザーリスト」シートにユーザーを追加してください。\nあなたのDiscord IDは ${userId} です。\n${process.env.SS_URL_SHEET_DB}`
      );
    }
    return discord.responseInteraction(
      client,
      interaction,
      `自習レポートの取得に失敗しました。\nたぶんバグなので関口に連絡ください..`
    );
  }

  let message = "今日の自習レポートです！";
  const studyHours = parseInt(res.studyMinutes / 60);
  const studyMinutes = parseInt(res.studyMinutes % 60);
  message += `\n今日の合計作業時間: ${studyHours}時間 ${studyMinutes} 分`;

  if (res.achievedLevel) {
    message += `\n\n報酬レベル${res.achievedLevel[0]}(合計作業時間${res.achievedLevel[1]}時間以上)をクリアしました！\n達成クエストを追加しましょう！\nhttps://www.notion.so/5fc3166a6b6d4ffaadc45d0617014503`;
  }

  return discord.responseInteraction(client, interaction, message);
};

exports.handle = handle;
