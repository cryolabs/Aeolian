const {
  ChatInputCommandInteraction,
  Client,
  EmbedBuilder,
} = require("discord.js");
const { checkVoice } = require("../../../functions/musicUtils.js");

module.exports = {
  subCommand: "music.play",
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { options, member } = interaction;
    const embed = new EmbedBuilder().setColor("Blurple").setTimestamp();

    await interaction.deferReply();
    if (await checkVoice(interaction)) return;

    const player = await client.manager.createPlayer({
      guildId: interaction.guild.id,
      voiceId: interaction.member.voice.channelId,
      textId: interaction.channelId,
      deaf: true,
    });

    const query = options.getString("query");
    const res = await player.search(query, { requester: interaction.user });

    if (!res.tracks.length) {
      if (player) player.destroy();

      return interaction.editReply({
        embeds: [embed.setDescription("🔹 | No matches found.")],
      });
    }

    if (res.type === "PLAYLIST") {
      const tracks = res.tracks;
      for (const track of tracks) player.queue.add(track);

      if (
        !player.playing &&
        !player.paused &&
        player.queue.totalSize === res.tracks.length
      )
        player.play();

      return interaction.editReply({
        embeds: [
          embed
            .setAuthor({
              name: "Playlist added to the queue",
              iconURL: member.user.avatarURL({ dynamic: true }),
            })
            .setDescription(`**[${res.playlistName}](${query})**`)
            .addFields(
              {
                name: "Added",
                value: `\`${res.tracks.length}\` tracks`,
                inline: true,
              },
              {
                name: "Queued by",
                value: `${member}`,
                inline: true,
              }
            ),
        ],
      });
    }

    if (res.type === "TRACK" || res.type === "SEARCH") {
      player.queue.add(res.tracks[0]);

      if (!player.playing && !player.paused && !player.queue.size)
        player.play();

      embed
        .setAuthor({
          name: "Added to the queue",
          iconURL: member.user.avatarURL({ dynamic: true }),
        })
        .setDescription(`**[${res.tracks[0].title}](${res.tracks[0].uri})** `)
        .addFields({
          name: "Queued by",
          value: `${member}`,
          inline: true,
        })
        .setThumbnail(res.tracks[0].thumbnail);
      await interaction.editReply({ embeds: [embed] });

      if (player.queue.totalSize > 1)
        embed.addFields({
          name: "Position in queue",
          value: `${player.queue.size - 0}`,
          inline: true,
        });
      return interaction.editReply({ embeds: [embed] });
    }
  },
};