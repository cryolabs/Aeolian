const {
  Client,
  GuildChannel,
  EmbedBuilder,
  AuditLogEvent,
} = require("discord.js");
const DB = require("../../structures/schemas/guildDB.js");

module.exports = {
  name: "channelCreate",
  /**
   * @param {GuildChannel} channel
   * @param {Client} client
   */
  async execute(channel, client) {
    const data = await DB.findOne({
      id: channel.guild.id,
    });

    if (!data) return;
    if (data.logs.enabled == "false" || data.logs.channel == null) return;

    const allLogs = await channel.guild.fetchAuditLogs({
      type: AuditLogEvent.ChannelCreate,
      limit: 1,
    });
    const fetchLogs = allLogs.entries.first();

    const embed = new EmbedBuilder()
      .setColor("Grey")
      .setAuthor({ name: channel.guild.name, iconURL: channel.guild.iconURL() })
      .setTitle("Channel Created")
      .addFields([
        {
          name: "🔹 | Channel Name",
          value: `> ${channel.name}`,
        },
        {
          name: "🔹 | Channel ID",
          value: `> ${channel.id}`,
        },
        {
          name: "🔹 | Created by",
          value: `> <@${fetchLogs.executor.id}> (${fetchLogs.executor.id})`,
        },
      ])
      .setTimestamp();
    client.channels.cache.get(data.logs.channel).send({ embeds: [embed] });
  },
};
