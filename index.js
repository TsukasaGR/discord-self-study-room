const dotenv = require("dotenv");
dotenv.config();

const { Client, Intents } = require("discord.js");
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

// ログイン時イベント
client.once("ready", async () => {
  const data = [
    {
      name: "ss",
      description: "自習スタート(Study Start)",
    },
    {
      name: "se",
      description: "自習終了(Study End)",
    },
    {
      name: "sr",
      description: "当日の合計作業時間レポート(Study Report)",
    },
  ];
  await client.application.commands.set(data, process.env.SERVER_ID);
  console.log("ready");
});

// スラッシュコマンド受信時イベント
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) {
    return;
  }
  // 自習開始
  if (interaction.commandName === "ss") {
    const at = new Date().toLocaleString({ timeZone: "Asia/Tokyo" });
    const userId = interaction.user.id;
    const userName = interaction.user.username;
    const ssUrl = process.env.SS_URL;
    const res = await studyStart(at, userId, userName, ssUrl).catch((e) => {
      return interaction.reply(
        "Whoops...\nバグってるので関口まで連絡ください..."
      );
    });
    if (res.status === "error") {
      if (res.errorType === "UnregisteredUser") {
        return interaction.reply(
          "ユーザー登録されていないようです。\n以下スプシの「ユーザーリスト」シートにユーザーを追加してください。\nあなたのDiscord IDは " +
            userId +
            " です。" +
            process.env.SS_URL_SHEET_DB
        );
      }
      return interaction.reply(
        "自習開始に失敗しました。\n未終了のレコードがないかスプシを確認してください。\n(未終了を忘れた場合は手動で入力してください)\n" +
          process.env.SS_URL_SHEET_DB
      );
    }

    return interaction.reply("自習スタートしました！");
  }

  // 自習終了
  else if (interaction.commandName === "se") {
    const at = new Date().toLocaleString({ timeZone: "Asia/Tokyo" });
    const userId = interaction.user.id;
    const userName = interaction.user.username;
    const ssUrl = process.env.SS_URL;
    const res = await studyEnd(at, userId, userName, ssUrl).catch((e) => {
      return interaction.reply(
        "Whoops...\nバグってるので関口まで連絡ください..."
      );
    });
    if (res.status === "error") {
      if (res.errorType === "UnregisteredUser") {
        return interaction.reply(
          "ユーザー登録されていないようです。\n以下スプシの「ユーザーリスト」シートにユーザーを追加してください。\nあなたのDiscord IDは " +
            userId +
            "\nです。" +
            process.env.SS_URL_SHEET_DB
        );
      }
      return interaction.reply(
        "自習終了に失敗しました。\n自習を開始するか、おかしなレコードがないかスプシを確認してください。\n" +
          process.env.SS_URL_SHEET_DB
      );
    }

    let message = "自習終了しました！";
    if (res.studyMinutes) {
      message += "\n作業時間: " + res.studyMinutes + "分";
    }
    return interaction.reply(message);
  }

  // 当日のレポート
  else if (interaction.commandName === "sr") {
    const userId = interaction.user.id;
    const ssUrl = process.env.SS_URL;
    const res = await studyReport(userId, ssUrl).catch((e) => {
      return interaction.reply(
        "Whoops...\nバグってるので関口まで連絡ください..."
      );
    });
    if (res.status === "error") {
      console.log(res);
      return interaction.reply(
        "自習レポートの取得に失敗しました。\nたぶんバグなので関口に連絡ください"
      );
    }

    if (!res.studyMinutes) {
      return interaction.reply("今日作業してないっぽいですね。。");
    }

    let message = "今日の自習レポートです！";
    const studyHours = parseInt(res.studyMinutes / 60);
    const studyMinutes = parseInt(res.studyMinutes % 60);
    message +=
      "\n今日の合計作業時間: " + studyHours + "時間" + studyMinutes + "分";
    return interaction.reply(message);
  }
});

// // メッセージ受信時イベント(Botがアクセス可能なチャンネルすべて)
// client.on("message", (message) => {
//   // コンソールにメッセージを表示する
//   console.log(message.content);

//   if (message.content === "!ping") {
//     // メッセージが送信されたチャンネルへ「Pong.」を送り返す
//     message.channel.send("Pong.");
//   }
// });

client.login(process.env.TOKEN);

const updateSS = async (type, data, ssUrl) => {
  const request = require("request-promise");
  const options = {
    uri: ssUrl,
    headers: { "Content-type": "application/json" },
    json: data,
    followAllRedirects: true,
  };

  return request
    .post(options)
    .then((res) => {
      console.log("ok res: ", res);
      try {
        JSON.parse(res);
      } catch (e) {
        throw new Error(e);
      }
      return res;
    })
    .catch((error) => {
      console.log("ng res: ", error);
      throw new Error(error);
    });
};

const studyStart = async (at, userId, userName, ssUrl) => {
  const jsonData = {
    type: "start",
    at,
    userId,
    userName,
  };
  return updateSS("start", jsonData, ssUrl);
};

const studyEnd = async (at, userId, userName, ssUrl) => {
  const jsonData = {
    type: "end",
    at,
    userId,
    userName,
  };
  return updateSS("end", jsonData, ssUrl);
};

const studyReport = async (userId, ssUrl) => {
  const jsonData = {
    type: "report",
    userId,
  };
  return updateSS("report", jsonData, ssUrl);
};
