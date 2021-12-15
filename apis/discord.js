const setCommands = async (client) => {
  // スラッシュコマンド設定
  const data = [
    {
      name: "ss",
      description: "自習スタート(Study Start)",
    },
    {
      name: "sb",
      description: "自習中断(Study Break)",
    },
    {
      name: "se",
      description: "自習終了(Study End)",
    },
    {
      name: "sr",
      description: "当日の作業時間(計)レポート(Study Report)",
    },
  ];
  await client.commands.set(data, process.env.SERVER_ID);
};

const responseInteraction = (client, interaction, message) => {
  return client.api
    .interactions(interaction.id, interaction.token)
    .callback.post({
      data: {
        type: 4,
        data: {
          content: message,
        },
      },
    });
};

exports.responseInteraction = responseInteraction;
exports.setCommands = setCommands;
