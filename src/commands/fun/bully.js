const { CommandInteraction, MessageEmbed } = require("discord.js");
const superagent = require("superagent");

module.exports = {
  name: "bully",
  description: "Bully someone.",
  public: true,
  options: [
    {
      name: "target",
      description: "Provide a target.",
      type: 6,
      required: true,
    },
  ],
  /**
   * @param {CommandInteraction} interaction
   */
  async execute(interaction) {
    const target = interaction.options.getMember("target");
    await target.user.fetch();
    const { body } = await superagent.get("https://api.waifu.pics/sfw/bully");

    if (target.id === interaction.user.id)
    return interaction.reply({ content: "Oh, I'm sure your friends do that to you enough already. Well, if you have any. :)" });

    const bullyEmbed = new MessageEmbed()
      .setColor("DARK_VIVID_PINK")
      .setAuthor({
        name: `${interaction.user.username} bullies ${target.user.username}!`,
        iconURL: `${interaction.user.avatarURL({ dynamic: true })}`,
      })
      .setImage(body.url)
      .setTimestamp()
    interaction.reply({ embeds: [bullyEmbed] });
  },
};