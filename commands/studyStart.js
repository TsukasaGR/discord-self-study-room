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

  const res = await spreadSheetApis
    .studyStart(at, userId, userName, ssUrl)
    .catch((e) => {
      return discord.responseInteraction(
        client,
        interaction,
        `Whoops...\nバグってるので${ADMIN_USER_NAME}まで連絡ください...`
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
      `自習開始に失敗しました。\n未終了のレコードがないかスプシを確認してください。\n(未終了を忘れた場合は手動で入力してください)\n${process.env.SS_URL_SHEET_DB}`
    );
  }

  return discord.responseInteraction(
    client,
    interaction,
    `自習スタートしました！`
  );
};

exports.handle = handle;
