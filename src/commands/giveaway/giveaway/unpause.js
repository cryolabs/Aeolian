const {
  ChatInputCommandInteraction,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
} = require("discord.js");
const {
  check4Data,
  check4Message,
  hasItEnded,
} = require("../../../functions/giveawayUtils.js");
const DB = require("../../../structures/schemas/giveaway.js");

module.exports = {
  subCommand: "giveaway.unpause",
  /**
   * @param {ChatInputCommandInteraction} interaction,
   */
  async execute(interaction) {
    const { guild, options } = interaction;
    const messageId = options.getString("messageid");
    const embed = new EmbedBuilder().setColor("Blurple").setTimestamp();

    const data = await DB.findOne({
      id: guild.id,
      messageID: messageId,
    });

    if (check4Data(data, interaction)) return;

    const message = await guild.channels?.cache
      .get(data?.channelId)
      ?.messages.fetch(messageId);

    if (check4Message(message, interaction)) return;
    if (hasItEnded(data, interaction)) return;

    const button = ActionRowBuilder.from(message.components[0]).setComponents(
      ButtonBuilder.from(message.components[0].components[0]).setDisabled(false)
    );

    const giveawayEmbed = EmbedBuilder.from(message.embeds[0])
      .setTitle(`${data.prize}`)
      .setColor("Blurple");

    await DB.findOneAndUpdate(
      {
        id: interaction.guild.id,
        messageID: message.id,
      },
      { hasEnded: false, isPaused: false }
    );

    await message.edit({
      embeds: [giveawayEmbed],
      components: [button],
    });

    return interaction.reply({
      embeds: [
        embed.setDescription("🔹 | Giveaway has been successfully unpaused."),
      ],
      ephemeral: true,
    });
  },
};