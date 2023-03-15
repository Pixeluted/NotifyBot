const Discord = require("discord.js");
const dotenv = require("dotenv");
const schedule = require("node-schedule");
const axios = require("axios");
dotenv.config();

const RecievierID = "REPLACE_WITH_YOUR_ID";
let lastMessage = null;

const client = new Discord.Client({
  intents: [
    "Guilds",
    "DirectMessages",
    "DirectMessageReactions",
    "DirectMessageTyping",
    "GuildMembers",
    "GuildMessages",
    "MessageContent",
  ],
});

function sendErrorWehbhook(embed) {
  axios({
    method: "POST",
    url: process.env.FAILED_WEBHOOK,
    data: {
      embeds: [embed],
    },
  });
}

function sendNotification() {
  if (lastMessage != null) {
    lastMessage.delete().catch((err) => {
      const embed = {
        title: "Failed to delete last message!",
        description:
          "I have failed to delete the last message in our DMs \n ```\n" +
          err.toString() +
          " ```",
        color: Discord.Colors.Red,
      };

      sendErrorWehbhook(embed);
    });
  }

  client.users
    .fetch(RecievierID)
    .then((member) => {
      member
        .send({
          embeds: [
            new Discord.EmbedBuilder()
              .setTitle("YOUR TITLE")
              .setDescription("YOUR MESSAGE")
              .setColor("Green")
              .setTimestamp()
              .setFooter({ text: "YOUR FOOTER" }),
          ],
        })
        .then((msg) => {
          lastMessage = msg;
        })
        .catch((err) => {
          const embed = {
            title: "Failed to send the message!",
            description:
              "I have failed to send the message to you \n ```\n" +
              err.toString() +
              " ```",
            color: Discord.Colors.Red,
          };

          sendErrorWehbhook(embed);
        });
    })
    .catch((err) => {
      const embed = {
        title: "Failed to send the message!",
        description:
          "I have failed to send the message to you \n ```\n" +
          err.toString() +
          " ```",
        color: Discord.Colors.Red,
      };

      sendErrorWehbhook(embed);
    });
}

client.on("ready", () => {
  console.log("Bot has sucessfully logged in!");

  const job = schedule.scheduleJob("* * * * *", function () {
    sendNotification();
  });

  console.log("Message job scheduled!");

  console.log("SENDING TEST NOTIFICATION");

  sendNotification();

  console.log("SENDING TEST FAILED WEBHOOK");

  const embed = {
    title: "Failed to delete last message!",
    description:
      "I have failed to delete the last message in our DMs \n ```\n" +
      "peepopoppoperroragdz" +
      " ```",
    color: Discord.Colors.Red,
  };

  axios({
    method: "POST",
    url: process.env.FAILED_WEBHOOK,
    data: {
      embeds: [embed],
    },
  });
});

client.login(process.env.BOT_TOKEN);
